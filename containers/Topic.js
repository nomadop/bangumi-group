import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ScrollView, RefreshControl, Image } from 'react-native';
import decode from 'unescape';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import FetchingIndicator from '../components/FetchingIndicator';
import ResizedImage from '../components/ResizedImage';
import { topics as mapStateToProps } from '../selectors';
import { topics as topicActions } from '../actions';
import { text, getAttribute } from '../utils/himalaya';
import { getImageUri } from '../utils/parser';

class Topic extends React.Component {
  componentDidMount() {
    const { match, fetchTopic } = this.props;
    fetchTopic(match.params.id);
  }

  refreshTopic = () => {
    const { match, refreshTopic } = this.props;
    refreshTopic(match.params.id);
  };

  renderContentRow = (node, key) => {
    if (node.type === 'text') {
      return <Text key={key}>{decode(node.content.trim())}</Text>;
    } else if (node.tagName === 'img') {
      const src = getAttribute(node, 'src');
      return <ResizedImage key={key} source={{ uri: getImageUri(src) }} offset={16} />
    } else if (!_.isEmpty(node.children)) {
      return <Text key={key}>{text(node.children).trim()}</Text>;
    }
  };

  renderContent = (content, prefix) => (
    <View style={styles.content}>
      {content.children.map((node, index) => this.renderContentRow(node, `${prefix}_content_${index}`))}
    </View>
  );

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
    return _.isEmpty(post) ? <View /> : (
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
          { this.renderContent(post.content, 'post') }
        </View>
        { reply.map(this.renderReply) }
      </ScrollView>
    );
  };

  render() {
    const { title, post, fetching } = this.props;

    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={() => this.props.history.goBack()} />
        { _.isEmpty(post) && fetching ? <FetchingIndicator /> : this.renderPost() }
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

const mapDispatchToProps = {
  fetchTopic: topicActions.fetch.start,
  refreshTopic: topicActions.refresh.start,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
