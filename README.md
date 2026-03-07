# ALICE-Cloud-Gateway-SaaS

Multi-protocol cloud gateway SaaS with protocol bridging, data transformation, and service mesh.

## Architecture

```
Frontend (Next.js :3000)
        |
        v
API Gateway (:8081)
        |
   +----+----+
   |         |
Protocol   Transform
 Bridge     Engine
   |         |
MQTT  gRPC  HTTP  WS
        |
   Service Mesh
  (mTLS + LB + CB)
```

## Features

| Feature | Description |
|---------|-------------|
| Protocol Bridging | MQTT, gRPC, HTTP/2, WebSocket, AMQP translation |
| Data Transformation | In-flight field mapping, enrichment, filtering |
| Service Mesh | Load balancing, circuit breaker, mTLS, retries |
| Gateway Sync | Bidirectional protocol synchronization |
| Stats & Monitoring | Real-time gateway metrics and throughput |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /api/v1/gateway/connect | Register a new gateway connection |
| POST | /api/v1/gateway/sync | Sync data between protocol endpoints |
| POST | /api/v1/gateway/transform | Apply transformation rules to a payload |
| POST | /api/v1/gateway/mesh | Configure service mesh topology |
| GET | /api/v1/gateway/protocols | List supported protocols |
| GET | /api/v1/gateway/stats | Gateway throughput and connection stats |

## Quick Start

```bash
docker compose up -d
# API:      http://localhost:8081
# Frontend: http://localhost:3000
```

## License

AGPL-3.0-or-later
