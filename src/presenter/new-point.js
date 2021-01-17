import NewPointView from "../view/new-point.js";
import {generateId} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";


export default class NewPointPresenter {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._newPointComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._getPointOffers = this._getPointOffers.bind(this);
    this._getTypes = this._getTypes.bind(this);
    this._getDestinationDetails = this._getDestinationDetails.bind(this);
    this._getDestinationsList = this._getDestinationsList.bind(this);
  }

  init(typeOffersModel, destinationDetailsModel, createPointButton) {

    this._typeOffersModel = typeOffersModel;
    this._destinationDetailsModel = destinationDetailsModel;

    if (this._newPointComponent !== null) {
      return;
    }

    this._createPointButton = createPointButton;
    this._newPointComponent = new NewPointView(this._getPointOffers, this._getDestinationDetails, this._getDestinationsList, this._getTypes);
    this._newPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._newPointComponent.setCancelClickHanler(this._handleCancelClick);

    render(this._pointListContainer, this._newPointComponent, RenderPosition.ARTERBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _getTypes() {
    return this._typeOffersModel.getTypes();
  }

  _getPointOffers(point) {
    return this._typeOffersModel.getOffers(point.type);
  }

  _getDestinationsList() {
    return this._destinationDetailsModel.getDestinationsList();
  }

  _getDestinationDetails(destination) {
    return this._destinationDetailsModel.getDestinationDetails(destination);
  }

  destroy() {
    if (this._newPointComponent === null) {
      return;
    }

    remove(this._newPointComponent);
    this._newPointComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._createPointButton.removeAttribute(`disabled`);
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, Object.assign({id: generateId()}, point));
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
