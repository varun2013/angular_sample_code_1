import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from './auth-user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private auth: AuthUserService,
    private myRoute: Router){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isLoggednIn()){
      return true;
    }else{
      // this.myRoute.navigate(["/login"]);
      return false;
    }
  }

}
