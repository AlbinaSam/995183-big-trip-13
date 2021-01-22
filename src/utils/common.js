import dayjs from "dayjs";

export const isDatesEqual = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB);
};
