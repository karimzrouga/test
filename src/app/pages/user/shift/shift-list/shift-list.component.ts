import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Permission } from 'src/app/model/Permission';
import { Shift } from 'src/app/model/Shift';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { ShiftsService } from 'src/app/services/Shifts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent {
  total !:any
  currentPage :any = 1;
  itemsPerPage :any = 10;
 shift: Shift= new Shift();
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  shifts!: Shift[];
  permision!:Permission
  totalshifts!: number;
   
  constructor(
    private  shiftsrvice: ShiftsService,
   private perm :PermissionsService,
    private toastr: ToastrService,
    private router: Router
    
  ) { }

  ngOnInit(): void {


this. getperm()
    
        

  }

 
  createshift(){
    this.hideEditForm()

  this.shiftsrvice.createshift (this.shift).subscribe(data=>{
      console.log(data)
      this.toastr.success("Shift ajouter avec succès!")
      this.getshifts()
      this.hideAddForm()
    }, error=>{
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.shift=new Shift();
    

  }
  getperm()
  { const id=sessionStorage.getItem("permissionId")
    this.perm.findpermissionById(id).subscribe(data=>{
   this.permision=data;
   //console.log(this.permision)
   this.getshifts()
    })
   
  }
  getshifts(){
    console.log("hello" + this.permision.title)
    if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
      this.shift = new Shift();
      this.shiftsrvice.getshifts().subscribe(data => {
        if(data != null){
          console.log(data.length)
          this.shifts= data;
          this.totalshifts = data.length;
          this.total=this.totalshifts/10
        }else{
          this.totalshifts = 0;
          this.shifts = [];
        }
      }, error => {
        this.toastr.warning("Serveur ne répond pas!")
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Consulte Permission  Error Contacté Administrateur !',

      })
    }
    
    
  }

  
  deleteshift(shift: Shift) {
    if(this.permision.title.toLocaleLowerCase().includes("delete"))
    {
       Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this Role!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
  
    this.shiftsrvice.deleteshift(shift.id).subscribe(data => {
      this.toastr.warning("Shift supprimée!")
    
      this.getshifts()
      this.hideAddForm()
      
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    })
  }
});
    }else
    {
    
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'DELETE Permission  Error Contacté Administrateur !',
       
      })
    }
     
  }

  editshift(shift: Shift) {
    this.hideAddForm()
    this.shiftsrvice.findshiftById(shift.id).subscribe(data=>{
      this.shift = data;
 
      this.showEditForm()
      this.gotoTop()
    
    });
  }
  updtaeshift(shift: Shift) {
   
    this.shiftsrvice.updtaeshift(shift,shift.id).subscribe(data=>{
      this.shift = data;
      this.toastr.success("Role Modifier avec succès!")
      this.getshifts()
      this.shift=new Shift();
      this.hideEditForm()
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    });
  }
  showEditForm() {

    if(this.permision.title.toLocaleLowerCase().includes("update"))
    {
      this.editFormVisible = true;
    }else
    {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Update Permission  Error Contacté Administrateur !',
       
      })
  
    }
    
   
  }
  hideAddForm() {
    this.addFormVisible = false;
  }

  
  hideEditForm() {
    this.editFormVisible = false;
  }
  showAddForm() {

    if(this.permision.title.toLocaleLowerCase().includes("create"))
    {
      this.addFormVisible = true;
    }else
    {
   
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Create Permission  Error Contacté Administrateur !',
       
      })
    }
    
   
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
