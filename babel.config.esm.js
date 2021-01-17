const config = require('./babel.config.json');

// Disable CommonJS modules
config.presets[0][1].modules = false;

module.exports = config;
