import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { Login } from 'src/app/models/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public role: string | null = '';
  public name: string | null = '';

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLogin();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService
      .login(form.value.emailLogin, form.value.passwordLogin)
      .subscribe((res: Login) => {
        this.authService.saveCookie(
          res.userId,
          res.token,
          res.expireAt,
          res.name,
          res.role
        );
        if (res.role === 'ADMIN') {
          this.router.navigate(['/all-teams']);
        } else {
          this.router.navigate(['/teams']);
        }
      });
  }

  onLogout() {
    this.authService.Logout();
  }

  isLogin(): boolean {
    const existsToken = this.authService.existsToken();
    if (existsToken) {
      this.role = this.cookieService.get('role');
      this.name = this.cookieService.get('name');
      return true;
    } else return false;
  }
}
