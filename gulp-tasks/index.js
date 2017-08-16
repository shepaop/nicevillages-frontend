module.exports = function (gulp, plugins, params, path) {

  return function () {

    var fs = require('fs');

    var html = '';
    html += '<!doctype html>';
    html += '<html>';
    html += '<head>';
    html += '<meta charset="utf-8">';
    html += '<title>Index</title>';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />';
    html += '<link rel="stylesheet" href="dist/css/styles.min.css" />';
    html += '<link rel="icon" type="image/png" sizes="32x32" href="dist/favicon/favicon-32x32.png">';
    html += '</head>';
    html += '<body>';
    html += '<div class="wysiwyg marger-top marger-bottom" style="width:320px;margin-left:auto;margin-right:auto;">';
    html += '<p style="text-align:center;"><img src="dist/favicon/apple-touch-icon-114x114.png" alt="" /></p>';
    html += '<h2>' + params.siteName + '</h2>';
    html += '</div>';
    html += '<div class="wysiwyg marger-top marger-bottom" style="width:320px;margin-left:auto;margin-right:auto;">';
    html += '<h3>Documentation</h3>';
    html += '<ul>';
    html += '<li><a href="styleguide/">Styleguide</a></li>';
    html += '<li><a href="jsdoc/">Documentation JS</a></li>';
    html += '</ul>';
    html += '</div>';

    for(var i = 0; i < Object.keys(params.index).length; i++){
      var key = Object.keys(params.index)[i];
      var result = plugins.globule.find(params.index[key].files);

      if(result.length){

        html += '<div class="wysiwyg marger-top marger-bottom" style="width:320px;margin-left:auto;margin-right:auto;">';
        html += '<h3>' + params.index[key].title + '</h3>';
        html += '<ul>';

        for(var j = 0; j < result.length; j++){

          var fileName = path.basename(result[j]);

          html += '<li>';
          html += '<a href="' + params.index[key].baseUrl + fileName + '">';
          html += fileName;
          html += '</a>';
          html += '</li>';
        }

        html += '</ul>';
        html += '</div>';
      }
    }

    html += '<body>';
    html += '<html>';

    fs.writeFileSync(params.tasksPath.destination['file-index'] + 'index.html', html);

  };

};