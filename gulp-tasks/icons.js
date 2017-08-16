var Datauri = require('datauri');

module.exports = function(gulp, plugins, params, path){

    return function() {

        gulp.src(
            params.tasksPath.source.icons+'*.svg'
        )
            .pipe(
                plugins.imagemin({
                    //svgoPlugins: [
                    //    {removeViewBox: false}
                    //]
                })
            )
            .pipe(
                plugins.svgSymbols({
                    templates: [
                        path.join(params.absolutePath, params.tasksPath.source.icons, '_icons.scss')
                    ],
                    transformData: function(svg, defaultData) {

                        var family = defaultData.id.split('_')[0];
                        var suffix = defaultData.id.split('_')[1];

                        var dUri = new Datauri();

                        var svgFinal = '<svg xmlns="http://www.w3.org/2000/svg" width="'+svg.width+'" height="'+svg.height+'" viewBox="0 0 '+svg.width+' '+svg.height+'">';
                        svgFinal += svg.content;
                        svgFinal += '</svg>';

                        dUri.format('.svg', svgFinal);

                        return {
                            path:       '../bin/icons/',
                            family:     family,
                            suffix:     suffix,
                            datauri:    dUri.content,
                            id:         defaultData.id,
                            name:       svg.name,
                            width:      svg.width,
                            height:     svg.height
                        };
                    }
                })
            )
            .pipe(
                gulp.dest(
                    params.tasksPath.destination.iconsScss
                )
            );

    };

};
