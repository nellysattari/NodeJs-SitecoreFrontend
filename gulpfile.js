/*jslint node: true, for */

'use strict';

let gulp = require(`gulp`);
let exec = require('child_process').exec;
const runSequence = require('run-sequence').use(gulp);

gulp.task('Serve-the-site', (callback) => {
  exec('npm run serve', (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) {
      console.log(stderr);
    }
    callback(err);
  });
});

gulp.task('Compile-Challenger-Sass-Resources', (callback) => {
    exec('npm run sassChallenger', (err, stdout, stderr) => {
      console.log(stdout);
      if (stderr) {
        console.log(stderr);
      }
      callback(err);
    });
  });
  

  
gulp.task('default', (callback) => {
  return runSequence(
        'Serve-the-site',
        'Compile-Challenger-Sass-Resources',
     
        callback);
  });
  