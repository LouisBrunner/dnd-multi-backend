export default function(target, ...sources) {
  sources.forEach((source) => {
    for (const name in source) {
      if (Object.prototype.hasOwnProperty.call(source, name)) {
        target[name] = source[name];
      }
    }
  });
  return target;
}
