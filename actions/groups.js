import { createAction } from 'redux-actions';

export const addGroups = createAction('ADD-GROUPS');

export const nextPage = createAction('GROUPS-NEXT-PAGE');

export const reachEnd = createAction('GROUPS-REACH-END');