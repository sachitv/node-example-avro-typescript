# Node Avro TypeScript Example

[![CI](https://github.com/sachitv/node-example-avro-typescript/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/sachitv/node-example-avro-typescript/actions/workflows/ci.yml)

This project demonstrates how to use the `@sachitv/avro-typescript` library with Node.js 25 in both a Node runtime and a browser bundle.

## Prerequisites

- Use Node.js 25 (`nvm use` will read `.nvmrc`).
- Install dependencies with:

```bash
npm install
```

## Scripts

- `npm run start` – bundle the browser build with esbuild and serve the demo.
- `npm run serve` – start the TypeScript server (expects `dist/` to exist).
- `npm run build:browser` – bundle `src/browser.ts` to `dist/browser.js` with source maps.
- `npm run test:node` – run the Node Avro example (`src/index.ts`) with `tsx`.
- `npm run test:e2e` – build the browser bundle then run the Playwright flow.
- `npm run check` / `npm run format` – Biome linting and formatting.

## Running the examples

- **Node example:** `npm run test:node` writes records to a temp Avro file and reads them back.
- **Browser example:** `npm start` then open [http://localhost:3000](http://localhost:3000) and click **Run Avro Example** to see Avro data written and read in-memory in the browser.
