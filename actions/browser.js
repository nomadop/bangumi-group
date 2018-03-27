import { identityActions, fetchAction } from './common';

export default {
  LOAD: fetchAction,
  ...identityActions('SET_URI', 'SET_TITLE'),
};
