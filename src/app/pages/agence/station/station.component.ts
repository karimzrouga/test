import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Station } from 'src/app/model/Station';
import { StationsService } from 'src/app/services/Stations.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent {

  currentPage :any = 1;
  itemsPerPAge :any = 10;
  station: Station= new Station();
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  stations! : Station[];

  totalstations! : number;
  total ! :any
  constructor(
    private stationsrvice:  StationsService,

    private toastr: ToastrService,
    private router: Router 
  ){ }
  ngOnInit(): void{
    this.getstations()
  }
createstation(){
  this.hideEditForm()
  
  this.stationsrvice.createstation(this.station).subscribe(data=>{
    console.log(data)
    this.toastr.success("Station ajouter avec succès!")
    this.getstations()
    this.hideAddForm()
  }, error=>{
    console.log(error);
    this.toastr.error ("Erreur, Serveur ne répond pas!")
  })
  this.station=new Station();
}
getstations(){
  this.station=new Station();
  this.stationsrvice.getstations().subscribe(data => {
    if(data != null){
      console.log(data.length)
      this.stations= data;
      this.totalstations=data.length;
      this.total=this.totalstations/10
    }else{
      this.totalstations = 0;
      this.stations = [];
    }
  }, error => {
    this.toastr.warning("Serveur ne répond pas!")
  });
}
deletestation(station: Station) {
  Swal.fire({
    title: 'Are you sure want to remove?',
    text: 'You will not be able to recover this Role!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.value) {
      this.stationsrvice.deletestation(station.id).subscribe(data => {
        this.toastr.warning("Role supprimée!")
      
        this.getstations()
        this.hideAddForm()
        
      }, error => {
        this.toastr.error("Error, server not responding!")
        console.log(error)
      })
    }
  });
 
}
editstation(station: Station) {
  this.hideAddForm()
  this.stationsrvice.findstationById(station.id).subscribe(data=>{
    this.station = data;
    this.showEditForm()
  
  });
}
 
updatestation(station: Station) {
   
  this.stationsrvice.updtaestation(station,station.id).subscribe(data=>{
    this.station = data;
    this.toastr.success("Role Modifier avec succès!")
    this.getstations()
    this.station=new Station();
    this.hideEditForm()
  }, error => {
    this.toastr.error("Error, server not responding!")
    console.log(error)
  });
}
showAddForm() {
  this.addFormVisible = true;
 
}
showEditForm() {
  throw new Error('Method not implemented.');
}

  log(data: any) {
    throw new Error('Method not implemented.');
  }
  hideAddForm() {
    throw new Error('Method not implemented.');
  }
  hideEditForm() {
    throw new Error('Method not implemented.');
  }

}
