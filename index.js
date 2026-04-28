const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Proxy middleware configuration
const proxyOptions = {
  target: 'https://sing.sevix.store', // Replace with your target server URL
  changeOrigin: true,
  ws: true, // Enable WebSockets proxying
  secure: true // Enable SSL/TLS (HTTPS) for the proxy connection
};

// Create the proxy middleware
const proxy = createProxyMiddleware(proxyOptions);

// Register the proxy middleware
app.use('/', proxy);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
