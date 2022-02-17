const projectFolder = "dist";
const sourceFolder = "src";

const path = {
	build: {
		html: projectFolder + "/",
		css: projectFolder + "/css/",
		js: projectFolder + "/js/",
		images: projectFolder + "/img/",
		imagesWEBP: projectFolder + "/img/",
		fonts: projectFolder + "/fonts/",
	},
	src: {
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
		css: sourceFolder + "/scss/style.scss",
		js: sourceFolder + "/js/*.js",
		images: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		imagesWEBP: sourceFolder + "/img/**/*.{jpg,png}",
		fonts: sourceFolder + "/fonts/*",
	},
	watch: {
		html: sourceFolder + "/**/*.html",
		css: sourceFolder + "/scss/**/*.scss",
		js: sourceFolder + "/js/**/*.js",
		images: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		imagesWEBP: sourceFolder + "/img/**/*.{jpg,png}",
		fonts: sourceFolder + "/fonts/*",
	},
	clean: "./" + projectFolder + "/",
};

const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webpack = require("webpack-stream");
const webp = require("imagemin-webp");

function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + projectFolder + "/",
		},
		port: 3000,
		notify: false,
	});
}

function clean() {
	return del(path.clean);
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			})
		)
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(cleanCss())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
}

function imgWEBP() {
	return src(path.src.imagesWEBP)
	.pipe(
		imagemin([
			webp({
				quality: 75,
			}),
		])
	)
	.pipe(
		rename({
			extname: ".webp",
		})
	)
	.pipe(dest(path.build.imagesWEBP))
	.pipe(browsersync.stream());
}

function images() {
	return src(path.src.images)
		.pipe(
			imagemin({
				progressiv: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(dest(path.build.images))
		.pipe(browsersync.stream());
}

function devJs() {
	return src(path.src.js)
		.pipe(
			webpack({
				mode: "development",
				output: {
					filename: "main.js",
				},
				watch: true,
				devtool: "source-map",
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: "babel-loader",
								options: {
									presets: [
										[
											"@babel/preset-env",
											{
												debug: true,
												corejs: 3,
												useBuiltIns: "usage",
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function prodJs() {
	return src(path.src.js)
		.pipe(
			webpack({
				mode: "production",
				output: {
					filename: "main.js",
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							exclude: /(node_modules|bower_components)/,
							use: {
								loader: "babel-loader",
								options: {
									presets: [
										[
											"@babel/preset-env",
											{
												corejs: 3,
												useBuiltIns: "usage",
											},
										],
									],
								},
							},
						},
					],
				},
			})
		)
		.pipe(dest(path.build.js));
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.fonts], fonts);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.imagesWEBP], imgWEBP);
	gulp.watch([path.watch.js], devJs);
}

const dev = gulp.series(clean, gulp.parallel(html, css, images, imgWEBP, fonts, devJs));
const prod = gulp.series(clean, gulp.parallel(html, css, images, imgWEBP, fonts, prodJs));

const watch = gulp.parallel(dev, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.fonts = fonts;
exports.images = images;
exports.imgWEBP = imgWEBP;
exports.devJs = devJs;
exports.prodJs = prodJs;
exports.dev = dev;
exports.prod = prod;
exports.watch = watch;
