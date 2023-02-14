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

import { IEmployeeService } from '@src/components/employees/services/employee.service.interface';
import { writeJsonResponse } from '@src/utils/express';
import logger from '@src/utils/logger';
import TYPES from '@src/constants/type';
import { ErrorResponse } from './../../../constants/response';
import { loginValidation } from '../middlewares/user.validators';

@controller('/employees')
export class EmployeeController extends BaseHttpController {
  private employeeService: IEmployeeService;

  constructor(
    @inject(TYPES.IEmployeeService) employeeService: IEmployeeService,
  ) {
    super();
    this.employeeService = employeeService;
  }

  @httpPost('/', ...loginValidation)
  public async createEmployee(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const { email, password, name, dob, phoneNumber, role, mailRequester } =
      req.body;
    try {
      const resp = await this.employeeService.createEmployee(
        email,
        password,
        name,
        dob,
        phoneNumber,
        role,
        mailRequester,
      );
      if ((resp as any).error) {
        if ((resp as ErrorResponse).error.type === 'employee_already_exists') {
          writeJsonResponse(res, 409, resp);
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
      logger.error(`create employee: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: 'internal_server_error',
          message: 'Internal Server Error',
        },
      });
    }
  }
  @httpPut('/')
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

  @httpDelete('/')
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
