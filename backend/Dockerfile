FROM node:20-bookworm AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm
WORKDIR /app
RUN npm install -g tsx
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
RUN mkdir -p /app/uploads
EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main"]
