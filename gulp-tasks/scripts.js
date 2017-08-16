module.exports = function (gulp, plugins, params) {

  return function () {

    // JS Concatenation and minification
    gulp.src([
      params.tasksPath.source.scripts + '**/*.js',
      params.tasksPath.source.themeComponents + '**/*.js'
    ])
      .pipe(
        plugins.concat('functions.js')
      )
      .pipe(
        plugins.uglify()
      )
      .pipe(
        plugins.rename({
          suffix: ".min"
        })
      )
      .pipe(
        gulp.dest(params.tasksPath.destination.scripts)
      );

  };

};
