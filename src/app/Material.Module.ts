import { NgModule } from "@angular/core";
import {MatButtonModule} from "@angular/material/button"
import {MatCardModule} from "@angular/material/card"
import {MatInputModule} from "@angular/material/input"
import {MatSelectModule} from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import {MatDialogModule} from "@angular/material/dialog"
import {MatCheckboxModule} from "@angular/material/checkbox"

@NgModule({
    exports: [
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCheckboxModule
    ]
})

export class MaterialModule{}