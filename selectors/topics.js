import { createSelector, createStructuredSelector } from 'reselect';

import { topicReducer } from '../reducers/topics';

const getTopicState = (state, props) => state.topics.topics[props.match.params.id] || topicReducer(undefined, {});

export const getTitle = createSelector([getTopicState], state => state.title);

export const getPost = createSelector([getTopicState], state => state.post);

export const getReply = createSelector([getTopicState], state => state.reply);

export const getFetching = state => state.topics.fetching;

export const getRefreshing = state => state.topics.refreshing;

export default createStructuredSelector({
  post: getPost,
  reply: getReply,
  title: getTitle,
  fetching: getFetching,
  refreshing: getRefreshing,
});
