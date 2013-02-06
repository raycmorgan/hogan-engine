var Hogan = require('hogan.js')
  , fs = require('fs');


var cache = {};

module.exports = function render(path, options, callback) {
  var compiled;

  if (options.cache && cache[path]) {
    compiled = cache[path];
  } else {
    var template = fs.readFileSync(path, 'utf8');
    
    compiled = Hogan.compile(template);
    compiled.partials = {};
    compilePartials(partialNames(template), options, compiled.partials);

    cache[path] = compiled;
  }

  callback(null, compiled.render(options, compiled.partials));
}


function compilePartials(names, options, compiled) {
  names.forEach(function (name) {
    if (!compiled[name]) {
      var path = options.settings.views + '/' + name;

      try {
        var template = fs.readFileSync(path, 'utf8');
      } catch (e) {
        e.message = 'Failed to load hogan partail with path: ' + path;
        throw e;
      }

      compiled[name] = Hogan.compile(template);
      compilePartials(partialNames(template), options, compiled);
    }
  });
}


function partialNames(template) {
  return Hogan.scan(template).filter(function (i) {
    return i.tag == '>' || i.tag == '<';
  }).map(function (i) {
    return i.n;
  });
}
