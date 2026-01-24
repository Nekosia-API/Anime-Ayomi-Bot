process.loadEnvFile();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { readdirSync, existsSync, writeFileSync } = require('node:fs');
const { join, dirname } = require('node:path');
const { version } = require('./package.json');

const commandsDir = join(__dirname, 'commands');
const commands = readdirSync(commandsDir)
	.flatMap(folder => {
		const folderPath = join(commandsDir, folder);
		return readdirSync(folderPath)
			.filter(file => file.endsWith('.js'))
			.map(file => {
				const command = require(join(folderPath, file));
				if (command?.data?.toJSON && command.execute) {
					const commandData = command.data.toJSON();
					commandData.nsfw = folder.toLowerCase() === 'nsfw';
					return commandData;
				}
				console.warn(`SlashC » Invalid command: ${file}`);
				return null;
			})
			.filter(Boolean);
	});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const saveCommandsToFile = data => {
	const jsonPath = join(__dirname, 'interactions.json');
	const interactionsDir = dirname(jsonPath);
	if (!existsSync(interactionsDir)) return console.error(`Directory ${interactionsDir} does not exist.`);

	const jsonData = {
		date: new Date().toISOString(),
		version,
		commands: data,
	};

	writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
	console.log(`Commands saved to ${jsonPath}`);
};

(async () => {
	try {
		console.log('Started refreshing application slash commands...');

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands }
		);

		saveCommandsToFile(commands);
		console.log(`Successfully reloaded ${data.length} slash commands!`);
	} catch (err) {
		console.error('An error occurred while reloading slash commands:', err);
	}
})();