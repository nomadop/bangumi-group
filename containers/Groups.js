import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { groups as mapStateToProps } from '../selectors';
import { groups as groupActions } from '../actions';

export const GROUP_TAGS = ['all', 'AC', 'Game', 'Tech', 'Life'];

class Groups extends React.Component {
  componentDidMount() {
    const { currentPage } = this.props;
    if (currentPage === 0) {
      this.fetchNext();
    }
  }

  fetchNext = () => {
    const { currentPage, endReached, fetching, fetchGroups, tag } = this.props;
    if (fetching || endReached) {
      return;
    }

    fetchGroups({ tag, page: currentPage + 1 });
  };

  renderTab = ({ item }) => {
    const { tag, switchTag } = this.props;
    const active = item === tag;
    return (
      <TouchableOpacity
        key={item}
        style={[styles.tab, active && styles.tabActive]}
        onPress={() => switchTag(item)}
      >
        <Text style={styles.tabText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  renderTabBar = () => {
    const { tag } = this.props;
    return (
      <View style={styles.tabBar}>
        <FlatList
          horizontal={true}
          data={GROUP_TAGS}
          keyExtractor={_.identity}
          renderItem={this.renderTab}
          extraData={tag}
        />
      </View>
    );
  };

  renderGroup = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.item}>
        <Image source={{ uri: `http:${item.image}` }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.feed}>{item.feed}</Text>
      </View>
    </Link>
  );

  renderRightTitle = () => (
    <Link to="/discover" style={styles.discover}>
      <Text>Discover</Text>
    </Link>
  );

  render() {
    const { groups, fetching } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title={groups.length} renderRightTitle={this.renderRightTitle} />
        <FlatList
          data={groups}
          keyExtractor={_.property('link')}
          renderItem={this.renderGroup}
          onRefresh={this.fetchNext}
          refreshing={fetching}
        />
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
  discover: {
    justifyContent: 'center',
  },
});

const mapDispatchToProps = {
  switchTag: groupActions.switchTag,
  fetchGroups: groupActions.fetch.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
