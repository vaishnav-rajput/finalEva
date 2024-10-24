import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { updateScheduleForm } from 'src/app/services/store/Form/form.actions';
import { FormModel } from 'src/app/services/store/Form/form.model';
import { ConfirmationFormComponent } from '../confirmation-form/confirmation-form.component';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ScheduleFormComponent>, private store: Store<{formState}>, @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder, public dialog: MatDialog
  ){}

  scheduleForm: FormGroup;

  time: number = 9;
  formattedTime: string = '09:00';
  selectedDay: string= '';
  allDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  filteredDays: string[] = [];
  days: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22, 23, 24, 25,26,27,28]
  today: number = new Date().getDate()

  reports: string[];
  vehicles: any[];
  mailedTo: string[];

  ngOnInit(): void {
    this.store.select('formState').subscribe((state) => {
      this.vehicles = state.vehicleList;
      this.mailedTo = state.emailList;
      this.reports = state.reportsList
      console.log("vehicles", this.vehicles)
      console.log("emails", this.mailedTo)
    })

    this.scheduleForm = this.fb.group({
      scheduleTime: new FormControl(null, Validators.required),
      scheduleDate: new FormControl(null , Validators.required),
      skipWeekend: new FormControl(false),
      scheduleInterval: new FormControl(null),
      amPm: new FormControl('am')
    })

    

    this.scheduleForm.get('skipWeekend')?.valueChanges.subscribe((skipWeekend) => {
      this.filterDays(skipWeekend)
    })

    this.filterDays(this.scheduleForm.get('skipWeekend')?.value)

    if(this.data.isEdit){

      const dataset = this.getFormStateFromStore(this.data.index)
      if(dataset){
      this.scheduleForm.patchValue({
        scheduleTime: dataset.scheduleTime,
        scheduleDate: dataset.scheduleDate,
        scheduleInterval: dataset.scheduleInterval,
        amPm: dataset.amPm,
        skipWeekend: dataset.skipWeekend,
      })
    }
  }
  }

  getFormStateFromStore(index: number) {
    let formState: FormModel;
    this.store.select('formState').subscribe((state) => {
      formState = state.datasets[index];  
    });
    return formState;
  }


  filterDays(skipWeekend: boolean){
    if(skipWeekend){
      this.filteredDays = this.allDays.filter((day) => day != 'Saturday' && day != 'Sunday')
    } else {
      this.filteredDays = [...this.allDays]
    }
  }

  parseVehicle(vehicleString: string): any {
      return JSON.parse(vehicleString);
    } 

  isPastDate(day: number){
    return day < this.today
  }

  selectDay(day: number){
    if(!this.isPastDate(day)){
      this.selectedDay = day.toString()
      this.scheduleForm.get('scheduleDate')?.setValue(day);
      console.log("selected day", this.selectedDay)
    }
  }

  incrementTime(){
    if(this.time < 17){
      this.time++;
      this.formatTime();

    }
  }

  decrementTime(){
    if(this.time > 9){
      this.time--;
      this.formatTime()
    }
  }
  

  formatTime(){
    this.formattedTime = `${this.time < 10 ? '0' + this.time : this.time}:00`;
    this.scheduleForm.get('scheduleTime')?.setValue(this.formattedTime)
  }

  setAmPm(value: string){
    this.scheduleForm.get('amPm')?.setValue(value)  
  }

  setQuarterly(value: string){
    this.scheduleForm.get('scheduleDate')?.setValue(value)
  }

  onDaySelect(event: any){
    const selectedDay = event.value;
    this.scheduleForm.get('scheduleDate')?.setValue(selectedDay)
    console.log("selected day ", selectedDay)
  }

  get intervalValue(){
    return this.scheduleForm.get('scheduleInterval')?.value
  }

  onSubmit(){
    if(this.scheduleForm.valid){
      const scheduleDate = this.scheduleForm.get('scheduleDate')?.value;
      const scheduleTime = this.scheduleForm.get('scheduleTime')?.value;
      const scheduleInterval = this.scheduleForm.get('scheduleInterval')?.value;
      const skipWeekend = this.scheduleForm.get('skipWeekend')?.value;
      const amPm = this.scheduleForm.get('amPm')?.value
   
      this.store.dispatch(updateScheduleForm({
        scheduleDate,
        scheduleTime,
        scheduleInterval,
        skipWeekend,
        amPm
      }))




      this.dialogRef.close()

      this.dialogRef.afterClosed().subscribe(() => {
        this.dialog.open(ConfirmationFormComponent, {
          width: '50%',
          maxHeight: '90vh',
          data: {
            index: this.data.index,
            title: 'schedule reports',
            isEdit: this.data.isEdit
          }
        })
      })
    }
  }
}
