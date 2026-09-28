const newsletterService = require('./newsletter.service');

async function subscribe(req, res) {
  res.status(201).json(await newsletterService.subscribe(req.body));
}

async function unsubscribe(req, res) {
  await newsletterService.unsubscribe(req.body.email);
  res.status(204).send();
}

module.exports = { subscribe, unsubscribe };
