export const sortByDate = (pointsArr) => pointsArr.sort((a, b) => a.startDate - b.startDate);

export const sortByDuration = (pointsArr) => pointsArr.sort((a, b) => b.endDate.diff(b.startDate) - a.endDate.diff(a.startDate));

export const sortByPrice = (pointsArr) => pointsArr.sort((a, b) => b.price - a.price);
