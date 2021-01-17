import dayjs from "dayjs";

export const isDatesEqual = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB);
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
