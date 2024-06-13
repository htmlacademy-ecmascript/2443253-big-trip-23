//Услуга
const EVENT_TYPES = ['taxi','bus','train','ship','drive','flight','check-in','sightseeing','restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
const LOADING = 'init';
const FAIL_LOAD = 'failload';


const SortType = {
  DAY:'day',
  EVENT:'event',
  TIME:'time',
  PRICE:'price',
  OFFER:'offer'};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  CHANGE_FAVORITE: 'CHANGE_FAVORITE',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  SMALL: 'SMALL',
  MIDDLE: 'MIDDLE',
  BIG: 'BIG',
  INIT: 'INIT'

};

const DEFAULT_FILTER = 'everything';
const DEFAULT_SORT_TYPE = 'day';
const DEFAULT_TYPE_TRIP = 'flight';

const MAX_DAYS_TRIP_POINT = '365';
const CHECKED = 'checked';


export {EVENT_TYPES,MAX_DAYS_TRIP_POINT,DEFAULT_FILTER,DEFAULT_SORT_TYPE,UserAction,
  UpdateType,FilterType,SortType,LOADING,CHECKED,DEFAULT_TYPE_TRIP,FAIL_LOAD};
