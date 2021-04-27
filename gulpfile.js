`use-strict`;

const
dirs = {
	src: `./src`,
	dist: `./dist`,
	media: `./media`,
	npm: `./node_modules`
},
pkgs = {
	babel: require(`gulp-babel`),
	concat: require(`gulp-concat`),
	del: require(`del`),
	fs: require(`fs`),
	gulp: require(`gulp`),
	path: require(`path`),
	rename: require(`gulp-rename`),
	sass: require(`gulp-sass`)
};

pkgs.gulp.task(
	`clean`,
	callback => {
		let deletedPaths = pkgs.del.sync( pkgs.path.join(dirs.dist, `/*`) );

		if(deletedPaths.length > 0)
			console.log(
				`Deleted the following files and directories:\n`,
				deletedPaths.join(`\n`)
			);

		callback();
	}
);

pkgs.gulp.task(
	`copy:src`,
	() => pkgs.gulp
		.src(
			[
				pkgs.path.join(dirs.src, `**/*.html`)
			],
			{ base: dirs.src }
		)
		.pipe(
			pkgs.gulp.dest( dirs.dist )
		)
);

pkgs.gulp.task(
	`copy:media`,
	() => pkgs.gulp
		.src( pkgs.path.join(dirs.media, `**/*`) )
		.pipe( pkgs.gulp.dest(dirs.dist) )
);

pkgs.gulp.task(
	`js`,
	() => pkgs.gulp
		.src(
			[
				pkgs.path.join(dirs.src, `js/**/*.js`),
			]
		)
		.pipe( pkgs.concat(`main.js`) )
		.pipe( pkgs.babel() )
		.pipe( pkgs.gulp
			.dest( pkgs.path.join(dirs.dist, `js`) )
		)
);

pkgs.gulp.task(
	`sass`,
	() => pkgs.gulp
		.src(
			pkgs.path.join(dirs.src, `sass/main.scss`),
			{ base: pkgs.path.join(dirs.src, `sass`) }
		)
		.pipe(pkgs.sass(
			{ outputStyle: 'compressed' }
		))
		.pipe( pkgs.rename(`style.css`) )
		.pipe(
			pkgs.gulp
				.dest( pkgs.path.join(dirs.dist, `css`) )
		)
);

pkgs.gulp.task(
	`build`,
	pkgs.gulp
		.series(
			`clean`,
			`copy:src`,
			`js`,
			`sass`,
			`copy:media`
		)
);


pkgs.gulp.task(
	`default`,
	pkgs.gulp.series(`build`)
);


let globsToWatch = [
	dirs.src + `**/*`,
	`README.md`
];
pkgs.gulp.task(
	`watch`,
	() => pkgs.gulp.watch(
		globsToWatch,
		(callback) => {
			console.clear();
			pkgs.gulp.series(
				`build`,
				() => console.log(`Watching changes in ${globsToWatch.join(', ')}...`)
			)();
			callback();
		}
	)
);
