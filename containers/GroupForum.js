import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import FetchingIndicator from '../components/FetchingIndicator';
import { getTopics, getCurrentPage, getEndReached, getTitle, getRefreshing, getFetching } from '../selectors/forums';
import { forumActions } from '../actions';

class GroupForum extends React.Component {
  componentDidMount() {
    this.fetchNext();
  }

  fetchNext = () => {
    const { currentPage, endReached, match, fetching, fetchForum } = this.props;
    if (fetching || endReached) {
      return;
    }

    fetchForum({
      group: match.params.name,
      page: currentPage + 1,
    });
  };

  refreshForum = () => {
    const { match, refreshForum } = this.props;
    refreshForum(match.params.name);
  };

  renderItem = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.topic}>
        <View style={styles.topicRow}>
          <Text style={styles.subject}>{item.subject}</Text>
        </View>
        <View style={styles.topicRow}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.posts}>{item.posts}</Text>
          <Text style={styles.lastpost}>{item.lastpost}</Text>
        </View>
      </View>
    </Link>
  );

  renderTopics = () => {
    const { topics, refreshing } = this.props;
    return <FlatList
      data={topics}
      keyExtractor={_.property('link')}
      renderItem={this.renderItem}
      onEndReached={this.fetchNext}
      onRefresh={this.refreshForum}
      refreshing={refreshing}
    />;
  };

  render() {
    const { title, topics, history, fetching } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={() => history.goBack()} />
        { _.isEmpty(topics) && fetching ? <FetchingIndicator /> : this.renderTopics() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  topic: {
    flex: 1,
    alignItems: 'stretch',
    borderColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  subject: {
    flex: 1,
  },
  author: {
    flex: 1,
  },
  posts: {
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#999',
    width: 64,
  },
  lastpost: {
    fontSize: 12,
    color: '#999',
    width: 64,
  },
});

const mapStateToProps = createStructuredSelector({
  topics: getTopics,
  currentPage: getCurrentPage,
  endReached: getEndReached,
  title: getTitle,
  fetching: getFetching,
  refreshing: getRefreshing,
});


const mapDispatchToProps = {
  fetchForum: forumActions.fetch.start,
  refreshForum: forumActions.refresh.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupForum);
