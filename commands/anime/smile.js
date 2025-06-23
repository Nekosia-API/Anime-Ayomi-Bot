const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	{ name: 'Smug Face', value: 'smug-face' },
	{ name: 'Blushing', value: 'blushing' },
	{ name: 'Happy', value: 'happy' },
	{ name: 'Confused', value: 'confused' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('smile')
		.setDescription('Get an image of anime characters with a specific facial expression.')
		.addStringOption(option =>
			option.setName('expression')
				.setDescription('Choose the facial expression.')
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
		const tag = inter.options.getString('expression') || 'smile';
		await fetchImage(inter, tag);
	},
};