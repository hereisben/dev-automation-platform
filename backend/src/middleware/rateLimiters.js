import rateLimit from "express-rate-limit";

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: message,
    },
  });
}

export const authLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts. Please try again later.",
});

export const commitLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: `Too many commit generation requests. Please try again later.`,
});

export const screenshotLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: `Too many monitor creation requests. Please try again later.`,
});

export const monitorCreateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: `Too many monitor creation requests. Please try again later.`,
});
