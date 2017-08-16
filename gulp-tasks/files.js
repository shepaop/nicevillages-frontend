module.exports = function (gulp, plugins, params) {

  return function () {

    // Génération des fichiers HTML
    gulp.src([
      params.tasksPath.source.files + '*.html'
    ])
      .pipe(
        plugins.fileInclude({
          prefix: '@@',
          basepath: '@file'
        })
      )
      .pipe(
        gulp.dest(
          params.tasksPath.destination.files
        )
      );

  };

};