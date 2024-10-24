import { Component, DoCheck, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { vehicleData } from 'src/app/vehicleData';
import { VehicleFilterPipe } from 'src/app/pipes/vehicle-filter.pipe';
import { updateVehicleForm } from 'src/app/services/store/Form/form.actions';
import { FormModel } from 'src/app/services/store/Form/form.model';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VehicleFormComponent implements OnInit{
  vehicleForm : FormGroup;
  reportsArray: string[] = ["Fleet Wise Report", "Vehicle Wise Report", "Trip Wise", "Driving Scorecard Report"]
  // currentEmail: string = '';
  vehicleBranches : string[] = ["Thane", "Pune", "Mumbai"];
  selectedBranch!: string;
  vehiclesData = vehicleData
  

  constructor(public dialogref: MatDialogRef<VehicleFormComponent>,private store:Store<{formState: FormModel}>, 
    private fb: FormBuilder, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any ){}

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      reports: new FormArray([], [this.minSelectedCheckboxes]),
      emailList: new FormArray([]),
      currentEmail: new FormControl('', [Validators.email]) ,
      branch: new FormControl('All'),
      vehicleList: new FormArray([]),
      searchText: new FormControl(null )
    })
    console.log("isEdit",this.data.isEdit)
    if(this.data.isEdit){
      const dataset = this.getFormStateFromStore(this.data.index)
      console.log("dataset", dataset)

      if(dataset){
        // this.vehicleForm.patchValue({
        //   reports: dataset.reportsList,
        //   emailList: dataset.emailList,
        //   vehicleList: dataset.vehicleList,
        // })
        this.patchReportsArray(dataset.reportsList)
        this.patchFormArray('emailList', dataset.emailList)
        this.patchFormArray('vehicleList', dataset.vehicleList)
      }
    }
  }

  patchReportsArray(selectedReports: string[]){
    const reportsArray = this.vehicleForm.get('reports') as FormArray;
    reportsArray.clear();
  
    this.reportsArray.forEach(report => {
      reportsArray.push(new FormControl(selectedReports.includes(report)));
    });
  }

  patchFormArray(formArrayName: string, values: any[]): void {
    const formArray = this.vehicleForm.get(formArrayName) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(new FormControl(value)));
  }

  getFormStateFromStore(index: number){
    let formState: FormModel;
    this.store.select('formState').subscribe((state) => {
      formState = state.datasets[index]
    })
    return formState;
  }

  get emailList(){
    return this.vehicleForm.get('emailList') as FormArray
  } 

  get getReports(){
    return this.vehicleForm.get('reports') as FormArray;
  }

  get searchInput(){
    return this.vehicleForm.get('searchText')?.value;
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

  onVehicleCheckbox(vehicle: any,event : any){
    const vehiclesListArray = this.vehicleForm.get('vehicleList') as FormArray;
    if(event.target.checked){
      vehiclesListArray.push(new FormControl(vehicle))
    } else{
      const index = vehiclesListArray.controls.findIndex(control => control.value == vehicle)
      if(index !== -1){
        vehiclesListArray.removeAt(index)
      }
    }
    console.log("vehicles list array changed to ", this.vehicleForm.get('vehicleList') as FormArray)
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
      const emailList = this.vehicleForm.get('emailList')?.value as string[];
      const vehicleList = this.vehicleForm.get('vehicleList')?.value as string[];
      const reportsList = this.vehicleForm.get('reports')?.value as string[];

      this.store.dispatch(updateVehicleForm({
        emailList,
        vehicleList,
        reportsList
      }))

      this.store.select('formState').subscribe((state) => {
        console.log("updated state", state)
        console.log("updated vehicles", state.vehicleList)
      })

      this.dialogref.close()

      this.dialogref.afterClosed().subscribe(() => {
        this.dialog.open(ScheduleFormComponent, {
          width: '50%',
          maxHeight: '90vh',
          // panelClass: 'custom-modal',
          data: {
            index: this.data.index,
            title: 'schedule reports',
            isEdit: this.data?.isEdit,
          }
        })
      })
    }
  }

 
  isEmailInList(email: string): boolean {
    return (this.vehicleForm.get('emailList') as FormArray).controls.some(control => control.value === email);
  }

  hasVehicleWiseReport(): boolean{
    return this.getReports.controls.some(control => control.value === 'Vehicle Wise Report')
  }

  branchChanged(){
    if(this.selectedBranch == 'All') {
      this.vehiclesData = vehicleData;
      return;
    }
    this.vehiclesData = vehicleData.filter((vehicle) => vehicle.branch === this.selectedBranch)
    
  }
}
