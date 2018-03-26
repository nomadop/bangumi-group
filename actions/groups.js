import { identityActions, fetchAction } from './common';

export default {
  FETCH: fetchAction,
  ...identityActions('SWITCH_TAG'),
};
