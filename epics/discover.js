import { Observable } from 'rxjs/Observable';

import { discover as discoverActions } from '../actions';
import { fetchDiscover } from '../utils/api';

const fetchEpic = action$ => action$
  .ofType(discoverActions.fetch.start)
  .switchMap(({ payload }) =>
    Observable.from(fetchDiscover())
      .map(discover => discoverActions.fetch.done(discover))
      .catch(error => Observable.of(discoverActions.fetch.fail(error)))
  );

export default [fetchEpic];
