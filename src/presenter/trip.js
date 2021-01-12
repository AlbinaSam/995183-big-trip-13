import TripInfoView from "../view/trip-info.js";
import TripInfoMainView from "../view/trip-info-main.js";
import TripInfoCostView from "../view/trip-info-cost.js";
import SortingView from "../view/sorting.js";
import PointListView from "../view/point-list.js";
import NoPointView from "../view/no-point.js";

import PointPresenter from "./point.js";
import NewPointPresenter from "./new-point.js";

import {remove, render, RenderPosition} from "../utils/render.js";
import {SortingTypes, UserAction, UpdateType, FilterType} from "../const.js";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/sorting.js";
import {filter} from "../utils/filter.js";
import {generateTripInfoMain} from "../utils/generate-trip-info.js";
import {destinationDetails, pointTypesOffers} from "../mock/point.js";


export default class Trip {
  constructor(tripPointsContainer, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._offersModel.setTypeOffers(pointTypesOffers);
    this._destinationsModel = destinationsModel;
    this._destinationsModel.setDestinationDetails(destinationDetails);
    this._filterModel = filterModel;

    this._tripContainer = tripPointsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._pointPresenter = {};
    this._currentSortingType = SortingTypes.DEFAULT;

    this._sortingComponent = null;
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._tripInfoComponent = null;
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;

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
        this._pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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

    this._tripInfoCostComponent = new TripInfoCostView();

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.ARTERBEGIN);
    render(this._tripInfoComponent, this._tripInfoMainComponent, RenderPosition.ARTERBEGIN);
    render(this._tripInfoComponent, this._tripInfoCostComponent, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }
    this._sortingComponent = new SortingView(this._currentSortingType);
    render(this._tripContainer, this._sortingComponent, RenderPosition.BEFOREEND);

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

    remove(this._tripInfoComponent);
    remove(this._tripInfoMainComponent);
    remove(this._tripInfoCostComponent);

    if (resetSortType) {
      this._currentSortingType = SortingTypes.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._getPoints().length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderTripInfo();
    this._renderSorting();
    this._renderPointListContainer();
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
    this._tripContainer.classList.remove(`trip-events--hidden`);
    this._handleSortingTypeChange(SortingTypes.DEFAULT);
  }

  hideTrip() {
    this._tripContainer.classList.add(`trip-events--hidden`);
  }
}
