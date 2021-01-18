let mockReturn;

export const __setMockReturn = (display, rest = {}) => {
  mockReturn = {display, ...rest};
};

export const usePreview = () => {
  return mockReturn;
};

// type usePreviewProps = {

// }

// type usePreviewState = {

// }

// let mockReturn: usePreviewState

// export const __setMockReturn = (display: boolean, rest: Exclude<usePreviewProps, 'display'> = {}): void => {
//   mockReturn = {display, ...rest}
// }

// export const fakeUsePreview = (): usePreviewState => {
//   return mockReturn
// }
