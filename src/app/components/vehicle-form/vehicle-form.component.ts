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
  vehicleBranches : string[] = ["Thane", "Pune", "Mumbai"];
  selectedBranch!: string;
  vehiclesData = vehicleData;
  datasetData : any;
  showEmailInput: boolean = false;
  errEmailLength: boolean = false;
  
  

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

   

    if(this.data.isEdit){
      let dataset = this.getFormStateFromStore(this.data.index)
      this.datasetData = dataset;

      if(dataset){
        this.patchFormArray('emailList', dataset.emailList)
        this.patchFormArray('vehicleList', dataset.vehicleList)
        this.patchReportsArray(dataset.reportsList)
      }      

    } else {
      this.populateReportsArray()
    }
  }

  populateReportsArray() {
    const reportsArray = this.vehicleForm.get('reports') as FormArray;
    this.reportsArray.forEach(() => reportsArray.push(new FormControl(false)));
  }

  toggleAddEmail(){
    this.showEmailInput = !this.showEmailInput;
    console.log("show email", this.showEmailInput)
  }

  isReportSelected(report: string): boolean {
    return this.data.isEdit && this.datasetData?.reportsList?.includes(report);
  }

  patchReportsArray(reportsList: string[]) {
    const reportsArray = this.vehicleForm.get('reports') as FormArray;
  
    this.reportsArray.forEach((report, i) => {
      const isSelected = reportsList.includes(report);
      reportsArray.push(new FormControl(isSelected));
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

  onCheckboxChange(event: any, index){
    const reportsArray = this.vehicleForm.get('reports') as FormArray;
    if(event.checked){
      reportsArray.at(index).setValue(true)
    } else {
      reportsArray.at(index).setValue(false)
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
  }

  addEmail(event: Event){
    const emailArray = this.vehicleForm.get('emailList') as FormArray;
    const currentEmailControl = this.vehicleForm.get('currentEmail') as FormControl;
    const currentEmail = currentEmailControl.value

    if(emailArray.length === 5){
      this.errEmailLength = true
    } 

    if(currentEmail && emailArray.length < 5 && !emailArray.controls.some(control => control.value === currentEmail)){
      emailArray.push(new FormControl(currentEmail, Validators.email))
      console.log("email array after adding ", emailArray)
      currentEmailControl.reset()
      this.toggleAddEmail()
    } else {
      console.log("email already in the list")
    }
  }

  removeEmail(index: number){
    const emailArray = this.vehicleForm.get('emailList') as FormArray;
    emailArray.removeAt(index)
    this.errEmailLength = false
  }

  onSubmit(){
    if(this.vehicleForm.valid){
      const emailList = this.vehicleForm.get('emailList')?.value as string[];
      const vehicleList = this.vehicleForm.get('vehicleList')?.value as string[];
      const reportsList = this.vehicleForm.get('reports')?.value as string[]
      const selectedReports = this.vehicleForm.get('reports')?.value
        .map((checked, i ) => (checked? this.reportsArray[i] : null))
        .filter(v => v !==null)


      this.store.dispatch(updateVehicleForm({
        emailList,
        vehicleList,
        reportsList: selectedReports
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

  closeDialog(){
    this.dialogref.close()
  }

 
  isEmailInList(email: string): boolean {
    return (this.vehicleForm.get('emailList') as FormArray).controls.some(control => control.value === email);
  }

  hasVehicleWiseReport(): boolean{
    const selectedReports = this.vehicleForm.value.reports
    .map((checked, i ) => (checked? this.reportsArray[i] : null))
    .filter(v => v !==null)

    return selectedReports.some(control => control === 'Vehicle Wise Report')
  }

  branchChanged(){
    const searchControl = this.vehicleForm.get('searchText') as FormControl;
    const selectBranch = this.vehicleForm.get('branch') as FormControl;

    if(selectBranch.value == 'All') {
      this.vehiclesData = vehicleData;
    searchControl.reset()

      return;
    }
    this.vehiclesData = vehicleData.filter((vehicle) => vehicle.branch === selectBranch.value)
    searchControl.reset()
  }
}
