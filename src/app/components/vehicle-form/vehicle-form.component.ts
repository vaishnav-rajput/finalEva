import { Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit{
  vehicleForm : FormGroup;
  reportsArray: string[] = ["Fleet Wise Report", "Vehicle Wise Report", "Trip Wise", "Driving Scorecard Report"]
  // currentEmail: string = '';

  constructor(public dialogref: MatDialogRef<VehicleFormComponent>,private store:Store, private fb: FormBuilder ){}

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      reports: new FormArray([], [this.minSelectedCheckboxes]),
      emailList: new FormArray([]),
      currentEmail: new FormControl('', [Validators.email]) 
    })
  }

  get emailList(){
    return this.vehicleForm.get('emailList') as FormArray
  } 

  minSelectedCheckboxes(formArray: FormArray){
    const selectedCount = formArray.controls.filter((control) => control.value).length;
    return selectedCount >= 1 ? null : {minCheckboxes : true}
  }

  onCheckboxChange(event: any){
    const reportsArray = this.vehicleForm.get('reports') as FormArray;

    if(event.checked){
      reportsArray.push(new FormControl(event.source.value));
    } else {
      const index = reportsArray.controls.findIndex(control => control.value === event.source.value)
      reportsArray.removeAt(index)
    }
  }

  addEmail(event: Event){
    const emailArray = this.vehicleForm.get('emailList') as FormArray;
    const currentEmailControl = this.vehicleForm.get('currentEmail') as FormControl;
    const currentEmail = currentEmailControl.value

    if(currentEmail && emailArray.length < 5 && !emailArray.controls.some(control => control.value === currentEmail)){
      emailArray.push(new FormControl(currentEmail, Validators.email))
      console.log("email array after adding ", emailArray)
      currentEmailControl.reset()
    } else {
      console.log("email already in the list")
    }
  }

  removeEmail(index: number){
    const emailArray = this.vehicleForm.get('emailList') as FormArray;
    emailArray.removeAt(index)
  }

  onSubmit(){
    if(this.vehicleForm.valid){
      console.log("form is valid")
    }
  }

  // onEmailInputChange(event: Event){
  //     currentEmail = (event.target as HTMLInputElement).value
  // }

  isEmailInList(email: string): boolean {
    return (this.vehicleForm.get('emailList') as FormArray).controls.some(control => control.value === email);
  }
}
