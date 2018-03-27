import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { browser as browserActions } from '../actions';

const setLoadingTitleEpic = action$ => action$
  .ofType(browserActions.load.start)
  .switchMap(() =>
    Observable.interval(500)
      .takeUntil(action$.ofType(browserActions.load.done))
      .map(tick => browserActions.setTitle(`Loading${_.pad('', tick % 3 + 1, '.')}`))
      .startWith(browserActions.setTitle('Loading...'))
  );

export default [setLoadingTitleEpic];
