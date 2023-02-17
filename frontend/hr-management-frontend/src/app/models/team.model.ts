import { Employee } from "./member.model";

export interface Team{
  _id: string;
  name: string;
  leader: Employee;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: Employee;
  employees: Employee[];
  isDeleted: boolean;
}
