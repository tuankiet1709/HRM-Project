import { EmployeeCreate } from './../../models/employee-create';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Employee } from 'src/app/models/member.model';

const url = 'http://localhost:3000/api/employees';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpClient: HttpClient) {}

  getEmployee(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(url);
  }

  getEmployeeById(id: string): Observable<Employee> {
    let params = new HttpParams().set('id', JSON.stringify(id));

    console.log(params);

    return this.httpClient.get<Employee>(url + `/${id}`);
  }

  createEmployee(employeeCreate: EmployeeCreate): Observable<string> {
    return this.httpClient.post<string>(url, employeeCreate);
  }
}
