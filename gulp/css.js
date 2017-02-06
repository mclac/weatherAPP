var gulp = require("gulp")
var stylus = require("gulp-stylus")

gulp.task("css", function () {
  return gulp.src("public/css/app.styl")
    .pipe(stylus())
    .pipe(gulp.dest("public/css"))
})

gulp.task("watch:css", ["css"], function () {
  gulp.watch("public/css/**/*.styl", ["css"])
})
