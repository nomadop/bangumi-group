import * as _ from 'lodash';

import { fetchAction } from './common';

export default {
  FETCH: fetchAction,
  SWITCH_TAG: _.identity,
};
