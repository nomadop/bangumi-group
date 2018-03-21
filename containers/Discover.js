import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, SectionList, Image } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { discoverActions } from '../actions';
import { getFetching, getHotGroups, getNewGroups, getTopics } from '../selectors/discover';

class Discover extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { fetchData, fetching } = this.props;
    if (!fetching) {
      fetchData();
    }
  };

  renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text>{section.title}</Text>
    </View>
  );

  renderGroup = ({ item }) => (
    <Link to={item.link}>
      <View style={styles.group}>
        <Image source={{ uri: `http:${item.image}` }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.feed}>{item.feed}</Text>
      </View>
    </Link>
  );

  renderTopic = ({ item }) => (
    <View style={styles.topic}>
      <Link to={item.link} style={styles.topicRow}>
        <Text style={styles.subject}>
          {item.subject}
          <Text style={styles.posts}>{item.posts}</Text>
        </Text>
      </Link>
      <View style={styles.topicRow}>
        <Link to={item.groupLink} style={styles.groupLink}>
          <Text>{item.groupName}</Text>
        </Link>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.lastpost}>{item.lastpost}</Text>
      </View>
    </View>
  );

  render() {
    const { hotGroups, newGroups, topics, fetching, history } = this.props;
    const keyExtractor = _.property('link');
    return (
      <View style={styles.container}>
        <NavigationBar title="Discovery" onBack={() => history.goBack()} />
        <SectionList
          onRefresh={this.fetchData}
          refreshing={fetching}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            { data: topics, renderItem: this.renderTopic, title: '最新话题', keyExtractor },
            { data: hotGroups, renderItem: this.renderGroup, title: '热门小组', keyExtractor },
            { data: newGroups, renderItem: this.renderGroup, title: '新成立小组', keyExtractor },
          ]}
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
  sectionHeader: {
    padding: 8,
    backgroundColor: '#ccc',
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
  groupLink: {
    flex: 1,
    width: 100,
  },
  author: {
    paddingHorizontal: 8,
    width: 120,
  },
  posts: {
    fontSize: 12,
    color: '#999',
  },
  lastpost: {
    fontSize: 12,
    color: '#999',
    width: 64,
  },
  group: {
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
    width: 80,
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
});

const mapStateToProps = createStructuredSelector({
  topics: getTopics,
  hotGroups: getHotGroups,
  newGroups: getNewGroups,
  fetching: getFetching,
});

const mapDispatchToProps = {
  fetchData: discoverActions.fetch.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
