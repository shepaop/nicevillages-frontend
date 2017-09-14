module.exports = function (gulp, plugins, params) {

  return function () {

    // Génération des emails
    gulp.src(
      params.tasksPath.source.mails + '*.mjml'
    )
      .pipe(
        plugins.mjml()
      )
      .pipe(
        gulp.dest(
          params.tasksPath.destination.mails
        )
      );

  };

};