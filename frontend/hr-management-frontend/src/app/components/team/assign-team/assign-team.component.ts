import { Status } from './../../../constants/status.enum';
import { AssignTeam } from './../../../models/team-assign.model';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Role } from 'src/app/constants/role.enum';
import { Employee } from 'src/app/models/member.model';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-assign-team',
  templateUrl: './assign-team.component.html',
  styleUrls: ['./assign-team.component.css'],
})
export class AssignTeamComponent {
  role: string = '';
  members: Employee[] = [];
  editMode = false;
  teamForm!: FormGroup;
  id: string = '';

  constructor(
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getMembers();
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    this.role = this.cookieService.get('role');
  }

  private initForm() {
    let member = '';

    if (this.editMode) {
    }
    this.teamForm = new FormGroup({
      member: new FormControl(member, Validators.required),
    });
  }

  getMembers() {
    this.employeeService.getEmployee().subscribe((res: any) => {
      const employees: Employee[] = res.employees;
      this.members = employees.filter(
        (employee) =>
          employee.role === Role.MEMBER &&
          employee.status === Status.AVAILABLE &&
          employee.isDeleted === false
      );
      console.log(this.members);
    });
  }

  onSubmit() {
    const formData = this.teamForm.value;

    console.log(formData);
    this.employeeService
      .getEmployeeById(this.cookieService.get('userId'))
      .subscribe((res: any) => {
        console.log(res);
        const assignTeam: AssignTeam = {
          teamId: this.id,
          employeeId: formData.member,
          emailRequester: res.employee.email,
        };
        console.log(assignTeam);
        this.teamService.assignEmployee(assignTeam).subscribe(() => {
          if (this.role === Role.ADMIN) {
            this.router.navigate(['/all-teams']);
          } else {
            this.router.navigate(['/teams']);
          }
        });
      });
  }

  onCancel() {
    if (this.role === Role.ADMIN) {
      this.router.navigate(['/all-teams']);
    } else {
      this.router.navigate(['/teams']);
    }
  }
}
