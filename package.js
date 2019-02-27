Package.describe({
  name: 'arutune:bz-engine-ui',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Encapsulates ui',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});
Package.onUse((api) => {
//api.mainModule("imports/index.js", "client", { lazy: true });
//api.mainModule("imports/bz-users/index.client.js", "client", { lazy: true });
//api.mainModule("imports/bz-users/index.shared.js", ["client", "server"], { lazy: true });
//api.mainModule("imports/bz-users/index.shared.js", ["client", "server"], { lazy: true });
  api.addAssets([
    'templates.html',
  ], 'client')
  api.addFiles([
    'controller.client.js',
  ], 'client');
});
