// DB stores money as DECIMAL(10,2) (string out of mysql2); gateways want integer paise.
const toNumber = (value) => Number.parseFloat(value ?? 0);

const round2 = (value) => Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;

const multiply = (price, quantity) => round2(toNumber(price) * quantity);

const sum = (values) => round2(values.reduce((total, value) => total + toNumber(value), 0));

const toPaise = (value) => Math.round(toNumber(value) * 100);

module.exports = { toNumber, round2, multiply, sum, toPaise };
