import AbstractView from "./abstract.js";

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

/* const renderMoneyChart = (moneyCtx, points) => {

};

const renderTypeChart = (typeCtx, points) => {

};

const renderTimeChart = (timeCtx, points) => {

}; */

export default class Statictics extends AbstractView {

  constructor() {
    super();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    this.getElement().classList.remove(`statistics--hidden`);
  }

  hide() {
    this.getElement().classList.add(`statistics--hidden`);
  }

  setCharts() {
    // отрисовать 3 графика
  }
}
