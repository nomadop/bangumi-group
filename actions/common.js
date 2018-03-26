import * as _ from 'lodash';

export function identityActions() {
  return Array.apply(null, arguments).reduce((actions, action) => ({
    ...actions,
    [action]: _.identity,
  }), {});
}

export const fetchAction = identityActions('START', 'DONE', 'FAIL');
