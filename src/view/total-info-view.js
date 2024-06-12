import AbstractView from '../framework/view/abstract-view.js';

export default class TotalInfoView extends AbstractView{
  #totalPrice = null;
  #totalTripPoints = null;
  #totalDates = null;
  #abbreviatedPath = null;

  constructor ({totalTripPoints = [],totalPrice = 0, totalDates = '',abbreviatedPath = false}){
    super();
    this.#totalTripPoints = totalTripPoints;
    this.#totalPrice = totalPrice;
    this.#totalDates = totalDates;
    this.#abbreviatedPath = abbreviatedPath;

  }

  get template() {
    return this.#createTotalInfoTemplate(this.#totalDates,this.#totalPrice);
  }

  #makeTotalPathTemplate(totalTripPoints = [], abbreviatedPath = false){
    if(abbreviatedPath){
      return `${totalTripPoints[0]} &mdash;&nbsp ... &mdash;&nbsp ${totalTripPoints[1]}`;
    }else{
      return `${totalTripPoints.map((town,index,array) =>index < array.length - 1 ? `${town} &mdash;&nbsp ` : town).join('')}`;
    }
  }

  #createTotalInfoTemplate(totalDates = '',totalPrice = 0){
    return (
      `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${this.#makeTotalPathTemplate(this.#totalTripPoints,this.#abbreviatedPath)}</h1>

              <p class="trip-info__dates">${totalDates.length > 1 ? `${totalDates[0] } &mdash;&nbsp; ${ totalDates[1]}` : totalDates[0]}
        </p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`
    );
  }

}
