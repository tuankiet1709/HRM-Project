import { CookieService } from 'ngx-cookie-service';
import { Role } from './../../constants/role.enum';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ENDPOINT_URL } from 'src/app/constants/endpoint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from 'src/app/models/auth-data.model';
import { Login } from 'src/app/models/login.model';

const login_Url = ENDPOINT_URL + '/api/employees/login';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = '';
  private authStatusListener = new Subject<Boolean>();
  private nameUpdated = new Subject<string | null>();
  private roleUpdated = new Subject<string | null>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private name: string | null = '';
  private role: string | null = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(email: string, password: string): Observable<Login> {
    const authData: AuthData = { email: email, password: password };
    return this.http.post<Login>(login_Url, authData);
  }

  Logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  saveCookie(
    userId: string,
    token: string,
    expirationDate: string,
    name: string,
    role: string
  ) {
    this.cookieService.set('token', token, new Date(expirationDate));
    this.cookieService.set('userId', userId, new Date(expirationDate));
    this.cookieService.set('name', name, new Date(expirationDate));
    this.cookieService.set('role', role, new Date(expirationDate));
  }

  private clearAuthData() {
    this.cookieService.delete('token');
    this.cookieService.delete('userId');
    this.cookieService.delete('name');
    this.cookieService.delete('role');
  }

  existsToken() {
    const token: string = this.cookieService.get('token');
    if (!token) {
      return null;
    } else {
      return token;
    }
  }
}
