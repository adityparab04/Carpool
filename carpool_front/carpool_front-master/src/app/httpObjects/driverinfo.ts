import { AcceptedRide } from './acceptedride';
import { Driver } from './driver';
import { CreatedRide } from './createdride';


export interface DriverInfo {
  'driver'?: Driver;
  'created_ride'?: CreatedRide;
  'accepted_ride'?: AcceptedRide;
}
