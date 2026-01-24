const { EmbedBuilder, MessageFlags } = require('discord.js');
const { NekosiaAPI } = require('nekosia.js');
const sendError = require('../scripts/error.js');

const cooldowns = new Map();
const BASE_COOLDOWN = 1200, MAX_COOLDOWN = 60000;

module.exports = async (inter, category) => {
	const now = Date.now();
	const count = inter.options.getInteger('count') || 1;

	// Cooldown
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
		const data = await NekosiaAPI.fetchCategoryImages(category, { session: 'id', id: userId, count });
		if (!data || (count > 1 && !data.images?.length)) {
			console.warn(`FhImgs » Empty response for category '${category}'; User: ${userId}; Count: ${count}; Data:`, data);
			return inter.reply({ content: '❌  No images found for this category. Please try again later.', flags: MessageFlags.Ephemeral });
		}

		const compressed = inter.options.getBoolean('compressed') || false;
		const images = count === 1 ? [data] : data.images;

		const embeds = images.map(({ image, colors, source, attribution }) => {
			const embed = new EmbedBuilder()
				.setImage(image[compressed ? 'compressed' : 'original'].url)
				.setColor(colors.main);
			if (count > 1) embed.setFooter({ text: attribution.copyright || source.url, iconURL: 'https://nekosia.cat/favicon.png' });
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