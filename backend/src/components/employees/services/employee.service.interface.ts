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
}
