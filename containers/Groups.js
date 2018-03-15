import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { getGroups, getCurrentPage, getEndReached, getFetching } from '../selectors/groups';
import { groupActions } from '../actions';

class Groups extends React.Component {
  componentDidMount() {
    this.fetchNext();
  }

  fetchNext = () => {
    const { currentPage, endReached, fetching, fetchGroups } = this.props;
    if (fetching || endReached) {
      return;
    }

    fetchGroups(currentPage + 1);
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
    const { groups, fetching } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar />
        <FlatList
          data={groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
        <TouchableOpacity onPress={this.fetchNext} style={styles.more}>
          {fetching ? <ActivityIndicator /> : <Text>More...</Text>}
        </TouchableOpacity>
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
  more: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  }
});

const mapStateToProps = createStructuredSelector({
  groups: getGroups,
  currentPage: getCurrentPage,
  endReached: getEndReached,
  fetching: getFetching,
});


const mapDispatchToProps = {
  fetchGroups: groupActions.fetchGroups.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
