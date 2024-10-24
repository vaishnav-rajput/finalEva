import { Component, isDevMode, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { Store } from '@ngrx/store';
import { FormModel } from 'src/app/services/store/Form/form.model';
import { updateVehicleForm } from 'src/app/services/store/Form/form.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
constructor(private dialog:MatDialog, private store: Store<{formState: FormModel}>){}

datasets: FormModel[] = [];

ngOnInit(): void {
  this.store.select('formState').subscribe((state) => {
    this.datasets = state.datasets;
  })
}

onEditDataset(index: number){
  const dataset = this.datasets[index]

  this.dialog.open(VehicleFormComponent, {
    width: '50%',
    maxHeight: '90vh',
    data: {
        index: index,
        title: "Edit Scheduled report",
        isEdit: true
    }
  })
}

onOpenModal(id: any, title: any, isEdit = false){
    this.dialog.open(VehicleFormComponent, {
      width: '50%',
      maxHeight: '90vh',
      // panelClass: 'custom-modal',
      data: {
        
        title: title,
        isEdit: isEdit
      }
    })
}


}
