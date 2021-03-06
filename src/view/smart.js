import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: ${this.restoreHandlers.name}`);
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updatePoint(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._point = Object.assign({}, this._point, update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }
}
