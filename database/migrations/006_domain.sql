-- ALICE Cloud Gateway: Domain-specific tables
CREATE TABLE IF NOT EXISTS gateway_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    device_id TEXT NOT NULL,
    protocol TEXT NOT NULL DEFAULT 'sdf-stream' CHECK (protocol IN ('sdf-stream', 'mqtt-bridge', 'grpc-relay')),
    region TEXT NOT NULL DEFAULT 'us-east-1',
    endpoint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gateway_meshes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    topology TEXT NOT NULL DEFAULT 'full-mesh' CHECK (topology IN ('full-mesh', 'star', 'ring', 'tree')),
    device_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'established' CHECK (status IN ('establishing', 'established', 'degraded', 'dissolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gateway_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES gateway_connections(id) ON DELETE CASCADE,
    objects_synced INTEGER NOT NULL DEFAULT 0,
    sdf_bytes BIGINT NOT NULL DEFAULT 0,
    latency_ms DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gateway_connections_user ON gateway_connections(user_id);
CREATE INDEX idx_gateway_meshes_user ON gateway_meshes(user_id);
CREATE INDEX idx_gateway_sync_logs_conn ON gateway_sync_logs(connection_id, created_at);
