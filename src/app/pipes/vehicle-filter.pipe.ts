import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleFilter'
})
export class VehicleFilterPipe implements PipeTransform {


  transform(vehicles: any[], searchInput: string): any[] {

    let filteredVehicles = vehicles;
    if(!searchInput) return vehicles;
    if(searchInput){
      filteredVehicles = vehicles.filter(vehicle => 
        vehicle.registration_number.toLowerCase().includes(searchInput.toLowerCase())
      )
    }

    return filteredVehicles;
  }

}
