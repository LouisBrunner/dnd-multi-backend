import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DnDPreview from 'react-dnd-preview';
import { PreviewManager } from 'dnd-multi-backend';

export default class Preview extends PureComponent {
  static propTypes = {generator: PropTypes.func.isRequired};

  constructor(props) {
    super(props);

    this.state = {enabled: false};

    PreviewManager.register(this);
  }

  backendChanged = (backend) => {
    this.setState({enabled: backend.previewEnabled()});
  }

  componentWillUnmount() {
    PreviewManager.unregister(this);
  }

  render() {
    if (!this.state.enabled) {
      return null;
    }
    return <DnDPreview {...this.props} />;
  }
}
