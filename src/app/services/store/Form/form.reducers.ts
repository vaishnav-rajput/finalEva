import { createReducer, on } from "@ngrx/store";
import { initialState } from "./form.state";
import { addFormDataset, resetForm, setCurrentStep, updateScheduleForm, updateVehicleForm } from "./form.actions";

const _formReducer = createReducer(initialState,
    on(updateVehicleForm, (state, {reportsList, emailList, vehicleList}) => (
        {
            ...state,
            reportsList,
            emailList,
            vehicleList,
            currentStep: 1,
        }
    )),
    on(updateScheduleForm, (state, {scheduleDate, scheduleTime, scheduleInterval, skipWeekend, amPm}) => (
        {
            ...state,
            scheduleDate,
            scheduleTime,
            scheduleInterval,
            skipWeekend,
            currentStep: 2,
            amPm
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
            datasets: [...state.datasets, {...state, datasets: []}]
        }
    )),
    on(resetForm, (state) => ({
        ...initialState,
        datasets: state.datasets

    })
)
)

export function formReducer (state: any, action: any){
    return _formReducer(state, action)
}