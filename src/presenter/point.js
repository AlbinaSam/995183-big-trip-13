import PointView from "../view/point.js";
import EditPointView from "../view/edit-point.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual, isOnline} from "../utils/common.js";
import {isPriceEqual} from "../utils/trip-info.js";
import {toast} from "../utils/toast/toast.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {
  constructor(pointListComponent, changeData, changeMode) {
    this._pointListContainer = pointListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePointClick = this._handlePointClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEditPointClick = this._handleEditPointClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._getPointOffers = this._getPointOffers.bind(this);
    this._getTypes = this._getTypes.bind(this);
    this._getDestinationDetails = this._getDestinationDetails.bind(this);
    this._getDestinationsList = this._getDestinationsList.bind(this);
    this._getOffersDictionary = this._getOffersDictionary.bind(this);
  }

  init(point, typeOffersModel, destinationDetailsModel) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._typeOffersModel = typeOffersModel;
    this._destinationDetailsModel = destinationDetailsModel;

    this._pointComponent = new PointView(this._point);
    this._editPointComponent = new EditPointView(this._point, this._getPointOffers, this._getDestinationDetails, this._getDestinationsList, this._getTypes, this._getOffersDictionary);
    this._pointComponent.setPointClickHandler(this._handlePointClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setEditPointClickHandler(this._handleEditPointClick);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditPointComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  _getTypes() {
    return this._typeOffersModel.getTypes();
  }

  _getPointOffers(point) {
    return this._typeOffersModel.getOffers(point.type);
  }

  _getOffersDictionary() {
    return this._typeOffersModel.getOffersDictionary();
  }

  _getDestinationsList() {
    return this._destinationDetailsModel.getDestinationsList();
  }

  _getDestinationDetails(destination) {
    return this._destinationDetailsModel.getDestinationDetails(destination);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editPointComponent.reset();
      this._replaceFormToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handlePointClick() {
    if (!isOnline()) {
      toast(`You can't edit event offline`);
      return;
    }

    this._replacePointToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast(`You can't save event offline`);
      this.setViewState(State.ABORTING);
      return;
    }

    const isMinorUpdate = !isDatesEqual(this._point.startDate, update.startDate) || !isPriceEqual(this._point.price, update.price);

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update);
  }

  _handleEditPointClick() {
    this._editPointComponent.reset();
    this._replaceFormToPoint();
  }

  _handleDeleteClick(point) {

    if (!isOnline()) {
      toast(`You can't delete event offline`);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point);
  }

  setViewState(state) {

    const resetFormState = () => {
      this._editPointComponent.updatePoint({
        isSaving: false,
        isDeleting: false,
        isDisabled: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._editPointComponent.updatePoint({
          isSaving: true,
          isDisabled: true
        });
        break;

      case State.DELETING:
        this._editPointComponent.updatePoint({
          isDeleting: true,
          isDisabled: true
        });
        break;

      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._editPointComponent.shake(resetFormState);
    }
  }
}
