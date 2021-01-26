import TripInfoView from "../view/trip-info.js";
import TripInfoMainView from "../view/trip-info-main.js";
import TripInfoCostView from "../view/trip-info-cost.js";
import SortingView from "../view/sorting.js";
import PointListView from "../view/point-list.js";
import NoPointView from "../view/no-point.js";
import LoadingView from "../view/loading.js";

import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import NewPointPresenter from "./new-point.js";

import {remove, render, RenderPosition} from "../utils/render.js";
import {SortingTypes, UserAction, UpdateType, FilterType} from "../const.js";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/sorting.js";
import {filter} from "../utils/filter.js";
import {generateTripInfoMain} from "../utils/trip-info.js";
import {countTripCost} from "../utils/trip-info.js";

export default class Trip {
  constructor(tripPointsContainer, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer, api) {
    this._api = api;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;

    this._tripContainer = tripPointsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._pointPresenter = {};
    this._currentSortingType = SortingTypes.DEFAULT;

    this._sortingComponent = null;
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._loadingComponent = new LoadingView();

    this._tripInfoComponent = null;
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;

    this._isLoading = true;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newPointPresenter = new NewPointPresenter(this._pointListComponent, this._handleViewAction);

  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortingType) {
      case SortingTypes.BY_TIME:
        return filteredPoints.sort(sortByDuration);

      case SortingTypes.BY_PRICE:
        return filteredPoints.sort(sortByPrice);

      default:
        return filteredPoints.sort(sortByDate);
    }
  }

  _getUnfilteredPoints() {
    return this._pointsModel.getPoints();
  }

  _handleViewAction(actionType, updateType, update) {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;

      case UserAction.ADD_POINT:
        this._newPointPresenter.setSavingState();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._newPointPresenter.setAbortingState();
        });
        break;

      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, update) {

    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[update.id].init(update, this._offersModel, this._destinationsModel);
        break;

      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;

      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderTripInfo() {

    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView();

    if (this._tripInfoMainComponent !== null) {
      this._tripInfoMainComponent = null;
    }

    this._tripInfoMainComponent = new TripInfoMainView(generateTripInfoMain(this._getUnfilteredPoints()));

    if (this._tripInfoCostComponent !== null) {
      this._tripInfoCostComponent = null;
    }

    this._tripInfoCostComponent = new TripInfoCostView(countTripCost(this._getUnfilteredPoints()));

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.ARTERBEGIN);
    render(this._tripInfoComponent, this._tripInfoMainComponent, RenderPosition.ARTERBEGIN);
    render(this._tripInfoComponent, this._tripInfoCostComponent, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }
    this._sortingComponent = new SortingView(this._currentSortingType);
    render(this._tripContainer, this._sortingComponent, RenderPosition.ARTERBEGIN);

    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
  }

  _renderPointListContainer() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoint() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offersModel, this._destinationsModel);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    this._getPoints().forEach((tripPoint) => this._renderPoint(tripPoint));
  }

  _clearTrip({resetSortType = false} = {}) {
    this._newPointPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortingComponent);
    remove(this._pointListComponent);
    remove(this._noPointComponent);
    remove(this._loadingComponent);

    remove(this._tripInfoComponent);
    remove(this._tripInfoMainComponent);
    remove(this._tripInfoCostComponent);

    if (resetSortType) {
      this._currentSortingType = SortingTypes.DEFAULT;
    }
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderPointListContainer();
    if (this._getPoints().length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderTripInfo();
    this._renderSorting();
    this._renderPointList();
  }

  _handleSortingTypeChange(sortingType) {
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._currentSortingType = sortingType;

    this._clearTrip();
    this._renderTrip();
  }

  createNewPoint(createPointButton) {
    this._currentSortingType = SortingTypes.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init(this._offersModel, this._destinationsModel, createPointButton);
  }

  showTrip() {
    this._tripContainer.show();
    this._handleSortingTypeChange(SortingTypes.DEFAULT);
  }

  hideTrip() {
    this._tripContainer.hide();
    this._newPointPresenter.destroy();
  }
}
