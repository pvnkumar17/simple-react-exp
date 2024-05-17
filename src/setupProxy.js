const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // app.use(
  //   '/v1/auth/checkusername',
  //   createProxyMiddleware({
  //     target: 'http://localhost:9000',
  //     changeOrigin: true,
  //   })
  // );

//   app.use(
//     '/api2',
//     createProxyMiddleware({
//       target: 'http://localhost:5002',
//       changeOrigin: true,
//     })
//   );
};