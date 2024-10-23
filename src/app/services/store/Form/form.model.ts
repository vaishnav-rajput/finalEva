export interface FormModel {
    reportsList: string[];
    emailList: string[];
    vehicleList: string[];
    scheduleDate: string;
    scheduleTime: string;
    scheduleInterval: string;
    skipWeekend: boolean;
    currentStep: number;
    datasets: any[];
    amPm: string;
  }