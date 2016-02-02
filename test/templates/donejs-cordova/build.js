// generator-donejs + donejs-cordova build.js
var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: true
});

// options added by `donejs add cordova` - START
// previous cordova options - START
var cordovaOptions = {
  buildDir: "./build/cordova",
  id: "com.bar.foo.existing",
  name: "Existing Foo",
  platforms: ["ios"],
  plugins: ["cordova-plugin-transport-security"],
  index: __dirname + "/production.html",
  glob: [
    "node_modules/steal/steal.production.js"
  ]
};

var stealCordova = require("steal-cordova")(cordovaOptions);
// Check if the cordova option is passed.
var buildCordova = process.argv.indexOf("cordova") > 0;

if(buildCordova) {
  buildPromise.then(stealCordova.build).then(stealCordova.ios.emulate);
}
// previous cordova options - END
// options added by `donejs add cordova` - END
