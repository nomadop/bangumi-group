import * as _ from 'lodash';

import { fetchActionMap } from './common';

export default {
  FETCH: fetchActionMap,
  SWITCH_TAG: _.identity,
};
