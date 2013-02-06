# Hogan.js engine for Express 3.x

## Installation

    npm install hogan-engine

## Setup

Where `app` is your express app instance.

    // Add the engine
    app.engine('html', require('hogan-engine'));

    // Then just do the normal view setup
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');

That's it.

## Usage

After installing the engine, you can use it as you would any other express
templating engine.

    res.render('index', { title: 'Hello World' });


And have the template views/index.html

    {{> header.html}}

    <h1>{{ title }}</h1>

    {{> footer.html}}

Notice we included a couple partials. You don't have to do anything more then
have them in the views directory for them to be loaded and rendered. Easy.


## Usage outside of Express's render function

    var hogan = require('hogan-engine');

    // Set the root of the template directory
    hogan.root = __dirname + '/views';

    // Set cache to true to cache the templates, do this in production please
    hogan.cache = true;

    hogan('index.html', { title: 'Hello World' }, function (err, text) {
      // ...
    });
