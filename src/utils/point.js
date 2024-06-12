
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const DATE_FORMAT_ONLY_TIME = 'HH:mm';
const DATE_FORMAT_WITHOUT_TIME = 'DD/MM/YY';


function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
//Вернуть строку с первым символом в верхнем регистре
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);


function humanizeDate(dueDate,dateFormat = DATE_FORMAT) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

//Перевод минутной разницы в разницу формата: дни, часы, минуты
function humanizeDiffDates (diffMinutes){
  const days = Math.trunc(diffMinutes / 60 / 24),
    hours = Math.trunc((diffMinutes - days * 24 * 60) / 60),
    minutes = (diffMinutes - days * 24 * 60 - hours * 60);


  if (diffMinutes < 60){
    return `${minutes}M`;
  } else if (diffMinutes > 60 && diffMinutes < 1440){
    return `${hours}H ${minutes}M`;
  } else if (diffMinutes > 1440){
    return `${days}D
            ${hours}H
            ${minutes}M`;
  }


}


function isPointToday(dateFrom, dateTo) {
  const now = new Date();
  return (dayjs(dateFrom).isBefore(now) || dayjs(dateFrom).isSame(now)) && (dayjs(dateTo).isAfter(now) || dayjs(dateTo).isSame(now));
}
function isPointWillBe(dateFrom) {
  const now = new Date();
  return dayjs(dateFrom).isAfter(now);
}

function isPointExpired(dateTo) {
  const now = new Date();
  return dayjs(dateTo).isBefore(now);
}

function comparePrice(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}
function compareTime(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}

//Функции сравнения при сортировке
function sortDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortTime(pointA, pointB) {
  return pointB.time - pointA.time;
}
function sortPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}


export{humanizeDate,capitalize,isPointToday, isPointWillBe, isPointExpired,comparePrice,compareTime,sortDay,sortTime,sortPrice,DATE_FORMAT_WITHOUT_TIME,
  humanizeDiffDates,addMinutes,DATE_FORMAT_ONLY_TIME
};
