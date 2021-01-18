import { useDrag } from 'react-dnd';
import { useMultiCommon } from './useMultiCommon';

export const useMultiDrag = (spec) => {
  return useMultiCommon(spec, useDrag);
};
