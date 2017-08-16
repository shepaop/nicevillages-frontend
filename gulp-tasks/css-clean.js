module.exports = function (gulp, plugins, params) {

  return function () {

    var result = plugins.globule.find(params.tasksPath.destination.css + '*.css', '!' + params.tasksPath.destination.css + '*.min.css');

    // SASS Compile
    return gulp.src(result)
    .pipe(
      plugins.combineMq({
        beautify: true
      })
    )
    .pipe(
      plugins.cssnano(
        {zindex: false}
      )
    )
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(
      gulp.dest(
        params.tasksPath.destination.css
      )
    );

  };

};
