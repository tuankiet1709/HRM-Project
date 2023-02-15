import {
  AddEmployeeToTeamResponse,
  CreateTeamResponse,
  DeleteTeamResponse,
  UpdateTeamResponse,
} from './../../../constants/response';

export interface ITeamService {
  createTeam(
    name: string,
    leader: string,
    emailRequester: string,
  ): Promise<CreateTeamResponse>;
  updateTeam(
    id: string,
    name: string,
    emailRequester: string,
  ): Promise<UpdateTeamResponse>;
  deleteTeam(id: string, emailRequester: string): Promise<DeleteTeamResponse>;
  addEmployeeToTeam(
    teamId: string,
    EmployeeId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse>;
  changeLeader(
    teamId: string,
    LeaderId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse>;
  removeEmployeeToTeam(
    teamId: string,
    EmployeeId: string,
    emailRequester: string,
  ): Promise<AddEmployeeToTeamResponse>;
}
