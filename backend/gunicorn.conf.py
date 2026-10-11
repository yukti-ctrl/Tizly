import os

# Render dynamically assigns PORT (defaults to 5000 if not set)
port = os.environ.get("PORT", "5000")

# Crucial for Render: must bind to 0.0.0.0 so external health checks can connect
bind = f"0.0.0.0:{port}"

# Concurrency & performance tuning for Render Free Tier
workers = int(os.environ.get("WEB_CONCURRENCY", "2"))
threads = 2
timeout = 120
keepalive = 5

# Stream logs directly to Render console
accesslog = "-"
errorlog = "-"
loglevel = "info"
