

//Случайный элемент из массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

//Случайные элементы из массива (максимум 2)
const getRandomArray = (items) => {
  const randomArray = [];
  for(let i = 0; i < 2; i++){
    const newElement = getRandomArrayElement(items);
    if (!randomArray.includes(newElement)){
      randomArray.push(newElement);
    }
  }
  return randomArray;


};

//Случайное число из диапазона

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};


export{getRandomArrayElement,getRandomInteger,getRandomArray};
