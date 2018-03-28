import { parseGroups, parseForum, parseTopic, parseDiscover } from './parser';

const fetchHTML = (url, parser) => fetch(url).then(response => response.text()).then(parser);

export const fetchGroups = (tag, page) => fetchHTML(`http://bangumi.tv/group/category/${tag}?page=${page}`, parseGroups);

export const fetchForum = (group, page) => fetchHTML(`http://bangumi.tv/group/${group}/forum?page=${page}`, parseForum);

export const fetchTopic = id => fetchHTML(`http://bangumi.tv/group/topic/${id}`, parseTopic);

export const fetchDiscover = () => fetchHTML(`http://bangumi.tv/group/discover`, parseDiscover);
