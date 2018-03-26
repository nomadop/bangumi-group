import React from 'react';
import { Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

class ResizedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { height: 0 };
  }

  componentDidMount() {
    const { offset } = this.props;
    Image.getSize(
      this.props.source.uri,
      (srcWidth, srcHeight) => {
        const ratio = Math.min((width - offset) / srcWidth, height / srcHeight);
        this.setState({ height: srcHeight * ratio });
      },
      error => console.log(error)
    );
  }
  componentWillUnmount() {
    this.setState({ height: 0 });
  }

  render() {
    const { source, offset } = this.props;
    return (
      <Image
        source={{ uri: source.uri }}
        style={{
          width: width - offset,
          height: this.state.height
        }}
        resizeMode='cover'
      />
    );
  }
}

export default ResizedImage;