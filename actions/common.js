import * as _ from 'lodash';

export const fetchActionMap = {
  START: _.identity,
  DONE: _.identity,
  FAIL: _.identity,
};