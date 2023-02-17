import { Team } from './team.model';
export interface Employee {
  _id: string;
  email: string;
  name: string;
  dob: Date;
  phoneNumber: number;
  currentTeams: Team[];
  status: string;
  role: string;
  isDeleted: boolean;
}
