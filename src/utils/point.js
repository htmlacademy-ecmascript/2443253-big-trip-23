
import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';

//Вернуть строку с первым символом в верхнем регистре
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);


function humanizeDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}
function humanizeTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}


function isPointToday(dateFrom, dateTo) {
  const now = new Date();
  return (dateFrom.isBefore(now) || dateFrom.isSame(now)) && (dateTo.isAfter(now) || dateTo.isSame(now));
}
function isPointWillBe(dateFrom) {
  const now = new Date();
  return dateFrom.isAfter(now);
}

function isPointExpired(dateTo) {
  const now = new Date();
  return dateTo.isBefore(now);
}

function comparePrice(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}
function compareTime(a,b){
  return parseFloat(b.basePrice) - parseFloat(a.basePrice);
}


export{humanizeDate,humanizeTime,capitalize,isPointToday, isPointWillBe, isPointExpired,comparePrice,compareTime};
