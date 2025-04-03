const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Custom Metrics
const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestFailures = new client.Counter({
  name: 'http_requests_failed_total',
  help: 'Total number of failed HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5] // Buckets for response time
});

// Register Metrics
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestFailures);
register.registerMetric(httpRequestDuration);

// Middleware to track metrics
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const responseTime = duration[0] + duration[1] / 1e9; // Convert to seconds

    // Record total requests
    httpRequestTotal.inc({ method: req.method, route: req.path, status: res.statusCode });

    // Record failures (4xx or 5xx responses)
    if (res.statusCode >= 400) {
      httpRequestFailures.inc({ method: req.method, route: req.path, status: res.statusCode });
    }

    // Record request duration
    httpRequestDuration.observe({ method: req.method, route: req.path, status: res.statusCode }, responseTime);
  });

  next();
});

// Define Routes
app.get('/', (req, res) => {
  res.send('Hello, Prometheus!');
});

app.get('/error', (req, res) => {
  res.status(500).send('Simulated Failure');
});

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});