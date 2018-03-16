import { Observable } from 'rxjs/Observable';

import { groupActions } from '../actions';
import { parseGroups } from '../utils/parsers';

export const fetchGroups = action$ => action$
  .ofType(groupActions.fetch.start)
  .do(action => console.log('receive', action))
  .distinctUntilChanged()
  .switchMap(({ payload }) =>
    Observable.from(fetch(`http://bangumi.tv/group/category/all?page=${payload}`).then(response => response.text()))
      .map(html => {
        const groups = parseGroups(html);
        return groupActions.fetch.done({
          groups,
          currentPage: payload,
          endReached: groups.length < 21,
        });
      })
      .catch(error => Observable.of(groupActions.fetch.fail(error)))
  )
  .do(action => console.log('send', action))
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

export const refreshGroups = action$ => action$
  .ofType(groupActions.refresh.start)
  .switchMap(() =>
    Observable.from(fetch(`http://bangumi.tv/group/category/all?page=1`).then(response => response.text()))
      .map(html => {
        const groups = parseGroups(html);
        return groupActions.refresh.done({
          groups,
          currentPage: 1,
          endReached: groups.length < 21,
        });
      })
      .catch(error => Observable.of(groupActions.refresh.fail(error)))
  )
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });
