module.exports = function(gulp, plugins, params){
    
    return function(){

        gulp.src(params.tasksPath.source.favicon)
            .pipe(
                plugins.favicons({
                    appName: null,                  // Your application's name. `string`
                    appDescription: null,           // Your application's description. `string`
                    developerName: null,            // Your (or your developer's) name. `string`
                    developerURL: null,             // Your (or your developer's) URL. `string`
                    background: params.favicon.background,             // Background colour for flattened icons. `string`
                    theme_color: params.favicon.theme,            // Theme color for browser chrome. `string`
                    path: params.favicon.relativePath,                      // Path for overriding default icons path. `string`
                    display: "standalone",          // Android display: "browser" or "standalone". `string`
                    orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
                    start_url: "/?homescreen=1",    // Android start application's URL. `string`
                    version: "1.0",                 // Your application's version number. `number`
                    logging: false,                 // Print logs to console? `boolean`
                    online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
                    preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
                    icons: {
                      // Platform Options:
                      // - offset - offset in percentage
                      // - shadow - drop shadow for Android icons, available online only
                      // - background:
                      //   * false - use default
                      //   * true - force use default, e.g. set background for Android icons
                      //   * color - set background for the specified icons
                      //
                      android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
                      appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background }`
                      appleStartup: false,         // Create Apple startup images. `boolean` or `{ offset, background }`
                      coast: false,      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset, background }`
                      favicons: true,             // Create regular favicons. `boolean`
                      firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset, background }`
                      windows: true,              // Create Windows 8 tile icons. `boolean` or `{ background }`
                      yandex: false                // Create Yandex browser icon. `boolean` or `{ background }`
                    }
                  })
            )
            .pipe(
                gulp.dest(params.tasksPath.destination.favicon)
            );

    };

};
