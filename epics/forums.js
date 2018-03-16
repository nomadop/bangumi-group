import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { forumActions } from '../actions';
import { fetchForum } from '../utils/api';

const fetchEpic = action$ => action$
  .ofType(forumActions.fetch.start)
  .distinctUntilChanged(_.isEqual)
  .do(action => console.log('receive', action))
  .switchMap(({ payload }) =>
    Observable.from(fetchForum(payload.group, payload.page))
      .map(forum => forumActions.fetch.done({
        ...forum,
        group: payload.group,
        currentPage: payload.page,
        endReached: forum.topics.length < 20,
      }))
      .catch(error => Observable.of(forumActions.fetch.fail(error)))
  )
  .do(action => console.log('send', action))
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

const refreshEpic = action$ => action$
  .ofType(forumActions.refresh.start)
  .switchMap(({ payload }) =>
    Observable.from(fetchForum(payload, 1))
      .map(forum => forumActions.refresh.done({
        ...forum,
        group: payload,
        currentPage: 1,
        endReached: forum.topics.length < 20,
      }))
      .catch(error => Observable.of(forumActions.refresh.fail(error)))
  )
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

export default [fetchEpic, refreshEpic];
