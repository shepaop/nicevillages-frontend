module.exports = function(gulp, plugins, params){

    return function(){

        // SASS Compile
        return gulp.src(params.tasksPath.source.images+'**/*')
            .pipe(
                plugins.imagemin({
                    progressive: true,
                    svgoPlugins: [{
                        removeViewBox: false
                    }]
                })
            )
            .pipe(
                gulp.dest(params.tasksPath.destination.images)
            );

    };

};
