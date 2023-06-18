import winston, { format } from "winston";
import combine = format.combine;
import timestamp = format.timestamp;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  defaultMeta: { service: 'fsplan-back-end' },
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;