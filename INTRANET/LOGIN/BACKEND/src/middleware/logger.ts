import { Request, Response, NextFunction } from "express";
import winston from "winston";

export const log = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "logs/actions.log" }),
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  )
});

export const logger = (req: Request, res: Response, next: NextFunction) => {
  log.info(`${req.method} ${req.url}`);
  next();
};
