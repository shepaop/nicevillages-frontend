module.exports = function (gulp, plugins, params) {

  return function () {

    gulp.watch('**/*.scss', {cwd: params.tasksPath.source.sassDir}, ['styleguide']);
    gulp.watch('**/*.js', {cwd: params.tasksPath.source.sassDir}, ['styleguide']);
    gulp.watch('**/*.js', {cwd: params.tasksPath.source.scripts}, ['styleguide']);
    gulp.watch('*.svg', {cwd: params.tasksPath.source.icons}, ['icons']);
    gulp.watch('**/*', {cwd: params.tasksPath.source.images}, ['images']);
    gulp.watch('**/*.html', {cwd: params.tasksPath.source.files}, ['files']);

  };

};
