export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a, #0d1b2a)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ffffff10",
        }}
      >
        <h2 style={{ margin: 0, color: "#00d4ff" }}>ALICE Cloud-Gateway</h2>
        <a
          href="/dashboard/console"
          style={{
            color: "#00d4ff",
            textDecoration: "none",
            padding: "8px 20px",
            border: "1px solid #00d4ff",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Console →
        </a>
      </header>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#00d4ff20",
            color: "#00d4ff",
            padding: "4px 16px",
            borderRadius: 20,
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Multi-Protocol Cloud Gateway
        </div>
        <h1 style={{ fontSize: 52, marginBottom: 16, lineHeight: 1.1 }}>
          Bridge Any Protocol,<br />At Any Scale
        </h1>
        <p style={{ fontSize: 20, color: "#aaa", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          Connect MQTT, gRPC, HTTP, WebSocket and more through a unified gateway with intelligent data transformation and service mesh.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            textAlign: "left",
          }}
        >
          <div style={{ background: "#ffffff08", borderRadius: 12, padding: 28, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>&#x21C4;</div>
            <h3 style={{ margin: "0 0 8px", color: "#00d4ff" }}>Protocol Bridging</h3>
            <p style={{ color: "#aaa", margin: 0, lineHeight: 1.6 }}>
              Seamlessly translate between MQTT, gRPC, HTTP/2, WebSocket, and AMQP without code changes.
            </p>
          </div>
          <div style={{ background: "#ffffff08", borderRadius: 12, padding: 28, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>&#x2699;&#xFE0F;</div>
            <h3 style={{ margin: "0 0 8px", color: "#00d4ff" }}>Data Transformation</h3>
            <p style={{ color: "#aaa", margin: 0, lineHeight: 1.6 }}>
              Apply real-time transformations, filters, and enrichment rules to streaming data in-flight.
            </p>
          </div>
          <div style={{ background: "#ffffff08", borderRadius: 12, padding: 28, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>&#x1F578;&#xFE0F;</div>
            <h3 style={{ margin: "0 0 8px", color: "#00d4ff" }}>Service Mesh</h3>
            <p style={{ color: "#aaa", margin: 0, lineHeight: 1.6 }}>
              Automatic load balancing, circuit breaking, retries, and mTLS across all connected services.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <a
            href="/dashboard/console"
            style={{
              display: "inline-block",
              background: "#00d4ff",
              color: "#000",
              padding: "14px 36px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Open Console
          </a>
        </div>
      </main>
    </div>
  );
}
