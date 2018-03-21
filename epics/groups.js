import { Observable } from 'rxjs/Observable';

import { groupActions } from '../actions';
import { fetchGroups } from '../utils/api';
import { getCurrentPage } from '../selectors/groups';

const fetchEpic = action$ => action$
  .ofType(groupActions.fetch.start)
  .distinctUntilChanged()
  .switchMap(({ payload }) =>
    Observable.from(fetchGroups(payload.tag, payload.page))
      .map(groups => groupActions.fetch.done({
        groups,
        tag: payload.tag,
        currentPage: payload.page,
        endReached: groups.length < 21,
      }))
      .catch(error => Observable.of(groupActions.fetch.fail(error)))
  );

const refreshEpic = action$ => action$
  .ofType(groupActions.refresh.start)
  .switchMap(({ payload }) =>
    Observable.from(fetchGroups(payload.tag, 1))
      .map(groups => groupActions.refresh.done({
        groups,
        tag: payload.tag,
        currentPage: 1,
        endReached: groups.length < 21,
      }))
      .catch(error => Observable.of(groupActions.refresh.fail(error)))
  );

const fetchAfterSwitchEpic = (action$, store) => action$
  .ofType(groupActions.switchTag)
  .distinctUntilChanged()
  .filter(() => getCurrentPage(store.getState()) === 0)
  .map(({ payload }) => groupActions.fetch.start({ tag: payload, page: 1 }));

export default [fetchEpic, refreshEpic, fetchAfterSwitchEpic];
