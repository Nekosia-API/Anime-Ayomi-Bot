const { Events } = require('discord.js');
const getGuildStats = require('../scripts/getGuildStats.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild, client) {
		if (!guild.available) return;

		const owner = await client.users.fetch(guild.ownerId);
		const { users, bots, total } = getGuildStats(guild, { isDelete: true });

		console.log(`Client » Removed from: '${guild.name}' (${guild.id}); Users: ${users}; Total: ${total}; Owner: '${owner.tag}' (${owner.id})`);

		client.channels.cache.get(process.env.BOT_LOGS).send(
			`<a:error:1410585397012205649> » **${guild.name}** \`${guild.id}\`; Users: \`${users}\`; Bots: \`${bots}\`; Total: \`${total}\`; Owner: **${owner.tag}** \`${owner.id}\`; Servers: **${client.guilds.cache.size}**;`
		).catch(err => console.warn('GKicked » Message (guildDelete) did not reach the info server.', err.message));
	},
};