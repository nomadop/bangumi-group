import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { parse } from 'himalaya';

import NavigationBar from '../components/NavigationBar';
import { search, text, hasClass, withTag, getAttribute } from '../utils/himalaya';

export default class Topic extends React.Component {
  constructor() {
    super();
    this.state = { reply: [] };
  }

  componentDidMount() {
    const { match } = this.props;
    fetch(`http://bangumi.tv/group/topic/${match.params.id}`)
      .then(response => response.text())
      .then(this.parseData);
  }

  parseData = (html) => {
    // const $ = cheerio.load(html);
    // this.setState({
    //   content: $('.topic_content').text().trim(),
    //   reply: $('.row_reply').map((index, row) => ({
    //     id: $(row).attr('id'),
    //     message: $(row).find('.message').text(),
    //     image: $(row).find('img').attr('src'),
    //     subReply: $(row).find('.sub_reply_bg').map((subIndex, subRow) => ({
    //       id: $(subRow).attr('id'),
    //       content: $(subRow).find('.cmt_sub_content').text(),
    //     })).toArray(),
    //   })).toArray(),
    // });
    const json = parse(html);
    const newState = {
      content: text(search(json, [hasClass('topic_content')])).trim(),
      reply: search(json, [hasClass('row_reply')]).map(row => ({
        id: getAttribute(row, 'id'),
        message: text(search(row.children, [hasClass('message')])),
        rowMessage: search(row.children, [hasClass('message')]),
        image: search(row.children, [withTag('img')]).map(img => getAttribute(img, 'src')),
        subReply: search(row.children, [hasClass('sub_reply_bg')]).map(subRow => ({
          id: getAttribute(subRow, 'id'),
          content: text(search(subRow.children, [hasClass('cmt_sub_content')])),
        })),
      })),
    };
    console.log(newState);
    this.setState(newState);
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
        <Text>{reply.message}</Text>
        { reply.subReply.map(this.renderSubReply) }
      </View>
    );
  };

  render() {
    const { content, reply } = this.state;
    console.log(content, reply);

    return (
      <View style={styles.container}>
        <NavigationBar onBack={() => this.props.history.goBack()} />
        <ScrollView>
          <View style={styles.content}>
            <Text>{content}</Text>
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
