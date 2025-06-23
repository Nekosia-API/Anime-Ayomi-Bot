const { join } = require('node:path');
const { readdir } = require('node:fs/promises');
const COMMANDS_DIR = join(__dirname, '..', 'commands');

module.exports = async client => {
	for (const category of await readdir(COMMANDS_DIR)) {
		const categoryPath = join(COMMANDS_DIR, category);

		for (const file of (await readdir(categoryPath)).filter(f => f.endsWith('.js'))) {
			const command = require(join(categoryPath, file));

			if (command?.data?.name && typeof command.execute === 'function') {
				Object.freeze(command);
				client.interactions.set(command.data.name, command);
			} else {
				console.error(`SlashH » Invalid command at ${join(categoryPath, file)} – missing 'data' or 'execute'`);
			}
		}
	}
};