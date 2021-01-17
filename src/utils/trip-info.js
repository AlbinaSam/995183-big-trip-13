import dayjs from "dayjs";
import {sortByDate} from "./sorting.js";
import {DESTINATIONS_COUNT} from "../const.js";

const getRouteName = (sortedRoutePoints) => {
  let destinations = [];
  sortedRoutePoints.forEach((element) => {
    let destination = element.destination.name;
    destinations.push(destination);
  });

  if (destinations.length <= DESTINATIONS_COUNT) {
    for (let i = 0; i < destinations.length; i++) {
      return destinations.join(` &mdash; `);
    }
  }
  return `${destinations[0]} &mdash; &hellip; &mdash; ${destinations[destinations.length - 1]}`;
};

const getRouteDates = (sortedRoutePoints) => {
  const startDate = sortedRoutePoints[0].startDate;
  const endDate = sortedRoutePoints[sortedRoutePoints.length - 1].endDate;
  if (dayjs(startDate).isSame(endDate, `month`)) {
    return `${dayjs(startDate).format(`MMM D`)} &mdash; ${dayjs(endDate).format(`D`)}`;
  }
  return `${dayjs(startDate).format(`MMM D`)} &nbsp;&mdash;&nbsp; ${dayjs(endDate).format(`MMM D`)}`;
};

export const generateTripInfoMain = (points) => {
  const sortedRoutePoints = points.sort(sortByDate);
  return {
    route: getRouteName(sortedRoutePoints),
    dates: getRouteDates(sortedRoutePoints)
  };
};

export const countTripCost = (points) => {
  return points.reduce((sum, point) => {
    return sum + point.price;
  }, 0);
};
