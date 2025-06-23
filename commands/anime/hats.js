const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	{ name: 'Beret', value: 'beret' },
	{ name: 'Straw Hat', value: 'straw-hat' },
	{ name: 'Newsboy Cap', value: 'newsboy-cap' },
	{ name: 'Headband', value: 'headband' },
	{ name: 'Headdress', value: 'headdress' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hats')
		.setDescription('Get an image of anime characters wearing different hats or headwear.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the type of hat or headwear.')
				.addChoices(...choices))
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('How many adorable images would you like? (1 to 5)')
				.setMinValue(1)
				.setMaxValue(5))
		.addBooleanOption(option =>
			option.setName('compressed')
				.setDescription('Display compressed (lighter and faster-loading) images. Default: false'))
		.setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles),

	execute: async (_, inter) => {
		let tag = inter.options.getString('type');
		if (!tag) {
			const randomChoice = choices[Math.floor(Math.random() * choices.length)];
			tag = randomChoice.value;
		}
		await fetchImage(inter, tag);
	},
};