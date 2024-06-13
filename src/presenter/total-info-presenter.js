import {render,replace,remove,RenderPosition} from '../framework/render.js';
import TotalInfoView from '../view/total-info-view.js';
import {sortDay} from '../utils/point.js';
import dayjs from 'dayjs';


export default class totalInfoPresenter {

  #pointsModel = null;
  #totalInfoView = null;
  #totalInfoContainer = null;


  constructor({totalInfoContainer,pointsModel}){
    this.#pointsModel = pointsModel;
    this.#totalInfoContainer = totalInfoContainer;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init(){
    let totalTripPoints = [],
      totalTripPrice = 0;
    const totalTripDates = [];

    const prevTotalInfoView = this.#totalInfoView;
    let abbreviated = false;
    //Сортировка по дате
    const points = [...this.#pointsModel.points.sort(sortDay)];
    //Точек нет убираем блок с информацией
    if (points.length === 0) {
      remove(this.#totalInfoView);
      this.#totalInfoView = null;
      return;
    }

    //Одинаковые ли все направления
    const isAllSame = points.every((elem,index,array) => elem.destination.town === array[0].destination.town);

    //Посчитаем путь, дaты и общую стоимость
    points.forEach((point,index,array) => {
      const indexOfDubl = totalTripPoints.indexOf(point.destination.town);
      if (indexOfDubl === -1 || (indexOfDubl === 0 && index === array.length - 1 && !isAllSame)){
        totalTripPoints.push(point.destination.town);
      }
      totalTripPrice += +point.basePrice;
      const priceOffers = point.offers.reduce((accu,current) =>
        current || current === 0 ? accu + current.price : 0,
      0);
      totalTripPrice += priceOffers;

    });
    //Если больше двух городов тогда берем первый и последний по дате посещения
    if (totalTripPoints.length > 2){
      totalTripPoints = [...totalTripPoints.filter((town,index,array) =>(index === 0) || (index === array.length - 1))];
      abbreviated = true;
    }
    //Даты
    if (points.length > 0){
      totalTripDates.push(dayjs(points[0].dateFrom).format('DD MMM'));
      if (points.length === 1){
        const hours = dayjs(points[0].dateTo).diff(dayjs(points[0].dateFrom), 'hours');
        if(hours > 23){
          totalTripDates.push(dayjs(points[0].dateTo).format('DD MMM'));
        }
      }
    }
    if (points.length > 1){
      totalTripDates.push(dayjs(points[points.length - 1].dateTo).format('DD MMM'));
    }

    this.#totalInfoView = new TotalInfoView({
      totalTripPoints :totalTripPoints,
      totalPrice: totalTripPrice,
      totalDates :totalTripDates,
      abbreviatedPath: abbreviated
    });

    if (prevTotalInfoView === null){
      render(this.#totalInfoView,this.#totalInfoContainer,RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#totalInfoView, prevTotalInfoView);

    remove(prevTotalInfoView);
  }

  //Обработчик события подписки на изменение модели
  #handleModelEvent = () => {
    this.init();
  };
}
