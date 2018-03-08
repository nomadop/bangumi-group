import { createAction } from 'redux-actions';

export const addTopics = createAction('ADD-TOPICS');

export const nextPage = createAction('TOPICS-NEXT-PAGE');

export const reachEnd = createAction('TOPICS-REACH-END');

export const setTitle = createAction('TOPICS-SET-TITLE');
