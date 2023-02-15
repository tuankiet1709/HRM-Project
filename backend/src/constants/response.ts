import { ITeamModel, ITeamDocument } from './../components/teams/models/team';
import { IEmployee } from './../components/employees/models/employee';
export type ErrorResponse = { error: { type: string; message: string } };
export type AuthResponse = ErrorResponse | { userId: string };
export type LoginEmployeeResponse =
  | ErrorResponse
  | { token: string; userId: string; expireAt: Date };
export type CreateEmployeeResponse = ErrorResponse | { employeeId: string };
export type GetEmployeesResponse = ErrorResponse | { employees: object };
export type GetEmployeeResponse = ErrorResponse | { employee: IEmployee };
export type UpdateEmployeeResponse = ErrorResponse | { employeeId: string };
export type DeleteEmployeeResponse = ErrorResponse | { employeeId: string };
export type GetTeamsResponse = ErrorResponse | { teams: object };
export type GetTeamResponse = ErrorResponse | { team: ITeamDocument };
export type CreateTeamResponse = ErrorResponse | { teamId: string };
export type UpdateTeamResponse = ErrorResponse | { teamId: string };
export type DeleteTeamResponse = ErrorResponse | { teamId: string };
export type AddEmployeeToTeamResponse = ErrorResponse | { response: boolean };
export type RemoveEmployeeToTeamResponse =
  | ErrorResponse
  | { response: boolean };
