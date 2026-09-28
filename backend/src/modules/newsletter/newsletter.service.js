const { badRequest } = require('../../utils/ApiError');
const Subscriber = require('./subscriber.model');

async function subscribe({ email, source = 'homepage' }) {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw badRequest('Enter a valid email address');
  }

  // Re-subscribing is not an error from the visitor's side — it just clears any
  // previous opt-out and returns success either way.
  const [subscriber] = await Subscriber.findOrCreate({
    where: { email: email.toLowerCase() },
    defaults: { email: email.toLowerCase(), source },
  });

  if (subscriber.unsubscribedAt) await subscriber.update({ unsubscribedAt: null });

  return { email: subscriber.email };
}

async function unsubscribe(email) {
  await Subscriber.update(
    { unsubscribedAt: new Date() },
    { where: { email: String(email).toLowerCase() } },
  );
}

module.exports = { subscribe, unsubscribe };
