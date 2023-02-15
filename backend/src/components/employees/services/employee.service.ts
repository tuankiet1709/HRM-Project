import { Team } from '@src/components/teams/models/team';
import { privateSecret, signOptions } from '@src/constants/key';
import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { IEmployeeService } from './employee.service.interface';
import {
  GetEmployeesResponse,
  CreateEmployeeResponse,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  GetEmployeeResponse,
  LoginEmployeeResponse,
} from '@src/constants/response';
import { Role } from '@src/constants/role.enum';
import Employee from '../models/employee';
import logger from '@src/utils/logger';
import { Status } from '@src/constants/status.enum';

@injectable()
export class EmployeeService implements IEmployeeService {
  async getEmployees(): Promise<GetEmployeesResponse> {
    const employees = await Employee.find()
      .populate('currentTeams')
      .select('-isDeleted -__v ');
    logger.debug(employees);
    return new Promise(function (resolve, reject) {
      resolve({ employees: employees });
    });
  }

  async getById(id: string): Promise<GetEmployeeResponse> {
    const employee = await Employee.findById(id)
      .populate('currentTeams')
      .select('-isDeleted -__v ');
    if (!employee) {
      return {
        error: {
          type: 'employee_no_exists',
          message: 'Employee No Exists',
        },
      };
    }
    return new Promise(function (resolve, reject) {
      resolve({ employee: employee });
    });
  }

  createAuthToken(
    employeeId: string,
  ): Promise<{ token: string; expireAt: Date }> {
    return new Promise(function (resolve, reject) {
      jwt.sign(
        { employeeId: employeeId },
        privateSecret,
        signOptions,
        (err: Error | null, encoded: string | undefined) => {
          if (err === null && encoded !== undefined) {
            const expireAfter = 2 * 604800;
            const expireAt = new Date();
            expireAt.setSeconds(expireAt.getSeconds() + expireAfter);

            resolve({ token: encoded, expireAt: expireAt });
          } else {
            reject(err);
          }
        },
      );
    });
  }

  async login(login: string, password: string): Promise<LoginEmployeeResponse> {
    try {
      const user = await Employee.findOne({ email: login });
      if (!user) {
        return {
          error: {
            type: 'invalid_credentials',
            message: 'Invalid Login/Password',
          },
        };
      }

      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return {
          error: {
            type: 'invalid_credentials',
            message: 'Invalid Login/Password',
          },
        };
      }

      const authToken = await this.createAuthToken(user._id.toString());
      return {
        userId: user._id.toString(),
        token: authToken.token,
        expireAt: authToken.expireAt,
      };
    } catch (err) {
      logger.error(`login ${err}`);
      return Promise.reject({
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  async createEmployee(
    email: string,
    password: string,
    name: string,
    dob: Date,
    phoneNumber: number,
    role: Role,
    emailRequester: string,
  ): Promise<CreateEmployeeResponse> {
    const creator = await Employee.findOne({ email: emailRequester });
    if (
      !creator ||
      creator.role === Role.MEMBER ||
      creator.isDeleted === true ||
      creator.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password',
        },
      };
    } else {
      return new Promise(function (resolve, reject) {
        const employee = new Employee({
          email: email,
          password: password,
          name: name,
          dob: dob,
          phoneNumber: phoneNumber,
          role: role,
        });
        employee
          .save()
          .then((e) => {
            resolve({ employeeId: e._id.toString() });
          })
          .catch((err) => {
            if (err.code === 11000) {
              resolve({
                error: {
                  type: 'account_already_exists',
                  message: `${email} already exists`,
                },
              });
            } else {
              logger.error(`createUser: ${err}`);
              reject(err);
            }
          });
      });
    }
  }
  async updateEmployee(
    email: string,
    password: string,
    name: string,
    dob: Date,
    phoneNumber: number,
    role: Role,
    emailRequester: string,
  ): Promise<UpdateEmployeeResponse> {
    const creator = await Employee.findOne({ email: emailRequester });
    if (
      !creator ||
      creator.role === Role.MEMBER ||
      creator.isDeleted === true ||
      creator.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password',
        },
      };
    } else {
      const currentEmployee = await Employee.findOne({
        email: email,
      });
      if (!currentEmployee) {
        return {
          error: {
            type: 'employee_no_exists',
            message: 'Employee No Exists',
          },
        };
      }
      currentEmployee.name = name;
      currentEmployee.dob = dob;
      currentEmployee.phoneNumber = phoneNumber;
      currentEmployee.role = role;
      currentEmployee.modifiedDate = new Date();
      return new Promise(async function (resolve, reject) {
        currentEmployee
          .save()
          .then((e) => {
            resolve({ employeeId: e._id.toString() });
          })
          .catch((err) => {
            logger.error(`Edit User: ${err}`);
            reject(err);
          });
      });
    }
  }
  async deleteEmployee(
    email: string,
    emailRequester: string,
  ): Promise<DeleteEmployeeResponse> {
    const creator = await Employee.findOne({ email: emailRequester });
    if (
      !creator ||
      creator.role === Role.MEMBER ||
      creator.isDeleted === true ||
      creator.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password',
        },
      };
    } else {
      const currentEmployee = await Employee.findOne({
        email: email,
      });
      if (!currentEmployee) {
        return {
          error: {
            type: 'employee_no_exists',
            message: 'Employee No Exists',
          },
        };
      } else if (currentEmployee.isDeleted === true) {
        return {
          error: {
            type: 'employee_deleted',
            message: 'Employee Deleted',
          },
        };
      }
      currentEmployee.isDeleted = true;
      return new Promise(function (resolve, reject) {
        currentEmployee
          .save()
          .then(async (e) => {
            logger.debug(e._id);

            const teamAssigned = await Team.find({
              employess: {
                $elemMatch: {
                  _id: e._id,
                },
              },
            });

            await Team.where('_id')
              .in(teamAssigned)
              .updateMany({ $pull: { employees: e._id } });

            // const test2 = await Team.find({ 'employess._id': e._id });

            // logger.debug('262');
            // logger.debug(test);
            // logger.debug(test2);

            resolve({ employeeId: e._id.toString() });
          })
          .catch((err) => {
            logger.error(`Delete User: ${err}`);
            reject(err);
          });
      });
    }
  }
}
