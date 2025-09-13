const { ChannelType, EmbedBuilder } = require('discord.js');

module.exports = async (client, guild, log = false) => {
	const me = guild.members.me;

	const sorted = guild.channels.cache
		.filter(ch => ch.isTextBased())
		.sort((a, b) => a.rawPosition - b.rawPosition);

	const channel =
        sorted.find(ch => ch.type === ChannelType.GuildText && ch.viewable && me?.permissionsIn(ch)?.has('SendMessages')) ||
        sorted.find(ch => ch.viewable && me?.permissionsIn(ch)?.has('SendMessages')) ||
        sorted.find(ch => me?.permissionsIn(ch)?.has('SendMessages')) ||
        null;

	if (!channel) return null;

	try {
		const embed = new EmbedBuilder()
			.setColor('#ff4e4e')
			.setAuthor({ name: 'I\'m leaving this server, sayonara! 👋', iconURL: guild.iconURL(), url: 'https://nekosia.cat' })
			.setDescription(
				'Pfft. This server stinks. I have no intention of taking part in artificially inflating stats. I assume it was created only to promote another server using Disboard.\n\n' +
                'If you think my judgment is wrong (which I doubt), the only way is to contact my developer via the [support server](https://nekosia.cat/discord) or email `support@nekosia.cat`. Bye!'
			)
			.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTimestamp();

		await channel.send({ embeds: [embed] });
		await client.users.fetch(guild.ownerId).send({ embeds: [embed] }).catch(err => console.log('Client » Message to owner was not delivered.', err.message));

		if (log) console.log(`Sent leave message in '${guild.name}' (${guild.id}) -> #${channel.name} (${channel.id})`);

		return channel;
	} catch (err) {
		if (log) console.log(`Failed to send in '${guild.name}' (${guild.id}) -> #${channel?.name} (${channel?.id}) | ${err.code} ${err.message}`);
		return false;
	}
};
