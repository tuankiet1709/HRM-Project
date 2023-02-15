import {
  AddEmployeeToTeamResponse,
  CreateTeamResponse,
  DeleteTeamResponse,
  UpdateTeamResponse,
} from './../../../constants/response';
import { injectable } from 'inversify';
import logger from '@src/utils/logger';
import Employee from '@src/components/employees/models/employee';
import { Role } from '@src/constants/role.enum';
import { Status } from '@src/constants/status.enum';
import Team from '../models/team';
import { ITeamService } from './team.service.interface';

@injectable()
export class TeamService implements ITeamService {
  async createTeam(
    name: string,
    leaderId: string,
    emailRequester: string,
  ): Promise<CreateTeamResponse> {
    const requester = await Employee.findOne({ email: emailRequester });
    if (
      !requester ||
      requester.role !== Role.ADMIN ||
      requester.isDeleted === true ||
      requester.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password',
        },
      };
    } else {
      const leader = await Employee.findById(leaderId);
      if (!leader || leader.role !== Role.LEADER) {
        return {
          error: {
            type: 'leader_no_exists',
            message: 'Leader No Exists',
          },
        };
      }
      return new Promise(function (resolve, reject) {
        const team = new Team({
          name: name,
          leader: leader._id,
          createdBy: requester._id,
        });
        team
          .save()
          .then((t) => {
            resolve({ teamId: t._id.toString() });
          })
          .catch((err) => {
            if (err.code === 11000) {
              resolve({
                error: {
                  type: 'team_already_exists',
                  message: `${name} already exists`,
                },
              });
            } else {
              logger.error(`create Team: ${err}`);
              reject(err);
            }
          });
      });
    }
  }
  async updateTeam(
    id: string,
    name: string,
    emailRequester: string,
  ): Promise<UpdateTeamResponse> {
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
      const currentTeam = await Team.findById(id);
      if (!currentTeam) {
        return {
          error: {
            type: 'team_no_exists',
            message: 'Team No Exists',
          },
        };
      }
      currentTeam.name = name;
      currentTeam.modifiedDate = new Date();
      return new Promise(async function (resolve, reject) {
        currentTeam
          .save()
          .then((t) => {
            resolve({ teamId: t._id.toString() });
          })
          .catch((err) => {
            logger.error(`Edit Team: ${err}`);
            reject(err);
          });
      });
    }
  }
  async deleteTeam(
    id: string,
    emailRequester: string,
  ): Promise<DeleteTeamResponse> {
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
      const currentTeam = await Team.findById(id);
      if (!currentTeam) {
        return {
          error: {
            type: 'team_no_exists',
            message: 'Team No Exists',
          },
        };
      }
      currentTeam.isDeleted = true;
      return new Promise(async function (resolve, reject) {
        currentTeam
          .save()
          .then((t) => {
            resolve({ teamId: t._id.toString() });
          })
          .catch((err) => {
            logger.error(`Delete Team: ${err}`);
            reject(err);
          });
      });
    }
  }

  async addEmployeeToTeam(
    teamId: string,
    employeeId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse> {
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
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return {
        error: {
          type: 'employee_no_exists',
          message: 'Employee No Exists',
        },
      };
    } else if (
      employee.role !== Role.MEMBER ||
      employee.isDeleted === true ||
      employee.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'employee_is_unavailable',
          message: 'Employee is unavailable',
        },
      };
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return {
        error: {
          type: 'team_no_exists',
          message: 'Team No Exists',
        },
      };
    }
    return new Promise(async function (resolve, reject) {
      team
        .update(
          { $push: { employees: employeeId } },
          { new: true, useFindAndModify: false },
        )
        .then(() => {
          employee
            .update(
              { $push: { currentTeams: teamId } },
              { new: true, useFindAndModify: false },
            )
            .then(() => {
              resolve({ response: true });
            });
        })
        .catch((err) => {
          logger.error(`Add employee to team: ${err}`);
          reject(err);
        });
    });
  }

  async changeLeader(
    teamId: string,
    leaderId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse> {
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
    }
    const leader = await Employee.findById(leaderId);
    if (!leader) {
      return {
        error: {
          type: 'employee_no_exists',
          message: 'Employee No Exists',
        },
      };
    } else if (
      leader.role !== Role.LEADER ||
      leader.isDeleted === true ||
      leader.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'employee_is_unavailable',
          message: 'Employee is unavailable',
        },
      };
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return {
        error: {
          type: 'team_no_exists',
          message: 'Team No Exists',
        },
      };
    }
    return new Promise(async function (resolve, reject) {
      team.leader = leader._id;
      team
        .save()
        .then(() => {
          leader
            .update(
              { $push: { currentTeams: teamId } },
              { new: true, useFindAndModify: false },
            )
            .then(() => {
              resolve({ response: true });
            });
        })
        .catch((err) => {
          logger.error(`Add leader to team: ${err}`);
          reject(err);
        });
    });
  }

  async removeEmployeeToTeam(
    teamId: string,
    employeeId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse> {
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
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return {
        error: {
          type: 'employee_no_exists',
          message: 'Employee No Exists',
        },
      };
    } else if (
      employee.role !== Role.MEMBER ||
      employee.isDeleted === true ||
      employee.status === Status.UNAVAILABLE
    ) {
      return {
        error: {
          type: 'employee_is_unavailable',
          message: 'Employee is unavailable',
        },
      };
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return {
        error: {
          type: 'team_no_exists',
          message: 'Team No Exists',
        },
      };
    }
    return new Promise(async function (resolve, reject) {
      team
        .update(
          { $pull: { employees: employeeId } },
          { new: true, useFindAndModify: false },
        )
        .then(() => {
          employee
            .update(
              { $pull: { currentTeams: teamId } },
              { new: true, useFindAndModify: false },
            )
            .then(() => {
              resolve({ response: true });
            });
        })
        .catch((err) => {
          logger.error(`Remove employee to team: ${err}`);
          reject(err);
        });
    });
  }
}
