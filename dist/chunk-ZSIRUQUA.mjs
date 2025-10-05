var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/utils/expressServer.ts
import express from "express";
import path from "path";
import { spawn } from "child_process";
function startReportServer(reportFolder, reportFilename, port = 2004, open) {
  const app = express();
  app.use(express.static(reportFolder));
  app.get("/", (_req, res) => {
    try {
      res.sendFile(path.resolve(reportFolder, reportFilename));
    } catch (error) {
      console.error("Kbs-Report: Error sending report file:", error);
      res.status(500).send("Error loading report");
    }
  });
  try {
    const server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port} 
Press Ctrl+C to stop.`);
      if (open === "always" || open === "on-failure") {
        try {
          openBrowser(`http://localhost:${port}`);
        } catch (error) {
          console.error("Kbs-Report: Error opening browser:", error);
        }
      }
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Kbs-Report: Port ${port} is already in use. Trying a different port...`);
      } else {
        console.error("Kbs-Report: Server error:", error);
      }
    });
  } catch (error) {
    console.error("Kbs-Report: Error starting the server:", error);
  }
}
function openBrowser(url) {
  const platform = process.platform;
  let command;
  try {
    if (platform === "win32") {
      command = "cmd";
      spawn(command, ["/c", "start", url]);
    } else if (platform === "darwin") {
      command = "open";
      spawn(command, [url]);
    } else {
      command = "xdg-open";
      spawn(command, [url]);
    }
  } catch (error) {
    console.error("Kbs-Report: Error opening the browser:", error);
  }
}

export {
  __require,
  startReportServer
};
