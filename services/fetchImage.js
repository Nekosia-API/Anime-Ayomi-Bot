const { EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('./axios.js');
const sendError = require('../scripts/error.js');

const cooldowns = new Map();
const BASE_COOLDOWN = 1200, MAX_COOLDOWN = 60000;

module.exports = async (inter, category) => {
	const now = Date.now();

	// Cooldown
	const count = inter.options.getInteger('count') || 1;
	const cooldown = Math.min(BASE_COOLDOWN * count, MAX_COOLDOWN);
	const userId = inter.user.id;
	const lastUsed = cooldowns.get(userId);
	if (lastUsed && now - lastUsed < cooldown) {
		const remaining = ((cooldown - (now - lastUsed)) / 1000).toFixed(1);
		return inter.reply({ content: `⏰  Please wait another **${remaining}s** before using this command again.`, flags: MessageFlags.Ephemeral });
	}
	cooldowns.set(userId, now);

	// Fetch
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

		inter.reply({
			content: count === 1
				? `https://nekosia.cat/booru/tags/${images[0].category}/${images[0].id}`
				: null,
			embeds,
		});
	} catch (err) {
		sendError(inter, err.stack);
	}
};