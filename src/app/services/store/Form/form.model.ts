export interface FormModel {
    reportsList: string[];
    emailList: string[];
    scheduleDate: string;
    scheduleTime: string;
    scheduleInterval: string;
    skipWeekend: boolean;
    currentStep: number;
    datasets: any[];
  }