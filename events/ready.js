const { Events } = require('discord.js');
const setActivity = require('../scripts/setActivity.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await setActivity(client.user);

		process.send?.('ready');
		console.log(`Client » ${client.user.username} is ready`);
	},
};