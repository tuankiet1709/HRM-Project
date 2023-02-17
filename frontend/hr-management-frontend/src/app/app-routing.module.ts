import { AssignTeamComponent } from './components/team/assign-team/assign-team.component';
import { TeamDetailComponent } from './components/team/team-detail/team-detail.component';
import { CreateEmployeeComponent } from './components/employee/create-employee/create-employee.component';
import { AllEmployeeListComponent } from './components/employee/all-employee-list/all-employee-list.component';
import { ListAllTeamComponent } from './components/team/list-all-team/list-all-team.component';
import { TeamListComponent } from './components/team/list/list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateTeamComponent } from './components/team/create/create.component';
import { AuthGuard } from './helper/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'all-teams', component: ListAllTeamComponent },
  { path: 'team-create', component: CreateTeamComponent },
  { path: 'all-employees', component: AllEmployeeListComponent },
  { path: 'employee-create', component: CreateEmployeeComponent },
  { path: 'team-detail/:id', component: TeamDetailComponent },
  { path: 'assign-team', component: AssignTeamComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
