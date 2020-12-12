import SortingView from "../view/sorting.js";
import PointListView from "../view/point-list.js";
import NoPointView from "../view/no-point.js";
import PointPresenter from "../presenter/point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";


export default class Trip {
  constructor(tripPointsContainer) {
    this._tripContainer = tripPointsContainer;

    this._sortingComponent = new SortingView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._pointPresenter = {};
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderPointListContainer() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoint() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    for (let i = 0; i < this._tripPoints.length; i++) {
      this._renderPoint(this._tripPoints[i]);
    }
  }

  _clearPointList() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderTrip() {
    if (this._tripPoints.length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderSorting();
    this._renderPointListContainer();
    this._renderPointList();
  }
}
