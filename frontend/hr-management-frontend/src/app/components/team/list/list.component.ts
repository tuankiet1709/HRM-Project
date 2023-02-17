import { Router } from '@angular/router';
import { Employee } from './../../../models/member.model';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { AuthService } from 'src/app/services/auth-service/auth-service.service';
import { TeamService } from './../../../services/team/team.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  p: number = 1;
  limit: number = 6;
  total: number = 0;
  search: String = '';

  constructor(
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTeamOfUser();
  }

  onNewTeam() {
    this.router.navigate(['/team-create']);
  }

  getTeamOfUser() {
    const userId = this.cookieService.get('userId');
    this.employeeService.getEmployeeById(userId).subscribe((res: any) => {
      console.log(res);
      this.teams = res.employee.currentTeams;
    });
  }
}
