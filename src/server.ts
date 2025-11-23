import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(projectRoot, "src");
const distDir = join(projectRoot, "dist");
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function getContentType(filePath: string): string {
  return mimeTypes[extname(filePath)] ?? "application/octet-stream";
}

async function resolveFile(pathname: string): Promise<string | null> {
  const normalizedPath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  const relativePath = normalizedPath === "/" ? "index.html" : normalizedPath.replace(/^[\\/]/, "");
  const isDistAsset = relativePath.startsWith("dist/");
  const baseDir = isDistAsset ? distDir : srcDir;
  const pathInBase = isDistAsset ? relativePath.slice("dist/".length) : relativePath;
  const filePath = join(baseDir, pathInBase);

  if (!filePath.startsWith(baseDir)) {
    return null;
  }

  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() ? filePath : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const filePath = await resolveFile(url.pathname);

  if (!filePath) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  try {
    const fileContents = await readFile(filePath);
    res.writeHead(200, { "content-type": getContentType(filePath) });
    res.end(fileContents);
  } catch (error) {
    console.error("Failed to read file", filePath, error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
