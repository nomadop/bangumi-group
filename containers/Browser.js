import React from 'react';
import { connect } from 'react-redux'
import { Text, View, WebView, TouchableOpacity, StyleSheet } from 'react-native';

import { browser as mapStateToProps } from '../selectors';
import { browser as browserActions } from '../actions';

import NavigationBar from '../components/NavigationBar';

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoBack: false,
      canGoForward: false,
    };
  }

  injectJavaScript = (code) => {
    const { loading } = this.props;
    if (!loading) {
      this.webView.injectJavaScript(code);
    }
  };

  handleBack = () => {
    const { history } = this.props;
    const { canGoBack } = this.state;
    return canGoBack ? this.injectJavaScript('window.history.back()') : history.goBack();
  };

  handleLoadEnd = (event) => {
    const { loadDone, setTitle } = this.props;
    this.setState({ ...event.nativeEvent });
    setTitle(event.nativeEvent.title);
    loadDone();
  };

  renderRightTitle = () => {
    const { canGoForward } = this.state;
    const handlePress = () => this.injectJavaScript('window.history.forward()');
    return canGoForward ? (
      <TouchableOpacity onPress={handlePress} style={styles.rightTitle}>
        <Text>Forward</Text>
      </TouchableOpacity>
    ) : <View />;
  };

  render() {
    const { uri, title, loadStart } = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title={title} onBack={this.handleBack} renderRightTitle={this.renderRightTitle} />
        <WebView
          ref={ component => this.webView = component }
          source={{ uri }}
          onLoadStart={loadStart}
          onLoadEnd={this.handleLoadEnd}
          startInLoadingState
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fetchingIndicator: {
    flex: 0,
    height: 64,
  },
  rightTitle: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

const mapDispatchToProps = {
  loadStart: browserActions.load.start,
  loadDone: browserActions.load.done,
  setTitle: browserActions.setTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
