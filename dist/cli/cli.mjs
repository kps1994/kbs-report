#!/usr/bin/env node
import {
  startReportServer
} from "../chunk-A6HCKATU.mjs";

// src/cli/cli.ts
import { program } from "commander";
import * as fs from "fs";
import * as path from "path";
program.version("2.0.9").description("Kbs Playwright Test Report CLI");
program.command("show-report").description("Open the generated Kbs report").option("-d, --dir <path>", "Path to the folder containing the report", "kbs-report").option("-f, --file <filename>", "Name of the report file", "kbs-report.html").option("-p, --port <port>", "Number of the port", "2004").action((options) => {
  const projectRoot = process.cwd();
  const folderPath = path.resolve(projectRoot, options.dir);
  const filePath = path.resolve(folderPath, options.file);
  const port = parseInt(options.port) || 2004;
  const fullFilePath = path.resolve(process.cwd(), folderPath, filePath);
  if (!fs.existsSync(fullFilePath)) {
    console.error(`Error: The file "${filePath}" does not exist in the folder "${folderPath}".`);
    process.exit(1);
  }
  startReportServer(folderPath, path.basename(filePath), port, "always");
});
program.parse(process.argv);
