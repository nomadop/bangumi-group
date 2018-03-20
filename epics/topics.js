import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { topicActions } from '../actions';
import { fetchTopic } from '../utils/api';

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

export default [fetchEpic, refreshEpic];
