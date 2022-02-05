import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export class Salary {
  constructor(
    public id: number,
    public qualification: string,
    public salaryAmount: DoubleRange
  ) {
  }
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {

  salaries: Salary[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getSalaries();

    this.editForm = this.fb.group({
      id: [''],
      qualification: [''],
      salaryAmount: ['']
    });
  }

  getSalaries() {
    this.httpClient.get<any>('http://localhost:4040/api/employee_biodata/salary/allSalaries').subscribe(
      response => {
        console.log(response);
        this.salaries = response;
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
    const url = 'http://localhost:4040/api/employee_biodata/salary/addSalary';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openEdit(targetModal, salary: Salary) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'md'
    });
    this.editForm.patchValue({
      id: salary.id,
      qualification: salary.qualification,
      salaryAmount: salary.salaryAmount
    });
  }

  onSave() {
    const editURL = 'http://localhost:4040/api/employee_biodata/salary/editSalary/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results: Object) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, salary: Salary) {
    this.deleteId = salary.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'md'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:4040/api/employee_biodata/salary/deleteSalary/' + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}