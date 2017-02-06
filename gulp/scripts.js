var gulp = require("gulp")

gulp.task("js", function () {
  return gulp.src(["public/js/**/*.js"])
})

gulp.task("watch:js", ["js"], function () {
  gulp.watch("public/js/**/*.js", ["js"])
})
