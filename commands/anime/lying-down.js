const { SlashCommandBuilder } = require('discord.js');
const fetchImage = require('../../scripts/fetchImage.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lying-down')
		.setDescription('Get an image of characters lying down.')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('How many adorable images would you like? (1 to 5)')
				.setMinValue(1)
				.setMaxValue(5))
		.addBooleanOption(option =>
			option.setName('compressed')
				.setDescription('Would you like to see the images in a lighter, faster-loading version? (default: false)')),

	execute: (_, inter) => fetchImage(inter, 'lying-down')
};