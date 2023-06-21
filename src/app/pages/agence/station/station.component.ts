import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormRecord } from '@angular/forms';
import { Circuit } from 'src/app/model/Circuit';
import { Permission } from 'src/app/model/Permission';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { Station } from 'src/app/model/Station';
import { CircuitsService } from 'src/app/services/Circuits.service';
import { StationsService } from 'src/app/services/Stations.service';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent {
  google!: any;
  currentPage: any = 1;
  itemsPerPAge: any = 10;
  station: Station = new Station();
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  stations!: Station[];
  circuits!: Circuit[];
  totalstations!: number;
  permision!: Permission;
  total !: any
  idcircircuit!: number
 
  constructor(
    private stationsrvice: StationsService,
    private circuitsrvice: CircuitsService,
    private perm: PermissionsService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  map!: L.Map;
  initMap() {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e) => this.onMapClick(e));
  }
  onMapClick(e:any) {
    this.station.longitude = e.latlng.lng;
    this.station.latitude = e.latlng.lat;
  
    // Call the reverse geocoding function
    this.getAddressFromCoordinates(e.latlng.lat, e.latlng.lng)
      .then((address) => {
        this.station.lieu=address
        console.log(address);
        // Use the address as needed
      })
      .catch((error) => {
        console.error('Error retrieving address:', error);
      });
  }
  getAddressFromCoordinates(latitude:any, longitude:any) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          return data.display_name;
        } else {
          throw new Error('Address not found');
        }
      });
  }
  ngOnInit(): void {
    this.initMap()

   
    this.getperm()

    this.getallcircuit()
  }
  getperm() {
    const id = sessionStorage.getItem("permissionId")
    this.perm.findpermissionById(id).subscribe(data => {
      this.permision = data;
      //console.log(this.permision)
      this.getstations()
    })

  }
  getallcircuit() {
    this.circuitsrvice.getCircuits().subscribe(data => {
      this.circuits = data
    })

  }
  getid(event: any) {
    this.idcircircuit = event.target.value
  }
  createstation() {
if (this.station.longitude==0 || this.station.latitude==0)
{
  this.toastr.warning("Choose station  location from map !")
}
    this.hideEditForm()
 
    console.log(this.circuits)
    this.stationsrvice.createstation(this.station, this.idcircircuit).subscribe(data => {
      console.log(data)
      this.toastr.success("Station ajouter avec succès!")
      this.getstations()
      this.hideAddForm()

    }, error => {
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    })
    this.station = new Station();
  }
  getstations() {
    if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
      this.station = new Station();
      this.stationsrvice.getstations().subscribe(data => {
        if (data != null) {
          console.log(data.length)
          this.stations = data;
          this.totalstations = data.length;
          this.total = this.totalstations / 10
        } else {
          this.totalstations = 0;
          this.stations = [];
        }
      }, error => {
        this.toastr.warning("Serveur ne répond pas!")
      });
    } else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Consulte Permission  Error Contacté Administrateur !',

      })
    }
  }
  deletestation(station: Station) {
    if (this.permision.title.toLocaleLowerCase().includes("delete")) {
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

    } else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'DELETE Permission  Error Contacté Administrateur !',

      })
    }

  }

  editstation(station: Station) {
    this.hideAddForm()
    this.stationsrvice.findstationById(station.id).subscribe(data => {
      this.station = data;
      this.showEditForm()
      this.gotoTop()

    });


  }

  updatestation(station: Station) {
console.log(this.station)
    this.stationsrvice.updtaestation(station, station.id).subscribe(data => {
      this.station = data;
      this.toastr.success("Station Modifier avec succès!")
      this.getstations()
      this.station = new Station();
      this.hideEditForm()
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    });
  }
  showAddForm() {
    if (this.permision.title.toLocaleLowerCase().includes("create")) {
      this.addFormVisible = true;

    } else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Create Permission  Error Contacté Administrateur !',

      })
    }
  }
  showEditForm() {
    if (this.permision.title.toLocaleLowerCase().includes("update")) {
      this.editFormVisible = true;
      //throw new Error('Method not implemented.');
    } else {

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
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  redirectToList() {
    this.router.navigate(['/admin'])
  }

}
