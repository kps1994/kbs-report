#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli/cli.ts
var import_commander = require("commander");

// src/utils/expressServer.ts
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_child_process = require("child_process");
function startReportServer(reportFolder, reportFilename, port = 2004, open) {
  const app = (0, import_express.default)();
  app.use(import_express.default.static(reportFolder));
  app.get("/", (_req, res) => {
    try {
      res.sendFile(import_path.default.resolve(reportFolder, reportFilename));
    } catch (error) {
      console.error("Kbs-Report: Error sending report file:", error);
      res.status(500).send("Error loading report");
    }
  });
  try {
    const server = app.listen(port, () => {
      console.log(
        `Server is running at http://localhost:${port} 
Press Ctrl+C to stop.`
      );
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
        console.error(
          `Kbs-Report: Port ${port} is already in use. Trying a different port...`
        );
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
      (0, import_child_process.spawn)(command, ["/c", "start", url]);
    } else if (platform === "darwin") {
      command = "open";
      (0, import_child_process.spawn)(command, [url]);
    } else {
      command = "xdg-open";
      (0, import_child_process.spawn)(command, [url]);
    }
  } catch (error) {
    console.error("Kbs-Report: Error opening the browser:", error);
  }
}

// src/cli/cli.ts
var fs = __toESM(require("fs"));
var path2 = __toESM(require("path"));
import_commander.program.version("2.0.9").description("Kbs Playwright Test Report CLI");
import_commander.program.command("show-report").description("Open the generated Kbs report").option("-d, --dir <path>", "Path to the folder containing the report", "kbs-report").option("-f, --file <filename>", "Name of the report file", "kbs-report.html").option("-p, --port <port>", "Number of the port", "2004").action((options) => {
  const projectRoot = process.cwd();
  const folderPath = path2.resolve(projectRoot, options.dir);
  const filePath = path2.resolve(folderPath, options.file);
  const port = parseInt(options.port) || 2004;
  const fullFilePath = path2.resolve(process.cwd(), folderPath, filePath);
  if (!fs.existsSync(fullFilePath)) {
    console.error(`Error: The file "${filePath}" does not exist in the folder "${folderPath}".`);
    process.exit(1);
  }
  startReportServer(folderPath, path2.basename(filePath), port, "always");
});
import_commander.program.parse(process.argv);
