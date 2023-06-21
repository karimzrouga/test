import { Facturation } from './../../../model/Facturation';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Agence } from 'src/app/model/Agence';

import { AgencesService } from 'src/app/services/Agences.service';
import { FacturationService } from 'src/app/services/Facturation.service';
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import { fromEvent } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from 'src/app/services/Permissions.service';
import { Permission } from 'src/app/model/Permission';
@Component({
  selector: 'app-list-facturation',
  templateUrl: './list-facturation.component.html',
  styleUrls: ['./list-facturation.component.css']
})
export class ListFacturationComponent {
  total !: any
  currentPage: any = 1;
  itemsPerPage: any = 10;
  addFormVisible: boolean = false;
  editFormVisible: boolean = false;
  Facturations!: Facturation[];
  agences!: Agence[];
  facturation: Facturation = new Facturation();
  totalFacturations!: number;
  selectedSortOrderbystate !: string
  term: any = "all";
  FacturationForm !: FormGroup;
  permision!: Permission;

  constructor(
    private perserv: PermissionsService,
    private Facturationsrvice: FacturationService,
    private perm: PermissionsService,
    private agenceser: AgencesService,
    private toastr: ToastrService,
    private router: Router

  ) { }

  public generatePDF(f: Facturation): void {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    const logo1 = new Image();
    const logo1Load$ = fromEvent(logo1, 'load');

    const logo2 = new Image();
    const logo2Load$ = fromEvent(logo2, 'load');

    const signature = new Image();
    const signatureLoad$ = fromEvent(signature, 'load');

    logo1Load$.subscribe(() => {
      doc.addImage(logo1, 'PNG', 5, 1, 50, 50);
      logo2Load$.subscribe(() => {
        doc.addImage(logo2, 'PNG', 140, 1, 50, 50);
        doc.setFontSize(18);
        doc.setFont("bold");
        doc.text('Facturation', 10, 60);

        doc.setFontSize(12);
        doc.setFont("normal");

        doc.text(` Date `, 20, 70);
        doc.setFont("helvetica", "normal");
        doc.text(` ${f.dateFacturation}`, 10, 80);

        doc.text(`Numéro de facture `, 80, 70);
        doc.setFont("helvetica", "normal");
        doc.text(` ${f.id}`, 90, 80);

        doc.text(`Paiement `, 140, 70);
        doc.setFont("helvetica", "normal");
        doc.text(` 30 jours`, 140, 80);

        doc.text(`Référence  `, 180, 70);
        const reference = Math.floor(Math.random() * 1000000);
        doc.setFont("helvetica", "normal");
        doc.text(` ${reference}`, 180, 80);

        this.agenceser.findAgenceById(f.agenceId).subscribe(d => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Matricule: ${d.matricule}`, 10, 100);
          doc.text(`Name: ${d.name}`, 10, 110);
          doc.text(`Email: ${d.email}`, 10, 120);
          doc.text(`Adresse: ${d.address}`, 10, 130);
          doc.text(`Raison Social: ${d.raisonSocial}`, 10, 140);
          // Footer
          doc.setFontSize(12);
          doc.setFont("bold");
          doc.text("LEONI TUNISIE \t\t\t\tCoordonnées\t\t\t    Détails bancaires", 10, 280);
          doc.setFont("normal");
          doc.text(`Messadine 4013 \t\t\t\t Fournisseur : ${d.name}  \t\t  Banque:\t\t\tNP Paribas`, 10, 287);
          doc.text("N° TVA intra. : FR 99999  \t\t E-mail : pierre@leoni.com\t IBAN:\t\t\tFRHHCXX1001", 10, 294);

          doc.text("N° TVA intra. : FRXX 999999999\t\t\t\twww. macompagnie.com", 10, 308);
          signatureLoad$.subscribe(() => {
            doc.addImage(signature, 'PNG', 130, 180, 80, 30);



            doc.save('facturation.pdf');
          });

          signature.src = 'assets/sin.png';
        });

        doc.setFont("helvetica", "normal");
        doc.text(`Total HT : ${f.montant} dinar`, 140, 150);
        doc.text(`Total TVA : ${f.montant + 30} dinar`, 140, 160);
        doc.text(`Total TTC : ${f.montant + 30} dinar`, 140, 170);
        doc.setFontSize(10);
        doc.text(`Description: ${f.description}`, 10, 150);
      });

      logo2.src = 'assets/logo.png';
    });

    logo1.src = 'assets/logo2.jpg';
  }

  ngOnInit(): void {

    this.FacturationForm = new FormGroup({
      DateFacturation: new FormControl('', Validators.required),
      montant: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      agenceId: new FormControl('', Validators.required),
    });

    this.getallagence()

    this.getperm()
  }

  getperm() {
    const id = sessionStorage.getItem("permissionId")
    this.perm.findpermissionById(id).subscribe(data => {
      this.permision = data;
      //console.log(this.permision)
      this.getFacturations()
    })

  }

  ChangeSortOrderbystate(event: any) {
    this.term = event.target.value

  }

  public filterCallback = (item: any) => {

    return this.Facturations.filter(e => e.agenceId == this.term)
  };
  getallagence() {
    this.agenceser.getAgences().subscribe(data => {
      this.agences = data;
    })

  }
  infoFacturation(Facturation: Facturation) {

    this.agenceser.findAgenceById(Facturation.agenceId).subscribe(data => {
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

  getid(event: any) {
    this.facturation.agenceId = event.target.value;
  }
  createFacturation() {
    //console.log(this.facturation.agenceId)
    this.facturation = this.FacturationForm.value
    this.Facturationsrvice.createFacturation(this.facturation).subscribe(data => {
      console.log(data)
      this.toastr.success("Facturation ajouter avec succès!")
      this.getFacturations()
      this.hideAddForm()
    }, error => {
      console.log(error);
      this.toastr.error("Erreur, Serveur ne répond pas!")
    });
    this.facturation = new Facturation();


  }

  getFacturations() {
    if (this.permision.title.toLocaleLowerCase().includes("consulte")) {
      this.Facturationsrvice.getFacturation().subscribe(data => {
        if (data != null) {
          console.log(data.length)
          this.Facturations = data;
          this.totalFacturations = data.length;
          this.total = this.totalFacturations / 10
        } else {
          this.totalFacturations = 0;
          this.Facturations = [];
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


  deleteFacturation(Facturation: Facturation) {
    if (this.permision.title.toLocaleLowerCase().includes("delete")) {
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
    } else {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'DELETE Permission  Error Contacté Administrateur !',

      })
    }

  }

  editFacturation(Facturation: Facturation) {

    this.hideAddForm()
    this.Facturationsrvice.findFacturationById(Facturation.id).subscribe(data => {

      this.facturation = data;

      this.showEditForm()
      this.gotoTop()
    });
  }
  updateFacturation(Facturation: Facturation) {

    this.Facturationsrvice.updtaeFacturation(Facturation, Facturation.id).subscribe(data => {
   
      this.toastr.success("Facturation Modifier avec succès!")
    
      this.getFacturations()

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
  hideAddForm() {
    this.addFormVisible = false;
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



