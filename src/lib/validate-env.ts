import { z } from "zod";
import { Logger } from "./logger.js";


export function validateEnvVar<T extends z.ZodType<any>>(envVarName: string, zodSchema: T): z.infer<T> {
    try {
        return zodSchema.parse(process.env[envVarName]);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            Logger.getInstance().error(
                `Error validating env var ${envVarName}: ${JSON.stringify(error.errors, null, 4)}`
            );
        }

        throw error;
    }
}
