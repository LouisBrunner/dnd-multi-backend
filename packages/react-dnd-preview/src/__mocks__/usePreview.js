let mockReturn;
const __setMockReturn = (display, rest = {}) => {
  mockReturn = {display, ...rest};
};

const fakeUsePreview = () => {
  return mockReturn;
};

export { fakeUsePreview as usePreview, __setMockReturn };
