import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-native';
import { parse } from 'himalaya';
import * as _ from 'lodash';

import NavigationBar from '../components/NavigationBar';
import { search, text, hasClass, withTag, getAttribute } from '../utils/himalaya';
import { getTopics, getCurrentPage, getEndReached, getTitle } from '../selectors/forums';
import { addTopics, nextPage, reachEnd, setTitle } from '../actions/forums';

class GroupForum extends React.Component {
  constructor() {
    super();
    this.state = {
      error: { stack: [] },
    };
    this.fetching = false;
  }

  componentDidMount() {
    this.fetchNext();
  }

  fetchNext = () => {
    const { currentPage, endReached, match } = this.props;
    if (this.fetching || endReached) {
      return;
    }

    this.fetching = true;
    fetch(`http://bangumi.tv/group/${match.params.name}/forum?page=${currentPage + 1}`)
      .then(response => response.text())
      .then(this.parseData)
      .catch(error => {
        console.log(error);
        return this.setState({ error: JSON.stringify(error.message), stack: error.stack });
      });
  };

  parseData = (html) => {
    // const $ = cheerio.load(html);
    // const $topics = $('.topic_list .topic');
    // const topics = $topics.map((index, node) => ({
    //   link: $(node).find('.subject a').attr('href'),
    //   subject: $(node).find('.subject').text(),
    //   author: $(node).find('.author').text(),
    //   posts: +$(node).find('.posts').text(),
    //   lastpost: $(node).find('.lastpost').text(),
    // }));
    // this.setState({ topics });
    const { match } = this.props;
    const json = parse(html);
    const title = text(search(json, [hasClass('SecondaryNavTitle')]));
    const topics = search(json, [hasClass('topic_list'), hasClass('topic')]).map(ele => ({
      link: getAttribute(search(ele.children, [hasClass('subject'), withTag('a')])[0], 'href'),
      subject: text(search(ele.children, [hasClass('subject')])),
      author: text(search(ele.children, [hasClass('author')])),
      posts: +text(search(ele.children, [hasClass('posts')])),
      lastpost: text(search(ele.children, [hasClass('lastpost')])),
    }));
    console.log(json, topics);
    if (topics.length < 20) {
      this.props.reachEnd({ group: match.params.name });
    }

    this.props.setTitle({ group: match.params.name, title });
    this.props.addTopics({ group: match.params.name, topics });
    this.props.nextPage({ group: match.params.name });

    this.fetching = false;
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
  addTopics,
  nextPage,
  reachEnd,
  setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupForum);
