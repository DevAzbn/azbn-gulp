var gulp = require('gulp'),
	
	argv = require('optimist').argv,
	/*
	argv.project --project
	argv.port --port
	*/
	
	autoprefixer = require('gulp-autoprefixer'),		// префиксы для css
	browserSync = require('browser-sync').create(),		// перезагрузка браузера
		reload = browserSync.reload,
	concat = require('gulp-concat'),					// склейка файлов
	less = require('gulp-less'),						// LESS
	//minifyCss = require('gulp-minify-css'),
	cleanCSS = require('gulp-clean-css'),				// минификация css
	//myth = require('gulp-myth'),						// префиксы для css - по умолчанию не установлен
	inlineCss = require('gulp-inline-css'),				// установка инлайновых стилей для верстки писем
	rename = require('gulp-rename'),					// переименование файлов
	uglify = require('gulp-uglify'),					// сжатие js
	watch = require('gulp-watch'),						// наблюдение за изменением файловой системы
	//imagemin = require('gulp-imagemin'),				// сжатие изображений
	cache = require('gulp-cache'),						// кеширование
	plumber = require('gulp-plumber'),					// отлов ошибок
	pagebuilder2 = require('gulp-pagebuilder2');			// умный инклуд html с поддержкой вложенности и передачей параметров

var root = 'projects/' + (argv.project || 'test'),
	src = root + '/' + 'src',
	fish = require('./' + root + '/json/content/fish.json');

var path = {
	build : {
		root : root,
		html : root,
		css : root + '/css',
		js : root + '/js',
		img : root + '/img',
	},
	src : {
		root : src,
		html : src + '/html',
		css : src + '/css',
		js : src + '/js',
		img : src + '/img',
		_ : src + '/_',
	},
	block : {
		root : root + '/src/block',
	}
};


gulp.task('default',
[
	'server',
	'dev',
]);
gulp.task('dev',
[
	'dev:html',
	'dev:plugin:js',
	'dev:body.on:js',
	'dev:document-ready:js',
	'dev:window-resize:js',
	'dev:window-scroll:js',
	'dev:body.changeClass:js',
	'dev:changeClass:js',
	'dev:js',
	'dev:block:less',
	'dev:css',
	'dev:email',
	//'dev:img',
]);

gulp.task('server', function(){
	browserSync.init({
		server : path.build.root,
		port : parseInt(argv.port) || 10080,
		ui : {
			port : parseInt(argv.port) + 1 || 10081,
		}
	});
	
	
	gulp.watch(path.block.root + '/**/.html', ['dev:html']);
	gulp.watch(path.block.root + '/**/*.html', ['dev:html']);
	gulp.watch(path.src.html + '/**/*.html', ['dev:html']);
	gulp.watch(path.src.html + '/**/*.email.html', ['dev:email']);
	
	gulp.watch(path.block.root + '/**/.plugin.js', ['dev:plugin:js']);
	gulp.watch(path.block.root + '/**/body.on.js', ['dev:body.on:js']);
	gulp.watch(path.block.root + '/**/.document-ready.js', ['dev:document-ready:js']);
	gulp.watch(path.block.root + '/**/.window-resize.js', ['dev:window-resize:js']);
	gulp.watch(path.block.root + '/**/.window-scroll.js', ['dev:window-scroll:js']);
	gulp.watch(path.block.root + '/**/body.changeClass.js', ['dev:body.changeClass:js']);
	gulp.watch(path.block.root + '/**/.changeClass.js', ['dev:changeClass:js']);
	
	gulp.watch(path.src._ + '/concat.plugin.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.body.on.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.document-ready.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.window-resize.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.window-scroll.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.body.changeClass.js', ['dev:js']);
	gulp.watch(path.src._ + '/concat.changeClass.js', ['dev:js']);
	gulp.watch(path.src.js + '/**/*.js', ['dev:js']);
	
	
	gulp.watch(path.build.css + '/**/*.less', ['dev:css','dev:email']);
	gulp.watch(path.block.root + '/**/.less', ['dev:block:less']);
	
	
	//gulp.watch(path.src.img + '/**/*', ['dev:img']);
	
	
});




gulp.task('dev:html', function(){
	return gulp.src(path.src.html + '/**/*.html')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream : true,}))
	;
});



gulp.task('dev:js', function(){
	return gulp.src(path.src.js + '/**/*.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		//.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream : true,}))
	;
});

gulp.task('dev:plugin:js', function(){
	return gulp.src(path.block.root + '/**/.plugin.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.plugin.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:body.on:js', function(){
	return gulp.src(path.block.root + '/**/body.on.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.body.on.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:document-ready:js', function(){
	return gulp.src(path.block.root + '/**/.document-ready.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.document-ready.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:window-resize:js', function(){
	return gulp.src(path.block.root + '/**/.window-resize.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.window-resize.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:window-scroll:js', function(){
	return gulp.src(path.block.root + '/**/.window-scroll.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.window-scroll.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:body.changeClass:js', function(){
	return gulp.src(path.block.root + '/**/body.changeClass.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.body.changeClass.js'))
		.pipe(gulp.dest(path.src._))
	;
});

gulp.task('dev:changeClass:js', function(){
	return gulp.src(path.block.root + '/**/.changeClass.js')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(uglify())
		.pipe(concat('concat.changeClass.js'))
		.pipe(gulp.dest(path.src._))
	;
});



gulp.task('dev:css', function(){
	return gulp.src(path.build.css + '/*.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['> 2% in RU', 'last 4 version', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],	//last 2 versions '> 0%'
			cascade: true,
		}))
		.pipe(cleanCSS())
		//.pipe(minifyCss())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream : true,}))
	;
});

gulp.task('dev:block:less', function(){
	return gulp.src(path.block.root + '/**/.less')
		.pipe(plumber())
		//.pipe(pagebuilder2(path.build.root, fish))
		.pipe(concat('gulp-block.less'))
		.pipe(gulp.dest(path.build.css + '/site'))
		//.pipe(reload({stream : true,}))
	;
});

gulp.task('dev:email', function(){
	return gulp.src(path.src.html + '/**/*.email.html')
		.pipe(plumber())
		.pipe(pagebuilder2(path.build.root, fish))
		.pipe(inlineCss({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true,
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream : true,}))
	;
});

//
//gulp.task('dev:img', function() {
//	return gulp.src(path.src.img + '/**/*')
//		.pipe(plumber())
//		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))) //cache
//		.pipe(gulp.dest(path.build.img))
//	;
//});
//