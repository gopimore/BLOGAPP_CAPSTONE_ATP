(The file was empty)
# Capstone Project — End-to-End Performance Guide

**Project Overview**
- **Purpose**: Full-stack MERN demo app demonstrating article creation, authoring, and user flows.
- **Stack**: **Backend**: Node/Express; **DB**: MongoDB; **Frontend**: React + Vite.

**Architecture**
- **Backend**: Express APIs in the `backend` folder, entry at [backend/server.js](backend/server.js).
- **Frontend**: React SPA in the `frontend` folder, entry at [frontend/src/main.jsx](frontend/src/main.jsx).
- **Data models**: See [backend/Models/ArticleModel.js](backend/Models/ArticleModel.js) and [backend/Models/UserModel.js](backend/Models/UserModel.js).

**Performance Goals (example targets)**
- **API latency**: p95 < 200ms for individual read endpoints under expected load.
- **Throughput**: 500 RPS for read-heavy workloads on a single app instance (adjust by infra).
- **Frontend**: Time to Interactive (TTI) < 3s on 3G-like throttled network.

**How to Measure (high level)**
- **Backend**: request latency, CPU, memory, GC pauses, DB op latency, connection pool usage.
- **Frontend**: bundle size, first contentful paint (FCP), TTI, render-blocking resources.
- **End-to-end**: user-perceived latency measured by browser RUM or synthetic browser tests.

**Backend — Profiling & Optimization**
- **Instrument first**: add request timing middleware and structured logs (timestamp, path, time_ms).
- **Profile CPU**: use `clinic` (`clinic doctor -- node server.js`) or Node's `--inspect` and `0x` for flamegraphs.
- **Profile memory**: take heap snapshots (`node --inspect`) and analyze with Chrome DevTools.
- **Common hotspots**:
	- **Synchronous work**: avoid heavy CPU tasks on the event loop; move to worker threads or background jobs.
	- **Blocking I/O**: ensure file and image operations are async; use streaming for large responses.
	- **Database**: optimize queries, add indexes, avoid N+1 queries, use projections to return only necessary fields.
- **Example: add request timing middleware**

```js
// backend/middlewares/requestTimer.js
module.exports = (req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
	});
	next();
};
```

**Database & Storage**
- **Indexes**: review queries in [backend/Models/ArticleModel.js](backend/Models/ArticleModel.js) and add compound indexes for common filters.
- **Connection pool**: tune MongoDB pool size to match CPU and concurrency.
- **Media**: use Cloudinary (see [backend/config/cloudinary.js](backend/config/cloudinary.js)) or a CDN to offload serving images.

**Frontend — Profiling & Optimization**
- **Measure**: Lighthouse, WebPageTest, and Chrome DevTools Performance panel.
- **Bundle analysis**: run `vite build` then analyze with `source-map-explorer` or `rollup-plugin-visualizer`.
- **Code-splitting**: lazy-load route-level code (`React.lazy` + `Suspense`) for large components like editors.
- **Asset optimization**: compress images, use next-gen formats (WebP/AVIF), and set proper cache headers.
- **Avoid unnecessary re-renders**: use `React.memo`, keep stable props, and avoid expensive functions in render.

**Benchmarking & Load Testing**
- **Local quick test** with `autocannon` (install globally or add as dev dep):

```bash
npm i -g autocannon
# run 30s test against a local backend endpoint
autocannon -c 100 -d 30 http://localhost:5000/api/articles
```

- **k6** for scriptable scenarios (recommended for realistic user journeys):

```js
// load-test-script.js
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
	http.get('http://localhost:5000/api/articles');
	sleep(1);
}
```

Run: `k6 run load-test-script.js`.

- **Artillery** for HTTP + socket scenarios: `artillery quick --count 50 -n 20 http://localhost:5000/api/articles`.

**Interpreting Results**
- **Latency distribution**: pay attention to p50/p95/p99, not just average.
- **Errors**: track 4xx/5xx rates and correlate to latency spikes.
- **Resource limits**: CPU, memory, file descriptors, DB connections.

**Monitoring & Logging**
- **APM**: integrate APM (e.g., Elastic APM, Datadog APM, New Relic) to track traces and slow transactions.
- **Logs**: centralize logs (structured JSON) into an aggregator (ELK/Opensearch, CloudWatch, Datadog).
- **Metrics**: export Prometheus metrics for request rate, latency buckets, and application-specific counters.

**Caching Strategies**
- **HTTP caching**: set `Cache-Control` for immutable assets and use CDN in front of static assets.
- **Server-side caching**: cache expensive DB queries with Redis (short TTLs) and use cache invalidation on writes.
- **DB**: use appropriate indexes; consider read replicas for scaling read-heavy workloads.

**Deployment & Scaling**
- **Vertical**: increase CPU/memory for single instance for short-term throughput gains.
- **Horizontal**: run multiple app instances behind a load balancer; use sticky sessions only if necessary.
- **Statelessness**: move session state to Redis or JWTs so instances can be scaled freely.

**Recommended Tools**
- **Profiling**: `clinic`, `0x`, Chrome DevTools
- **Load testing**: `k6`, `autocannon`, `artillery`
- **Monitoring/APM**: Prometheus + Grafana, Elastic APM, Datadog
- **Frontend auditing**: Lighthouse, WebPageTest

**Quick Commands**
- **Start backend**:

```bash
cd backend
npm install
npm run start
```

- **Start frontend (dev)**:

```bash
cd frontend
npm install
npm run dev
```

- **Run a quick load test**:

```bash
autocannon -c 100 -d 20 http://localhost:5000/api/articles
```

**Where to look in this repo**
- **Server entry**: [backend/server.js](backend/server.js)
- **API routes**: [backend/APIs](backend/APIs)
- **Models**: [backend/Models](backend/Models)
- **Cloudinary config**: [backend/config/cloudinary.js](backend/config/cloudinary.js)
- **Frontend entry**: [frontend/src/main.jsx](frontend/src/main.jsx)
- **Frontend components**: [frontend/src/components](frontend/src/components)



