import { z } from "zod";

const logGranulaityEnvSchema = z.enum(['DEBUG', 'ERROR', 'INFO']);
type LogsGranularity = z.infer<typeof logGranulaityEnvSchema>;

const xd = logGranulaityEnvSchema.parse(process.env.LOG_GRANULARITY);
console.log(xd);
