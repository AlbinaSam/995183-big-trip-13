export const createTripInfoMainTemplate = ({route, dates}) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${route}</h1>

  <p class="trip-info__dates">${dates}</p>
</div>`;
};

