import dayjs from "dayjs";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isDatesEqual = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB);
};

export const isNumber = (num) => {
  return typeof num === `number` && !isNaN(num);
};
