import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { getGroups, getCurrentPage, getEndReached, getFetching, getRefreshing } from '../selectors/groups';
import { groupActions } from '../actions';

export const GROUP_TABS = ['all', 'AC', 'Game', 'Tech', 'Life'];

class Groups extends React.Component {
  componentDidMount() {
    const { currentPage } = this.props;
    if (currentPage === 0) {
      this.fetchNext();
    }
  }

  fetchNext = () => {
    const { currentPage, endReached, fetching, fetchGroups } = this.props;
    if (fetching || endReached) {
      return;
    }

    fetchGroups(currentPage + 1);
  };

  renderTab = ({ item }) => {
    const active = item === 'all';
    return (
      <TouchableOpacity key={item} style={[styles.tab, active && styles.tabActive]} >
        <Text style={styles.tabText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  renderTabBar = () => (
    <View style={styles.tabBar}>
      <FlatList
        horizontal={true}
        data={GROUP_TABS}
        keyExtractor={_.identity}
        renderItem={this.renderTab}
      />
    </View>
  );

  renderGroup = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.item}>
        <Image source={{ uri: `http:${item.image}` }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.feed}>{item.feed}</Text>
      </View>
    </Link>
  );

  keyExtractor = (item) => _.last(item.link.split('/'));

  render() {
    const { groups, fetching, refreshing, refreshGroups } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title={groups.length} />
        <FlatList
          data={groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderGroup}
          onRefresh={refreshGroups}
          refreshing={refreshing}
        />
        <TouchableOpacity onPress={this.fetchNext} style={styles.more}>
          {(fetching || refreshing) ? <ActivityIndicator /> : <Text>More...</Text>}
        </TouchableOpacity>
        {this.renderTabBar()}
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
    fontSize: 12,
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
  },
  tabBar: {
    height: 48,
    borderColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#00adef',
  },
  tabText: {
    fontSize: 16,
  },
});

const mapStateToProps = createStructuredSelector({
  groups: getGroups,
  currentPage: getCurrentPage,
  endReached: getEndReached,
  fetching: getFetching,
  refreshing: getRefreshing,
});


const mapDispatchToProps = {
  fetchGroups: groupActions.fetch.start,
  refreshGroups: groupActions.refresh.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
