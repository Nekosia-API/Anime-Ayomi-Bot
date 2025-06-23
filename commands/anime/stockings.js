const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	{ name: 'Thigh-High Socks', value: 'thigh-high-socks' },
	{ name: 'Black Thigh-High Socks', value: 'black-thigh-high-socks' },
	{ name: 'White Thigh-High Socks', value: 'white-thigh-high-socks' },
	{ name: 'Striped Thigh-High Socks', value: 'striped-thigh-high-socks' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stockings')
		.setDescription('Get an image of anime characters wearing stockings or thigh-high socks.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the type or color of stockings.')
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
