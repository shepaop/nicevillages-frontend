module.exports = function (gulp, plugins, params) {

  return function () {

    gulp.src(
      params.tasksPath.destination.css + 'styles.css'
    )
      .pipe(
        plugins.sc5styleguide.applyStyles()
      )
      .pipe(
        gulp.dest(
          params.tasksPath.destination.styleguide
        )
      );

  };

};
