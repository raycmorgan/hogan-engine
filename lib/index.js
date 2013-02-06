var Hogan = require('hogan.js')
  , fs = require('fs')
  , pathjoin = require('path').join;


var cache = {};

module.exports = function render(path, options, callback) {
  var compiled;

  if (!(options.settings && options.settings.views) && module.exports.root) {
    path = pathjoin(module.exports.root, path);
  }

  if ((options.cache || module.exports.cache) && cache[path]) {
    compiled = cache[path];
  } else {
    try {
      var template = fs.readFileSync(path, 'utf8');
      
      compiled = Hogan.compile(template);
      compiled.partials = {};
      compilePartials(partialNames(template), options, compiled.partials);

      cache[path] = compiled;
    } catch (e) {
      return callback(e);
    }
  }

  callback(null, compiled.render(options, compiled.partials));
}


function compilePartials(names, options, compiled) {
  names.forEach(function (name) {
    if (!compiled[name]) {
      var root = ((options.settings && options.settings.views) || module.exports.root)
        , path = pathjoin(root, name);

      try {
        var template = fs.readFileSync(path, 'utf8');
      } catch (e) {
        e.message = 'Failed to load hogan partial with path: ' + path;
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
