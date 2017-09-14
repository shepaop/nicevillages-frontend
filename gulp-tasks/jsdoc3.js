module.exports = function (gulp, plugins, params, path) {

  return function (cb) {

    var config = require(path.join(params.absolutePath, 'jsdoc.json'));

    // JS Documentation
    gulp.src([
      './jsdoc.md',
      params.tasksPath.source.scripts + '**/*.js',
      params.tasksPath.source.themeComponents + '**/*.js'
    ], {read: false})
      .pipe(
        plugins.jsdoc3(config, cb)
      );

  };

};
