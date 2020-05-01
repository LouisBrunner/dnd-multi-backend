import { useDrop } from 'react-dnd';
import { useMultiCommon } from './common';

export const useMultiDrop = (spec) => {
  return useMultiCommon(spec, useDrop);
};
