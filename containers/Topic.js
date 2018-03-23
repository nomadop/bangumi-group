import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ScrollView, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { createStructuredSelector } from 'reselect';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { getPost, getReply, getRefreshing, getTitle, getFetching } from '../selectors/topics';
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

  renderReplyContent = (reply) => (
    <View style={styles.replyContent}>
      <Text style={styles.reInfo}>{reply.reInfo}</Text>
      <Text>
        {reply.author}
        <Text style={styles.tip}>{reply.tip}</Text>
      </Text>
      <Text style={styles.content}>{reply.content}</Text>
      { (reply.subReply || []).map(this.renderSubReply) }
    </View>
  );

  renderSubReply = (subReply) => {
    return (
      <View key={subReply.id} style={styles.subReply}>
        <View style={styles.dashed} />
        <View style={styles.row}>
          <Image source={{ uri: `http:${subReply.avatar}` }} style={styles.avatarTiny} />
          { this.renderReplyContent(subReply) }
        </View>
      </View>
    );
  };

  renderReply = (reply) => {
    return (
      <View key={reply.id} style={styles.reply}>
        <Image source={{ uri: `http:${reply.avatar}` }} style={styles.avatarSmall} />
        { this.renderReplyContent(reply) }
      </View>
    );
  };

  renderPost = () => {
    const { post, reply, refreshing } = this.props;
    return (
      <ScrollView refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={this.refreshTopic}
      />}>
        <View style={styles.post}>
          <View style={styles.row}>
            <Image source={{ uri: `http:${post.avatar}` }} style={styles.avatar} />
            <View>
              <Text style={styles.reInfo}>{post.reInfo}</Text>
              <Text>
                {post.author}
                <Text style={styles.tip}>{post.tip}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.content}>{post.content}</Text>
        </View>
        { reply.map(this.renderReply) }
      </ScrollView>
    );
  };

  renderActivityIndicator = () => (
    <View style={styles.activityIndicator}>
      <ActivityIndicator />
    </View>
  );

  render() {
    const { title, post, fetching } = this.props;

    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={() => this.props.history.goBack()} />
        { _.isEmpty(post) && fetching ? this.renderActivityIndicator() : this.renderPost() }
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
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  post: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  tip: {
    color: '#999',
    marginLeft: 4,
  },
  content: {
    paddingTop: 8,
  },
  reInfo: {
    color: '#AAA',
    fontSize: 12,
    marginTop: -2,
    marginBottom: 4,
  },
  reply: {
    padding: 8,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  replyContent: {
    flex: 1,
    alignItems: 'stretch',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  subReply: {
    marginTop: 4,
    alignItems: 'stretch',
  },
  dashed: {
    height: 0,
    marginBottom: 4,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarTiny: {
    width: 32,
    height: 32,
    marginRight: 4,
  },
});

const mapStateToProps = createStructuredSelector({
  post: getPost,
  reply: getReply,
  title: getTitle,
  fetching: getFetching,
  refreshing: getRefreshing,
});


const mapDispatchToProps = {
  fetchTopic: topicActions.fetch.start,
  refreshTopic: topicActions.refresh.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
