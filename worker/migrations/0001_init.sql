-- Orb queries and contact messages are kept 30 days; audit_log 12 months. A daily cron purges.
CREATE TABLE orb_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  redacted_text TEXT NOT NULL,
  track TEXT NOT NULL,
  source TEXT NOT NULL,
  top_projects TEXT NOT NULL,
  latency_ms INTEGER NOT NULL
);
CREATE INDEX idx_orb_queries_created ON orb_queries(created_at);

CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);
CREATE INDEX idx_contact_created ON contact_messages(created_at);

CREATE TABLE usage_daily (
  day TEXT PRIMARY KEY,
  orb_calls INTEGER NOT NULL DEFAULT 0,
  ai_calls INTEGER NOT NULL DEFAULT 0,
  fallback_calls INTEGER NOT NULL DEFAULT 0,
  neurons_estimated INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE test_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  suite TEXT NOT NULL,
  passed INTEGER NOT NULL,
  failed INTEGER NOT NULL,
  commit_sha TEXT NOT NULL
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL
);
CREATE INDEX idx_audit_created ON audit_log(created_at);
