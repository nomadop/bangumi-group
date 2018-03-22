import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { createStructuredSelector } from 'reselect';

import NavigationBar from '../components/NavigationBar';
import { getPost, getReply, getRefreshing, getTitle } from '../selectors/topics';
import { topicActions } from '../actions';

class Topic extends React.Component {
  componentDidMount() {
    const { match, fetchTopic } = this.props;
    fetchTopic(match.params.id);
  }

  refreshTopic = () => {
    const { match, refreshTopic } = this.props;
    refreshTopic(match.params.id);
  };

  renderSubReply = (subReply) => {
    return (
      <View key={subReply.id} style={styles.subReply}>
        <Text>{subReply.content}</Text>
      </View>
    );
  };

  renderReply = (reply) => {
    return (
      <View key={reply.id} style={styles.reply}>
        <Text>{reply.content}</Text>
        { reply.subReply.map(this.renderSubReply) }
      </View>
    );
  };

  render() {
    const { title, post, reply, refreshing } = this.props;

    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={() => this.props.history.goBack()} />
        <ScrollView refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={this.refreshTopic}
        />}>
          <View style={styles.content}>
            <Text>{post.content}</Text>
          </View>
          { reply.map(this.renderReply) }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reply: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subReply: {
    marginTop: 4,
    paddingTop: 4,
    marginLeft: 16,
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
  }
});

const mapStateToProps = createStructuredSelector({
  post: getPost,
  reply: getReply,
  title: getTitle,
  refreshing: getRefreshing,
});


const mapDispatchToProps = {
  fetchTopic: topicActions.fetch.start,
  refreshTopic: topicActions.refresh.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
