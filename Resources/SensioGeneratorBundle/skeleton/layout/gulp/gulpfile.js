'use strict';

/* ==========================================================================
   Gulpfile

   Development-tasks:
   - gulp (build + watch)
   - gulp build
   - gulp watch
   ========================================================================== */


/* Setup Gulp
   ========================================================================== */
// Require Gulp
var gulp = require('gulp');

// Load Gulp plugins
var plugins = require('gulp-load-plugins')();



/* Config
   ========================================================================== */
var resourcesPath = './src/{{ bundle.namespace|replace({'\\':'/'}) }}/Resources';
var distPath = './web/frontend';
var bowerComponentsPath = './bower_components';
var {{ bundle.getName() }} = {
    dist: {
        css: distPath + '/css',
        js: distPath + '/js',
        img: distPath + '/img',
        fonts: distPath + '/fonts'
    },

    styleguide: resourcesPath + '/ui/styleguide',

    img: resourcesPath + '/ui/img/**/*.{png,jpg,jpeg,gif,svg,webp}',
    twig: resourcesPath + '/views/**/*.html.twig',
    scss: resourcesPath + '/ui/scss/**/*.scss',
    js: {
        modernizr: {
            tempFolder: './.temp/modernizr',
            tempFile: './.temp/modernizr/modernizr.js'
        },
        app: resourcesPath + '/ui/js/**/*.js',
        all: [
            './.temp/modernizr/modernizr.js',
            bowerComponentsPath + '/jquery/dist/jquery.js',
            bowerComponentsPath + '/velocity/jquery.velocity.min.js',
            bowerComponentsPath + '/fancybox/source/jquery.fancybox.js',
            bowerComponentsPath + '/fancybox/source/helpers/jquery.fancybox-media.js',
            bowerComponentsPath + '/masonry/dist/masonry.pkgd.js',
            bowerComponentsPath + '/cupcake/js/scrollToTop/jquery.scrollToTop.js',
            resourcesPath + '/ui/js/**/*.js',
        ]
    },

    copy: {
        fonts: resourcesPath + '/ui/fonts/**/*.{eot,woff,ttf,svg}',
        js: [
            bowerComponentsPath + '/svgeezy/svgeezy.min.js',
            bowerComponentsPath + '/jquery-placeholder/jquery.placeholder.js',
        ]
    },

    liveReloadFiles: [
        distPath + '/css/style.css',
        distPath + '/js/footer.min.js'
    ]
};



/* Tasks
   ========================================================================== */
// Styles
gulp.task('styles', function() {
    return gulp.src({{ bundle.getName() }}.scss)
        // Scss -> Css
        .pipe(plugins.rubySass({
            loadPath: '.',
            bundleExec: true
        }))

        // Combine Media Queries
        .pipe(plugins.combineMediaQueries())

        // Prefix where needed
        .pipe(plugins.autoprefixer('last 1 version'))

        // Minify output
        .pipe(plugins.minifyCss())

        // Set destination
        .pipe(gulp.dest({{ bundle.getName() }}.dist.css))

        // Show total size of css
        .pipe(plugins.size({
            title: 'css'
        }));
});


// Modernizr
gulp.task('modernizr', function () {
    return gulp.src([{{ bundle.getName() }}.js.app, {{ bundle.getName() }}.scss, {{ bundle.getName() }}.twig])
        // Run modernizr check  >!! "Npm module not found" errors relate to https://github.com/doctyper/gulp-modernizr/issues/3 but have no impact on build !!<
        .pipe(plugins.modernizr({
            options : [
                'setClasses',
                'fnBind',
                'mq'
            ]
        }))

        // Set destination
        .pipe(gulp.dest({{ bundle.getName() }}.js.modernizr.tempFolder))
});


// Jshint
gulp.task('jshint', function () {
    return gulp.src({{ bundle.getName() }}.js.app)
        // Jshint
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});


// Scripts
gulp.task('scripts', ['modernizr', 'jshint'], function () {
    return gulp.src({{ bundle.getName() }}.js.all)
        // Uglify
        .pipe(plugins.uglify({
            mangle: {
                except: ['jQuery']
            }
        }))

        //Concat
        .pipe(plugins.concat('footer.min.js'))

        // Set desitination
        .pipe(gulp.dest({{ bundle.getName() }}.dist.js))

        // Show total size of js
        .pipe(plugins.size({
            title: 'js'
        }));
});


// Images
var imageminSvgo = require('imagemin-svgo');

gulp.task('images', function () {
    return gulp.src({{ bundle.getName() }}.img)
        // Only optimize changed images
        .pipe(plugins.changed({{ bundle.getName() }}.dist.img))

        // Imagemin
        .pipe(plugins.imagemin({
            optimizationLevel: 3,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
            use: [imageminSvgo()]
        }))

        // Set desitination
        .pipe(gulp.dest({{ bundle.getName() }}.dist.img))

        // Show total size of images
        .pipe(plugins.size({
            title: 'images'
        }));
});


// Copy
gulp.task('copy', ['copyJs', 'copyFonts']);

gulp.task('copyJs', function () {
    return gulp.src({{ bundle.getName() }}.copy.js)
        .pipe(gulp.dest({{ bundle.getName() }}.dist.js))
});

gulp.task('copyFonts', function () {
    return gulp.src({{ bundle.getName() }}.copy.fonts)
        .pipe(gulp.dest({{ bundle.getName() }}.dist.fonts))
});


// Styleguide -> Change it by https://github.com/rejahrehim/gulp-hologram when it supports bundler
gulp.task('styleguide', function () {
    return gulp.src({{ bundle.getName() }}.styleguide, {read: false})
        .pipe(plugins.shell([
            'bundle exec hologram',
        ], {
            cwd: {{ bundle.getName() }}.styleguide
        }));
});


// Watch
gulp.task('watch', function () {
    // Livereload
    plugins.livereload.listen();
    gulp.watch({{ bundle.getName() }}.liveReloadFiles).on('change', plugins.livereload.changed);

    // Styles
    gulp.watch({{ bundle.getName() }}.scss, ['styles']);

    // Scripts
    gulp.watch({{ bundle.getName() }}.js.app, ['scripts']);

    // Images
    gulp.watch({{ bundle.getName() }}.img, ['images']);
});


// Build
gulp.task('build', ['styles', 'scripts', 'images', 'copy'], function() {
    gulp.start('styleguide');
});


// Default
gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
