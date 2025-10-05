"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/kbs-report.ts
var kbs_report_exports = {};
__export(kbs_report_exports, {
  KbsReport: () => KbsReport,
  default: () => KbsReport
});
module.exports = __toCommonJS(kbs_report_exports);

// src/helpers/fileManager.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var FileManager = class {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }
  ensureReportDirectory() {
    const kbsDataFolder = import_path.default.join(this.folderPath, "kbs-data");
    if (!import_fs.default.existsSync(this.folderPath)) {
      import_fs.default.mkdirSync(this.folderPath, { recursive: true });
    } else {
      if (import_fs.default.existsSync(kbsDataFolder)) {
        import_fs.default.rmSync(kbsDataFolder, { recursive: true, force: true });
      }
    }
  }
  writeReportFile(filename, content) {
    const outputPath = import_path.default.join(process.cwd(), this.folderPath, filename);
    import_fs.default.writeFileSync(outputPath, content);
    return outputPath;
  }
  readCssContent() {
    return import_fs.default.readFileSync(
      import_path.default.resolve(__dirname, "style", "main.css"),
      "utf-8"
    );
  }
  copyTraceViewerAssets(skip) {
    if (skip) return;
    const traceViewerFolder = import_path.default.join(
      require.resolve("playwright-core"),
      "..",
      "lib",
      "vite",
      "traceViewer"
    );
    const traceViewerTargetFolder = import_path.default.join(this.folderPath, "trace");
    const traceViewerAssetsTargetFolder = import_path.default.join(
      traceViewerTargetFolder,
      "assets"
    );
    import_fs.default.mkdirSync(traceViewerAssetsTargetFolder, { recursive: true });
    for (const file of import_fs.default.readdirSync(traceViewerFolder)) {
      if (file.endsWith(".map") || file.includes("watch") || file.includes("assets"))
        continue;
      import_fs.default.copyFileSync(
        import_path.default.join(traceViewerFolder, file),
        import_path.default.join(traceViewerTargetFolder, file)
      );
    }
    const assetsFolder = import_path.default.join(traceViewerFolder, "assets");
    for (const file of import_fs.default.readdirSync(assetsFolder)) {
      if (file.endsWith(".map") || file.includes("xtermModule")) continue;
      import_fs.default.copyFileSync(
        import_path.default.join(assetsFolder, file),
        import_path.default.join(traceViewerAssetsTargetFolder, file)
      );
    }
  }
};

// src/helpers/HTMLGenerator.ts
var import_path3 = __toESM(require("path"));

// src/utils/groupProjects.ts
function groupResults(config, results) {
  if (config.showProject) {
    const groupedResults = results.reduce((acc, result, index) => {
      const testId = `${result.filePath}:${result.projectName}:${result.title}`;
      const { filePath, suite, projectName } = result;
      acc[filePath] = acc[filePath] || {};
      acc[filePath][suite] = acc[filePath][suite] || {};
      acc[filePath][suite][projectName] = acc[filePath][suite][projectName] || [];
      acc[filePath][suite][projectName].push({ ...result, index, testId });
      return acc;
    }, {});
    return groupedResults;
  } else {
    const groupedResults = results.reduce((acc, result, index) => {
      const testId = `${result.filePath}:${result.projectName}:${result.title}`;
      const { filePath, suite } = result;
      acc[filePath] = acc[filePath] || {};
      acc[filePath][suite] = acc[filePath][suite] || [];
      acc[filePath][suite].push({ ...result, index, testId });
      return acc;
    }, {});
    return groupedResults;
  }
}

