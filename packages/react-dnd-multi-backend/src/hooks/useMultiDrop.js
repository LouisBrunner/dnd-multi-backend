import { useDrop } from 'react-dnd';
import { useMultiCommon } from './useMultiCommon';

export const useMultiDrop = (spec) => {
  return useMultiCommon(spec, useDrop);
};
