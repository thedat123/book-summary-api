/**
 * Custom Jest resolver using Node.js's built-in require.resolve.
 * Needed because unrs-resolver (used by Jest 30) requires a native binary
 * that may not be installed in all environments.
 */
const path = require('path');

module.exports = function resolver(moduleName, options) {
  const { basedir, defaultResolver, ...rest } = options;
  try {
    return require.resolve(moduleName, { paths: [basedir, ...((options.paths || []))] });
  } catch {
    // Fall back to jest's default resolver
    return defaultResolver(moduleName, { basedir, ...rest });
  }
};
