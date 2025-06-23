const { EmbedBuilder } = require('discord.js');

module.exports = (inter, err) => {
	console.error('Client »', err);

	const embed = new EmbedBuilder()
		.setColor('#F03A17')
		.setAuthor({
			name: '❌ Sorry, something went wrong',
			iconURL: inter.commandName ? inter.user.displayAvatarURL() : inter.author.displayAvatarURL(),
		})
		.setDescription('We sincerely apologize for the inconvenience. Please report this issue to the Nekosia API [support server](https://discord.gg/Ws3H6wJ4qw) or email us at `contact@nekosia.cat`. Meow~~');

	const handleReply = method => inter[method]({ embeds: [embed] }).catch(console.error);
	if (inter.replied) {
		handleReply('followUp');
	} else if (inter.deferred) {
		handleReply('editReply');
	} else {
		handleReply('reply');
	}
};