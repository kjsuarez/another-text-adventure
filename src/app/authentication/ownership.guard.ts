import { Observable } from 'rxjs';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from "@angular/core";

import { AuthService } from './auth.service';

@Injectable()

export class OwnershipGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      console.log(route.params.id)
      const id = route.params.id


      this.authService.getUsersGames()
      .subscribe(games => {
        console.log("games recieved by getUsersGames:")
        console.log(games)
        if(!games.includes(id)){
          this.router.navigateByUrl('/');
        }
      });

      return true
  }
}
