module.exports = function (gulp, plugins, params) {

  if (params.copy !== null && typeof params.copy === 'object') {

    return function () {

      for (var i = 0; i < Object.keys(params.copy).length; i++) {
        var key = Object.keys(params.copy)[i];

        if (params.copy[key].dest !== null) {

          var result = plugins.globule.find(params.copy[key].files, {srcBase: params.copy[key].source});

          for (var j = 0; j < result.length; j++) {
            result[j] = params.copy[key].source + result[j];
          }

          var baseDir = {};

          // Souhaite-on respecter la structure des dossiers ou non ?
          if (typeof params.copy[key].keepTree === 'boolean' && params.copy[key].keepTree) {
            baseDir = {
              base: params.copy[key].source
            }
          }

          // Copie des fichiers
          gulp.src(
            result, baseDir
          )
            .pipe(
              gulp.dest(params.copy[key].dest)
            );

        }
      }

    };

  }
  else {

    return function () {
    };

  }

};
