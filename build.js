const browserify = require('browserify');
const fs = require('fs');
const uglify = require('uglify-js');

const bundle = browserify({ standalone: 'EasyMediasoup', debug: false });
bundle.add('./es5-bundle/index');
bundle.bundle(function (err, source) {
  if (err) {
    console.error(err);
  }
  fs.writeFileSync('dist/easy-mediasoup.bundle.js', source)

});

function minimize(){
  //get a reference to the minified version of file-1.js
  var result = uglify.minify(["dist/easy-mediasoup.bundle.js"]);


  fs.writeFile("dist/easy-mediasoup.bundle.min.js", result.code, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("File was successfully saved.");
      }
  });

  //https://skalman.github.io/UglifyJS-online/
}
