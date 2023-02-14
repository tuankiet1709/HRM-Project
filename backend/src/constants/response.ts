import { IEmployee } from './../components/employees/models/employee';
export type ErrorResponse = { error: { type: string; message: string } };
export type CreateEmployeeResponse = ErrorResponse | { employeeId: string };
export type GetEmployeeResponse = ErrorResponse | { employee: IEmployee };
export type UpdateEmployeeResponse = ErrorResponse | { employeeId: string };
