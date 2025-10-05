import { Reporter, FullConfig, Suite, TestCase, TestResult, TestError, FullResult } from '@playwright/test/reporter';

/**
 * Configuration options for KbsReport.
 */
interface KbsReportConfig {
    /**
     * Open the report in local host (Trace viewer is accessible only in localhost)
     * @example "always"| "never"| "on-failure";
     * @default "never"
     */
    open?: "always" | "never" | "on-failure";
    /**
     * The title of the HTML report.
     * @example "Kbs Playwright Test Report"
     */
    title?: string;
    /**
     * Add project on the list of the tests? (Filtering projects still works if hidden)
     * @example true to display, false to hide.
     * @default false
     */
    showProject?: boolean;
    /**
     * The name of the project.
     * @example "Kbs Project"
     */
    projectName?: string;
    /**
     * The name of the author.
     * @example "Koushik Chatterjee"
     */
    authorName?: string;
    /**
     * The type of tests being run.
     * @example "Regression"
     */
    testType?: string;
    /**
     * The preferred theme for the report.
     * Can be either "light" or "dark".
     * @default "System theme"
     * @example "dark"
     */
    preferredTheme?: "light" | "dark";
    /**
     * If true, images will be encoded in base64.
     * @default false
     * @example true
     */
    base64Image?: boolean;
    /**
     * The local relative of the logo image.
     * Recommended to keep within the report genrated folder.
     * @default "kbs-report/logo.png"
     * @example "logo.png"
     */
    logo?: string;
    /**
     * The filename to the html report.
     * @example "index.html"
     * @default "kbs-report.html"
     */
    filename?: string;
    /**
     * The folder name.
     * @example "report"
     * @default "kbs-report"
     */
    folderPath?: string;
    /**
     * Port to connect
     * @example 3600
     */
    port?: number;
    /**
     * Display console logs?
     * @example boolean
     * @default true
     */
    stdIO?: boolean;
    /**
     * Metadata for the report. ['TestCycle': 'Cycle 1', 'TestEnvironment':'QA', etc]
     * @example { "key": "value" } as string
     */
    meta?: Record<string, string>;
    /**
     * Chart type on the dashboard.
     * @example "doughnut" | "pie"   */
    chartType?: "doughnut" | "pie";
}

declare class KbsReport implements Reporter {
    private kbsConfig;
    private testResultProcessor;
    private htmlGenerator;
    private fileManager;
    private serverManager;
    private results;
    private projectSet;
    private overAllStatus;
    private folderPath;
    private outputFilename;
    private outputPath;
    private dbManager;
    private shouldGenerateReport;
    private showConsoleLogs;
    private skipTraceViewer;
    constructor(kbsConfig?: KbsReportConfig);
    private reportsCount;
    onBegin(config: FullConfig, _suite: Suite): Promise<void>;
    onStdOut(chunk: string | Buffer, _test: void | TestCase, _result: void | TestResult): void;
    onTestEnd(test: TestCase, result: TestResult): void;
    printsToStdio(): boolean;
    onError(error: TestError): void;
    onEnd(result: FullResult): Promise<void>;
    onExit(): Promise<void>;
}

export { KbsReport, type KbsReportConfig, KbsReport as default };
