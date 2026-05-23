const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    const requested = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(root, requested === "/" ? "index.html" : requested);
    const safePath = filePath.startsWith(root) ? filePath : path.join(root, "index.html");

    fs.readFile(safePath, (error, data) => {
      if (error) {
        fs.readFile(path.join(root, "index.html"), (fallbackError, fallbackData) => {
          if (fallbackError) {
            res.writeHead(404);
            res.end("Not found");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fallbackData);
        });
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(safePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1");
