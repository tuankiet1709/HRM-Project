import { IEmployee } from './../components/employees/models/employee';
export type ErrorResponse = { error: { type: string; message: string } };
export type CreateEmployeeResponse = ErrorResponse | { employeeId: string };
export type GetEmployeeResponse = ErrorResponse | { employee: IEmployee };
export type UpdateEmployeeResponse = ErrorResponse | { employeeId: string };
export type DeleteEmployeeResponse = ErrorResponse | { employeeId: string };
export type CreateTeamResponse = ErrorResponse | { teamId: string };
export type UpdateTeamResponse = ErrorResponse | { teamId: string };
export type DeleteTeamResponse = ErrorResponse | { teamId: string };
export type AddEmployeeToTeamResponse = ErrorResponse | { response: boolean };
export type RemoveEmployeeToTeamResponse =
  | ErrorResponse
  | { response: boolean };
