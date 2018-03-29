import { Observable } from 'rxjs/Observable';

import { groups as groupActions } from '../actions';
import { fetchGroups } from '../utils/api';
import { getCurrentPage } from '../selectors/groups';
import { ofLocationChange } from '../utils/observable';
import { HOME_PATH } from '../constants/router';

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

const fetchAfterSwitchEpic = (action$, store) => action$
  .ofType(groupActions.switchTag)
  .distinctUntilChanged()
  .filter(() => getCurrentPage(store.getState()) === 0)
  .map(({ payload }) => groupActions.fetch.start({ tag: payload, page: 1 }));

const fetchWhenFirstLoadEpic = action$ => action$
  .let(ofLocationChange(HOME_PATH))
  .take(1)
  .map(() => groupActions.fetch.start({ tag: 'all', page: 1 }));

export default [fetchEpic, fetchAfterSwitchEpic, fetchWhenFirstLoadEpic];
