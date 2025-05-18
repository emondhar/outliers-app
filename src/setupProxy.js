const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/vidiq',
        createProxyMiddleware({
            target: 'https://api.vidiq.com',
            changeOrigin: true,
            pathRewrite: { '^/api/vidiq': '' },
        })
    );
};
