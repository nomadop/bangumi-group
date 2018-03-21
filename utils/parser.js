import { parse } from 'himalaya';

import { search, text, hasClass, withTag, getAttribute, hasAttribute } from '../utils/himalaya';

export const parseGroups = html => {
  const json = parse(html);
  return search(json, [hasAttribute('id', 'memberGroupList'), hasClass('userContainer')])
    .map(group => ({
      name: text(search(group.children, [withTag('strong')])).trim(),
      link: getAttribute(search(group.children, [withTag('a')])[0], 'href'),
      image: getAttribute(search(group.children, [withTag('img')])[0], 'src'),
      feed: text(search(group.children, [withTag('small')])),
    }));
};

export const parseForum = html => {
  const json = parse(html);
  const title = text(search(json, [hasClass('SecondaryNavTitle')]));
  const topics = search(json, [hasClass('topic_list'), hasClass('topic')]).map(ele => ({
    link: getAttribute(search(ele.children, [hasClass('subject'), withTag('a')])[0], 'href'),
    subject: text(search(ele.children, [hasClass('subject')])),
    author: text(search(ele.children, [hasClass('author')])),
    posts: +text(search(ele.children, [hasClass('posts')])),
    lastpost: text(search(ele.children, [hasClass('lastpost')])),
  }));
  return { title, topics };
};

export const parseTopic = html => {
  const json = parse(html);
  return {
    content: text(search(json, [hasClass('topic_content')])).trim(),
    reply: search(json, [hasClass('row_reply')]).map(row => ({
      id: getAttribute(row, 'id'),
      message: text(search(row.children, [hasClass('message')])),
      image: search(row.children, [withTag('img')]).map(img => getAttribute(img, 'src')),
      subReply: search(row.children, [hasClass('sub_reply_bg')]).map(subRow => ({
        id: getAttribute(subRow, 'id'),
        content: text(search(subRow.children, [hasClass('cmt_sub_content')])),
      })),
    })),
  };
};

export const parseDiscover = html => {
  const json = parse(html);
  const hotGroups = search(json, [hasClass('groupsLarge'), withTag('li')])
    .map(group => {
      const linkEle = search(group.children, [withTag('a')])[0];
      return {
        link: getAttribute(linkEle, 'href'),
        name: getAttribute(linkEle, 'title'),
        image: getAttribute(search(linkEle.children, [withTag('img')])[0], 'src'),
        feed: text(search(group.children, [hasClass('feed')])),
      };
    });
  const newGroups = search(json, [hasClass('groupsSmall'), withTag('li')])
    .map(group => ({
      link: getAttribute(search(group.children, [hasClass('inner'), withTag('a')])[0], 'href'),
      name: text(search(group.children, [hasClass('inner'), withTag('a')])),
      image: getAttribute(search(group.children, [withTag('img')])[0], 'src'),
      feed: text(search(group.children, [hasClass('feed')])),
    }));
  const topics = search(json, [hasClass('topic_list'), withTag('tr')]).slice(1)
    .map(row => ({
      link: getAttribute(row.children[0].children[0], 'href'),
      subject: text(row.children[0].children[0].children),
      posts: text(row.children[0].children[2].children),
      groupLink: getAttribute(row.children[1].children[0], 'href'),
      groupName: text(row.children[1].children),
      author: text(row.children[2].children),
      lastpost: text(row.children[3].children),
    }));
  return { hotGroups, newGroups, topics };
};
