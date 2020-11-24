import dayjs from "dayjs";
import {getRandomInteger} from "../util.js";

const generateType = () => {
  const types = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

const generateDestination = () => {
  const destinations = [`Rome`, `Paris`, `Berlin`, `Milan`, `Amsterdam`, `Brussels`];
  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const generateOffer = () => {

  const offers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`, `Travel by train`];

  const offersDetails = {
    'Add luggage': {
      price: 30,
      inputName: `event-offer-luggage`
    },
    'Switch to comfort class': {
      price: 100,
      inputName: `event-offer-comfort`
    },
    'Add meal': {
      price: 15,
      inputName: `event-offer-meal`
    },
    'Choose seats': {
      price: 5,
      inputName: `event-offer-seats`
    },
    'Travel by train': {
      price: 40,
      inputName: `event-offer-train`
    }
  };

  const randomIndex = getRandomInteger(0, offers.length - 1);
  const randomOffer = offers[randomIndex];

  return {
    title: randomOffer,
    price: offersDetails[randomOffer].price,
    inputName: offersDetails[randomOffer].inputName,
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


const pointTypeOffers = {
  'Bus': generateOffersList(),
  'Taxi': generateOffersList(),
  'Flight': generateOffersList(),
  'Ship': generateOffersList(),
  'Check-in': generateOffersList(),
  'Transport': generateOffersList(),
  'Drive': generateOffersList(),
  'Sightseeng': generateOffersList(),
  'Restaurant': generateOffersList(),
  'Train': generateOffersList()
};

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

const DAYS_GAP = 90;
const HOURS_GAP = 24;
const MINUTES_GAP = 60;
const MAX_POINT_DURATION = 30;

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
