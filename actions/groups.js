import * as _ from 'lodash';

import { fetchActionMap } from './common';

export default {
  FETCH: fetchActionMap,
  REFRESH: fetchActionMap,
  SWITCH_TAG: _.identity,
};
