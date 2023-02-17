import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/member.model';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-list-all-team',
  templateUrl: './list-all-team.component.html',
  styleUrls: ['./list-all-team.component.css'],
})
export class ListAllTeamComponent implements OnInit {
  teams: Team[] = [];

  constructor(private teamService: TeamService, private router: Router) {}

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe((res: any) => {
      console.log(res.teams);
      this.teams = res.teams;
    });
  }

  onNewTeam() {
    this.router.navigate(['/team-create']);
  }
}
