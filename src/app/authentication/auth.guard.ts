import { Observable } from 'rxjs';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from "@angular/core";

import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const is_authenticated = this.authService.getAuthStatus();

      if(!is_authenticated){
        this.router.navigateByUrl('/');
      }
      return is_authenticated
  }
}
