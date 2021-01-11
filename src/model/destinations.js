export default class Destination {
  constructor() {
    this._destinationDetails = {};
  }

  setDestinationDetails(destinationDetails) {
    this._destinationDetails = destinationDetails;
  }

  getDestinationDetails(destination) {
    return this._destinationDetails[destination];
  }
}
