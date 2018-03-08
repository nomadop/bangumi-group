import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import { parse } from 'himalaya';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { search, text, hasClass, withTag, getAttribute, hasAttribute } from '../utils/himalaya';
import { getGroups, getCurrentPage, getEndReached } from '../selectors/groups';
import { addGroups, nextPage, reachEnd } from '../actions/groups';

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: { stack: [] },
    };
    this.fetching = false;
  }

  componentDidMount() {
    this.fetchNext();
  }

  fetchNext = () => {
    const { currentPage, endReached } = this.props;
    if (this.fetching || endReached) {
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
      this.props.reachEnd();
    }

    this.props.addGroups(groups);
    this.props.nextPage();
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
    const { groups } = this.props;
    console.log(groups);
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

const mapStateToProps = createStructuredSelector({
  groups: getGroups,
  currentPage: getCurrentPage,
  endReached: getEndReached,
});


const mapDispatchToProps = {
  addGroups,
  nextPage,
  reachEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
