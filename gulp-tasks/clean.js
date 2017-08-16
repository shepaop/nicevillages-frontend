module.exports = function (gulp, plugins, params, path) {

  return function () {

    var fs = require('fs');

    for (var i = 0; i < Object.keys(params.clean).length; i++) {
      var key = Object.keys(params.clean)[i];
      var result = plugins.globule.find(params.clean[key].files, {srcBase: params.clean[key].source});

      if (result.length) {

        for (var j = 0; j < result.length; j++) {
          var fileName = params.clean[key].source + result[j];
          fs.unlinkSync(fileName);
        }
      }
    }

  };

};