import { ITeamService } from '@src/components/teams/services/team.service.interface';
import 'reflect-metadata';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpPost,
  httpPut,
  request,
  response,
} from 'inversify-express-utils';
import * as express from 'express';

import { writeJsonResponse } from '@src/utils/express';
import logger from '@src/utils/logger';
import TYPES from '@src/constants/type';
import { ErrorResponse } from './../../../constants/response';

@controller('/teams')
export class TeamController extends BaseHttpController {
  private teamService: ITeamService;

  constructor(@inject(TYPES.ITeamService) teamService: ITeamService) {
    super();
    this.teamService = teamService;
  }

  @httpPost('/')
  public async createTeam(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { name, leaderId, emailRequester } = req.body;
    try {
      const resp = await this.teamService.createTeam(
        name,
        leaderId,
        emailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'team_already_exists') {
          writeJsonResponse(res, 409, resp);
        } else if ((resp as ErrorResponse).error.type === 'leader_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'invalid_credentials'
        ) {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 201, resp);
      }
    } catch (err: any) {
      logger.error(`create team: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpPut('/')
  public async updateTeam(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { id, name, emailRequester } = req.body;
    try {
      const resp = await this.teamService.updateTeam(id, name, emailRequester);
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
          writeJsonResponse(res, 404, resp);
        } else if ((resp as ErrorResponse).error.type === 'teams_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`update team: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpDelete('/')
  public async deleteTeam(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { id, emailRequester } = req.body;
    try {
      const resp = await this.teamService.deleteTeam(id, emailRequester);
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
          writeJsonResponse(res, 404, resp);
        } else if ((resp as ErrorResponse).error.type === 'team_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`delete employee: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpPost('/add2team')
  public async addEmployeeToTeam(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { teamId, employeeId, emailRequester } = req.body;
    try {
      const resp = await this.teamService.addEmployeeToTeam(
        teamId,
        employeeId,
        emailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'team_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_no_exists'
        ) {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_is_unavailable'
        ) {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'invalid_credentials'
        ) {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`add to team: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpPost('/changeleader')
  public async addLeader2Team(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { teamId, leaderId, emailRequester } = req.body;
    try {
      const resp = await this.teamService.changeLeader(
        teamId,
        leaderId,
        emailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'team_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_no_exists'
        ) {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_is_unavailable'
        ) {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'invalid_credentials'
        ) {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`add to team: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpPost('/removefromteam')
  public async removeEmployeeToTeam(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { teamId, employeeId, emailRequester } = req.body;
    try {
      const resp = await this.teamService.removeEmployeeToTeam(
        teamId,
        employeeId,
        emailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'team_no_exists') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'invalid_credentials'
        ) {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`remove from team: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }
}
