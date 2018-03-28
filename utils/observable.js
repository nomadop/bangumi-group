import { Observable } from 'rxjs/Observable';
import { createMatchSelector } from 'react-router-redux';
import * as _ from 'lodash';

import { LOCATION_CHANGE_ACTION } from '../constants/router';

export const ofLocationChange = path => source => Observable.create(
  subscriber => source
    .ofType(LOCATION_CHANGE_ACTION)
    .map(({ payload }) => createMatchSelector(path)({ router: { location: payload } }))
    .filter(_.identity)
    .subscribe(subscriber)
);
