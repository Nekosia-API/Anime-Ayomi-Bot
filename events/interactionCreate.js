const { Events } = require('discord.js');
const sendError = require('../scripts/error.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(inter, client) {
		if (!inter.isChatInputCommand() || !inter.guild) return;

		const command = client.interactions.get(inter.commandName);
		if (!command) return;

		try {
			await command.execute(client, inter);
		} catch (err) {
			sendError(inter, err);
		}

		console.log(`SlashC » Interaction '${inter.commandName}' was triggered by ${inter.user.tag} (${inter.id}) on the server '${inter.guild.name}' (${inter.guild.id})`);
	},
};