import { Component } from '@angular/core';
import { Cotisation } from 'src/app/model/Cotisation';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CotisationsService } from 'src/app/services/Cotisations.service';
import Swal from 'sweetalert2';
import { usersService } from 'src/app/services/users.service';
import { User } from 'src/app/model/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { Permission } from 'src/app/model/Permission';
@Component({
  selector: 'app-cotisation',
  templateUrl: './cotisation.component.html',
  styleUrls: ['./cotisation.component.css']
})
export class CotisationComponent {
  total !: any
  currentPage: any = 1;
  itemsPerPage: any = 10;
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Cotisation!: Cotisation[];
  users!: User[];
  cotisation: Cotisation = new Cotisation();
  totalCotisations!: number;
  selectedSortOrderbystate !: string
  term: any = "all";

  cotisationForm!: FormGroup;
  permision!: Permission;

  constructor(
    private Cotisationsrvice: CotisationsService,
    private userser: usersService,
    private toastr: ToastrService,
    private perm: PermissionsService,
    private router: Router

  ) { }
  ngOnInit(): void {
    this.cotisationForm = new FormGroup({
      mois: new FormControl('', Validators.required),

      montant: new FormControl('', Validators.required),
      userId: new FormControl('', Validators.required),


    });
    this.getperm()
    this.getalluser()
  }
  getperm() {
    const id = sessionStorage.getItem("permissionId")
    this.perm.findpermissionById(id).subscribe(data => {
      this.permision = data;
      //console.log(this.permision)
      this.getCotisations()
    })

  }
  ChangeSortOrderbystate(event: any) {
    this.term = event.target.value

  }

  public filterCallback = (item: any) => {

    return this.Cotisation.filter(e => e.userId == this.term)
  };
  getalluser() {
    this.userser.getusers().subscribe(data => {
      this.users = data;
    })

  }

  getid(event: any) {
    this.cotisation.userId = event.target.value;
  }

  createCotisation() {
    this.cotisation = this.cotisationForm.value
    this.Cotisationsrvice.createcotisation(this.cotisation).subscribe(data => {
      console.log(data)
      this.toastr.success("Cotisation ajouter avec succès!")
      this.getCotisations()
      this.hideAddForm()
    }, error => {
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.cotisation = new Cotisation();


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
    } else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Update Permission  Error Contacté Administrateur !',

      })

    }


  }
  getCotisations() {

    if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
      this.Cotisationsrvice.getcotisations().subscribe(data => {
        if (data != null) {
          console.log(data.length)
          this.Cotisation = data;
          this.totalCotisations = data.length;
        } else {
          this.totalCotisations = 0;
          this.Cotisation = [];
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


  deleteCotisation(Cotisation: Cotisation) {
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
  
          this.Cotisationsrvice.deleteCotisation(Cotisation.id).subscribe(data => {
            this.toastr.warning("Cotisation supprimée!")
  
            this.getCotisations()
            this.hideAddForm()
  
          }, error => {
            this.toastr.error("Error, server not responding!")
            console.log(error)
          })
        }
      });
  }else{

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Delete Permission  Error Contacté Administrateur !',
     
    })
  }
    
  }

  editCotisation(Cotisation: Cotisation) {
    this.hideAddForm()
    this.Cotisationsrvice.findcotisationById(Cotisation.id).subscribe(data => {
      this.cotisation = data;
      this.cotisationForm.setValue({
        mois: this.cotisation.mois,
        montant: this.cotisation.montant,
        userId: this.cotisation.userId,

      });
      this.showEditForm()
      this.gotoTop()

    });
  }
  updateCotisation(Cotisation: Cotisation) {

    this.Cotisationsrvice.updtaecotisation(Cotisation, Cotisation.id).subscribe(data => {
      this.Cotisation = data;
      this.toastr.success("Cotisation Modifier avec succès!")
      this.getCotisations()

      this.hideEditForm()
    }, error => {
      this.toastr.error("Error, server not responding!")
      console.log(error)
    });
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

