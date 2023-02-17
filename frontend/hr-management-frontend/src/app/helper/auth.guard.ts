import { CookieService } from 'ngx-cookie-service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuth = this.cookieService.get('token');
    const role = this.cookieService.get('role');
    if (!isAuth) {
      this.router.navigate(['/login']);
    } else if (role === 'ADMIN') {
      this.router.navigate(['/all-teams']);
    } else {
      this.router.navigate(['/teams']);
    }
    return true;
  }
}
