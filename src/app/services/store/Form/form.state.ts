import { FormModel} from "./form.model";

export const initialState: FormModel = {
    reportsList: [],
    emailList: [],
    vehicleList: [],
    scheduleDate: '',
    scheduleTime: '',
    scheduleInterval: '',
    skipWeekend: false,
    currentStep: 0,
    amPm: '',
    datasets: []
}