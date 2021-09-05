const bcrypt = require("bcrypt");

const encrypt = async (PlaintextPassword, saltRounds) => {
	const hash = await bcrypt.hash(PlaintextPassword, saltRounds);
	return hash;
};

const compare = async (PlaintextPassword, hashedPassword) => {
	return await bcrypt.compare(PlaintextPassword, hashedPassword);
};

module.exports = { encrypt, compare };
