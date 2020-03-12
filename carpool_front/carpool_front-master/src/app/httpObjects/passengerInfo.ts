import { Passenger } from './passenger';
import { RequestedRide } from './requestedride';
import { AcceptedRide } from './acceptedride';

export interface PassengerInfo {
  'passenger'?: Passenger;
  'requested_ride'?: RequestedRide;
  'accepted_ride'?: AcceptedRide;
}
