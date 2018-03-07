import * as _ from 'lodash';

export const search = (json, predicates) => _.flatMap(json, node => (
  predicates[0](node) ? (
    predicates.length === 1 ? [node] : search(node.children || [], predicates.slice(1))
  ) : []
).concat(search(node.children || [], predicates)));

const textReducer = (str, node) => {
  if (node.type === 'text') {
    return str + node.content;
  }

  if (node.tagName === 'br') {
    return str + '\n';
  }

  if (node.children) {
    return str + text(node.children);
  }
};
export const text = json => _.reduce(json, textReducer, '');

export const getAttribute = (ele, key) => _.chain(ele).get('attributes').find({ key }).get('value', '').value();

export const hasClass = className => ele => !!getAttribute(ele, 'class').match(className);

export const withTag = tagName => _.iteratee({ tagName });

export const hasAttribute = (key, value) => ele => getAttribute(ele, key) === value;