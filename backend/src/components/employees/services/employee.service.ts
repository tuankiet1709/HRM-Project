import { injectable } from 'inversify';
import { IEmployeeService } from './employee.service.interface';
import {
  GetEmployeeResponse,
  CreateEmployeeResponse,
} from '@src/constants/response';
import { Role } from '@src/constants/role.enum';
import Employee from '../models/employee';
import logger from '@src/utils/logger';
import { Status } from '@src/constants/status.enum';

@injectable()
export class EmployeeService implements IEmployeeService {
  findEmployee(email: string): Promise<GetEmployeeResponse> {
    throw new Error('Method not implemented.');
  }
  async createEmployee(
    email: string,
    password: string,
    name: string,
    dob: Date,
    phoneNumber: number,
    role: Role,
    creatorEmail: string,
  ): Promise<CreateEmployeeResponse> {
    const creator = await Employee.findOne({ email: creatorEmail });
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
}
