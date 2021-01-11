export const sortByDate = (a, b) => a.startDate - b.startDate;

export const sortByDuration = (a, b) => b.endDate.diff(b.startDate) - a.endDate.diff(a.startDate);

export const sortByPrice = (a, b) => b.price - a.price;

