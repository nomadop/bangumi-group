import { Observable } from 'rxjs/Observable';

import { discover as discoverActions } from '../actions';
import { fetchDiscover } from '../utils/api';
import { DISCOVER_PATH } from '../constants/router';
import { ofLocationChange } from '../utils/observable';
import { getFetchStatus } from '../selectors/discover';

const fetchEpic = action$ => action$
  .ofType(discoverActions.fetch.start)
  .switchMap(() =>
    Observable.from(fetchDiscover())
      .map(discover => discoverActions.fetch.done(discover))
      .catch(error => Observable.of(discoverActions.fetch.fail(error)))
  );

const fetchWhenFirstLoadEpic = (action$, store) => action$
  .let(ofLocationChange(DISCOVER_PATH))
  .filter(() => getFetchStatus(store.getState()) !== 'COMPLETE')
  .map(() => discoverActions.fetch.start());


export default [fetchEpic, fetchWhenFirstLoadEpic];
