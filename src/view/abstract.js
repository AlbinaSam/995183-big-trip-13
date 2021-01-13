import {createElement} from "../utils/render.js";

export default class Abstarct {
  constructor() {
    if (new.target === Abstarct) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: ${this.getTemplate.name}`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this.getElement().classList.remove(`block--hidden`);
  }

  hide() {
    this.getElement().classList.add(`block--hidden`);
  }
}
