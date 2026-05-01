import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.appService.userDetails() === null) {
      return this.router.createUrlTree(['/login']); 
    }
    return true;
  }
}
