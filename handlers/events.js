const fs = require('node:fs');
const path = require('node:path');
const EVENTS_DIR = path.join(__dirname, '../events');

module.exports = client => {
	for (const file of fs.readdirSync(EVENTS_DIR)) {
		if (!file.endsWith('.js')) continue;

		const event = require(path.join(EVENTS_DIR, file));
		Object.freeze(event);

		const handler = (...args) => event.execute(...args, client);
		(event.once ? client.once : client.on).call(client, event.name, handler);
	}
};