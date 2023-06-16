import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Agence } from 'src/app/model/Agence';
import { Facturation } from 'src/app/model/Facturation';
import { AgencesService } from 'src/app/services/Agences.service';
import { FacturationService } from 'src/app/services/Facturation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-facturation',
  templateUrl: './list-facturation.component.html',
  styleUrls: ['./list-facturation.component.css']
})
export class ListFacturationComponent {
  total !:any
  currentPage :any = 1;
  itemsPerPage :any = 10;
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Facturations!: Facturation[];
  agences!: Agence[];
  facturation: Facturation= new Facturation();
  totalFacturations!: number;
  selectedSortOrderbystate !:string
  term: any ="all";
  constructor(
    private  Facturationsrvice: FacturationService,
    private  agenceser : AgencesService,
    private toastr: ToastrService,
    private router: Router
    
  ) { }

  ngOnInit(): void {
 this.getFacturations()
 this.getallagence()
  }
  
  ChangeSortOrderbystate(event :any)
  {this.term=event.target.value
   
  }

  public filterCallback = (item: any) => {
    
    return this.Facturations.filter(e=> e.agenceId==this.term)
  };
 getallagence()
 {
  this.agenceser.getAgences().subscribe(data=>{
    this.agences=data;
  })
  
 }
 infoFacturation(Facturation: Facturation) {
 
  this.agenceser.findAgenceById(Facturation.agenceId).subscribe(data=>{
    Swal.fire({
      icon: 'info',
      title: data.name,
      html:
        '<div class="swal-info">' +
        ' <p><b>Matricule:</b> <span>' + data.matricule + '</span></p>' +
        ' <p><b>Email:</b> <span>' + data.email + '</span></p>' +
        ' <p><b>Adresse:</b> <span>' + data.address + '</span></p>' +
        ' <p><b>Raison Sociale:</b> <span>' + data.raisonSocial + '</span></p>' +
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
this.facturation.agenceId=event.target.value;
 }
  createFacturation(){
    //console.log(this.facturation.agenceId)
  this.Facturationsrvice.createFacturation(this.facturation).subscribe(data=>{
      console.log(data)
      this.toastr.success("Facturation ajouter avec succès!")
      this.getFacturations()
      this.hideAddForm()
    }, error=>{
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.facturation=new Facturation();
  

  }

  getFacturations(){
   
    this.Facturationsrvice.getFacturation().subscribe(data => {
      if(data != null){
        console.log(data.length)
        this.Facturations= data;
        this.totalFacturations = data.length;
        this.total=this.totalFacturations/10
      }else{
        this.totalFacturations = 0;
        this.Facturations = [];
      }
    }, error => {
      this.toastr.warning("Serveur ne répond pas!")
    });
  }

  
  deleteFacturation(Facturation: Facturation) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this Facturation!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
  
    this.Facturationsrvice.deleteFacturation(Facturation.id).subscribe(data => {
      this.toastr.warning("Facturation supprimée!")
    
      this.getFacturations()
      this.hideAddForm()
      
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    })
  }
});
  }

  editFacturation(Facturation: Facturation) {
    this.showEditForm()
    this.Facturationsrvice.findFacturationById(Facturation.id).subscribe(data=>{
   // console.log(data)
      this.facturation = data;
     
    
    });
  }
updateFacturation(Facturation: Facturation) {
   console.log(Facturation)
    this.Facturationsrvice.updtaeFacturation(Facturation,Facturation.id).subscribe(data=>{
      this.facturation = data;
      this.toastr.success("Facturation Modifier avec succès!")
      this.getFacturations()
     
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



