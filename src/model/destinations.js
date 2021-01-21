export default class Destination {
  constructor() {
    this._destinationDetails = {};
  }

  setDestinationDetails(destinationDetails) {
    this._destinationDetails = destinationDetails;
  }

  getDestinationsList() {
    return this._destinationDetails.map((destination) => {
      return destination.name;
    });
  }

  getDestinationDetails(destination) {
    return this._destinationDetails.find((item) => item.name === destination);
  }
}
