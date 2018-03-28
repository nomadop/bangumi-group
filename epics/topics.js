import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { topics as topicActions } from '../actions';
import { fetchTopic } from '../utils/api';
import { getPost } from '../selectors/topics';

const fetchEpic = action$ => action$
  .ofType(topicActions.fetch.start)
  .distinctUntilChanged(_.isEqual)
  .switchMap(({ payload }) =>
    Observable.from(fetchTopic(payload))
      .map(topic => topicActions.fetch.done({
        ...topic,
        id: payload,
      }))
      .catch(error => Observable.of(topicActions.fetch.fail(error)))
  );

const refreshEpic = action$ => action$
  .ofType(topicActions.refresh.start)
  .switchMap(({ payload }) =>
    Observable.from(fetchTopic(payload))
      .map(topic => topicActions.refresh.done({
        ...topic,
        id: payload,
      }))
      .catch(error => Observable.of(topicActions.refresh.fail(error)))
  );

const routerPathRegex = /^\/group\/topic\/(\d+)$/;
const fetchWhenFirstLoadEpic = (action$, store) => action$
  .filter(({ type, payload }) => (type === '@@router/LOCATION_CHANGE' && routerPathRegex.test(payload.pathname)))
  .map(({ payload }) => payload.pathname.match(routerPathRegex)[1])
  .switchMap(id => (
    _.isEmpty(getPost(store.getState(), { match: { params: { id } } })) ?
      Observable.of(topicActions.fetch.start(id)) : Observable.empty()
  ));

export default [fetchEpic, refreshEpic, fetchWhenFirstLoadEpic];
