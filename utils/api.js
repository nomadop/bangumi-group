import { parseGroups, parseForum } from './parser';

export const fetchGroups = page => fetch(`http://bangumi.tv/group/category/all?page=${page}`)
  .then(response => response.text())
  .then(parseGroups);

export const fetchForum = (group, page) => fetch(`http://bangumi.tv/group/${group}/forum?page=${page}`)
  .then(response => response.text())
  .then(parseForum);
