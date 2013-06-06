var through = require('through');
var eco = require('eco')

function isEco(file) {
  return /\.eco$/.test(file)
}

function compile(file, data) {
  return "module.exports = " + eco.precompile(data);
}

module.exports = function(file) {
  if (!isEco(file)) return through();

  var data = '';
  return through(write, end);

  function write(buf) { data += buf }
  function end () {
    var src;
    try {
      src = compile(file, data);
    } catch (error) {
      this.emit('error', error);
    }
    this.queue(src);
    this.queue(null);
  }
}
