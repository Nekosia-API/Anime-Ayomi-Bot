const { EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('../services/axios.js');
const sendError = require('./error.js');

const cooldowns = new Map();
const BASE_COOLDOWN = 1800;
const MAX_COOLDOWN = 60000;

module.exports = async (inter, category) => {
	const count = inter.options.getInteger('count') || 1;
	const userId = inter.user.id;

	const cooldownTime = Math.min(BASE_COOLDOWN * count, MAX_COOLDOWN);
	if (cooldowns.has(userId)) {
		const lastUsed = cooldowns.get(userId);
		const timeElapsed = Date.now() - lastUsed;

		if (timeElapsed < cooldownTime) {
			return inter.reply({
				content: `⏰  Please wait another ${(cooldownTime - timeElapsed) / 1000}s before using this command again.`,
				ephemeral: MessageFlags.Ephemeral,
			});
		}
	}

	cooldowns.set(userId, Date.now());

	try {
		const { data } = await axios.get(`${process.env.API_URL}/api/v1/images/${category}`, {
			params: { session: 'id', id: userId, count },
		});

		const compressed = inter.options.getBoolean('compressed') || false;

		const images = data.images || [data];
		const embeds = images.map(({ image, colors, attribution }) => {
			const embed = new EmbedBuilder()
				.setImage(image[compressed ? 'compressed' : 'original'].url)
				.setColor(colors.main);

			if (count > 1 && attribution?.copyright) embed.setFooter({ text: attribution.copyright });
			return embed;
		});

		const content = count === 1
			? `https://nekosia.cat/booru/tags/${images[0].category}/${images[0].id}`
			: null;

		inter.reply({ content, embeds });
	} catch (err) {
		sendError(EmbedBuilder, inter, err.stack);
	}
};