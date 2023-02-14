import {
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
} from './../../../constants/response';
import {
  CreateEmployeeResponse,
  GetEmployeeResponse,
} from '@src/constants/response';
import { Role } from '@src/constants/role.enum';

export interface IEmployeeService {
  findEmployee(email: string): Promise<GetEmployeeResponse>;
  createEmployee(
    email: string,
    password: string,
    name: string,
    dob: Date,
    phoneNumber: number,
    role: Role,
    creatorEmail: string,
  ): Promise<CreateEmployeeResponse>;
  updateEmployee(
    email: string,
    password: string,
    name: string,
    dob: Date,
    phoneNumber: number,
    role: Role,
    editorEmail: string,
  ): Promise<UpdateEmployeeResponse>;
  deleteEmployee(
    email: string,
    mailRequester: string,
  ): Promise<DeleteEmployeeResponse>;
}
