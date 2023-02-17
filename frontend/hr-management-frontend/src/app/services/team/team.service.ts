import { AssignTeam } from './../../models/team-assign.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamCreate } from 'src/app/models/team-create.model';
import { Team } from 'src/app/models/team.model';

const url = 'http://localhost:3000/api/teams';


@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private httpClient: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(url);
  }

  getTeamById(id: string): Observable<Team> {
    return this.httpClient.get<Team>(url + `/${id}`);
  }

  createTeam(teamCreate: TeamCreate): Observable<string> {
    return this.httpClient.post<string>(url, teamCreate);
  }

  assignEmployee(assignTeam: AssignTeam): Observable<string> {
    return this.httpClient.post<string>(url + '/add2team', assignTeam);
  }
}
