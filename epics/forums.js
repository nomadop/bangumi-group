import { forumActions } from '../actions';
import { Observable } from 'rxjs/Observable';
import { parse } from 'himalaya';
import * as _ from 'lodash';

import { search, text, hasClass, withTag, getAttribute } from '../utils/himalaya';

const parseData = (html) => {
  const json = parse(html);
  const title = text(search(json, [hasClass('SecondaryNavTitle')]));
  const topics = search(json, [hasClass('topic_list'), hasClass('topic')]).map(ele => ({
    link: getAttribute(search(ele.children, [hasClass('subject'), withTag('a')])[0], 'href'),
    subject: text(search(ele.children, [hasClass('subject')])),
    author: text(search(ele.children, [hasClass('author')])),
    posts: +text(search(ele.children, [hasClass('posts')])),
    lastpost: text(search(ele.children, [hasClass('lastpost')])),
  }));
  return { title, topics };
};

export const fetchForum = action$ => action$
  .ofType(forumActions.fetch.start)
  .distinctUntilChanged(_.isEqual)
  .do(action => console.log('receive', action))
  .switchMap(({ payload }) =>
    Observable.from(fetch(`http://bangumi.tv/group/${payload.group}/forum?page=${payload.page}`).then(response => response.text()))
      .map(html => {
        const forum = parseData(html);
        return forumActions.fetch.done({
          ...forum,
          group: payload.group,
          currentPage: payload.page,
          endReached: forum.topics.length < 20,
        });
      })
      .catch(error => Observable.of(forumActions.fetch.fail(error)))
  )
  .do(action => console.log('send', action))
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });

export const refreshForum = action$ => action$
  .ofType(forumActions.refresh.start)
  .switchMap(({ payload }) =>
    Observable.from(fetch(`http://bangumi.tv/group/${payload}/forum?page=1`).then(response => response.text()))
      .map(html => {
        const forum = parseData(html);
        return forumActions.refresh.done({
          ...forum,
          group: payload,
          currentPage: 1,
          endReached: forum.topics.length < 20,
        });
      })
      .catch(error => Observable.of(forumActions.refresh.fail(error)))
  )
  .catch(error => {
    console.log(error);
    return Observable.empty();
  });
