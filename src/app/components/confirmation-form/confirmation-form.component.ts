import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { addFormDataset, resetForm, updateDataset } from 'src/app/services/store/Form/form.actions';
import { FormModel } from 'src/app/services/store/Form/form.model';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.scss']
})
export class ConfirmationFormComponent implements OnInit{
  constructor(public dialogref: MatDialogRef<ConfirmationFormComponent>,
    private store: Store<{formState}>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  reports: string[]
  emails: string[]
  scheduleTime: string;
  scheduleDate: string;
  scheduleInterval: string;
  amPm: string;


  ngOnInit(): void {
    const dataIndex = this.data.index;
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

    if(this.data.isEdit){
      const formState = this.store.select('formState')

      formState.pipe(take(1)).subscribe(formState => {
        const updateInput: FormModel = formState;
        const index: number = this.data.index;
        this.store.dispatch(updateDataset({index, updateInput}))
      })
    this.store.dispatch(resetForm())

    this.dialogref.close()

    } else{

    this.store.dispatch(addFormDataset())

    this.store.dispatch(resetForm())

    this.dialogref.close()
    }
    
  }





}

