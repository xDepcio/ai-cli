
import fs from 'fs';

type POJOStringifiableToJson = {
    [key: string]: string | number | boolean | null | POJOStringifiableToJson;
}

type LoggerOptions = {
    logDest: 'console';
} | {
    logDest: 'file';
    logFile: string;
}
class Logger {
    private options: LoggerOptions;

    public constructor(options: LoggerOptions) {
        this.options = options;
        this.internal('Logger initialized');
    }

    public info(message: string, data?: POJOStringifiableToJson) {
        const logMessage = `${(new Date()).toISOString()} [INFO] ${message}${data ? JSON.stringify(data) : ''}`;
        this.finishLog(logMessage);
    }

    public debug(message: string, data?: POJOStringifiableToJson) {
        const logMessage = `${(new Date()).toISOString()} [DEBUG] ${message}${data ? JSON.stringify(data) : ''}`;
        this.finishLog(logMessage);
    }

    public error(message: string, data?: POJOStringifiableToJson) {
        const logMessage = `${(new Date()).toISOString()} [ERROR] ${message}${data ? JSON.stringify(data) : ''}`;
        this.finishLog(logMessage);
    }

    private internal(message: string, data?: POJOStringifiableToJson) {
        const logMessage = `${(new Date()).toISOString()} [INTERNAL] ${message}${data ? JSON.stringify(data) : ''}`;
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
    Logger
};
