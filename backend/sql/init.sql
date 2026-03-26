CREATE TABLE IF NOT EXISTS api_monitors (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    normalized_url TEXT NOT NULL UNIQUE,
    interval_seconds INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitor_logs (
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER NOT NULL REFERENCES api_monitors(id) ON DELETE CASCADE,
    status_code INTEGER,
    response_time INTEGER,
    body_preview TEXT,
    success BOOLEAN NOT NULL,
    checked_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incidents(
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER NOT NULL REFERENCES api_monitors(id) ON DELETE CASCADE,
    monitor_log_id INTEGER NOT NULL REFERENCES monitor_logs(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);