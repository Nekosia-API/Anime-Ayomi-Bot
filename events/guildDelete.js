const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild, client) {
		if (!guild.available) return;

		const owner = await client.users.fetch(guild.ownerId);

		console.log(`NoelCL » Bot removed from: '${guild.name}' (${guild.id}); Members: ${guild.members.cache.size}; Owner: '${owner.tag}' (${owner.id})`);

		client.channels.cache.get(process.env.BOT_LOGS).send(
			`\\❎️ » Kicked from: **${guild.name}** \`${guild.id}\`; Users: **${guild.members.cache.filter(m => !m.user.bot).size}**>**${guild.members.cache.size}**; Owner: **${owner.tag}** \`${owner.id}\`; Servers: **${client.guilds.cache.size}**;`
		).catch(err => console.warn('GKicked » Message (guildDelete) did not reach the info server.', err.message));
	},
};