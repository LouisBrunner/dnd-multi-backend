export default (event, check) => {
  return {
    _isMBTransition: true,
    event: event,
    check: check,
  };
};
