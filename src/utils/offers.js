export const collectOffersTitles = (offers) => {
  return offers.map((offer) => {
    return offer.title;
  });
};

export const createTypeOffersDictionary = (typesOffers) => {
  return typesOffers.reduce((acc, typeOffer) => {
    acc[typeOffer.type] = typeOffer.offers.reduce((offersAcc, offer, index) => {
      offersAcc[`offer${index + 1}`] = {
        title: offer.title,
        price: offer.price
      };
      return offersAcc;
    }, {});
    return acc;
  }, {});
};
