import { Station } from './../../../model/Station';
import { Circuit } from 'src/app/model/Circuit';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Vehicule } from 'src/app/model/Vehicule';
import { FormControl, Validators } from '@angular/forms';
import { VehiculesService } from 'src/app/services/Vehicules.service';
import Swal from 'sweetalert2';
import { Agence } from 'src/app/model/Agence';
import { AgencesService } from 'src/app/services/Agences.service';

@Component({
  selector: 'app-list-vehicule',
  templateUrl: './list-vehicule.component.html',
  styleUrls: ['./list-vehicule.component.css']
})
export class ListVehiculeComponent {
  total !:any
  currentPage :any = 1;
  itemsPerPage :any = 10;
  vehicule:Vehicule= new Vehicule();
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Vehicules!: Vehicule[];

  totalroles!: number;
  totalvehicules!: number 
  builder: any;
  formulaire: any;
 
  agences!: Agence[];
   
  constructor(
    private  vehiculesrvice: VehiculesService,
    private  agenceser : AgencesService,
    private toastr: ToastrService,
    private router: Router
    
  ) { }

  ngOnInit(): void {

 this.getVehicules()
 this.  getallagence()
  }
  getid(event :any){
    this.vehicule.agenceId=event.target.value;
     }
  getallagence()
 {
  this.agenceser.getAgences().subscribe(data=>{
    this.agences=data;
  })
}
 
  createVehicule(){
    this.hideEditForm()
    
  this.vehiculesrvice.createvehicule(this.vehicule).subscribe(data=>{
      console.log(data)
      this.toastr.success("vehicule ajouter avec succès!")
      this.getVehicules()
      this.hideAddForm()
    }, error=>{
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.vehicule=new Vehicule();
    

  }

  getVehicules(){
    this.vehicule = new Vehicule();
    this.vehiculesrvice.getvehicule().subscribe(data => {
      if(data != null){
        console.log(data.length)
        this.Vehicules= data;
        this.totalvehicules = data.length;
        this.total=this.totalvehicules/10
      }else{
        this.totalvehicules = 0;
        this.Vehicules = [];
      }
    }, error => {
      this.toastr.warning("Serveur ne répond pas!")
    });
  }
  deletevehicules(vehicule: Vehicule) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this Role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
  
    this.vehiculesrvice. deletevehicule(vehicule.id).subscribe(data => {
      this.toastr.warning("vehicule supprimée!")
    
      this.getVehicules()
      this.hideAddForm()
      
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    })
  }
});
  }
  infovehicule(vehicule: Vehicule) {
    let stations ="";
    vehicule.stations.forEach(element => {
      stations+= " "+element.lieu+","
    });
    this.agenceser.findAgenceById(vehicule.agenceId).subscribe(data=>{
     
      Swal.fire({
        icon: 'info',
        title: data.name,
        html:
          '<div class="swal-info">' +
          ' <p><b>Matricule vehicule:</b> <span>' + vehicule.immatricule + '</span></p>' +
          ' <p><b>Matricule Agence:</b> <span>' + data.matricule + '</span></p>' +
          ' <p><b>Email:</b> <span>' + data.email + '</span></p>' +
          ' <p><b>Adresse:</b> <span>' + data.address + '</span></p>' +
          ' <p><b>Raison Sociale:</b> <span>' + data.raisonSocial + '</span></p>' +
          ' <p><b>Station:</b> <span>' + stations + '</span></p>' +
          '</div>',
        customClass: {
          container: 'swal-container',
          title: 'swal-title',
          htmlContainer: 'swal-html-container',
        }
      });
     
    
    });
  }
  editvehicule(vehicule: Vehicule) {
    this.hideAddForm()
    this.vehiculesrvice.findvehicleById(vehicule.id).subscribe(data=>{
      this.vehicule = data;
      this.showEditForm()
    
    });
  }
updatevehicule(vehicule: Vehicule) {
   
    this.vehiculesrvice.updtaevehicule(vehicule,vehicule.id).subscribe(data=>{
      this.vehicule = data;
      this.toastr.success("Vehicule Modifier avec succès!")
      this.getVehicules()
      this.vehicule=new Vehicule();
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
