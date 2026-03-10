FROM node:22-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY . .

# Install all dependencies including devDependencies for build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Run the build
RUN pnpm build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
