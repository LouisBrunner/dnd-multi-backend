import { useDrag } from 'react-dnd';
import { useMultiCommon } from './common';

export const useMultiDrag = (spec) => {
  return useMultiCommon(spec, useDrag);
};
