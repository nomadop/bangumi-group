import * as _ from 'lodash';

export const fetchAction = {
  START: _.identity,
  DONE: _.identity,
  FAIL: _.identity,
};
