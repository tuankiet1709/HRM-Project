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

import { IEmployeeService } from '@src/components/employees/services/employee.service.interface';
import { writeJsonResponse } from '@src/utils/express';
import logger from '@src/utils/logger';
import TYPES from '@src/constants/type';
import { ErrorResponse } from './../../../constants/response';

@controller('/employees')
export class EmployeeController extends BaseHttpController {
  private employeeService: IEmployeeService;

  constructor(
    @inject(TYPES.IEmployeeService) employeeService: IEmployeeService,
  ) {
    super();
    this.employeeService = employeeService;
  }

  @httpGet('/', TYPES.AuthMiddleware)
  public async getEmployees(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const employees = await this.employeeService.getEmployees();
    writeJsonResponse(res, 200, employees);
  }

  @httpGet('/:id', TYPES.AuthMiddleware)
  public async getById(
    @requestParam('id') id: string,
    @request() req: express.Request,
    @response() res: express.Response,
  ): Promise<void> {
    const employee = await this.employeeService.getById(id);
    writeJsonResponse(res, 200, employee);
  }
  @httpPost('/login')
  public async login(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { email, password } = req.body;
    try {
      const resp = await this.employeeService.login(email, password);
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupported ${resp}`);
        }
      } else {
        const { userId, token, expireAt, name, role } = resp as {
          token: string;
          userId: string;
          expireAt: Date;
          name: string;
          role: string;
        };

        writeJsonResponse(
          res,
          200,
          {
            userId: userId,
            token: token,
            expireAt: expireAt.toISOString(),
            name: name,
            role: role,
          },
          { 'X-Expires-After': expireAt.toISOString() },
        );
      }
    } catch (err: any) {
      logger.error(`login: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpPost('/', TYPES.AuthMiddleware)
  public async createEmployee(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { email, password, name, dob, phoneNumber, role, emailRequester } =
      req.body;
    try {
      const resp = await this.employeeService.createEmployee(
        email,
        password,
        name,
        dob,
        phoneNumber,
        role,
        emailRequester,
      );
      logger.debug(emailRequester);
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'employee_already_exists') {
          logger.debug(116);
          writeJsonResponse(res, 409, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'invalid_credentials'
        ) {
          logger.debug(120);
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 201, resp);
      }
    } catch (err: any) {
      logger.error(`create employee: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }
  @httpPut('/', TYPES.AuthMiddleware)
  public async updateEmployee(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { email, password, name, dob, phoneNumber, role, mailRequester } =
      req.body;
    try {
      const resp = await this.employeeService.updateEmployee(
        email,
        password,
        name,
        dob,
        phoneNumber,
        role,
        mailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_no_exists'
        ) {
          writeJsonResponse(res, 404, resp);
        } else {
          throw new Error(`unsupport ${resp}`);
        }
      } else {
        writeJsonResponse(res, 204, resp);
      }
    } catch (err: any) {
      logger.error(`update employee: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }

  @httpDelete('/', TYPES.AuthMiddleware)
  public async deleteEmployee(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { email, mailRequester } = req.body;
    try {
      const resp = await this.employeeService.deleteEmployee(
        email,
        mailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
          writeJsonResponse(res, 404, resp);
        } else if (
          (resp as ErrorResponse).error.type === 'employee_no_exists'
        ) {
          writeJsonResponse(res, 404, resp);
        } else if ((resp as ErrorResponse).error.type === 'employee_deleted') {
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
}
