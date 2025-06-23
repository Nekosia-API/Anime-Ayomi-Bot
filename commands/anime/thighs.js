const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../scripts/fetchImage.js');

const choices = [
	{ name: 'Bewitching Thighs', value: 'bewitching-thighs' },
	{ name: 'Plump Thighs', value: 'plump-thighs' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thighs')
		.setDescription('Get an image of anime characters focusing on thighs.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the thighs style.')
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
		const tag = inter.options.getString('type') || 'thighs';
		await fetchImage(inter, tag);
	},
};
