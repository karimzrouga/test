import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanificationComponent } from './planifi/planification/planification.component';
import { ShiftListComponent } from './shift/shift-list/shift-list.component';
import { CotisationComponent } from './coti/cotisation/cotisation.component';
import { AdminComponent } from './admin/admin.component';
import { ListUserComponent } from './list-user/list-user.component';

const routes: Routes = [
  {
    path:'admin' ,component:AdminComponent, 
    children:[
      {path:'users', component:ListUserComponent},
      
      {path: 'planifications' ,component:PlanificationComponent},
      {path: 'shifts' , component:ShiftListComponent},
      {path: 'coti' ,component:CotisationComponent}
    ]
  }

 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
