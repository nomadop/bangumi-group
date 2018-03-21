import { parseGroups, parseForum, parseTopic, parseDiscover } from './parser';

export const fetchGroups = (tag, page) => fetch(`http://bangumi.tv/group/category/${tag}?page=${page}`)
  .then(response => response.text())
  .then(parseGroups);

export const fetchForum = (group, page) => fetch(`http://bangumi.tv/group/${group}/forum?page=${page}`)
  .then(response => response.text())
  .then(parseForum);

export const fetchTopic = id => fetch(`http://bangumi.tv/group/topic/${id}`)
  .then(response => response.text())
  .then(parseTopic);

export const fetchDiscover = () => fetch(`http://bangumi.tv/group/discover`)
  .then(response => response.text())
  .then(parseDiscover);
