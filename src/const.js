export const DESTINATIONS_COUNT = 3;

export const Types = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECK_IN: `Check-in`,
  SIGHTSEENG: `Sightseeing`,
  RESTAURANT: `Restaurant`
};

export const Offers = {
  ADD_LUGGAGE: `luggage`,
  SWITCH_TO_COMFORT_CLASS: `comfort`,
  ADD_MEAL: `meal`,
  CHOOSE_SEATS: `seats`,
  TRAVEL_BY_TRAIN: `train`
};

export const SortingTypes = {
  DEFAULT: `default`,
  BY_TIME: `time`,
  BY_PRICE: `price`
};

export const OffersDetails = {
  'luggage': {
    price: 30,
    title: `Add luggage`
  },
  'comfort': {
    price: 100,
    title: `Switch to comfort class`
  },
  'meal': {
    price: 15,
    title: `Add meal`
  },
  'seats': {
    price: 5,
    title: `Choose seats`
  },
  'train': {
    price: 40,
    title: `Travel by train`
  }
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const BLANK_POINT = {
  type: Object.values(Types)[0],
  destination: ``,
  offers: [],
  price: ``,
  isFavorite: false,
  startDate: ``,
  endDate: ``
};

export const destinationList = {
  ROME: `Rome`,
  PARIS: `Paris`,
  BERLIN: `Berlin`,
  MILAN: `Milan`,
  AMSTERDAM: `Amsterdam`,
  BRUSSELS: `Brussels`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const BAR_HEIGHT = 55;
