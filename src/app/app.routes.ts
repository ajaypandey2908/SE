import { Routes } from '@angular/router';
import { Loginpage } from './loginpage/loginpage';
import { Dashboard } from './dashboard/dashboard';
import { Upload } from './upload/upload';
import { Table } from './table/table';
import { Practice } from './practice/practice';


export const routes: Routes = [
    {path:'', component:Loginpage},
    {path:'login', component:Loginpage},

    {path: 'dashboard' , component: Dashboard},
    {path: 'upload', component: Upload},
    {path: 'table', component: Table},
    {path: 'practice', component:Practice}
   
];
