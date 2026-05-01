import { Routes } from '@angular/router';
import { Loginpage } from './loginpage/loginpage';
import { Dashboard } from './dashboard/dashboard';
import { Upload } from './upload/upload';
import { Table } from './table/table';
import { Practice } from './practice/practice';
import { LoginGuard } from './login-guard';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Loginpage, canActivate: [LoginGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'upload', component: Upload, canActivate: [AuthGuard] },
  { path: 'table', component: Table, canActivate: [AuthGuard] },
  { path: 'practice', component: Practice, canActivate: [AuthGuard] }
];
