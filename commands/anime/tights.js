const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../scripts/fetchImage.js');

const choices = [
	{ name: 'Black Tights', value: 'black-tights' },
	{ name: 'White Tights', value: 'white-tights' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tights')
		.setDescription('Get an image of anime characters wearing tights.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the color/type of tights.')
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
		let tag = inter.options.getString('tag');
		if (!tag) {
			const randomChoice = choices[Math.floor(Math.random() * choices.length)];
			tag = randomChoice.value;
		}
		await fetchImage(inter, tag);
	},
};