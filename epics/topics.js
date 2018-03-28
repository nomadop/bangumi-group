import { Observable } from 'rxjs/Observable';
import { createMatchSelector } from 'react-router-redux';
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

const matchPath = createMatchSelector('/group/topic/:id');
const fetchWhenFirstLoadEpic = (action$, store) => action$
  .ofType('@@router/LOCATION_CHANGE')
  .map(({ payload }) => matchPath({ router: { location: payload } }))
  .filter(match => match && _.isEmpty(getPost(store.getState(), { match })))
  .map(match => topicActions.fetch.start(match.params.id));

export default [fetchEpic, refreshEpic, fetchWhenFirstLoadEpic];
