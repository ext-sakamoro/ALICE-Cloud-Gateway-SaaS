"use client";
import { useState } from "react";

type Tab = "connect" | "sync" | "transform" | "mesh" | "protocols" | "stats";

const DEFAULTS: Record<Tab, string> = {
  connect: JSON.stringify({
    protocol: "grpc",
    endpoint: "service.internal:443",
    auth: { type: "mtls", cert: "base64cert==" },
    options: { timeout_ms: 5000, retry: 3 }
  }, null, 2),
  sync: JSON.stringify({
    gateway_id: "gw-001",
    source: { protocol: "mqtt", topic: "sensors/#" },
    target: { protocol: "http", url: "https://api.example.com/ingest" },
    transform_id: "txf-001"
  }, null, 2),
  transform: JSON.stringify({
    input_protocol: "mqtt",
    output_protocol: "grpc",
    payload: { temperature: 23.5, humidity: 60 },
    rules: [{ field: "temperature", op: "multiply", value: 1.8 }]
  }, null, 2),
  mesh: JSON.stringify({
    services: [
      { name: "auth-service", address: "auth:8080", protocol: "http" },
      { name: "data-service", address: "data:9090", protocol: "grpc" }
    ],
    policy: { load_balance: "round_robin", circuit_breaker: true }
  }, null, 2),
  protocols: "",
  stats: "",
};

const TAB_LABELS: Record<Tab, string> = {
  connect: "POST /connect",
  sync: "POST /sync",
  transform: "POST /transform",
  mesh: "POST /mesh",
  protocols: "GET /protocols",
  stats: "GET /stats",
};

const GET_TABS: Tab[] = ["protocols", "stats"];

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [input, setInput] = useState(DEFAULTS["connect"]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8081";

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setInput(DEFAULTS[tab]);
    setResponse("");
  };

  const send = async () => {
    setLoading(true);
    try {
      const isGet = GET_TABS.includes(activeTab);
      const url = `${API}/api/v1/gateway/${activeTab}`;
      const res = await fetch(url, {
        method: isGet ? "GET" : "POST",
        headers: isGet ? {} : { "Content-Type": "application/json" },
        body: isGet ? undefined : input,
      });
      setResponse(JSON.stringify(await res.json(), null, 2));
    } catch (e: unknown) {
      setResponse(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, fontFamily: "monospace", background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ marginBottom: 4 }}>ALICE Cloud-Gateway-SaaS — Console</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Multi-protocol cloud gateway API tester</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid",
              borderColor: activeTab === tab ? "#00d4ff" : "#333",
              background: activeTab === tab ? "#00d4ff20" : "#111",
              color: activeTab === tab ? "#00d4ff" : "#888",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {!GET_TABS.includes(activeTab) && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: 13,
            background: "#111",
            color: "#e0e0e0",
            border: "1px solid #333",
            borderRadius: 8,
            padding: 12,
            boxSizing: "border-box",
          }}
        />
      )}

      {GET_TABS.includes(activeTab) && (
        <div style={{ color: "#666", fontSize: 13, padding: "12px 0" }}>
          No request body required for GET requests.
        </div>
      )}

      <button
        onClick={send}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 28px",
          background: loading ? "#333" : "#00d4ff",
          color: loading ? "#666" : "#000",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          marginTop: 16,
          minHeight: 200,
          overflow: "auto",
          borderRadius: 8,
          border: "1px solid #222",
          fontSize: 13,
        }}
      >
        {response || "// Response will appear here"}
      </pre>
    </div>
  );
}
