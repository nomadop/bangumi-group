import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { forums as forumActions } from '../actions';
import { fetchForum } from '../utils/api';
import { ofLocationChange } from '../utils/observable';
import { FORUM_PATH } from '../constants/router';
import { getTopics } from '../selectors/forums';

const fetchEpic = action$ => action$
  .ofType(forumActions.fetch.start)
  .distinctUntilChanged(_.isEqual)
  .switchMap(({ payload }) =>
    Observable.from(fetchForum(payload.group, payload.page))
      .map(forum => forumActions.fetch.done({
        ...forum,
        group: payload.group,
        currentPage: payload.page,
        endReached: forum.topics.length < 20,
      }))
      .catch(error => Observable.of(forumActions.fetch.fail(error)))
  );

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
  );

const fetchWhenFirstLoadEpic = (action$, store) => action$
  .let(ofLocationChange(FORUM_PATH))
  .filter(match => _.isEmpty(getTopics(store.getState(), { match })))
  .map(match => forumActions.fetch.start({ group: match.params.name, page: 1 }));

export default [fetchEpic, refreshEpic, fetchWhenFirstLoadEpic];
