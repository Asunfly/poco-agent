# Use the provided all-in-one sandbox base image
FROM enterprise-public-cn-beijing.cr.volces.com/vefaas-public/all-in-one-sandbox:latest

# Set working directory to /app (absolute path)
WORKDIR /app

# Copy pyproject.toml for dependency installation
COPY executor/pyproject.toml .

# Install dependencies using uv with Tsinghua mirror
RUN uv sync --no-dev

# Copy the executor application code to /app
COPY executor/app ./app

# Copy the startup script
COPY docker/executor/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose the executor service port (8000, leaving 8080 for the sandbox web UI)
EXPOSE 8000 8080

# Reset ENTRYPOINT and use our startup script
ENTRYPOINT []
CMD ["/app/start.sh"]
