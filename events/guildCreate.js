const { Events, EmbedBuilder } = require('discord.js');
const isSpamGuild = require('../scripts/classifyGuild.js');
const getGuildStats = require('../scripts/getGuildStats.js');
const formatGuildChannels = require('../scripts/formatGuildChannels.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild, client) {
		if (!guild.available) return;

		if (isSpamGuild(guild)) {
			let sentChannel = null;

			const channel = guild.channels.cache.find(ch =>
				ch.isTextBased() &&
				ch.permissionsFor(guild.members.me).has(['ViewChannel', 'SendMessages'])
			);

			if (channel) {
				const embed = new EmbedBuilder()
					.setColor('#ff4e4e')
					.setAuthor({ name: 'Opuszczam ten serwer, sayonara! 👋', iconURL: guild.iconURL(), url: 'https://nekosia.cat' })
					.setDescription(
						'Pfff. Ten serwer śmierdzi. Nie mam zamiaru brać udziału w sztucznym nabijaniu statystyk. ' +
						'Zakładam, że został stworzony tylko po to, aby wypromować inny serwer przy użyciu Disboarda.\n\n' +
						'Jeśli uważasz, że mój osąd jest błędny (w co wątpię), jedyna droga to kontakt z moim deweloperem poprzez [serwer wsparcia](https://nekosia.cat/discord) albo mail `support@nekosia.cat`. Pa!'
					)
					.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTimestamp();

				await channel.send({ embeds: [embed] }).catch(() => {});
				sentChannel = channel;
			}

			const channelsCount = guild.channels.cache.size;
			const botsCount = guild.members.cache.filter(m => m.user.bot).size;
			const channelList = formatGuildChannels(guild, { sentChannel });

			await guild.leave().catch(() => {});

			console.log(`Client » Left spammy guild: '${guild.name}' (${guild.id}); Channels: ${channelsCount}; Bots: ${botsCount}`);

			return client.channels.cache.get(process.env.BOT_LOGS)?.send(
				`⚠️ » Left spammy guild: **${guild.name}** \`${guild.id}\`; Members: \`${guild.memberCount}\`; Channels: \`${channelsCount}\`; Bots: \`${botsCount}\`;\n` +
				'```' + channelList + '```'
			);
		}

		const owner = await client.users.fetch(guild.ownerId);
		owner.send({ embeds: [new EmbedBuilder()
			.setColor('#aa8ed6')
			.setAuthor({ name: 'Thank you for adding me 💗', iconURL: guild.iconURL() })
			.addFields([
				{ name: 'Commands', value: '> [See commands](https://nekosia.cat/discord/ayomi/commands)', inline: true },
				{ name: 'More Info', value: '> [Learn more](https://nekosia.cat/discord/ayomi)', inline: true },
				{ name: 'Our Discord Server', value: '> [Join now](https://discord.gg/Ws3H6wJ4qw)', inline: true },
				{ name: 'Official Website', value: '> [nekosia.cat](https://nekosia.cat)' },
				{ name: 'Support the Bot', value: 'Enjoying Ayomi? Leave [a review](https://top.gg/bot/1282807473769680938#reviews) and [upvote](https://top.gg/bot/1282807473769680938/vote) on Top.gg. 💜' },
			])
			.setThumbnail(client.user.displayAvatarURL())],
		}).catch(err => console.log('Client » Message for adding the bot was not delivered.', err.message));

		const { users, bots, total } = getGuildStats(guild);
		console.log(`Client » Added to: '${guild.name}' (${guild.id}); Users: ${users}; Bots: ${bots}; Total: ${total}; Owner: '${owner.tag}' (${owner.id})`);

		client.channels.cache.get(process.env.BOT_LOGS).send(
			`<a:success:1410585401466425364> » **${guild.name}** \`${guild.id}\`; Users: \`${users}\`; Bots: \`${bots}\`; Total: \`${total}\`; Owner: **${owner.tag}** \`${owner.id}\`; Servers: **${client.guilds.cache.size}**;`
		).catch(err => console.warn('GAdded » Message (guildCreate) did not reach the info server.', err.message));
	},
};