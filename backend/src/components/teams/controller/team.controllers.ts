import { ITeamService } from '@src/components/teams/services/team.service.interface';
import 'reflect-metadata';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestParam,
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

  @httpGet('/', TYPES.AuthMiddleware)
  public async getTeams(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const teams = await this.teamService.getTeams();
    writeJsonResponse(res, 200, teams);
  }

  @httpGet('/:id', TYPES.AuthMiddleware)
  public async getById(
    @requestParam('id') id: string,
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    logger.debug(id);
    const team = await this.teamService.getById(id);
    writeJsonResponse(res, 200, team);
  }

  @httpPost('/', TYPES.AuthMiddleware)
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

  @httpPut('/', TYPES.AuthMiddleware)
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

  @httpDelete('/', TYPES.AuthMiddleware)
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

  @httpPost('/add2team', TYPES.AuthMiddleware)
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
          (resp as ErrorResponse).error.type === 'employee_exists_in_team'
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

  @httpPost('/changeleader', TYPES.AuthMiddleware)
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

  @httpPost('/removefromteam', TYPES.AuthMiddleware)
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
        } else if (
          (resp as ErrorResponse).error.type === 'employee_no_exists_in_team'
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
