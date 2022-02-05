import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ProfessionComponent } from './profession/profession.component';
import { HomeComponent } from './home/home.component';
import { SalaryComponent } from './salary/salary.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'professions', component: ProfessionComponent },
  { path: 'salaries', component: SalaryComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
