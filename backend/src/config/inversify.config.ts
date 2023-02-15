import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '../constants/type';

import { IEmployeeService } from '@src/components/employees/services/employee.service.interface';
import { EmployeeService } from '@src/components/employees/services/employee.service';
import { TeamService } from '@src/components/teams/services/team.service';
import { ITeamService } from '@src/components/teams/services/team.service.interface';

import '../components/employees/controller/employee.controllers';
import '../components/teams/controller/team.controllers';
import AuthMiddleware from '@src/middlewares/auth-middleware';

const container = new Container();

container
  .bind<IEmployeeService>(TYPES.IEmployeeService)
  .to(EmployeeService)
  .inSingletonScope();
container
  .bind<ITeamService>(TYPES.ITeamService)
  .to(TeamService)
  .inSingletonScope();
container
  .bind<AuthMiddleware>(TYPES.AuthMiddleware)
  .to(AuthMiddleware)
  .inSingletonScope();

export default container;
