const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild, client) {
		if (!guild.available) return;

		const owner = await client.users.fetch(guild.ownerId);
		owner.send({ embeds: [new EmbedBuilder()
			.setColor('#584e51')
			.setAuthor({ name: 'Thank you for adding 💗', iconURL: guild.iconURL() })
			.addFields([
				{ name: '» Official Website', value: '> https://nekosia.cat' },
				{ name: '» More Info', value: '> [Click here](https://nekosia.cat/discord/ayomi)', inline: true },
				{ name: '» Commands', value: '> [Click here](https://nekosia.cat/discord/ayomi/commands)', inline: true },
				{ name: '» Our Discord Server', value: '> https://discord.gg/Ws3H6wJ4qw' },
				{ name: '» Upvote & Review', value: 'If you\'re enjoying Ayomi, please consider leaving [a review](https://top.gg/bot/1282807473769680938#reviews) and [upvoting](https://top.gg/bot/1282807473769680938/vote) it on Top.gg!' },
			])
			.setThumbnail(client.user.displayAvatarURL())],
		}).catch(err => console.log('NoelCL » Message for adding the bot was not delivered.', err.message));

		console.log(`NoelCL » Bot added to: '${guild.name}' (${guild.id}); Members: ${guild.members.cache.size}; Owner: '${owner.tag}' (${owner.id})`);

		client.channels.cache.get(process.env.BOT_LOGS).send(
			`\\✅ » Added to: **${guild.name}** \`${guild.id}\`; Users: **${guild.members.cache.filter(m => !m.user.bot).size}**>**${guild.members.cache.size}**; Owner: **${owner.tag}** \`${owner.id}\`; Servers: **${client.guilds.cache.size}**;`
		).catch(err => console.warn('GAdded » Message (guildCreate) did not reach the info server.', err.message));
	},
};