import { CookieService } from 'ngx-cookie-service';
import { TeamService } from 'src/app/services/team/team.service';
import { Team } from 'src/app/models/team.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css'],
})
export class TeamDetailComponent implements OnInit {
  team: Team = {} as Team;
  role: string = '';
  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTeam(this.route.snapshot.params['id']);
    this.role = this.cookieService.get('role')
  }

  getTeam(id: string) {
    this.teamService.getTeamById(id).subscribe((res: any) => {
      console.log(res);
      this.team = res.team;
    });
  }

  addMember() {
    this.router.navigate(['/assign-team'], {
      queryParams: { id: this.team._id },
    });
  }
}
