import { groupActions } from '../actions';
import { Observable } from 'rxjs/Observable';
import { parse } from 'himalaya';

import { search, text, hasClass, withTag, getAttribute, hasAttribute } from '../utils/himalaya';

const parseData = (html) => {
  const json = parse(html);
  return search(json, [hasAttribute('id', 'memberGroupList'), hasClass('userContainer')])
    .map(group => ({
      name: text(search(group.children, [withTag('strong')])).trim(),
      link: getAttribute(search(group.children, [withTag('a')])[0], 'href'),
      image: getAttribute(search(group.children, [withTag('img')])[0], 'src'),
      feed: text(search(group.children, [withTag('small')])),
    }));
};

export default action$ => action$
  .ofType(groupActions.fetchGroups.start)
  .do(action => console.log('receive', action))
  .distinctUntilChanged()
  .switchMap(({ payload }) =>
    Observable.from(fetch(`http://bangumi.tv/group/category/all?page=${payload}`).then(response => response.text()))
      .map(html => {
        const groups = parseData(html);
        return groupActions.fetchGroups.done({
          groups,
          currentPage: payload,
          endReached: groups.length < 21,
        });
      })
      .catch(error => Observable.of(groupActions.fetchGroups.fail(error)))
  )
  .do(action => console.log('send', action))
  .catch(error => {
    console.log(error);
    return Observable.empty();
  })
