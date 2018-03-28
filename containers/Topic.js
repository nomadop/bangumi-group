import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ScrollView, RefreshControl, Image } from 'react-native';
import { Link } from 'react-router-native';
import he from 'he';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import FetchingIndicator from '../components/FetchingIndicator';
import ResizedImage from '../components/ResizedImage';
import { topics as mapStateToProps } from '../selectors';
import { topics as topicActions, browser as browserActions } from '../actions';
import { text, getAttribute } from '../utils/himalaya';
import { getImageUri } from '../utils/parser';
import { PATHS } from '../constants';

class Topic extends React.Component {
  refreshTopic = () => {
    const { match, refreshTopic } = this.props;
    refreshTopic(match.params.id);
  };

  getImageOffset = key => {
    if (_.startsWith(key, 'post')) {
      return 16;
    } else if (_.startsWith(key, 'reply')) {
      return 64;
    } else {
      return 100;
    }
  };

  getReplyType = reInfo => /^#\d*-\d*/.test(reInfo) ? 'subReply' : 'reply';

  renderContentLink = (node, key) => {
    const href = getAttribute(node, 'href');
    const match = href.match(/(\/group\/topic\/\d+)/);
    const to = match ? match[1] : PATHS.BROWSER;
    const onPress = match ? _.noop : () => this.props.setUri(href);
    return (
      <Link key={key} to={to} onPress={onPress} style={styles.link}>
        <View>
          {node.children.map((subNode, index) => this.renderContentRow(subNode, `${key}_${index}`))}
        </View>
      </Link>
    );
  };

  renderContentRow = (node, key) => {
    if (node.type === 'text') {
      return <Text key={key} style={styles.contentText}>{he.decode(node.content.trim())}</Text>;
    } else if (node.tagName === 'br') {
      return <View key={key} style={styles.lineBreak} />
    } else if (node.tagName === 'img') {
      const src = getAttribute(node, 'src');
      return <ResizedImage key={key} source={{ uri: getImageUri(src) }} offset={this.getImageOffset(key)} />
    } else if (node.tagName === 'a') {
      return this.renderContentLink(node, key);
    } else if (!_.isEmpty(node.children)) {
      return node.children.map((subNode, index) => this.renderContentRow(subNode, `${key}_${index}`));
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
      { this.renderContent(reply.content, `${this.getReplyType(reply.reInfo)}_${reply.id}`) }
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentText: {
    lineHeight: 22,
  },
  lineBreak: {
    width: '100%',
    height: 16,
  },
  link: {
    borderBottomColor: '#00ADEF',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  refreshTopic: topicActions.refresh.start,
  setUri: browserActions.setUri,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
