import { NgModule } from "@angular/core";
import {MatButtonModule} from "@angular/material/button"
import {MatCardModule} from "@angular/material/card"
import {MatInputModule} from "@angular/material/input"
import {MatSelectModule} from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import {MatDialogModule} from "@angular/material/dialog"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
    exports: [
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatButtonToggleModule
    ]
})

export class MaterialModule{}