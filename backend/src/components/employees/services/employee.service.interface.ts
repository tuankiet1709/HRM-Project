import {
  CreateEmployeeResponse,
  GetEmployeesResponse,
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
  LoginEmployeeResponse,
  GetEmployeeResponse,
} from '@src/constants/response';
import { Role } from '@src/constants/role.enum';

export interface IEmployeeService {
  getEmployees(): Promise<GetEmployeesResponse>;
  getById(id: string): Promise<GetEmployeeResponse>;
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
  createAuthToken(
    employeeId: string,
  ): Promise<{ token: string; expireAt: Date }>;
  login(login: string, password: string): Promise<LoginEmployeeResponse>;
}
