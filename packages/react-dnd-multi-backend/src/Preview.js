import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DnDPreview from 'react-dnd-preview';

export default class Preview extends PureComponent {
  static propTypes = {generator: PropTypes.func.isRequired};
  static contextTypes = {dragDropManager: PropTypes.object};

  render() {
    console.log(this.context); // eslint-disable-line
    if (!this.context.dragDropManager.getBackend().previewEnabled()) {
      return null;
    }
    return <DnDPreview {...this.props} />;
  }
}
