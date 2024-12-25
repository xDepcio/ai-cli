import fs from 'fs';
import { z } from 'zod';

class LoggerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LoggerError';
    }
}
class LoggerOptionsNotSetError extends LoggerError {
    constructor() {
        super('Logger options not set');
        this.name = 'LoggerOptionsNotSetError';
    }
}

const logGranulaityEnvSchema = z.enum(['DEBUG', 'ERROR', 'INFO']).optional();
type LogsGranularity = Exclude<z.infer<typeof logGranulaityEnvSchema>, undefined>;

type LoggerOptions = ({
    logDest: 'console';
} | {
    logDest: 'file';
    logFile: string;
}) & {
    logGranularity: LogsGranularity
}
/**
 * Logger class with logs granularity hierarchy:
 * INFO,
 */
class Logger {
    public static clearInstance() {
        Logger.instance = undefined as any;
        Logger.loggerOptions = undefined as any;
    }
    public static setOptions(LoggerOptions: LoggerOptions) {
        Logger.loggerOptions = LoggerOptions;
    }
    public static getInstance() {
        if (!Logger.loggerOptions) {
            throw new LoggerOptionsNotSetError();
        }
        if (!Logger.instance) {
            Logger.instance = new Logger(Logger.loggerOptions);
        }
        return Logger.instance;
    }
    private static loggerOptions: LoggerOptions;
    private static instance: Logger;
    private options: LoggerOptions;

    private constructor(options: LoggerOptions) {
        this.options = options;
    }

    public info(message: string) {
        this.message(message, 'INFO');
    }

    public debug(message: string) {
        this.message(message, 'DEBUG');
    }

    public error(message: string) {
        this.message(message, 'ERROR');
    }

    public doesGranularityAllowLogType(logType: LogsGranularity): boolean {

        switch (this.options.logGranularity) {
            case 'DEBUG':
                return true;
            case 'ERROR':
                return logType === 'ERROR' || logType === 'INFO';
            case 'INFO':
                return logType === 'INFO';
        }
    }

    private message(message: string, type: LogsGranularity) {
        if (!this.doesGranularityAllowLogType(type)) {
            return;
        }

        const logMessage = `${(new Date()).toISOString()} [${type}] ${message}\n`;
        this.finishLog(logMessage);
    }

    private finishLog(message: string) {
        switch (this.options.logDest) {
            case 'console':
                console.log(message);
                break;
            case 'file':
                fs.appendFileSync(this.options.logFile, message);
                break;
        }
    }
}

export {
    Logger,
    logGranulaityEnvSchema,
    LoggerError,
    LoggerOptionsNotSetError
};
