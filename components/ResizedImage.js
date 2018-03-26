import React from 'react';
import { Dimensions, Image } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class ResizedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: deviceWidth,
      height: 0,
    };
  }

  componentDidMount() {
    const { offset } = this.props;
    Image.getSize(
      this.props.source.uri,
      (srcWidth, srcHeight) => {
        const ratio = Math.min((deviceWidth - offset) / srcWidth, deviceHeight / srcHeight);
        const width = ratio >= 1 ? srcWidth : srcWidth * ratio;
        const height = ratio >= 1 ? srcHeight : srcHeight * ratio;
        this.setState({ width, height });
      },
      error => console.log(error)
    );
  }
  componentWillUnmount() {
    this.setState({ height: 0 });
  }

  render() {
    const { source } = this.props;
    return (
      <Image
        source={{ uri: source.uri }}
        style={this.state}
        resizeMode='cover'
      />
    );
  }
}

export default ResizedImage;