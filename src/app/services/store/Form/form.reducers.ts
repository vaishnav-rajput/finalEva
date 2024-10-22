import { createReducer, on } from "@ngrx/store";
import { initialState } from "./form.state";
import { addFormDataset, resetForm, setCurrentStep, updateScheduleForm, updateVehicleForm } from "./form.actions";

const _formReducer = createReducer(initialState,
    on(updateVehicleForm, (state, {reportsList, emailList}) => (
        {
            ...state,
            reportsList,
            emailList,
            currentStep: 1,
        }
    )),
    on(updateScheduleForm, (state, {scheduleDate, scheduleTime, scheduleInterval, skipWeekend}) => (
        {
            ...state,
            scheduleDate,
            scheduleTime,
            scheduleInterval,
            skipWeekend,
            currentStep: 2
        }
    )),
    on(setCurrentStep, (state,{step}) => (
        {
            ...state,
            currentStep: step
        }
    )),
    on(addFormDataset, (state) => (
        {
            ...state,
            datasets: [...state.datasets, state]
        }
    )),
    on(resetForm, () => initialState)
)

export function formReducer (state: any, action: any){
    return _formReducer
}