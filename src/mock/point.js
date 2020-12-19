import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";
import {Types} from "../const.js";
import {Offers} from "../const.js";
import {OffersDetails} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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

const generateOffersList = () => {
  const offers = Object.values(Offers);
  const randomLength = getRandomInteger(0, 5);
  const pointOffers = {};

  for (let i = 0; i < randomLength; i++) {
    const randomOffer = offers[getRandomInteger(0, offers.length - 1)];

    pointOffers[randomOffer] = OffersDetails[randomOffer];
  }
  return pointOffers;
};

const genereateOffersForPointType = () => {
  const pointTypesOffers = {};

  pointTypes.forEach((type) => {
    pointTypesOffers[type] = generateOffersList();
  });

  return pointTypesOffers;
};

export const pointTypesOffers = genereateOffersForPointType();


const generateOffersForPoint = (type) => {

  const typeOffers = Object.keys(pointTypesOffers[type]);

  const randomLength = getRandomInteger(0, typeOffers.length - 1);

  let offers = new Set();

  for (let i = 0; i < randomLength; i++) {
    const randomIndex = getRandomInteger(0, typeOffers.length - 1);
    offers.add(typeOffers[randomIndex]);
  }

  offers = Array.from(offers);
  return offers;
};

const generateDescription = () => {
  let text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  text = text.slice(0, -1).split(`. `);
  const randomLength = getRandomInteger(0, 5);
  const description = [];
  for (let i = 0; i < randomLength; i++) {
    let sentence = text[getRandomInteger(0, text.length - 1)];
    description.push(sentence);
  }
  return description.join(`. `) + `.`;
};

const generatePhotosList = () => {
  const randomLength = getRandomInteger(0, 4);
  const photos = [];
  for (let i = 0; i < randomLength; i++) {
    let photo = `http://picsum.photos/id/${getRandomInteger(0, 100)}/248/152`;
    photos.push(photo);
  }
  return photos;
};

export const destinationDetails = {
  Rome: {
    description: generateDescription(),
    photos: generatePhotosList()
  },
  Paris: {
    description: generateDescription(),
    photos: generatePhotosList()
  },
  Berlin: {
    description: generateDescription(),
    photos: generatePhotosList()
  },
  Milan: {
    description: generateDescription(),
    photos: generatePhotosList()
  },
  Amsterdam: {
    description: generateDescription(),
    photos: generatePhotosList()
  },
  Brussels: {
    description: generateDescription(),
    photos: generatePhotosList()
  }
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
  const destination = generateDestination();
  const offers = generateOffersForPoint(type);
  const startDate = generateStartDate();
  const endDate = generateEndDate(startDate);
  return {
    id: generateId(),
    type,
    destination,
    offers,
    description: destinationDetails[destination].description,
    photos: destinationDetails[destination].photos,
    price: getRandomInteger(50, 500),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startDate,
    endDate
  };
};
