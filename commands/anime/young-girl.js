const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('young-girl')
		.setDescription('Find a random image of a young anime girl character.')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('How many adorable images would you like? (1 to 5)')
				.setMinValue(1)
				.setMaxValue(5))
		.addBooleanOption(option =>
			option.setName('compressed')
				.setDescription('Display compressed (lighter and faster-loading) images. Default: false'))
		.setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles),

	execute: (_, inter) => fetchImage(inter, 'young-girl'),
};