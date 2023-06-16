import { Shift } from './../../../model/Shift';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { User } from './../../../model/User';
import { Component } from '@angular/core';
import { usersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/Roles.service';
import Swal from 'sweetalert2';
import { Role } from 'src/app/model/Role.model';
import { Planification } from 'src/app/model/Planification';
import { PlanificationsService } from 'src/app/services/Planification.service';
import { ShiftsService } from 'src/app/services/Shifts.service';
import { Permission } from 'src/app/model/Permission';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {

total !:any
  currentPage :any = 1;
  itemsPerPage :any = 10;
   addFormVisible: boolean = false;
  editFormVisible: boolean = false;
   users!: User[];
   roles!: Role[];
   plani!: Planification[];
   Shift!: Shift[];
   permissions!: Permission[];
   user: User= new User();
  totalusers!: number;
  selectedSortOrderbystate !:string
  term: any ="all";
 


  constructor(
    private  perserv: PermissionsService,
    private  shiftser: ShiftsService,
    private  planiser: PlanificationsService,
    private  userser : usersService,
    private  rolesser : RolesService,
    private toastr: ToastrService,
    private router: Router
    
  ) { }
  ngOnInit(): void {
    this.getusers()
    this.getallroles()
    this. getallplani()
    this.getallshift()
    this.getallpermission()
  }
  getallpermission()
  {
    this.perserv.getpermissions().subscribe(d=>{
      this.permissions=d
      console.log(this.roles)
    })
  }
  getallroles()
  {
    this.rolesser.getroles().subscribe(d=>{
      this.roles=d
      console.log(this.roles)
    })
  }
  getallplani()
  {
    this.planiser.getplanifications().subscribe(d=>{
      this.plani=d
      console.log(this.roles)
    })
  }
  getallshift()
  {
    this.shiftser.getshifts().subscribe(d=>{
      this.Shift=d
      console.log(this.roles)
    })
  }
  ChangeSortOrderbystate(event :any)
  {this.term=event.target.value
   
  }

  infouser(f:any){}
  getid(event:any){
    this.user.roleId=event.target.value
      }

  getidper(event:any){
    this.user.permissionId=event.target.value
      }
  
  getidrole(event:any){
this.user.roleId=event.target.value
  }
  getidplani(event:any){
    this.user.listePlanificationId=event.target.value
  }
  getidshift(event:any){
    this.user.shiftId=event.target.value
   
  }    
     createuser(){
      console.log(this.user)
 
      this.userser.createUser(this.user).subscribe(data=>{
          console.log(data)
          this.toastr.success("user ajouter avec succès!")
          this.getusers()
          this.hideAddForm()
        }, error=>{
          console.log(error);
          this.toastr.error("Erreur, Serveur ne répond pas!")
        });
        this.user=new User();
      

      }
    
      getusers(){
       
        this.userser.getusers().subscribe(data => {
          if(data != null){
            console.log(data.length)
            this.users= data;
            this.totalusers = data.length;
          }else{
            this.totalusers = 0;
            this.users = [];
          }
        }, error => {
          this.toastr.warning("Serveur ne répond pas!")
        });
      }
    
      
      deleteuser(user: User) {
        
          Swal.fire({
            title: 'Are you sure want to remove?',
            text: 'You will not be able to recover this Role!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
          }).then((result) => {
            if (result.value) {
      
        this.userser.deleteUser(user.id).subscribe(data => {
          this.toastr.warning("user supprimée!")
        
          this.getusers()
          this.hideAddForm()
          
        }, error => {
          this.toastr.error("Error, server not responding!")
          console.log(error)
        })
          }
});
      }
    
      edituser(user: User) {
        this.hideAddForm()
        this.userser.findUserById(user.id).subscribe(data=>{
          this.user = data;
          this.showEditForm()
        
        });
      }
    updateuser(user: User) {
       
        this.userser.updtaeUser(user,user.id).subscribe(data=>{
          this.user = data;
          this.toastr.success("user Modifier avec succès!")
          this.getusers()
         
          this.hideEditForm()
        }, error => {
          this.toastr.error("Error, server not responding!")
          console.log(error)
        });
      }
      showAddForm() {
      
        this.addFormVisible = true;
       
      }
      hideAddForm() {
        this.addFormVisible = false;
      }
    
      showEditForm() {
        this.editFormVisible = true;
      }
      hideEditForm() {
        this.editFormVisible = false;
      }
    
     
    
      gotoTop() {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      redirectToList(){
        this.router.navigate(['/admin'])
      }
    
    
    }
    

