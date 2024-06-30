export class Logger {
    private readonly className: string;

    constructor(className: string) {
        this.className = className;
    }

    private getFormattedTimestamp(): string {
        return new Date().toISOString();
    }

    info(message: string) {
        console.info(`[${this.getFormattedTimestamp()}] [INFO] [${this.className}] ${message}`);
    }

    warn(message: string) {
        console.warn(`[${this.getFormattedTimestamp()}] [WARN] [${this.className}] ${message}`);
    }

    error(message: string) {
        console.error(`[${this.getFormattedTimestamp()}] [ERROR] [${this.className}] ${message}`);
    }

    debug(message: string) {
        console.debug(`[${this.getFormattedTimestamp()}] [DEBUG] [${this.className}] ${message}`);
    }
}