// Require Path
var path = require('path');
// Require Gulp
var gulp = require('gulp');

// Include all plugins dependencies from package.json
var plugins = require('gulp-load-plugins')({
  replaceString: /^gulp(-|\.)/,
  scope: ['dependencies'],
  lazy: false
});

// Specifics includes
plugins.sc5styleguide = require('sc5-styleguide');
plugins.runSequence = require('run-sequence').use(gulp);
plugins.stylelint = require('gulp-stylelint');
plugins.globule = require('globule');

// Variables
var gulpTasks = "./gulp-tasks/";


// ---------------------------------
// Paramètres du FRAMEWORK
// ---------------------------------

var params = require(path.join(__dirname, 'params.json'));
params.absolutePath = __dirname;


// ---------------------------------
// Tâche configurées
// ---------------------------------

// Parametered Modernizr build
gulp.task('modernizr', require(gulpTasks + 'modernizr')(gulp, plugins, params));

// Favicon collection generation
gulp.task('favicon', require(gulpTasks + 'favicon')(gulp, plugins, params));

// Génération des fichiers HTML et de l'index
gulp.task('files:build', require(gulpTasks + 'files')(gulp, plugins, params));
gulp.task('mails:build', require(gulpTasks + 'mjml')(gulp, plugins, params));
gulp.task('index', require(gulpTasks + 'index')(gulp, plugins, params, path));
gulp.task('files', function (callback) {
  plugins.runSequence(['files:build', 'mails:build'], 'index', callback);
});

// SASS Compilation
gulp.task('sass:compile', require(gulpTasks + 'sass-compile')(gulp, plugins, params));
gulp.task('css:clean', require(gulpTasks + 'css-clean')(gulp, plugins, params));
gulp.task('sass', function (callback) {
  plugins.runSequence('sass:compile', 'css:clean', callback);
});

// Documentation JS
gulp.task('jsdoc', require(gulpTasks + 'jsdoc3')(gulp, plugins, params, path));

// JS concatenation and minification
gulp.task('eslint', require(gulpTasks + 'eslint')(gulp, plugins, params));

// JS concatenation and minification
gulp.task('js', require(gulpTasks + 'scripts')(gulp, plugins, params));

// js + jsdoc
gulp.task('scripts', function (callback) {
  plugins.runSequence('eslint', 'js', 'jsdoc', callback);
});

// Styleguide generation
gulp.task('styleguide:generate', require(gulpTasks + 'styleguide-generate')(gulp, plugins, params));
gulp.task('styleguide:applystyles', require(gulpTasks + 'styleguide-applystyles')(gulp, plugins, params));
gulp.task('styleguide:copyassets', require(gulpTasks + 'styleguide-copyassets')(gulp, plugins, params));
gulp.task('styleguide', function (callback) {
  plugins.runSequence(['sass', 'scripts'], 'styleguide:copyassets', ['styleguide:applystyles', 'styleguide:generate'], ['copy'], callback);
});
gulp.task('styleguide:sass', function (callback) {
  plugins.runSequence(['sass'], 'styleguide:copyassets', ['styleguide:applystyles', 'styleguide:generate'], callback);
});
gulp.task('styleguide:scripts', function (callback) {
  plugins.runSequence(['scripts'], 'styleguide:copyassets', ['styleguide:applystyles', 'styleguide:generate'], callback);
});

// Delete selected files
gulp.task('clean', require(gulpTasks + 'clean')(gulp, plugins, params, path));

// Generate icons
gulp.task('icons', require(gulpTasks + 'icons')(gulp, plugins, params, path));

// Generate icons
gulp.task('font64', require(gulpTasks + 'font64')(gulp, plugins, params, path));

// Minify images
gulp.task('images', require(gulpTasks + 'images')(gulp, plugins, params, path));

// Copy to theme
gulp.task('copy', require(gulpTasks + 'copy')(gulp, plugins, params, path));

// Endless watch
gulp.task('watch', require(gulpTasks + 'watch')(gulp, plugins, params));

// Fullmonty: Compilation globale
gulp.task('fullmonty', function (callback) {
  plugins.runSequence(['modernizr', 'favicon', 'images'], ['sass', 'scripts'], 'styleguide:copyassets', ['styleguide:applystyles', 'styleguide:generate'], ['files'], ['copy'], callback);
});

// Deployment task
gulp.task('deployment', function (callback) {
  plugins.runSequence(['sass', 'scripts'], ['copy'], callback);
});