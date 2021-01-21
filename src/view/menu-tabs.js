import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTabsTemplate = (currentTab) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn ${MenuItem.TABLE === currentTab ? `trip-tabs__btn--active` : ``}" href="#">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn ${MenuItem.STATS === currentTab ? `trip-tabs__btn--active` : ``}" href="#">${MenuItem.STATS}</a>
</nav>`;
};

export default class MenuTabs extends AbstractView {
  constructor(currentMenuTab) {
    super();

    this._menuTabChangeHandler = this._menuTabChangeHandler.bind(this);

    this._currentMenuTab = currentMenuTab;
  }

  getTemplate() {
    return createMenuTabsTemplate(this._currentMenuTab);
  }

  _menuTabChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A` || this._currentMenuTab === evt.target.textContent) {
      return;
    }

    this._currentMenuTab = evt.target.textContent;
    this._callback.menuTabChange(evt.target.textContent);
  }

  _restoreHandler() {
    this.setMenuTabChangeHandler(this._callback.menuTabChange);
  }

  updateElement(newTab) {
    this._currentMenuTab = newTab;
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this._restoreHandler();
  }

  setMenuTabChangeHandler(callback) {
    this._callback.menuTabChange = callback;
    this.getElement().addEventListener(`click`, this._menuTabChangeHandler);
  }
}
