var Datauri = require('datauri');
var extension = 'woff2';

module.exports = function (gulp, plugins, params, path) {

  return function () {

    var fs = require('fs');
    fs.writeFileSync(params.tasksPath.destination.font64 + '_font-faces.scss', '');

    gulp.src(
      params.tasksPath.source.font64 + '*.' + extension
    )
      .pipe(
        plugins.tap(function (file, t) {

          var dUri = new Datauri();
          dUri.on('encoded', function (content) {

            var filename = path.basename(file.path);
            filename = filename.substring(0, (filename.length - ('.' + extension).length));

            var fontFace = '/* stylelint-disable */';
            fontFace += '@font-face {';
            fontFace += "font-family:'" + filename + "';";
            fontFace += 'font-style:normal;';
            fontFace += "src:local('" + filename + "')";
            fontFace += ", url(";
            fontFace += '"' + content + '"';
            fontFace += ") format('" + extension + "')";
            fontFace += ", url('../font/" + filename + ".woff') format('woff')";
            fontFace += ";";
            fontFace += '}';
            fontFace += '/* stylelint-enable */';

            fs.appendFile(params.tasksPath.destination.font64 + '_font-faces.scss', fontFace);
          });
          // dUri.pipe(process.stdout);
          dUri.encode(file.path);

        })
      );

  };

};
