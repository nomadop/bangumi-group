import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { Link } from 'react-router-native';
import { parse } from 'himalaya';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { search, text, hasClass, withTag, getAttribute, hasAttribute } from '../utils/himalaya';

export default class Groups extends React.Component {
  constructor() {
    super();
    this.state = {
      error: { stack: [] },
      groups: [],
      currentPage: 0,
    };
    this.fetching = false;
    this.endReached = false;
  }

  componentDidMount() {
    this.fetchNext();
  }

  fetchNext = () => {
    const { currentPage } = this.state;
    if (this.fetching || this.endReached) {
      return;
    }

    this.fetching = true;
    fetch(`http://bangumi.tv/group/category/all?page=${currentPage + 1}`)
      .then(response => response.text())
      .then(this.parseData)
      .catch(error => {
        console.log(error);
        return this.setState({ error: JSON.stringify(error.message), stack: error.stack });
      });
  };

  parseData = (html) => {
    const json = parse(html);
    const groups = search(json, [hasAttribute('id', 'memberGroupList'), hasClass('userContainer')]).map(group => ({
      name: text(search(group.children, [withTag('strong')])).trim(),
      link: getAttribute(search(group.children, [withTag('a')])[0], 'href'),
      image: getAttribute(search(group.children, [withTag('img')])[0], 'src'),
      feed: text(search(group.children, [withTag('small')])),
    }));

    console.log(json, groups);
    if (groups.length < 21) {
      this.endReached = true;
    }

    this.setState({
      groups: this.state.groups.concat(groups),
      currentPage: this.state.currentPage + 1,
    });
    this.fetching = false;
  };

  renderItem = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.item}>
        <Image source={{uri: `http:${item.image}`}} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.feed}>{item.feed}</Text>
      </View>
    </Link>
  );

  keyExtractor = (item) => _.last(item.link.split('/'));

  render() {
    const { error, groups } = this.state;
    return (
      <View style={styles.container}>
        <NavigationBar />
        <FlatList
          data={groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReached={this.fetchNext}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
  },
  name: {
    flex: 1,
  },
  feed: {
    paddingRight: 8,
    width: 72,
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
});
