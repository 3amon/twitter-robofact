var fs = require('fs');
var Twitter = require('twitter');

var filepath = __dirname + "/fake_wikipedia.txt";

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'XXX',
  consumer_secret: 'XXX',
  access_token_key: 'XXX',
  access_token_secret: 'XXX'
});


String.prototype.replace_all = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

function get_line(filename, line_no, callback) {
    fs.readFile(filename, function (err, data) {
      if (err) throw err;

      // Data is a buffer that we need to convert to a string
      // Improvement: loop over the buffer and stop when the line is reached
      var lines = data.toString('utf-8').split("\n");

      if(+line_no > lines.length){
        return callback('File end reached without finding line', null);
      }

      callback(null, lines[+line_no]);
    });
}

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function count_lines(filename, callback)
{
  var i;
  var count = 0;
  fs.createReadStream(filename)
    .on('data', function(chunk) {
      for (i=0; i < chunk.length; ++i)
        if (chunk[i] == 10) count++;
    })
    .on('end', function() {
      callback(count);
    });
}

count_lines(filepath, function(lines)
  {
    var x = get_random_int(0, lines);
    get_line(filepath, x, function(err, line)
    {
      line = line.replace_all('*', '');
      line = line.replace_all('_', '');
      client.post('statuses/update', {status: line},  function(error, tweet, response){
        if(error) throw error;
          console.log(tweet);  // Tweet body. 
          console.log(response);  // Raw response object. 
      });
    })
  });


