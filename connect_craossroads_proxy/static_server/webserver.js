var http = require('http'),
  path = require('path'),
  fs = require('fs'),
  mime = require('mime'),
  base = '/Users/draconian/Development/Node/node_study/static_server/public';

http.createServer((req, res) => {
  pathname = __dirname + req.url; // __dirname == webserver.js 가 위치한 디렉토리;
  console.log(pathname);

  fs.stat(pathname, (err, stats) => {
    if (err) {
      rew.writeHead(404);
      res.write('Bad request 404\n');
      res.end()
    } else if (stats.isFile()) {
      // check content type
      var type = mime.lookup(pathname);
      console.log(type);
      res.setHeader('Content-Type', type);
      res.statusCode = 200;
      var file = fs.createReadStream(pathname);
      file.on('open', () => {
        file.pipe(res);
      });
      file.on('error', (err) => {
        console.log(err);
      });
    } else {
      res.writeHead(403);
      res.write('Directory access is forbidden');
      res.end();
    }
  });
}).listen(3000);

console.log('Server runnting at 3000');