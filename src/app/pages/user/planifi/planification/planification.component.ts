import { Component, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Permission } from 'src/app/model/Permission';
import { Planification } from 'src/app/model/Planification';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { PlanificationsService } from 'src/app/services/Planification.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-planification',
  templateUrl: './planification.component.html',
  styleUrls: ['./planification.component.css']
})
export class PlanificationComponent {
  total !: any
  currentPage: any = 1;
  itemsPerPage: any = 10;
  permision!: Permission;
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Planifications!: Planification[];
  planification: Planification = new Planification();
  totalPlanifications!: number;

  constructor(
    private planificationsrvice: PlanificationsService,
    private perm: PermissionsService,
    private toastr: ToastrService,
    private router: Router

  ) { }
  getperm() {
    const id = sessionStorage.getItem("permissionId")
    this.perm.findpermissionById(id).subscribe(data => {
      this.permision = data;
      //console.log(this.permision)
      this.getPlanifications()
    })
  }
  ngOnInit(): void {

    this.getperm()
  }
  info(plani: Planification) {
     if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
    let htmlContent = '';
    if (plani.users.length > 0) {
      plani.users.forEach(element => {
        htmlContent += '<div class="swal-info">' +
          ' <p><b>Matricule:</b> <span>' + element.matricule + '</span> <b>nom:</b> <span>' + element.nom + '</span></p>' +

          '</div>';
      });
      Swal.fire({
        icon: 'info',
        title: plani.planificationName,
        html: htmlContent,
        customClass: {
          container: 'swal-container',
          title: 'swal-title',
          htmlContainer: 'swal-html-container',
        }
      });
    } else {
      this.toastr.warning("pas d'employé pour cette planification!")
    }
  }else{

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Consulte Permission  Error Contacté Administrateur !',
     
    })
  }
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
  createPlanification() {
    console.log(this.planification)
    this.planificationsrvice.createplanifications(this.planification).subscribe(data => {
      this.planification = new Planification();
      this.toastr.success("Planification ajouter avec succès!")
      this.getPlanifications()

      this.hideAddForm()
    }, error => {
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });


  }

  getPlanifications() {
    if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
      this.planificationsrvice.getplanifications().subscribe(data => {
        if (data != null) {
          console.log(data.length)
          this.Planifications = data;
          this.totalPlanifications = data.length;
        } else {
          this.totalPlanifications = 0;
          this.Planifications = [];
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


  deletePlanification(Planification: Planification) {
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
          this.planificationsrvice.deleteplanification(Planification.id).subscribe(data => {
            this.toastr.warning("Planification supprimée!")

            this.getPlanifications()
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
        text: 'Delete Permission  Error Contacté Administrateur !',

      })
    }
  }

  editPlanification(Planification: Planification) {
    this.hideAddForm()
    this.planificationsrvice.findplanificationById(Planification.id).subscribe(data => {
      this.planification = data;

      this.showEditForm()
      this.gotoTop()

    });
  }
  updatePlanification(Planification: Planification) {

    this.planificationsrvice.updtaeplanification(Planification, Planification.id).subscribe(data => {
      //this.planification = data;
      this.toastr.success("Planification Modifier avec succès!")
      this.getPlanifications()

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
