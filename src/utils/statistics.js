import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const makeTypesUniq = (items) => [...new Set(items)];

export const countTypeMoney = (type, points) => {
  return points.filter((point) => point.type === type)
  .reduce(function (sum, point) {
    return sum + point.price;
  }, 0);
};

export const countTypeQuantity = (type, points) => {
  return points.filter((point) => point.type === type).length;
};

const getDuration = (point) => {
  const startDate = point.startDate;
  const endDate = point.endDate;
  return endDate.diff(startDate);
};

export const countTypeDurations = (type, points) => {
  return dayjs.duration(
      points.filter((point) => point.type === type)
      .reduce(function (sum, point) {
        return sum + getDuration(point);
      }, 0)).days();
};
