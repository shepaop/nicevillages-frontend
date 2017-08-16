module.exports = function (gulp, plugins, params) {

  return function () {

    // SASS Compile
    return gulp.src(
      params.tasksPath.source.sass
    )
      .pipe(
        plugins.stylelint({
          failAfterError: true,
          syntax: 'scss',
          //reportOutputDir: params.tasksPath.destination.stylelint,
          reporters: [{
            formatter: 'string',
            console: true
          }]
        })
      )
      .pipe(
        plugins.sass().on('error', plugins.sass.logError)
      )
      .pipe(
        gulp.dest(params.tasksPath.destination.css)
      )
      .pipe(
        plugins.autoprefixer(params.autoprefixer)
      )
      .pipe(
        gulp.dest(params.tasksPath.destination.css)
      );

  };

};
