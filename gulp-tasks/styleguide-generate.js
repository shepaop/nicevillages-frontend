module.exports = function (gulp, plugins, params) {

  return function () {

    var fs = require('fs');

    gulp.src(
      params.tasksPath.destination.css + 'styles.css'
    )
      .pipe(
        plugins.sc5styleguide.generate({
          title: 'Styleguide ' + params.siteName,
          readOnly: true,
          rootPath: params.tasksPath.destination.styleguide,
          appRoot: params.styleguide.serverRoot,
          overviewPath: params.styleguide.readme,
          commonClass: "sc5-ctx",
          extraHead: [
            // Attention, la version de jQuery peut faire planter le styleguide
            // '<style type="text/css">@import url('+ params.styleguide.skin +');</style>',
            '<style type="text/css">@import url(https://api.mapbox.com/mapbox-gl-js/v0.39.1/mapbox-gl.css);</style>',
            '<style type="text/css">@import url(css/styles.min.css);</style>',
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>',
            '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>',
            '<script src="https://api.mapbox.com/mapbox-gl-js/v0.39.1/mapbox-gl.js"></script>',
            '<script src="js/modernizr.min.js"></script>',
            '<script src="../bin/styleguide-context.js"></script>',
            '<script src="js/functions.min.js"></script>'
          ],
          server: false,
          disableHtml5Mode: true,
          disableEncapsulation: true,
          // customColors: params.styleguide.skinFile,
          styleguideProcessors: {
            30: function (styleguide) {
              var componentsDir = params.tasksPath.destination.components;
              if (!fs.existsSync(componentsDir)) {
                fs.mkdirSync(params.tasksPath.destination.components);
              }
              for (var i = 0; i < styleguide.sections.length; i++) {
                if (typeof styleguide.sections[i]['sg-filename'] === 'string') {

                  // Nom du fichier
                  var filename = styleguide.sections[i]['sg-filename'];
                  // Futur contenu du fichier
                  var filecontent = '';
                  // Futur modifier
                  var className = '';

                  if (styleguide.sections[i].modifiers.length) {
                    for (var j = 0; j < styleguide.sections[i].modifiers.length; j++) {
                      var suffix = '.' + styleguide.sections[i].modifiers[j].className;
                      filecontent = styleguide.sections[i].modifiers[j].markup;
                      className = styleguide.sections[i].modifiers[j].className;
                      filecontent = filecontent.replace("{$modifiers}", className);
                      fs.writeFileSync(params.tasksPath.destination.components + filename + suffix + '.html', filecontent, 'utf8');
                    }
                  }
                  else {
                    filecontent = styleguide.sections[i].markup.replace("{$modifiers}", '');
                    fs.writeFileSync(params.tasksPath.destination.components + filename + '.html', filecontent, 'utf8');
                  }
                }
              }
            }
          }
        })
      )
      .pipe(
        gulp.dest(
          params.tasksPath.destination.styleguide
        )
      );

  };

};