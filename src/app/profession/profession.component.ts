import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export class Profession {
  constructor(
    public id: number,
    public professionType: string
  ) {
  }
}

@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.css']
})
export class ProfessionComponent implements OnInit {

  professions: Profession[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProfessions();

    this.editForm = this.fb.group({
      id: [''],
      professionType: ['']
    });
  }

  getProfessions() {
    this.httpClient.get<any>('http://localhost:4040/api/employee_biodata/profession/allProfessions').subscribe(
      response => {
        console.log(response);
        this.professions = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSubmit(f: NgForm) {
    const url = 'http://localhost:4040/api/employee_biodata/profession/addProfession';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openEdit(targetModal, profession: Profession) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });
    this.editForm.patchValue({
      id: profession.id,
      professionType: profession.professionType
    });
  }

  onSave() {
    const editURL = 'http://localhost:4040/api/employee_biodata/profession/editProfession/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results: Object) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, profession: Profession) {
    this.deleteId = profession.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'md'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:4040/api/employee_biodata/profession/deleteProfession/' + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}