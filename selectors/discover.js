import { createStructuredSelector } from 'reselect';

export const getHotGroups = state => state.discover.hotGroups;

export const getNewGroups = state => state.discover.newGroups;

export const getTopics = state => state.discover.topics;

export const getFetching = state => state.discover.fetching;

export const getFetchStatus = state => state.discover.fetchStatus;

export default createStructuredSelector({
  topics: getTopics,
  hotGroups: getHotGroups,
  newGroups: getNewGroups,
  fetching: getFetching,
  fetchStatus: getFetchStatus,
});
