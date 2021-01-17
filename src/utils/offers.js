export const createTypeOffersDictionary = (offers) => {
  return offers.reduce((acc, current, index) => {
    acc[`offer${index + 1}`] = {
      title: current.title,
      price: current.price
    };

    return acc;
  }, {});
};

export const collectOffersTitles = (offers) => {
  return offers.map((offer) => {
    return offer.title;
  });
};
