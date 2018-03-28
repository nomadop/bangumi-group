import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { browser as browserActions } from '../actions';

const getLoadingTitle = dotCount => `Loading${_.chain('.').repeat(dotCount).padEnd(3, "\u00a0").value()}`;

const setLoadingTitleEpic = action$ => action$
  .ofType(browserActions.load.start)
  .switchMap(() =>
    Observable.interval(500)
      .takeUntil(action$.ofType(browserActions.load.done))
      .map(tick => browserActions.setTitle(getLoadingTitle(tick % 3 + 1)))
      .startWith(browserActions.setTitle(getLoadingTitle(3)))
  );

export default [setLoadingTitleEpic];
