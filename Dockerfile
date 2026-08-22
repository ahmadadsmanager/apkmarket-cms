FROM node:20-bookworm-slim
WORKDIR /app
COPY app.tar.gz /tmp/app.tar.gz
RUN tar -xzf /tmp/app.tar.gz -C /app && rm /tmp/app.tar.gz && \
    if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
