import { CookieService } from 'ngx-cookie-service';
import { Role } from './../../constants/role.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public role: string | null = '';
  public name: string | null = '';
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.isLogin();
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
