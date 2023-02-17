import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth-service/auth-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public role: string | null = '';
  public name: string | null = '';
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.isLogin();
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
