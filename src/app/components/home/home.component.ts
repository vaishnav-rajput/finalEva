import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
constructor(private dialog:MatDialog){}

ngOnInit(): void {
  
}

onOpenModal(id: any, title: any, isEdit = false){
    this.dialog.open(VehicleFormComponent, {
      width: '50%',
      panelClass: 'custom-modal',
      data: {
        id: id,
        title: title,
        isEdit: isEdit
      }
    })
}


}
