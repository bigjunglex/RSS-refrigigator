import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:dd-MM-yyyy HH:mm:ss',
    },
  },
});

logger.info('initialazed')

export default logger;