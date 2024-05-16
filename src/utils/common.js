

//Случайный элемент из массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

//Случайное число из диапазона

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const updateItem = (points,updatePoint) =>points.map((point) => point.id === updatePoint.id ? updatePoint : point);

export{getRandomArrayElement,getRandomInteger,updateItem};
