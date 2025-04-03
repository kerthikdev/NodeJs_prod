const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// Collect default metrics and associate them with the register instance
client.collectDefaultMetrics({ register });

// Create a custom metric (Optional)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

// Register the custom metric
register.registerMetric(httpRequestCounter);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Sample request to increase counter
app.get('/', (req, res) => {
  httpRequestCounter.inc();
  res.send('Hello, Prometheus!');
});

// Run server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});