var through = require("through");

var logify = function (filename, options)  {
  var data = "";
  var path = filename.split("/").reverse()[0];
  var re = /([\w_\.]*[lL]ogger).(info|log|warn|error)\((.*)\)/g;

  var write = function (buffer) {
    data += buffer;
  }

  var end = function () {
    var lines = data.split(/\n/).slice(1);
    var nums = [];
    var i = 0;

    lines.forEach(function (line, idx) {
      if (line.match(re)) {
        nums.push(idx + 2);
      }
    });

    var out = data.replace(re, function (match, obj, method, args) {
      return obj + "." + method + ".apply(" + obj + ", " + obj + ".proxy('"
        + method + "','" + path + "'," + nums[i++] + "," + args + "))";
    });

    this.queue(out);
    this.queue(null);
  }

  return through(write, end);
}

module.exports = logify;