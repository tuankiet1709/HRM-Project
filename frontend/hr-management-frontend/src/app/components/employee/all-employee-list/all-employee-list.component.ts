import { EmployeeService } from './../../../services/employee/employee.service';
import { Employee } from 'src/app/models/member.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-employee-list',
  templateUrl: './all-employee-list.component.html',
  styleUrls: ['./all-employee-list.component.css'],
})
export class AllEmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployee().subscribe((res: any) => {
      console.log(res.employees);
      this.employees = res.employees;
    });
  }

  onNewEmployee() {
    this.router.navigate(['/employee-create']);
  }
}
