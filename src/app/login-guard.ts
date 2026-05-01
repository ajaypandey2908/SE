import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from './services/app.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.appService.userDetails() !== null) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
