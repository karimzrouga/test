import { Component } from '@angular/core';

@Component({
  selector: 'app-adminsidebar',
  templateUrl: './adminsidebar.component.html',
  styleUrls: ['./adminsidebar.component.css']
})
export class AdminsidebarComponent {
 
  role !:string | null

  ngOnInit(): void {
 this.role= sessionStorage.getItem("role")
     }

}


