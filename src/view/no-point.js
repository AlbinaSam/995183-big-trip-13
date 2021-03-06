import AbstractView from "./abstract.js";

const createNoPointTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoPoints extends AbstractView {

  getTemplate() {
    return createNoPointTemplate();
  }
}
