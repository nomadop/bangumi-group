import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { getTopics, getCurrentPage, getEndReached, getTitle } from '../selectors/forums';
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

  renderItem = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.item}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.posts}>{item.posts}</Text>
        <Text>{item.lastpost}</Text>
      </View>
    </Link>
  );

  keyExtractor = (item) => _.last(item.link.split('/'));

  render() {
    const { title, topics, history } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={() => history.goBack()} />
        <FlatList
          data={topics}
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
    height: 50,
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
  },
  subject: {
    flex: 1,
  },
  author: {
    paddingHorizontal: 8,
    width: 100,
  },
  posts: {
    paddingRight: 8,
    width: 36,
  }
});

const mapStateToProps = createStructuredSelector({
  topics: getTopics,
  currentPage: getCurrentPage,
  endReached: getEndReached,
  title: getTitle,
});


const mapDispatchToProps = {
  fetchForum: forumActions.fetch.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupForum);
