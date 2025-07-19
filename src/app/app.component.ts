import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmployeeModel} from './model/Employee';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem('EmpData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      employeeId: new FormControl(this.employeeObj.employeeId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId),
      contactNo: new FormControl(this.employeeObj.contactNo),
      address: new FormControl(this.employeeObj.address),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)])
    })
  }

  onSave() {
    const oldData = localStorage.getItem('EmpData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['employeeId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeForm.controls['employeeId'].setValue(1);
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.onReset()
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.employeeList.find(m=>m.employeeId == this.employeeForm.controls['employeeId'].value);
    if(record != undefined) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.onReset();
  }

  onDelete(item: EmployeeModel) {
    const isDelete = confirm("Are you sure you want to delete?");
    if (isDelete) {
      this.employeeList = this.employeeList.filter(emp=> emp.employeeId != item.employeeId);
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    }
  }

  onReset() {
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }
}
