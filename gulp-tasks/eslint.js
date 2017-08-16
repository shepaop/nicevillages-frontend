module.exports = function(gulp, plugins, params){
    
    return function(){

        // JS hint
        gulp.src([
                params.tasksPath.source.themeComponents+'**/*.js',
                params.tasksPath.source.scripts+'**/*.js'
            ])
            .pipe(
                plugins.eslint()
            )
            .pipe(
                plugins.eslint.format()
            )
            .pipe(
                plugins.eslint.failAfterError()
            );

    };

};
