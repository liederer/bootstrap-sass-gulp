var	gulp 	= require('gulp'),
	sass 	= require('gulp-sass'),
	htmlmin = require('gulp-htmlmin'),
	uglify 	= require('gulp-uglify'),
	concat 	= require('gulp-concat'),
	clean 	= require('gulp-clean'),
	imgmin 	= require('gulp-imagemin'),
	cache 	= require('gulp-cache'),
	useref 	= require('gulp-useref'),
	gulpif 	= require('gulp-if'),
	react	= require('gulp-react');

var config = {
	srcPath: './src',
	imgPath: './src/img',
	nodeDir: './node_modules',
	destDir: './dist'
}

gulp.task('clean', function () {
	return gulp.src(config.destDir, { read: false })
	.pipe(clean())
});

gulp.task('compile', function () {
	return gulp.src(config.srcPath + '/*.html')
	.pipe(useref())
	.pipe(gulpif('*.js', react()))
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css',
		sass({
			outputStyle: 'compressed',
			includePaths: [
				config.nodeDir + '/bootstrap-sass/assets/stylesheets',
				config.nodeDir + '/font-awesome/scss'
			]
		})/*,
		htmlmin({collapseWhitespace: true}) */
	))

	.pipe(gulp.dest(config.destDir))

});

gulp.task('images', function() {
	return gulp.src(config.imgPath + '/**/*')
	.pipe(cache(imgmin({ optimizationLevel: 5, progressive: true, interlaced: true, multipass: true })))
	.pipe(gulp.dest(config.destDir + '/img'))
});

gulp.task('copy-txt-files', function() {
	return gulp.src(config.srcPath + '/*.txt')
	.pipe(gulp.dest(config.destDir))
});

gulp.task('copy-bs-fonts', function(){
	return gulp.src(config.nodeDir + '/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}')
	.pipe(gulp.dest(config.destDir + '/fonts/bootstrap'));
});

gulp.task('default', ['clean'], function() {
	gulp.start('compile', 'images', 'copy-txt-files', 'copy-bs-fonts')
});
