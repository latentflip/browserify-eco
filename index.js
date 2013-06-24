var through = require('through');
var eco = require('eco')

function isEco(file) {
  return /\.eco$/.test(file)
}

function compile(file, data, debug) {
  data = "<% window && window.templateLog && window.templateLog('"+file+"') %>" + data;
  return "module.exports = " + eco.precompile(data);
}

var ecoify = function(file) {
  if (!isEco(file)) return through();

  var data = '';
  return through(write, end);

  function write(buf) { data += buf }
  function end () {
    var src;
    try {
      src = compile(file, data, ecoify.debug);
    } catch (error) {
      this.emit('error', error);
    }
    this.queue(src);
    this.queue(null);
  }
}

ecoify.debug = true

module.exports = ecoify
