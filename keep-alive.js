// Keep-alive script to ensure 24/7 operation
const http = require('http');

/**
 * @typedef {Object} KeepAliveOptions
 * @property {string} hostname - The hostname to ping
 * @property {number} port - The port to ping
 * @property {string} path - The path to ping
 */

function keepAlive() {
  // Ping the application every 5 minutes to prevent sleeping
  setInterval(() => {
    const options = {
      hostname: process.env.REPLIT_DEV_DOMAIN || 'localhost',
      port: process.env.PORT || 5000,
      path: '/api/traditions',
      method: 'GET',
      headers: {
        'User-Agent': 'KeepAlive/1.0'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    });

    req.on('error', (err) => {
      console.log('Keep-alive ping failed:', err.message);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('Keep-alive ping timeout');
    });

    req.end();
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Only run keep-alive in production
if (process.env.NODE_ENV === 'production') {
  keepAlive();
  console.log('Keep-alive service started for 24/7 operation');
}

module.exports = { keepAlive };
module.exports.keepAlive = keepAlive;