module.exports = function (gulp, plugins, params) {

  return function () {

    gulp.src([
      params.tasksPath.destination.font + '**/*',
      params.tasksPath.destination.scripts + '**/*',
      params.tasksPath.destination.css + '**/*',
      params.tasksPath.destination.images + '**/*'
    ], {base: './dist/'})
      .pipe(
        gulp.dest(
          params.tasksPath.destination.styleguide
        )
      );

  };

};
