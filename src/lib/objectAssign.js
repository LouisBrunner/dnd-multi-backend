export default function(target, ...sources) {
  for (const source of sources) {
    for (const name in source) {
      if (Object.prototype.hasOwnProperty.call(source, name)) {
        target[name] = source[name];
      }
    }
  }
  return target;
}
