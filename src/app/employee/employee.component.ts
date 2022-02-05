import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export class Employee {
  constructor(
    public id: number,
    public title: string,
    public firstName: string,
    public middleName: string,
    public lastName: string,
    public username: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public address: string,
    public height: number,
    public weight: number
  ) {
  }
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getEmployees();

    this.editForm = this.fb.group({
      id: [''],
      title: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      username: [''],
      email: [''],
      password: [''],
      phoneNumber: [''],
      address: [''],
      height: [''],
      weight: ['']
    });
  }

  getEmployees() {
    this.httpClient.get<any>('http://localhost:4040/api/employee_biodata/employee/allEmployees').subscribe(
      response => {
        this.employees = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'

    }).result.then((result) => {
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
    const url = 'http://localhost:4040/api/employee_biodata/employee/addEmployee';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openEdit(targetModal, employee: Employee) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      id: employee.id,
      title: employee.title,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      username: employee.username,
      email: employee.email,
      password: employee.password,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      height: employee.height,
      weight: employee.weight
    });
  }

  onSave() {
    const editURL = 'http://localhost:4040/api/employee_biodata/employee/editEmployee/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results: Object) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, employee: Employee) {
    this.deleteId = employee.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'md'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:4040/api/employee_biodata/employee/deleteEmployee/' + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}