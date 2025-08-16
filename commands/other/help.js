const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('All the useful information about Ayomi.')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	execute: (client, inter) => {
		const embed1 = new EmbedBuilder()
			.setAuthor({ name: `List of available commands for ${client.user.username} bot (v${version})`, iconURL: client.user.displayAvatarURL() })
			.setColor('#00FF72')
			.setDescription('Please see: https://nekosia.cat/discord/ayomi/commands');

		const embed2 = new EmbedBuilder()
			.setColor('#09A1E2')
			.addFields([
				{ name: '🌍  Official Website', value: '[nekosia.cat](https://nekosia.cat)', inline: true },
				{ name: '📝  Documentation', value: '[Documentation](https://nekosia.cat/documentation?page=introduction)', inline: true },
				{ name: '😺  Status Page', value: '[status.nekosia.cat](https://status.nekosia.cat)', inline: true },
				{ name: '💗  Add This Bot', value: 'Want to add this bot to your server? Click [here](https://discord.com/oauth2/authorize?client_id=1282807473769680938)! Thank you <3' },
				{ name: '😻  Cutest Anime Booru', value: 'Visit our [anime booru](https://nekosia.cat/booru) for even more cute pictures! Become a member of our community to explore, comment on, and rate images. You can also submit requests to update image data. Once reviewed, your edits will be reflected in the API responses. We greatly appreciate your contributions, as our API relies on accurate image tagging.' },
				{ name: '🔢  Are You a Developer?', value: 'If so, refer to the [Nekosia API documentation](https://nekosia.cat/documentation?page=introduction). This API provides a variety of random anime images. Add a touch of anime charm to your projects today!' },
			])
			.setFooter({ text: 'Copyright © 2024-2025 by Nekosia API. All Rights Reserved.', iconURL: client.user.displayAvatarURL() });

		inter.reply({ embeds: [embed1, embed2] });
	},
};