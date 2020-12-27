import {destinationDetails} from "../mock/point.js";
import Observer from "../utils/observer.js";

export default class Destination extends Observer {
  constructor() {
    super();
  }

  getDestinationDetails(destination) {
    return destinationDetails[destination];
  }
}
