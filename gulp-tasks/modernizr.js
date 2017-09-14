module.exports = function (gulp, plugins, params) {

  return function () {

    gulp.src(params.tasksPath.source.modernizr)
      .pipe(
        plugins.modernizr('modernizr.min.js', {
          "parseFiles": true,
          "customTests": [],
          "tests": params.modernizr,
          "options": [
            "setClasses"
          ]
        })
      )
      .pipe(
        plugins.uglify()
      )
      .pipe(
        gulp.dest(params.tasksPath.destination.modernizr)
      );

  };

};