// src/utils/utils.ts
var import_path2 = __toESM(require("path"));
function msToTime(duration) {
  const milliseconds = Math.floor(duration % 1e3);
  const seconds = Math.floor(duration / 1e3 % 60);
  const minutes = Math.floor(duration / (1e3 * 60) % 60);
  const hours = Math.floor(duration / (1e3 * 60 * 60) % 24);
  let result = "";
  if (hours > 0) {
    result += `${hours}h:`;
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes < 10 ? "0" + minutes : minutes}m:`;
  }
  if (seconds > 0 || minutes > 0 || hours > 0) {
    result += `${seconds < 10 ? "0" + seconds : seconds}s`;
  }
  if (milliseconds > 0 && !(seconds > 0 || minutes > 0 || hours > 0)) {
    result += `${milliseconds}ms`;
  } else if (milliseconds > 0) {
    result += `:${milliseconds < 100 ? "0" + milliseconds : milliseconds}ms`;
  }
  return result;
}
function normalizeFilePath(filePath) {
  const normalizedPath = import_path2.default.normalize(filePath);
  return import_path2.default.basename(normalizedPath);
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString();
  return `${day}-${month}-${year} ${time}`;
}
function safeStringify(obj, indent = 2) {
  const cache = /* @__PURE__ */ new Set();
  const json = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.has(value)) {
          return;
        }
        cache.add(value);
      }
      return value;
    },
    indent
  );
  cache.clear();
  return json;
}
function ensureHtmlExtension(filename) {
  const ext = import_path2.default.extname(filename);
  if (ext && ext.toLowerCase() === ".html") {
    return filename;
  }
  return `${filename}.html`;
}
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") {
    return String(unsafe);
  }
  return unsafe.replace(/[&<"']/g, function(match) {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return escapeMap[match] || match;
  });
}
function formatDateUTC(date) {
  return date.toISOString();
}
function formatDateLocal(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "shortOffset"
  };
  return new Intl.DateTimeFormat(void 0, options).format(date);
}
function formatDateNoTimezone(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

// src/helpers/HTMLGenerator.ts
var import_fs2 = __toESM(require("fs"));
var import_handlebars = __toESM(require("handlebars"));
var HTMLGenerator = class {
  constructor(kbsConfig, dbManager) {
    this.kbsConfig = kbsConfig;
    this.registerHandlebarsHelpers();
    this.registerPartials();
    this.dbManager = dbManager;
  }
  async generateHTML(filteredResults, totalDuration, cssContent, results, projectSet) {
    const data = await this.prepareReportData(
      filteredResults,
      totalDuration,
      results,
      projectSet
    );
    const templateSource = import_fs2.default.readFileSync(
      import_path3.default.resolve(__dirname, "views", "main.hbs"),
      "utf-8"
    );
    const template = import_handlebars.default.compile(templateSource);
    return template({ ...data, inlineCss: cssContent });
  }
  async getReportData() {
    return {
      summary: await this.dbManager.getSummaryData(),
      trends: await this.dbManager.getTrends(),
      flakyTests: await this.dbManager.getFlakyTests(),
      slowTests: await this.dbManager.getSlowTests()
    };
  }
  async chartTrendData() {
    return {
      labels: (await this.getReportData()).trends.map(
        (t) => formatDateNoTimezone(t.run_date)
      ),
      passed: (await this.getReportData()).trends.map((t) => t.passed),
      failed: (await this.getReportData()).trends.map((t) => t.failed),
      avgDuration: (await this.getReportData()).trends.map(
        (t) => t.avg_duration
      )
    };
  }
  async prepareReportData(filteredResults, totalDuration, results, projectSet) {
    const totalTests = filteredResults.length;
    const passedTests = results.filter((r) => r.status === "passed").length;
    const flakyTests = results.filter((r) => r.status === "flaky").length;
    const failed = filteredResults.filter(
      (r) => r.status === "failed" || r.status === "timedOut"
    ).length;
    const successRate = ((passedTests + flakyTests) / totalTests * 100).toFixed(2);
    const allTags = /* @__PURE__ */ new Set();
    results.forEach(
      (result) => result.testTags.forEach((tag) => allTags.add(tag))
    );
    const projectResults = this.calculateProjectResults(
      filteredResults,
      results,
      projectSet
    );
    const utcRunDate = formatDateUTC(/* @__PURE__ */ new Date());
    const localRunDate = formatDateLocal(utcRunDate);
    const testHistories = await Promise.all(
      results.map(async (result) => {
        const testId = `${result.filePath}:${result.projectName}:${result.title}`;
        const history = await this.dbManager.getTestHistory(testId);
        return {
          testId,
          history
        };
      })
    );
    return {
      utcRunDate,
      localRunDate,
      testHistories,
      logo: this.kbsConfig.logo || void 0,
      totalDuration,
      results,
      retryCount: results.filter((r) => r.isRetry).length,
      passCount: passedTests,
      failCount: failed,
      skipCount: results.filter((r) => r.status === "skipped").length,
      flakyCount: flakyTests,
      totalCount: filteredResults.length,
      groupedResults: groupResults(this.kbsConfig, results),
      projectName: this.kbsConfig.projectName,
      authorName: this.kbsConfig.authorName,
      meta: this.kbsConfig.meta,
      testType: this.kbsConfig.testType,
      preferredTheme: this.kbsConfig.preferredTheme,
      successRate,
      lastRunDate: formatDate(/* @__PURE__ */ new Date()),
      projects: projectSet,
      allTags: Array.from(allTags),
      showProject: this.kbsConfig.showProject || false,
      title: this.kbsConfig.title || "Kbs Playwright Test Report",
      chartType: this.kbsConfig.chartType || "pie",
      reportAnalyticsData: await this.getReportData(),
      chartData: await this.chartTrendData(),
      ...this.extractProjectStats(projectResults)
    };
  }
  calculateProjectResults(filteredResults, results, projectSet) {
    return Array.from(projectSet).map((projectName) => {
      const projectTests = filteredResults.filter(
        (r) => r.projectName === projectName
      );
      const allProjectTests = results.filter(
        (r) => r.projectName === projectName
      );
      return {
        projectName,
        passedTests: projectTests.filter((r) => r.status === "passed").length,
        failedTests: projectTests.filter(
          (r) => r.status === "failed" || r.status === "timedOut"
        ).length,
        skippedTests: allProjectTests.filter((r) => r.status === "skipped").length,
        retryTests: allProjectTests.filter((r) => r.isRetry).length,
        flakyTests: allProjectTests.filter((r) => r.status === "flaky").length,
        totalTests: projectTests.length
      };
    });
  }
  extractProjectStats(projectResults) {
    return {
      projectNames: projectResults.map((result) => result.projectName),
      totalTests: projectResults.map((result) => result.totalTests),
      passedTests: projectResults.map((result) => result.passedTests),
      failedTests: projectResults.map((result) => result.failedTests),
      skippedTests: projectResults.map((result) => result.skippedTests),
      retryTests: projectResults.map((result) => result.retryTests),
      flakyTests: projectResults.map((result) => result.flakyTests)
    };
  }
  registerHandlebarsHelpers() {
    import_handlebars.default.registerHelper("joinWithSpace", (array) => array.join(" "));
    import_handlebars.default.registerHelper("json", (context) => safeStringify(context));
    import_handlebars.default.registerHelper(
      "eq",
      (actualStatus, expectedStatus) => actualStatus === expectedStatus
    );
    import_handlebars.default.registerHelper(
      "includes",
      (actualStatus, expectedStatus) => actualStatus.includes(expectedStatus)
    );
    import_handlebars.default.registerHelper("gr", (count) => count > 0);
    import_handlebars.default.registerHelper("or", function(a3, b2) {
      return a3 || b2;
    });
    import_handlebars.default.registerHelper("concat", function(...args) {
      args.pop();
      return args.join("");
    });
  }
  registerPartials() {
    [
      "head",
      "sidebar",
      "testPanel",
      "summaryCard",
      "userInfo",
      "project",
      "testStatus",
      "testIcons",
      "analytics"
    ].forEach((partialName) => {
      import_handlebars.default.registerPartial(
        partialName,
        import_fs2.default.readFileSync(
          import_path3.default.resolve(__dirname, "views", `${partialName}.hbs`),
          "utf-8"
        )
      );
    });
  }
};

// src/helpers/resultProcessor .ts
var import_ansi_to_html = __toESM(require("ansi-to-html"));
var import_path5 = __toESM(require("path"));

// src/utils/attachFiles.ts
var import_path4 = __toESM(require("path"));
var import_fs4 = __toESM(require("fs"));

// src/helpers/markdownConverter.ts
var import_fs3 = __toESM(require("fs"));

// node_modules/marked/lib/marked.esm.js
function M() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var w = M();
function H(a3) {
  w = a3;
}
var C = { exec: () => null };
function h(a3, e = "") {
  let t = typeof a3 == "string" ? a3 : a3.source, n = { replace: (s, i) => {
    let r = typeof i == "string" ? i : i.source;
    return r = r.replace(m.caret, "$1"), t = t.replace(s, r), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (a3) => new RegExp(`^( {0,3}${a3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (a3) => new RegExp(`^ {0,${Math.min(3, a3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (a3) => new RegExp(`^ {0,${Math.min(3, a3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (a3) => new RegExp(`^ {0,${Math.min(3, a3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (a3) => new RegExp(`^ {0,${Math.min(3, a3 - 1)}}#`), htmlBeginRegex: (a3) => new RegExp(`^ {0,${Math.min(3, a3 - 1)}}<(?:[a-z].*>|!--)`, "i") };
var xe = /^(?:[ \t]*(?:\n|$))+/;
var be = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Te = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var I = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var j = /(?:[*+-]|\d{1,9}[.)])/;
var re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ie = h(re).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var ye = h(re).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var F = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Re = /^[^\n]+/;
var Q = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var Se = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var $e = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, j).getRegex();
var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var oe = h(F).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var Le = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex();
var K = { blockquote: Le, code: be, def: Se, fences: Te, heading: we, hr: I, html: _e, lheading: ie, list: $e, newline: xe, paragraph: oe, table: C, text: Re };
var se = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var ze = { ...K, lheading: ye, table: se, paragraph: h(F).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
var Me = { ...K, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: C, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(F).replace("hr", I).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Pe = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ae = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var le = /^( {2,}|\\)\n(?!\s*$)/;
var Ee = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var D = /[\p{P}\p{S}]/u;
var X = /[\s\p{P}\p{S}]/u;
var ae = /[^\s\p{P}\p{S}]/u;
var Ce = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, X).getRegex();
var ce = /(?!~)[\p{P}\p{S}]/u;
var Ie = /(?!~)[\s\p{P}\p{S}]/u;
var Oe = /(?:[^\s\p{P}\p{S}]|~)/u;
var Be = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var pe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var qe = h(pe, "u").replace(/punct/g, D).getRegex();
var ve = h(pe, "u").replace(/punct/g, ce).getRegex();
var ue = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var De = h(ue, "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex();
var Ze = h(ue, "gu").replace(/notPunctSpace/g, Oe).replace(/punctSpace/g, Ie).replace(/punct/g, ce).getRegex();
var Ge = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex();
var He = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
var Ne = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var je = h(U).replace("(?:-->|$)", "-->").getRegex();
var Fe = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var Qe = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var he = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex();
var ke = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex();
var Ue = h("reflink|nolink(?!\\()", "g").replace("reflink", he).replace("nolink", ke).getRegex();
var W = { _backpedal: C, anyPunctuation: He, autolink: Ne, blockSkip: Be, br: le, code: Ae, del: C, emStrongLDelim: qe, emStrongRDelimAst: De, emStrongRDelimUnd: Ge, escape: Pe, link: Qe, nolink: ke, punctuation: Ce, reflink: he, reflinkSearch: Ue, tag: Fe, text: Ee, url: C };
var Ke = { ...W, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
var N = { ...W, emStrongRDelimAst: Ze, emStrongLDelim: ve, url: h(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ };
var Xe = { ...N, br: h(le).replace("{2,}", "*").getRegex(), text: h(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var O = { normal: K, gfm: ze, pedantic: Me };
var P = { normal: W, gfm: N, breaks: Xe, pedantic: Ke };
var We = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (a3) => We[a3];
function R(a3, e) {
  if (e) {
    if (m.escapeTest.test(a3)) return a3.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(a3)) return a3.replace(m.escapeReplaceNoEncode, ge);
  return a3;
}
function J(a3) {
  try {
    a3 = encodeURI(a3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return a3;
}
function V(a3, e) {
  let t = a3.replace(m.findPipe, (i, r, o) => {
    let l = false, c = r;
    for (; --c >= 0 && o[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), n = t.split(m.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; s < n.length; s++) n[s] = n[s].trim().replace(m.slashPipe, "|");
  return n;
}
function A(a3, e, t) {
  let n = a3.length;
  if (n === 0) return "";
  let s = 0;
  for (; s < n; ) {
    let i = a3.charAt(n - s - 1);
    if (i === e && !t) s++;
    else if (i !== e && t) s++;
    else break;
  }
  return a3.slice(0, n - s);
}
function fe(a3, e) {
  if (a3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < a3.length; n++) if (a3[n] === "\\") n++;
  else if (a3[n] === e[0]) t++;
  else if (a3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function de(a3, e, t, n, s) {
  let i = e.href, r = e.title || null, o = a3[1].replace(s.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let l = { type: a3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: r, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = false, l;
}
function Je(a3, e, t) {
  let n = a3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let s = n[1];
  return e.split(`
`).map((i) => {
    let r = i.match(t.other.beginningSpace);
    if (r === null) return i;
    let [o] = r;
    return o.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var S = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "rules");
    __publicField(this, "lexer");
    this.options = e || w;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : A(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], s = Je(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = A(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: A(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = A(t[0], `
`).split(`
`), s = "", i = "", r = [];
      for (; n.length > 0; ) {
        let o = false, l = [], c;
        for (c = 0; c < n.length; c++) if (this.rules.other.blockquoteStart.test(n[c])) l.push(n[c]), o = true;
        else if (!o) l.push(n[c]);
        else break;
        n = n.slice(c);
        let p = l.join(`
`), u = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${p}` : p, i = i ? `${i}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(u, r, true), this.lexer.state.top = d, n.length === 0) break;
        let g = r.at(-1);
        if (g?.type === "code") break;
        if (g?.type === "blockquote") {
          let x = g, f = x.raw + `
` + n.join(`
`), y = this.blockquote(f);
          r[r.length - 1] = y, s = s.substring(0, s.length - x.raw.length) + y.raw, i = i.substring(0, i.length - x.text.length) + y.text;
          break;
        } else if (g?.type === "list") {
          let x = g, f = x.raw + `
` + n.join(`
`), y = this.list(f);
          r[r.length - 1] = y, s = s.substring(0, s.length - g.raw.length) + y.raw, i = i.substring(0, i.length - x.raw.length) + y.raw, n = f.substring(r.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: r, text: i };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), s = n.length > 1, i = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let r = this.rules.other.listItemRegex(n), o = false;
      for (; e; ) {
        let c = false, p = "", u = "";
        if (!(t = r.exec(e)) || this.rules.block.hr.test(e)) break;
        p = t[0], e = e.substring(p.length);
        let d = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Z) => " ".repeat(3 * Z.length)), g = e.split(`
`, 1)[0], x = !d.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, u = d.trimStart()) : x ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, u = d.slice(f), f += t[1].length), x && this.rules.other.blankLine.test(g) && (p += g + `
`, e = e.substring(g.length + 1), c = true), !c) {
          let Z = this.rules.other.nextBulletRegex(f), ee = this.rules.other.hrRegex(f), te = this.rules.other.fencesBeginRegex(f), ne = this.rules.other.headingBeginRegex(f), me = this.rules.other.htmlBeginRegex(f);
          for (; e; ) {
            let G = e.split(`
`, 1)[0], E;
            if (g = G, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), E = g) : E = g.replace(this.rules.other.tabCharGlobal, "    "), te.test(g) || ne.test(g) || me.test(g) || Z.test(g) || ee.test(g)) break;
            if (E.search(this.rules.other.nonSpaceChar) >= f || !g.trim()) u += `
` + E.slice(f);
            else {
              if (x || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(d) || ne.test(d) || ee.test(d)) break;
              u += `
` + g;
            }
            !x && !g.trim() && (x = true), p += G + `
`, e = e.substring(G.length + 1), d = E.slice(f);
          }
        }
        i.loose || (o ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (o = true));
        let y = null, Y;
        this.options.gfm && (y = this.rules.other.listIsTask.exec(u), y && (Y = y[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: p, task: !!y, checked: Y, loose: false, text: u, tokens: [] }), i.raw += p;
      }
      let l = i.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let c = 0; c < i.items.length; c++) if (this.lexer.state.top = false, i.items[c].tokens = this.lexer.blockTokens(i.items[c].text, []), !i.loose) {
        let p = i.items[c].tokens.filter((d) => d.type === "space"), u = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
        i.loose = u;
      }
      if (i.loose) for (let c = 0; c < i.items.length; c++) i.items[c].loose = true;
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: s, title: i };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = V(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], r = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let o of s) this.rules.other.tableAlignRight.test(o) ? r.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? r.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? r.align.push("left") : r.align.push(null);
      for (let o = 0; o < n.length; o++) r.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: r.align[o] });
      for (let o of i) r.rows.push(V(o, r.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: false, align: r.align[c] })));
      return r;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let r = A(n.slice(0, -1), "\\");
        if ((n.length - r.length) % 2 === 0) return;
      } else {
        let r = fe(t[2], "()");
        if (r === -2) return;
        if (r > -1) {
          let l = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + r;
          t[2] = t[2].substring(0, r), t[0] = t[0].substring(0, l).trim(), t[3] = "";
        }
      }
      let s = t[2], i = "";
      if (this.options.pedantic) {
        let r = this.rules.other.pedanticHrefTitle.exec(s);
        r && (s = r[1], i = r[3]);
      } else i = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), de(t, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[s.toLowerCase()];
      if (!i) {
        let r = n[0].charAt(0);
        return { type: "text", raw: r, text: r };
      }
      return de(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let r = [...s[0]].length - 1, o, l, c = r, p = 0, u = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, t = t.slice(-1 * e.length + r); (s = u.exec(t)) != null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (l = [...o].length, s[3] || s[4]) {
          c += l;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + l) % 3)) {
          p += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + p);
        let d = [...s[0]][0].length, g = e.slice(0, r + s.index + d + l);
        if (Math.min(r, l) % 2) {
          let f = g.slice(1, -1);
          return { type: "em", raw: g, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let x = g.slice(2, -2);
        return { type: "strong", raw: g, text: x, tokens: this.lexer.inlineTokens(x) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e) {
    let t = this.rules.inline.del.exec(e);
    if (t) return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, s;
      if (t[2] === "@") n = t[0], s = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var b = class a {
  constructor(e) {
    __publicField(this, "tokens");
    __publicField(this, "options");
    __publicField(this, "state");
    __publicField(this, "tokenizer");
    __publicField(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || w, this.options.tokenizer = this.options.tokenizer || new S(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: O.normal, inline: P.normal };
    this.options.pedantic ? (t.block = O.pedantic, t.inline = P.pedantic) : this.options.gfm && (t.block = O.gfm, this.options.breaks ? t.inline = P.breaks : t.inline = P.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: O, inline: P };
  }
  static lex(e, t) {
    return new a(t).lex(e);
  }
  static lexInline(e, t) {
    return new a(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
      let s;
      if (this.options.extensions?.block?.some((r) => (s = r.call({ lexer: this }, e, t)) ? (e = e.substring(s.raw.length), t.push(s), true) : false)) continue;
      if (s = this.tokenizer.space(e)) {
        e = e.substring(s.raw.length);
        let r = t.at(-1);
        s.raw.length === 1 && r !== void 0 ? r.raw += `
` : t.push(s);
        continue;
      }
      if (s = this.tokenizer.code(e)) {
        e = e.substring(s.raw.length);
        let r = t.at(-1);
        r?.type === "paragraph" || r?.type === "text" ? (r.raw += `
` + s.raw, r.text += `
` + s.text, this.inlineQueue.at(-1).src = r.text) : t.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.list(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.html(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.def(e)) {
        e = e.substring(s.raw.length);
        let r = t.at(-1);
        r?.type === "paragraph" || r?.type === "text" ? (r.raw += `
` + s.raw, r.text += `
` + s.raw, this.inlineQueue.at(-1).src = r.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = { href: s.href, title: s.title });
        continue;
      }
      if (s = this.tokenizer.table(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let r = 1 / 0, o = e.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, o), typeof l == "number" && l >= 0 && (r = Math.min(r, l));
        }), r < 1 / 0 && r >= 0 && (i = e.substring(0, r + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(i))) {
        let r = t.at(-1);
        n && r?.type === "paragraph" ? (r.raw += `
` + s.raw, r.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(s), n = i.length !== e.length, e = e.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(e)) {
        e = e.substring(s.raw.length);
        let r = t.at(-1);
        r?.type === "text" ? (r.raw += `
` + s.raw, r.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(s);
        continue;
      }
      if (e) {
        let r = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(r);
          break;
        } else throw new Error(r);
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    let n = e, s = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, s.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let i = false, r = "";
    for (; e; ) {
      i || (r = ""), i = false;
      let o;
      if (this.options.extensions?.inline?.some((c) => (o = c.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let c = t.at(-1);
        o.type === "text" && c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, r)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let l = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
        }), c < 1 / 0 && c >= 0 && (l = e.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(l)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (r = o.raw.slice(-1)), i = true;
        let c = t.at(-1);
        c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        let c = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else throw new Error(c);
      }
    }
    return t;
  }
};
var $ = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "parser");
    this.options = e || w;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let s = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + R(s) + '">' + (n ? i : R(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : R(i, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, s = "";
    for (let o = 0; o < e.items.length; o++) {
      let l = e.items[o];
      s += this.listitem(l);
    }
    let i = t ? "ol" : "ul", r = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + r + `>
` + s + "</" + i + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      let n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + R(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = true)) : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let i = 0; i < e.rows.length; i++) {
      let r = e.rows[i];
      n = "";
      for (let o = 0; o < r.length; o++) n += this.tablecell(r[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${R(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let s = this.parser.parseInline(n), i = J(e);
    if (i === null) return s;
    e = i;
    let r = '<a href="' + e + '"';
    return t && (r += ' title="' + R(t) + '"'), r += ">" + s + "</a>", r;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let i = J(e);
    if (i === null) return R(n);
    e = i;
    let r = `<img src="${e}" alt="${n}"`;
    return t && (r += ` title="${R(t)}"`), r += ">", r;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : R(e.text);
  }
};
var _ = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
};
var T = class a2 {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "renderer");
    __publicField(this, "textRenderer");
    this.options = e || w, this.options.renderer = this.options.renderer || new $(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new _();
  }
  static parse(e, t) {
    return new a2(t).parse(e);
  }
  static parseInline(e, t) {
    return new a2(t).parseInline(e);
  }
  parse(e, t = true) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, l = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (l !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(o.type)) {
          n += l || "";
          continue;
        }
      }
      let r = i;
      switch (r.type) {
        case "space": {
          n += this.renderer.space(r);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(r);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(r);
          continue;
        }
        case "code": {
          n += this.renderer.code(r);
          continue;
        }
        case "table": {
          n += this.renderer.table(r);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(r);
          continue;
        }
        case "list": {
          n += this.renderer.list(r);
          continue;
        }
        case "html": {
          n += this.renderer.html(r);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(r);
          continue;
        }
        case "text": {
          let o = r, l = this.renderer.text(o);
          for (; s + 1 < e.length && e[s + 1].type === "text"; ) o = e[++s], l += `
` + this.renderer.text(o);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: l, text: l, tokens: [{ type: "text", raw: l, text: l, escaped: true }] }) : n += l;
          continue;
        }
        default: {
          let o = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  parseInline(e, t = this.renderer) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
          continue;
        }
      }
      let r = i;
      switch (r.type) {
        case "escape": {
          n += t.text(r);
          break;
        }
        case "html": {
          n += t.html(r);
          break;
        }
        case "link": {
          n += t.link(r);
          break;
        }
        case "image": {
          n += t.image(r);
          break;
        }
        case "strong": {
          n += t.strong(r);
          break;
        }
        case "em": {
          n += t.em(r);
          break;
        }
        case "codespan": {
          n += t.codespan(r);
          break;
        }
        case "br": {
          n += t.br(r);
          break;
        }
        case "del": {
          n += t.del(r);
          break;
        }
        case "text": {
          n += t.text(r);
          break;
        }
        default: {
          let o = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var _a;
var L = (_a = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "block");
    this.options = e || w;
  }
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  provideLexer() {
    return this.block ? b.lex : b.lexInline;
  }
  provideParser() {
    return this.block ? T.parse : T.parseInline;
  }
}, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a);
var B = class {
  constructor(...e) {
    __publicField(this, "defaults", M());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", T);
    __publicField(this, "Renderer", $);
    __publicField(this, "TextRenderer", _);
    __publicField(this, "Lexer", b);
    __publicField(this, "Tokenizer", S);
    __publicField(this, "Hooks", L);
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
      case "table": {
        let i = s;
        for (let r of i.header) n = n.concat(this.walkTokens(r.tokens, t));
        for (let r of i.rows) for (let o of r) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let i = s;
        n = n.concat(this.walkTokens(i.items, t));
        break;
      }
      default: {
        let i = s;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((r) => {
          let o = i[r].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let r = t.renderers[i.name];
          r ? t.renderers[i.name] = function(...o) {
            let l = i.renderer.apply(this, o);
            return l === false && (l = r.apply(this, o)), l;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let r = t[i.level];
          r ? r.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), s.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new $(this.defaults);
        for (let r in n.renderer) {
          if (!(r in i)) throw new Error(`renderer '${r}' does not exist`);
          if (["options", "parser"].includes(r)) continue;
          let o = r, l = n.renderer[o], c = i[o];
          i[o] = (...p) => {
            let u = l.apply(i, p);
            return u === false && (u = c.apply(i, p)), u || "";
          };
        }
        s.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new S(this.defaults);
        for (let r in n.tokenizer) {
          if (!(r in i)) throw new Error(`tokenizer '${r}' does not exist`);
          if (["options", "rules", "lexer"].includes(r)) continue;
          let o = r, l = n.tokenizer[o], c = i[o];
          i[o] = (...p) => {
            let u = l.apply(i, p);
            return u === false && (u = c.apply(i, p)), u;
          };
        }
        s.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new L();
        for (let r in n.hooks) {
          if (!(r in i)) throw new Error(`hook '${r}' does not exist`);
          if (["options", "block"].includes(r)) continue;
          let o = r, l = n.hooks[o], c = i[o];
          L.passThroughHooks.has(r) ? i[o] = (p) => {
            if (this.defaults.async) return Promise.resolve(l.call(i, p)).then((d) => c.call(i, d));
            let u = l.call(i, p);
            return c.call(i, u);
          } : i[o] = (...p) => {
            let u = l.apply(i, p);
            return u === false && (u = c.apply(i, p)), u;
          };
        }
        s.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, r = n.walkTokens;
        s.walkTokens = function(o) {
          let l = [];
          return l.push(r.call(this, o)), i && (l = l.concat(i.call(this, o))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return b.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return T.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      let i = { ...s }, r = { ...this.defaults, ...i }, o = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === true && i.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      r.hooks && (r.hooks.options = r, r.hooks.block = e);
      let l = r.hooks ? r.hooks.provideLexer() : e ? b.lex : b.lexInline, c = r.hooks ? r.hooks.provideParser() : e ? T.parse : T.parseInline;
      if (r.async) return Promise.resolve(r.hooks ? r.hooks.preprocess(n) : n).then((p) => l(p, r)).then((p) => r.hooks ? r.hooks.processAllTokens(p) : p).then((p) => r.walkTokens ? Promise.all(this.walkTokens(p, r.walkTokens)).then(() => p) : p).then((p) => c(p, r)).then((p) => r.hooks ? r.hooks.postprocess(p) : p).catch(o);
      try {
        r.hooks && (n = r.hooks.preprocess(n));
        let p = l(n, r);
        r.hooks && (p = r.hooks.processAllTokens(p)), r.walkTokens && this.walkTokens(p, r.walkTokens);
        let u = c(p, r);
        return r.hooks && (u = r.hooks.postprocess(u)), u;
      } catch (p) {
        return o(p);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let s = "<p>An error occurred:</p><pre>" + R(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var z = new B();
function k(a3, e) {
  return z.parse(a3, e);
}
k.options = k.setOptions = function(a3) {
  return z.setOptions(a3), k.defaults = z.defaults, H(k.defaults), k;
};
k.getDefaults = M;
k.defaults = w;
k.use = function(...a3) {
  return z.use(...a3), k.defaults = z.defaults, H(k.defaults), k;
};
k.walkTokens = function(a3, e) {
  return z.walkTokens(a3, e);
};
k.parseInline = z.parseInline;
k.Parser = T;
k.parser = T.parse;
k.Renderer = $;
k.TextRenderer = _;
k.Lexer = b;
k.lexer = b.lex;
k.Tokenizer = S;
k.Hooks = L;
k.parse = k;
var Dt = k.options;
var Zt = k.setOptions;
var Gt = k.use;
var Ht = k.walkTokens;
var Nt = k.parseInline;
var Ft = T.parse;
var Qt = b.lex;

// src/helpers/markdownConverter.ts
function convertMarkdownToHtml(markdownPath, htmlOutputPath, stepsError, resultError) {
  const hasMarkdown = import_fs3.default.existsSync(markdownPath);
  const markdownContent = hasMarkdown ? import_fs3.default.readFileSync(markdownPath, "utf-8") : "";
  const markdownHtml = hasMarkdown ? k(markdownContent) : "";
  const stepsHtml = stepsError.filter((step) => step.snippet?.trim()).map(
    (step) => `
      <div>
        <pre><code>${step.snippet}</code></pre>
        ${step.location ? `<p><em>Location: ${escapeHtml(step.location)}</em></p>` : ""}
      </div>`
  ).join("\n");
  const errorHtml = resultError.map((error) => `<pre><code>${error}</code></pre>`).join("\n");
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Kbs Error Report</title>
      <style>
        body { font-family: sans-serif; padding: 2rem; line-height: 1.6; max-width: 900px; margin: auto; }
        code, pre { background: #f4f4f4; padding: 0.5rem; border-radius: 5px; display: block; overflow-x: auto; }
        h1, h2, h3 { color: #444; }
        hr { margin: 2em 0; }
        #copyBtn {
          background-color: #007acc;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        #copyBtn:hover {
          background-color: #005fa3;
        }
      </style>
    </head>
    <body>
      <button id="copyBtn">\u{1F4CB} Copy All</button>
      <script>
        document.getElementById("copyBtn").addEventListener("click", () => {
          const content = document.getElementById("markdownContent").innerText;
          navigator.clipboard.writeText(content).then(() => {
            // change button text to indicate success
            const button = document.getElementById("copyBtn");
            button.textContent = "\u2705 Copied!";
            setTimeout(() => {
              button.textContent = "\u{1F4CB} Copy All"
              }, 2000);
          }).catch(err => {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy text. Please try manually.");   
          });
        });
      </script>
      <div id="markdownContent">
      <h1>Instructions</h1>
      <ul>
        <li>Following Playwright test failed.</li>
        <li>Explain why, be concise, respect Playwright best practices.</li>
        <li>Provide a snippet of code with the fix, if possible.</li>
      </ul>
      <h1>Error Details</h1>
      ${errorHtml || "<p>No errors found.</p>"}
      ${stepsHtml || "<p>No step data available.</p>"}
      ${markdownHtml || ""}
      </div>
    </body>
    </html>
  `;
  import_fs3.default.writeFileSync(htmlOutputPath, fullHtml, "utf-8");
  if (hasMarkdown) {
    import_fs3.default.unlinkSync(markdownPath);
  }
}

// src/utils/attachFiles.ts
function attachFiles(subFolder, result, testResult, config, steps, errors) {
  const folderPath = config.folderPath || "kbs-report";
  const attachmentsFolder = import_path4.default.join(
    folderPath,
    "kbs-data",
    "attachments",
    subFolder
  );
  if (!import_fs4.default.existsSync(attachmentsFolder)) {
    import_fs4.default.mkdirSync(attachmentsFolder, { recursive: true });
  }
  if (!result.attachments) return;
  const { base64Image } = config;
  testResult.screenshots = [];
  result.attachments.forEach((attachment) => {
    const { contentType, name, path: attachmentPath, body } = attachment;
    if (!attachmentPath && !body) return;
    const fileName = attachmentPath ? import_path4.default.basename(attachmentPath) : `${name}.${getFileExtension(contentType)}`;
    const relativePath = import_path4.default.join(
      "kbs-data",
      "attachments",
      subFolder,
      fileName
    );
    const fullPath = import_path4.default.join(attachmentsFolder, fileName);
    if (contentType === "image/png") {
      handleImage(
        attachmentPath,
        body,
        base64Image,
        fullPath,
        relativePath,
        testResult
      );
    } else if (name === "video") {
      handleAttachment(
        attachmentPath,
        fullPath,
        relativePath,
        "videoPath",
        testResult
      );
    } else if (name === "trace") {
      handleAttachment(
        attachmentPath,
        fullPath,
        relativePath,
        "tracePath",
        testResult
      );
    } else if (name === "error-context") {
      handleAttachment(
        attachmentPath,
        fullPath,
        relativePath,
        "markdownPath",
        testResult,
        steps,
        errors
      );
    }
  });
}
function handleImage(attachmentPath, body, base64Image, fullPath, relativePath, testResult) {
  let screenshotPath = "";
  if (attachmentPath) {
    try {
      const screenshotContent = import_fs4.default.readFileSync(
        attachmentPath,
        base64Image ? "base64" : void 0
      );
      screenshotPath = base64Image ? `data:image/png;base64,${screenshotContent}` : relativePath;
      if (!base64Image) {
        import_fs4.default.copyFileSync(attachmentPath, fullPath);
      }
    } catch (error) {
      console.error(
        `KbsReport: Failed to read screenshot file: ${attachmentPath}`,
        error
      );
    }
  } else if (body) {
    screenshotPath = `data:image/png;base64,${body.toString("base64")}`;
  }
  if (screenshotPath) {
    testResult.screenshots?.push(screenshotPath);
  }
}
function handleAttachment(attachmentPath, fullPath, relativePath, resultKey, testResult, steps, errors) {
  if (attachmentPath) {
    import_fs4.default.copyFileSync(attachmentPath, fullPath);
    testResult[resultKey] = relativePath;
  }
  if (resultKey === "markdownPath" && errors) {
    const htmlPath = fullPath.replace(/\.md$/, ".html");
    const htmlRelativePath = relativePath.replace(/\.md$/, ".html");
    convertMarkdownToHtml(fullPath, htmlPath, steps || [], errors || []);
    testResult[resultKey] = htmlRelativePath;
    return;
  }
}
function getFileExtension(contentType) {
  const extensions = {
    "image/png": "png",
    "video/webm": "webm",
    "application/zip": "zip",
    "text/markdown": "md"
  };
  return extensions[contentType] || "unknown";
}

// src/helpers/resultProcessor .ts
var TestResultProcessor = class {
  constructor(projectRoot) {
    this.ansiToHtml = new import_ansi_to_html.default({ fg: "var(--snippet-color)" });
    this.projectRoot = projectRoot;
  }
  processTestResult(test, result, projectSet, kbsConfig) {
    const status = test.outcome() === "flaky" ? "flaky" : result.status;
    const projectName = test.titlePath()[1];
    projectSet.add(projectName);
    const location = test.location;
    const filePath = normalizeFilePath(test.titlePath()[2]);
    const tagPattern = /@[\w]+/g;
    const title = test.title.replace(tagPattern, "").trim();
    const suite = test.titlePath()[3].replace(tagPattern, "").trim();
    const testResult = {
      port: kbsConfig.port || 2004,
      annotations: test.annotations,
      testTags: test.tags,
      location: `${filePath}:${location.line}:${location.column}`,
      retry: result.retry > 0 ? "retry" : "",
      isRetry: result.retry,
      projectName,
      suite,
      title,
      status,
      flaky: test.outcome(),
      duration: msToTime(result.duration),
      errors: result.errors.map(
        (e) => this.ansiToHtml.toHtml(escapeHtml(e.stack || e.toString()))
      ),
      steps: this.processSteps(result.steps),
      logs: this.ansiToHtml.toHtml(
        escapeHtml(
          result.stdout.concat(result.stderr).map((log) => log).join("\n")
        )
      ),
      filePath,
      filters: projectSet,
      base64Image: kbsConfig.base64Image
    };
    attachFiles(
      test.id,
      result,
      testResult,
      kbsConfig,
      testResult.steps,
      testResult.errors
    );
    return testResult;
  }
  processSteps(steps) {
    return steps.map((step) => {
      const stepLocation = step.location ? `${import_path5.default.relative(this.projectRoot, step.location.file)}:${step.location.line}:${step.location.column}` : "";
      return {
        snippet: this.ansiToHtml.toHtml(escapeHtml(step.error?.snippet || "")),
        title: step.title,
        location: step.error ? stepLocation : ""
      };
    });
  }
};

// src/utils/expressServer.ts
var import_express = __toESM(require("express"));
var import_path6 = __toESM(require("path"));
var import_child_process = require("child_process");
function startReportServer(reportFolder, reportFilename, port = 2004, open2) {
  const app = (0, import_express.default)();
  app.use(import_express.default.static(reportFolder));
  app.get("/", (_req, res) => {
    try {
      res.sendFile(import_path6.default.resolve(reportFolder, reportFilename));
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
      if (open2 === "always" || open2 === "on-failure") {
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

// src/helpers/serverManager.ts
var ServerManager = class {
  constructor(kbsConfig) {
    this.kbsConfig = kbsConfig;
  }
  startServer(folderPath, outputFilename, overAllStatus) {
    const openOption = this.kbsConfig.open || "never";
    const hasFailures = overAllStatus === "failed";
    if (openOption === "always" || openOption === "on-failure" && hasFailures) {
      startReportServer(
        folderPath,
        outputFilename,
        this.kbsConfig.port,
        openOption
      );
    }
  }
};

// src/helpers/databaseManager.ts
var import_sqlite = require("sqlite");
var import_sqlite3 = __toESM(require("sqlite3"));
var DatabaseManager = class {
  constructor() {
    this.db = null;
  }
  async initialize(dbPath) {
    try {
      this.db = await (0, import_sqlite.open)({
        filename: dbPath,
        driver: import_sqlite3.default.Database
      });
      await this.createTables();
      await this.createIndexes();
    } catch (error) {
      console.error("KbsReport: Error initializing database:", error);
    }
  }
  async createTables() {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return;
    }
    try {
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS test_runs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          run_date TEXT
        );

        CREATE TABLE IF NOT EXISTS test_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          run_id INTEGER,
          test_id TEXT,
          status TEXT,
          duration TEXT,
          error_message TEXT,
          FOREIGN KEY (run_id) REFERENCES test_runs (id)
        );
      `);
    } catch (error) {
      console.error("KbsReport: Error creating tables:", error);
    }
  }
  async createIndexes() {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return;
    }
    try {
      await this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_test_id ON test_results (test_id);
        CREATE INDEX IF NOT EXISTS idx_run_id ON test_results (run_id);
      `);
    } catch (error) {
      console.error("KbsReport: Error creating indexes:", error);
    }
  }
  async saveTestRun() {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return null;
    }
    try {
      const runDate = (/* @__PURE__ */ new Date()).toISOString();
      const { lastID } = await this.db.run(
        `
        INSERT INTO test_runs (run_date)
        VALUES (?)
      `,
        [runDate]
      );
      return lastID;
    } catch (error) {
      console.error("KbsReport: Error saving test run:", error);
      return null;
    }
  }
  async saveTestResults(runId, results) {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return;
    }
    try {
      await this.db.exec("BEGIN TRANSACTION;");
      const stmt = await this.db.prepare(`
        INSERT INTO test_results (run_id, test_id, status, duration, error_message)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const result of results) {
        await stmt.run([
          runId,
          `${result.filePath}:${result.projectName}:${result.title}`,
          result.status,
          result.duration,
          result.errors.join("\n")
        ]);
      }
      await stmt.finalize();
      await this.db.exec("COMMIT;");
    } catch (error) {
      await this.db.exec("ROLLBACK;");
      console.error("KbsReport: Error saving test results:", error);
    }
  }
  async getTestHistory(testId, limit = 10) {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return [];
    }
    try {
      const results = await this.db.all(
        `
        SELECT tr.status, tr.duration, tr.error_message, trun.run_date
        FROM test_results tr
        JOIN test_runs trun ON tr.run_id = trun.id
        WHERE tr.test_id = ?
        ORDER BY trun.run_date DESC
        LIMIT ?
      `,
        [testId, limit]
      );
      return results.map((result) => ({
        ...result,
        run_date: formatDateLocal(result.run_date)
      }));
    } catch (error) {
      console.error("KbsReport: Error getting test history:", error);
      return [];
    }
  }
  async close() {
    if (this.db) {
      try {
        await this.db.close();
      } catch (error) {
        console.error("KbsReport: Error closing database:", error);
      } finally {
        this.db = null;
      }
    }
  }
  async getSummaryData() {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return {
        totalRuns: 0,
        totalTests: 0,
        passed: 0,
        failed: 0,
        passRate: 0,
        avgDuration: 0
      };
    }
    try {
      const summary = await this.db.get(`
      SELECT
        (SELECT COUNT(*) FROM test_runs) as totalRuns,
        (SELECT COUNT(*) FROM test_results) as totalTests,
        (SELECT COUNT(*) FROM test_results WHERE status = 'passed') as passed,
        (SELECT COUNT(*) FROM test_results WHERE status = 'failed') as failed,
        (SELECT AVG(CAST(duration AS FLOAT)) FROM test_results) as avgDuration
    `);
      const passRate = summary.totalTests ? (summary.passed / summary.totalTests * 100).toFixed(2) : 0;
      return {
        totalRuns: summary.totalRuns,
        totalTests: summary.totalTests,
        passed: summary.passed,
        failed: summary.failed,
        passRate: parseFloat(passRate.toString()),
        avgDuration: Math.round(summary.avgDuration || 0)
      };
    } catch (error) {
      console.error("KbsReport: Error getting summary data:", error);
      return {
        totalRuns: 0,
        totalTests: 0,
        passed: 0,
        failed: 0,
        passRate: 0,
        avgDuration: 0
      };
    }
  }
  async getTrends(limit = 100) {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return [];
    }
    try {
      const rows = await this.db.all(
        `
      SELECT trun.run_date,
        SUM(CASE WHEN tr.status = 'passed' THEN 1 ELSE 0 END) AS passed,
        SUM(CASE WHEN tr.status = 'failed' THEN 1 ELSE 0 END) AS failed,
        AVG(CAST(tr.duration AS FLOAT)) AS avg_duration
      FROM test_results tr
      JOIN test_runs trun ON tr.run_id = trun.id
      GROUP BY trun.run_date
      ORDER BY trun.run_date DESC
      LIMIT ?
    `,
        [limit]
      );
      return rows.reverse().map((row) => ({
        ...row,
        run_date: formatDateLocal(row.run_date),
        avg_duration: Math.round(row.avg_duration || 0)
      }));
    } catch (error) {
      console.error("KbsReport: Error getting trends data:", error);
      return [];
    }
  }
  async getFlakyTests(limit = 10) {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return [];
    }
    try {
      return await this.db.all(
        `
      SELECT
        test_id,
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'flaky' THEN 1 ELSE 0 END) AS flaky
      FROM test_results
      GROUP BY test_id
      HAVING flaky > 0
      ORDER BY flaky DESC
      LIMIT ?
    `,
        [limit]
      );
    } catch (error) {
      console.error("KbsReport: Error getting flaky tests:", error);
      return [];
    }
  }
  async getSlowTests(limit = 10) {
    if (!this.db) {
      console.error("KbsReport: Database not initialized");
      return [];
    }
    try {
      const rows = await this.db.all(
        `
      SELECT
        test_id,
        AVG(CAST(duration AS FLOAT)) AS avg_duration
      FROM test_results
      GROUP BY test_id
      ORDER BY avg_duration DESC
      LIMIT ?
    `,
        [limit]
      );
      return rows.map((row) => ({
        test_id: row.test_id,
        avg_duration: Math.round(row.avg_duration || 0)
      }));
    } catch (error) {
      console.error("KbsReport: Error getting slow tests:", error);
      return [];
    }
  }
};

// src/kbs-report.ts
var import_path7 = __toESM(require("path"));
var KbsReport = class {
  constructor(kbsConfig = {}) {
    this.kbsConfig = kbsConfig;
    this.results = [];
    this.projectSet = /* @__PURE__ */ new Set();
    this.shouldGenerateReport = true;
    this.showConsoleLogs = true;
    this.skipTraceViewer = false;
    this.reportsCount = 0;
    this.folderPath = kbsConfig.folderPath || "kbs-report";
    this.outputFilename = ensureHtmlExtension(
      kbsConfig.filename || "kbs-report.html"
    );
    this.dbManager = new DatabaseManager();
    this.htmlGenerator = new HTMLGenerator(kbsConfig, this.dbManager);
    this.fileManager = new FileManager(this.folderPath);
    this.serverManager = new ServerManager(kbsConfig);
    this.testResultProcessor = new TestResultProcessor("");
    this.showConsoleLogs = kbsConfig.stdIO !== false;
  }
  async onBegin(config, _suite) {
    this.skipTraceViewer = config.projects.every((project) => {
      const trace = project.use?.trace;
      return trace === void 0 || trace === "off";
    });
    this.reportsCount = config.reporter.length;
    this.results = [];
    this.testResultProcessor = new TestResultProcessor(config.rootDir);
    this.fileManager.ensureReportDirectory();
    await this.dbManager.initialize(
      import_path7.default.join(this.folderPath, "kbs-data-history.sqlite")
    );
  }
  onStdOut(chunk, _test, _result) {
    if (this.reportsCount == 1 && this.showConsoleLogs) {
      console.log(chunk.toString().trim());
    }
  }
  onTestEnd(test, result) {
    try {
      const testResult = this.testResultProcessor.processTestResult(
        test,
        result,
        this.projectSet,
        this.kbsConfig
      );
      this.results.push(testResult);
    } catch (error) {
      console.error("KbsReport: Error processing test end:", error);
    }
  }
  printsToStdio() {
    return true;
  }
  onError(error) {
    if (error.location === void 0) {
      this.shouldGenerateReport = false;
    }
  }
  async onEnd(result) {
    try {
      this.overAllStatus = result.status;
      if (this.shouldGenerateReport) {
        const filteredResults = this.results.filter(
          (r) => r.status !== "skipped" && !r.isRetry
        );
        const totalDuration = msToTime(result.duration);
        const cssContent = this.fileManager.readCssContent();
        const runId = await this.dbManager.saveTestRun();
        if (runId !== null) {
          await this.dbManager.saveTestResults(runId, this.results);
          const html = await this.htmlGenerator.generateHTML(
            filteredResults,
            totalDuration,
            cssContent,
            this.results,
            this.projectSet
          );
          this.outputPath = this.fileManager.writeReportFile(
            this.outputFilename,
            html
          );
        } else {
          console.error("KbsReport: Error saving test run to database");
        }
      } else {
        console.error(
          "KbsReport: Report generation skipped due to error in Playwright worker!"
        );
      }
    } catch (error) {
      this.shouldGenerateReport = false;
      console.error("KbsReport: Error generating report:", error);
    }
  }
  async onExit() {
    try {
      await this.dbManager.close();
      if (this.shouldGenerateReport) {
        this.fileManager.copyTraceViewerAssets(this.skipTraceViewer);
        console.info(`Kbs HTML report generated at ${this.outputPath}`);
        this.serverManager.startServer(
          this.folderPath,
          this.outputFilename,
          this.overAllStatus
        );
        await new Promise((_resolve) => {
        });
      }
    } catch (error) {
      console.error("KbsReport: Error in onExit:", error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KbsReport
});
