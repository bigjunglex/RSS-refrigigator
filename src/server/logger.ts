import fs  from "fs";
import pino, { Logger } from "pino";

const cwd = process.cwd();
const logPath = `${cwd}/logs/log.txt`;
if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, 'start')
}

export const logger: Logger = pino({
    transport: {
        targets: [
            { target: 'pino/file', options: { destination: logPath, ignore: 'hostname, pid' }},
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS: dd-mm-yyyy HH:MM:ss',
                    ignore: 'hostname, pid'
                }
            }
        ]

    },
    msgPrefix: '[API] :',
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
})