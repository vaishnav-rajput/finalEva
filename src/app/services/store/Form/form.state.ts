import { FormModel} from "./form.model";

export const initialState: FormModel = {
    reportsList: [],
    emailList: [],
    scheduleDate: '',
    scheduleTime: '',
    scheduleInterval: '',
    skipWeekend: false,
    currentStep: 0,
    datasets: []
}