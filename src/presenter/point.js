import PointView from "../view/point.js";
import EditPointView from "../view/edit-point.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/common.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
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
  }

  init(point, typeOffersModel, destinationDetailsModel) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(this._point);
    this._editPointComponent = new EditPointView(this._point, typeOffersModel, destinationDetailsModel);
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
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
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
    this._replacePointToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handleFormSubmit(update) {

    const isMinorUpdate = !isDatesEqual(this._point.startDate, update.startDate) ||
    !isDatesEqual(this._point.endDate, update.endDate);

    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update);

    this._replaceFormToPoint();
  }

  _handleEditPointClick() {
    this._editPointComponent.reset();
    this._replaceFormToPoint();
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point);
  }
}
