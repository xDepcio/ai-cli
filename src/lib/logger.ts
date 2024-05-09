
import fs from 'fs';

type POJOStringifiableToJson = {
    [key: string]: string | number | boolean | null | POJOStringifiableToJson;
}

type LoggerOptions = ({
    logDest: 'console';
} | {
    logDest: 'file';
    logFile: string;
}) & {
    supressInternalLogs?: boolean;
}
class Logger {
    private options: LoggerOptions;

    public constructor(options: LoggerOptions) {
        this.options = options;
        if (this.options.supressInternalLogs === undefined) {
            this.options.supressInternalLogs = false;
        }
        this.internal('Logger initialized');
    }

    public info(message: string, data?: POJOStringifiableToJson) {
        this.message(message, 'INFO', data);
    }

    public debug(message: string, data?: POJOStringifiableToJson) {
        this.message(message, 'DEBUG', data);
    }

    public error(message: string, data?: POJOStringifiableToJson) {
        this.message(message, 'ERROR', data);
    }

    private message(message: string, type: string, data?: POJOStringifiableToJson) {
        const logMessage = `${(new Date()).toISOString()} [${type}] ${message}${data ? JSON.stringify(data, null, 4) : ''}\n`;
        this.finishLog(logMessage);
    }

    private internal(message: string, data?: POJOStringifiableToJson) {
        if (this.options.supressInternalLogs) {
            return;
        }
        this.message(message, 'INTERNAL', data);
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
