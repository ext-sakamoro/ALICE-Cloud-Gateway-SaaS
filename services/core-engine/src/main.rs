use axum::{extract::State, response::Json, routing::{get, post}, Router};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

struct AppState { start_time: Instant, stats: Mutex<Stats> }
struct Stats { total_connections: u64, total_syncs: u64, total_transforms: u64, bytes_relayed: u64 }

#[derive(Serialize)]
struct Health { status: String, version: String, uptime_secs: u64, total_ops: u64 }

#[derive(Deserialize)]
struct ConnectRequest { device_id: String, protocol: Option<String>, region: Option<String> }
#[derive(Serialize)]
struct ConnectResponse { connection_id: String, device_id: String, protocol: String, region: String, endpoint: String, status: String }

#[derive(Deserialize)]
struct SyncRequest { connection_id: String, sdf_delta: Option<serde_json::Value>, timestamp: Option<String> }
#[derive(Serialize)]
struct SyncResponse { sync_id: String, status: String, objects_synced: u32, sdf_bytes_transferred: u64, latency_ms: f64 }

#[derive(Deserialize)]
struct TransformRequest { source_protocol: String, target_protocol: String, payload: serde_json::Value }
#[derive(Serialize)]
struct TransformResponse { transform_id: String, source: String, target: String, output: serde_json::Value, elapsed_us: u128 }

#[derive(Deserialize)]
struct MeshRequest { devices: Vec<String>, topology: Option<String> }
#[derive(Serialize)]
struct MeshResponse { mesh_id: String, devices: usize, topology: String, connections: Vec<MeshConnection>, status: String }
#[derive(Serialize)]
struct MeshConnection { from: String, to: String, latency_ms: f64 }

#[derive(Serialize)]
struct ProtocolInfo { name: String, description: String, latency_ms: f64, throughput_mbps: f64 }
#[derive(Serialize)]
struct StatsResponse { total_connections: u64, total_syncs: u64, total_transforms: u64, bytes_relayed: u64, active_meshes: u32 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().with_env_filter(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "gateway_engine=info".into())).init();
    let state = Arc::new(AppState { start_time: Instant::now(), stats: Mutex::new(Stats { total_connections: 0, total_syncs: 0, total_transforms: 0, bytes_relayed: 0 }) });
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/gateway/connect", post(connect))
        .route("/api/v1/gateway/sync", post(sync_data))
        .route("/api/v1/gateway/transform", post(transform))
        .route("/api/v1/gateway/mesh", post(create_mesh))
        .route("/api/v1/gateway/protocols", get(protocols))
        .route("/api/v1/gateway/stats", get(stats))
        .layer(cors).layer(TraceLayer::new_for_http()).with_state(state);
    let addr = std::env::var("GATEWAY_ADDR").unwrap_or_else(|_| "0.0.0.0:8081".into());
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Cloud Gateway Engine on {addr}");
    axum::serve(listener, app).await.unwrap();
}

async fn health(State(s): State<Arc<AppState>>) -> Json<Health> {
    let st = s.stats.lock().unwrap();
    Json(Health { status: "ok".into(), version: env!("CARGO_PKG_VERSION").into(), uptime_secs: s.start_time.elapsed().as_secs(), total_ops: st.total_connections + st.total_syncs })
}

async fn connect(State(s): State<Arc<AppState>>, Json(req): Json<ConnectRequest>) -> Json<ConnectResponse> {
    let protocol = req.protocol.unwrap_or_else(|| "sdf-stream".into());
    let region = req.region.unwrap_or_else(|| "us-east-1".into());
    s.stats.lock().unwrap().total_connections += 1;
    Json(ConnectResponse { connection_id: uuid::Uuid::new_v4().to_string(), device_id: req.device_id, protocol, region: region.clone(), endpoint: format!("wss://gateway.alice-platform.com/{}", region), status: "connected".into() })
}

async fn sync_data(State(s): State<Arc<AppState>>, Json(_req): Json<SyncRequest>) -> Json<SyncResponse> {
    let bytes = 4096_u64;
    { let mut st = s.stats.lock().unwrap(); st.total_syncs += 1; st.bytes_relayed += bytes; }
    Json(SyncResponse { sync_id: uuid::Uuid::new_v4().to_string(), status: "synced".into(), objects_synced: 12, sdf_bytes_transferred: bytes, latency_ms: 8.5 })
}

async fn transform(State(s): State<Arc<AppState>>, Json(req): Json<TransformRequest>) -> Json<TransformResponse> {
    let t = Instant::now();
    s.stats.lock().unwrap().total_transforms += 1;
    Json(TransformResponse { transform_id: uuid::Uuid::new_v4().to_string(), source: req.source_protocol, target: req.target_protocol, output: req.payload, elapsed_us: t.elapsed().as_micros() })
}

async fn create_mesh(State(_s): State<Arc<AppState>>, Json(req): Json<MeshRequest>) -> Json<MeshResponse> {
    let topology = req.topology.unwrap_or_else(|| "full-mesh".into());
    let count = req.devices.len();
    let connections: Vec<MeshConnection> = if count >= 2 { (0..count-1).map(|i| MeshConnection { from: req.devices[i].clone(), to: req.devices[i+1].clone(), latency_ms: 15.0 + i as f64 * 5.0 }).collect() } else { vec![] };
    Json(MeshResponse { mesh_id: uuid::Uuid::new_v4().to_string(), devices: count, topology, connections, status: "established".into() })
}

async fn protocols() -> Json<Vec<ProtocolInfo>> {
    Json(vec![
        ProtocolInfo { name: "sdf-stream".into(), description: "SDF delta streaming for spatial data sync".into(), latency_ms: 8.0, throughput_mbps: 100.0 },
        ProtocolInfo { name: "mqtt-bridge".into(), description: "MQTT to SDF protocol bridge for IoT devices".into(), latency_ms: 15.0, throughput_mbps: 10.0 },
        ProtocolInfo { name: "grpc-relay".into(), description: "gRPC relay for microservice communication".into(), latency_ms: 5.0, throughput_mbps: 500.0 },
    ])
}

async fn stats(State(s): State<Arc<AppState>>) -> Json<StatsResponse> {
    let st = s.stats.lock().unwrap();
    Json(StatsResponse { total_connections: st.total_connections, total_syncs: st.total_syncs, total_transforms: st.total_transforms, bytes_relayed: st.bytes_relayed, active_meshes: 1 })
}
