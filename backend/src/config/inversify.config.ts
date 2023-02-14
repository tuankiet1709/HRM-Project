import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from '../constants/type';

import { IEmployeeService } from '@src/components/employees/services/employee.service.interface';
import { EmployeeService } from '@src/components/employees/services/employee.service';

import '../components/employees/controller/employee.controllers';

const container = new Container();

container
  .bind<IEmployeeService>(TYPES.IEmployeeService)
  .to(EmployeeService)
  .inSingletonScope();

export default container;
