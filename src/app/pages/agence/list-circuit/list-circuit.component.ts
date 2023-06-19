import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Circuit } from 'src/app/model/Circuit';
import { Stat } from 'src/app/model/Stat';
import { Station } from 'src/app/model/Station';
import { CircuitsService } from 'src/app/services/Circuits.service';
import { StationsService } from 'src/app/services/Stations.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-circuit',
  templateUrl: './list-circuit.component.html',
  styleUrls: ['./list-circuit.component.css']
})
export class ListCircuitComponent {
  total !:any
  currentPage :any = 1;
  itemsPerPage :any = 10;
  circuit :Circuit = new Circuit();
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Circuits!:Circuit [];
  stations!:Station [];
  totalCircuit !: number;
  term: any ="all";
  constructor(
    private  circuitsrvice: CircuitsService,
    private  stationsrvice: StationsService,
    private toastr: ToastrService,
    private router: Router,
    private builder:FormBuilder
    
  ) { }
 
  ngOnInit(): void {

 this.getCircuits()
 this.getstations()


  }
  public filterCallback = (item: any) => {
    
    return this.stationsrvice.filter(e=> e.stationsId==this.term)
  };

  getstations()
  {
    this.stationsrvice.getstations().subscribe(data=>{
      this.stations=data
    })
  }
  infoStation(Station: Station) {
 
    this.stationsrvice.findstationById(Station.id).subscribe(data=>{
      Swal.fire({
        icon: 'info',
        title: data.lieu,
        html:
          '<div class="swal-info">' +
          ' <p><b>Matricule:</b> <span>' + data.lieu + '</span></p>' +
         
          '</div>',
        customClass: {
          container: 'swal-container',
          title: 'swal-title',
          htmlContainer: 'swal-html-container',
        }
      });
     
    
    });
  }
  getid(event :any){
   // this.stations.id=event.target.value;
     }
  createcircuit (){

this.circuitsrvice.createCircuit(this.circuit).subscribe(data=>{
      console.log(data)
      this.toastr.success("Circuit  ajouter avec succès!")
      this.getCircuits()
      this.hideAddForm()
    
    }, error=>{
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.circuit =new Circuit();


  }

  getCircuits(){
  
    this.circuitsrvice.getCircuits().subscribe(data => {
      if(data != null){
        console.log(data.length)
        this.Circuits= data;
        this.totalCircuit = data.length;
      }else{
        this.totalCircuit = 0;
        this.Circuits = [];
      }
    }, error => {
      this.toastr.warning("Serveur ne répond pas!")
    });
  }

  
  deleteCircuit (Circuit :Circuit ) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this Role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
  
    this.circuitsrvice.deleteCircuit(Circuit .id).subscribe(data => {
      this.toastr.warning("Circuit supprimée!")
    
      this.getCircuits()
      this.hideAddForm()
      
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    })
  }
});
  }

  editcircuit (Circuit :Circuit ) {
    this.hideAddForm()
    this.circuitsrvice.findCircuitById(Circuit.id).subscribe(data=>{
      this.circuit  = data;
      this.showEditForm()
    
    });
  }
updatecircuit (Circuit :Circuit ) {
   
    this.circuitsrvice.updtaeCircuit (Circuit ,Circuit .id).subscribe(data=>{
      this.circuit  = data;
      this.toastr.success("Circuit  Modifier avec succès!")
      this.getCircuits ()
     
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


