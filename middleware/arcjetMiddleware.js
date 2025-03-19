const loadArcjet = require('../config/arcjet');

const arcjetMiddleware = async (req, res, next) => {
  try {
    const aj = await loadArcjet();
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: 'Bot detected' });
      }
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch (error) {
    console.error('Arcjet error:', error);
    next(error);
  }
};

module.exports = arcjetMiddleware;
