import {FilterType} from "../const.js";
import dayjs from "dayjs";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDate).isAfter(dayjs(), `day`) || dayjs(point.startDate).isSame(dayjs(), `day`)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.endDate).isBefore(dayjs(), `day`))
};
