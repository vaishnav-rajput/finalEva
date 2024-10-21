import { createAction, props } from "@ngrx/store";
import { FormModel } from "./form.model";

export const updateVehicleForm = createAction(
    'updateVehicleForm',
    props<{reportsList: string[]; emailList: string[]}>()
)

export const updateScheduleForm = createAction(
    'updateScheduleForm',
    props<{scheduleDate: string; scheduleTime: string; 
        scheduleInterval: string;
        skipWeekend: boolean
    }>()
)

export const setCurrentStep = createAction(
    'setCurrentStep',
    props<{step: number}>()
)

export const addFormDataset = createAction(
    'addFormDataset',

)

export const resetForm = createAction(
    'resetForm'
)