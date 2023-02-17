import { AuthService } from 'src/app/services/auth-service/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from './../../../services/employee/employee.service';
import { TeamCreate } from './../../../models/team-create.model';
import { Employee } from 'src/app/models/member.model';
import { TeamService } from './../../../services/team/team.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/constants/role.enum';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateTeamComponent implements OnInit {
  leaders: Employee[] = [];
  editMode = false;
  teamForm!: FormGroup;

  constructor(
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getLeaders();
  }

  private initForm() {
    let name = '';
    let leader = '';

    if (this.editMode) {
    }
    this.teamForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      leader: new FormControl(leader, Validators.required),
    });
  }

  getLeaders() {
    this.employeeService.getEmployee().subscribe((res: any) => {
      const employees: Employee[] = res.employees;
      this.leaders = employees.filter(
        (employee) => employee.role === Role.LEADER
      );
      console.log(this.leaders);
    });
  }

  onSubmit() {
    const formData = this.teamForm.value;

    console.log(formData);
    this.employeeService
      .getEmployeeById(this.cookieService.get('userId'))
      .subscribe((res: any) => {
        console.log(res);
        const teamCreate: TeamCreate = {
          name: formData.name,
          leaderId: formData.leader,
          emailRequester: res.employee.email,
        };
        console.log(teamCreate);
        this.teamService.createTeam(teamCreate).subscribe((res) => {
          console.log(res);
        });

        this.router.navigate(['/all-teams']);
      });
  }

  onCancel() {
    this.router.navigate(['/all-teams']);
  }
}
