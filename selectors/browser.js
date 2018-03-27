import { createStructuredSelector } from 'reselect';

export default createStructuredSelector({
  uri: state => state.browser.uri,
  title: state => state.browser.title,
  loading: state => state.browser.loading,
});
