const bcrypt = require("bcrypt");

const encrypt = async (PlaintextPassword, saltRounds) => {
	const hash = await bcrypt.hash(PlaintextPassword, saltRounds);
	return hash;
};

const compare = async (PlaintextPassword) => {
	return await bcrypt.compare(PlaintextPassword, hash);
};

module.exports = { encrypt, compare };
