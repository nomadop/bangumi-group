import { Observable } from 'rxjs/Observable';

import { groupActions } from '../actions';
import { fetchGroups } from '../utils/api';

const fetchEpic = action$ => action$
  .ofType(groupActions.fetch.start)
  .distinctUntilChanged()
  .switchMap(({ payload }) =>
    Observable.from(fetchGroups(payload))
      .map(groups => groupActions.fetch.done({
        groups,
        currentPage: payload,
        endReached: groups.length < 21,
      }))
      .catch(error => Observable.of(groupActions.fetch.fail(error)))
  )
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

const refreshEpic = action$ => action$
  .ofType(groupActions.refresh.start)
  .switchMap(() =>
    Observable.from(fetchGroups(1))
      .map(groups => groupActions.refresh.done({
        groups,
        currentPage: 1,
        endReached: groups.length < 21,
      }))
      .catch(error => Observable.of(groupActions.refresh.fail(error)))
  )
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

export default [fetchEpic, refreshEpic];
