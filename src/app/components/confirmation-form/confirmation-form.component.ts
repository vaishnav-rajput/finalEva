import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addFormDataset, resetForm } from 'src/app/services/store/Form/form.actions';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.scss']
})
export class ConfirmationFormComponent implements OnInit{
  constructor(public dialogref: MatDialogRef<ConfirmationFormComponent>,
    private store: Store<{formState}>, public dialog: MatDialog
  ){}

  reports: string[]
  emails: string[]
  scheduleTime: string;
  scheduleDate: string;
  scheduleInterval: string;
  amPm: string;

  ngOnInit(): void {
    this.store.select('formState').subscribe((state) => {
      this.emails = state.emailList;
      this.scheduleDate = state.scheduleDate;
      this.scheduleTime = state.scheduleTime;
      this.amPm = state.amPm;
      this.reports = state.reportsList;
      this.scheduleInterval = state.scheduleInterval
    })
  }

  onConfirm(){
    this.store.dispatch(addFormDataset())

    this.store.dispatch(resetForm())

    this.dialogref.close()
    
    
  }





}

