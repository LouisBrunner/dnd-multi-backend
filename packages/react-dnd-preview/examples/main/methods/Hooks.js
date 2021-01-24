import React from 'react';
import { usePreview } from '../../../src';
import { generatePreview } from './common';

const WithHook = (props) => {
  const {display, ...preview} = usePreview();
  if (!display) {
    return null;
  }
  return generatePreview(preview, props);
};

export const Hooks = (props) => (
  <>
    <WithHook row={0} method="with hook" {...props} />
  </>
);
