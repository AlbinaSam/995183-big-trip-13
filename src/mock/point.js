import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";

const Types = {
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

const Offers = {
  ADD_LUGGAGE: `Add luggage`,
  SWITCH_TO_COMFORT_CLASS: `Switch to comfort class`,
  ADD_MEAL: `Add meal`,
  CHOOSE_SEATS: `Choose seats`,
  TRAVEL_BY_TRAIN: `Travel by train`
};

const DAYS_GAP = 90;
const HOURS_GAP = 24;
const MINUTES_GAP = 60;
const MAX_POINT_DURATION = 10;

const pointTypes = Object.values(Types);

const generateType = () => {
  const randomIndex = getRandomInteger(0, pointTypes.length - 1);
  return pointTypes[randomIndex];
};

const generateDestination = () => {
  const destinations = [`Rome`, `Paris`, `Berlin`, `Milan`, `Amsterdam`, `Brussels`];
  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const generateOffer = () => {

  const offers = Object.values(Offers);

  const offersDetails = {
    'Add luggage': {
      price: 30,
      name: `luggage`
    },
    'Switch to comfort class': {
      price: 100,
      name: `comfort`
    },
    'Add meal': {
      price: 15,
      name: `meal`
    },
    'Choose seats': {
      price: 5,
      name: `seats`
    },
    'Travel by train': {
      price: 40,
      name: `train`
    }
  };

  const randomIndex = getRandomInteger(0, offers.length - 1);
  const randomOffer = offers[randomIndex];

  return {
    title: randomOffer,
    price: offersDetails[randomOffer].price,
    name: offersDetails[randomOffer].name,
    isChecked: Boolean(getRandomInteger(0, 1))
  };
};

const generateOffersList = () => {
  const randomLength = getRandomInteger(1, 5);
  const offers = [];

  for (let i = 0; i < randomLength; i++) {
    const offer = generateOffer();
    offers.push(offer);
  }
  return offers;
};

const genereateOffersForPointType = () => {
  const pointTypeOffers = {};

  pointTypes.forEach((type) => {
    pointTypeOffers[type] = generateOffersList();
  });

  return pointTypeOffers;
};

const pointTypeOffers = genereateOffersForPointType();

const generateDescription = () => {
  let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  text = text.slice(0, -1).split(`. `);
  const randomLength = getRandomInteger(1, 5);
  const description = [];
  for (let i = 0; i < randomLength; i++) {
    let sentence = text[getRandomInteger(0, text.length - 1)];
    description.push(sentence);
  }
  return description.join(`. `) + `.`;
};

const geneatePhotosList = () => {
  const randomLength = getRandomInteger(1, 5);
  const photos = [];
  for (let i = 0; i < randomLength; i++) {
    let photo = `http://picsum.photos/248/152`;
    photos.push(photo);
  }
  return photos;
};

const generateStartDate = () => {
  const randomDaysCount = getRandomInteger(-DAYS_GAP, DAYS_GAP);
  const randomHoursCount = getRandomInteger(0, HOURS_GAP);
  const randomMinutesCount = getRandomInteger(0, MINUTES_GAP);
  const startDate = dayjs().add(randomDaysCount, `day`).add(randomHoursCount, `hours`).add(randomMinutesCount, `minutes`);
  return startDate;
};

const generateEndDate = (startDate) => {
  const randomDaysCount = getRandomInteger(1, MAX_POINT_DURATION);
  const randomHoursCount = getRandomInteger(0, HOURS_GAP);
  const randomMinutesCount = getRandomInteger(0, MINUTES_GAP);
  const endDate = dayjs(startDate).add(randomDaysCount, `day`).add(randomHoursCount, `hours`).add(randomMinutesCount, `minutes`);
  return endDate;
};

export const generatePoint = () => {
  const type = generateType();
  const offers = pointTypeOffers[type];
  const startDate = generateStartDate();
  const endDate = generateEndDate(startDate);
  return {
    type,
    destination: generateDestination(),
    offers,
    description: generateDescription(),
    photos: geneatePhotosList(),
    price: getRandomInteger(50, 500),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startDate,
    endDate
  };
};
