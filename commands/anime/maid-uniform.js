const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../scripts/fetchImage.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('maid-uniform')
		.setDescription('Get an image of characters wearing a maid uniform.')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('How many adorable images would you like? (1 to 5)')
				.setMinValue(1)
				.setMaxValue(5))
		.addBooleanOption(option =>
			option.setName('compressed')
				.setDescription('Would you like to see the images in a lighter, faster-loading version? (default: false)'))
		.setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles),

	execute: (_, inter) => fetchImage(inter, 'maid-uniform'),
};