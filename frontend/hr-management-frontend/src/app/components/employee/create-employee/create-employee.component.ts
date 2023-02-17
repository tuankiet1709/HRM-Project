import { EmployeeCreate } from './../../../models/employee-create';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Role } from 'src/app/constants/role.enum';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent {
  editMode = false;
  employeeForm!: FormGroup;
  roles: string[] = ['MEMBER', 'LEADER', 'ADMIN'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    const name = '';
    const email = '';
    const password = '';
    const dob = '';
    const phoneNumber = '';
    const role = '';

    if (this.editMode) {
    }

    this.employeeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      email: new FormControl(email, Validators.required),
      password: new FormControl(password, Validators.required),
      dob: new FormControl(dob, Validators.required),
      phoneNumber: new FormControl(phoneNumber, Validators.required),
      role: new FormControl(role, Validators.required),
    });
  }

  onSubmit() {
    const formData = this.employeeForm.value;

    console.log(formData);
    this.employeeService
      .getEmployeeById(this.cookieService.get('userId'))
      .subscribe((res: any) => {
        console.log(res);
        const employeeCreate: EmployeeCreate = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          emailRequester: res.employee.email,
        };
        console.log(employeeCreate);
        this.employeeService
          .createEmployee(employeeCreate)
          .subscribe((res: string) => {
            if (res) {
              this.router.navigate(['/all-employees']);
            }
          });
      });
  }

  onCancel() {
    this.router.navigate(['/all-employees']);
  }
}
