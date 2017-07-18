var connect = require('connect'),
    logger = require('morgan'),
    favicon = require('serve-favicon'),
    serveStatic = require('serve-static'),
    http = require('http'),
    fs = require('fs'),
    crossroads = require('crossroads'),
    httpProxy = require('http-proxy'),
    base = __dirname;

// 모든 요청을 수신 대기하는 프록시 생성
httpProxy.createServer((req, res, proxy) => {
  if (req.url.match(/^\/node\//)) {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      post: 8000
    });
  } else {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 8124
    });
  }
}).listen(9000);

// 동적 리소스에 대한 요청을 위한 라우팅 경로 추가
crossroads.addRoute('/node/{id}/', (id) => {
  console.log('accessed node ' + id);
});

// 동적 파일 서버
http.createServer((req, res) => {
  crossroads.parse(req.url);
  res.end('that\'s all!');
}).listen(8000);

// 정적 파일 서버
http.createServer(connect()
  .use(favicon(base+'/favicon.ico'))
  .use(logger('dev'))
  .use(serveStatic(base))
).listen(8124);