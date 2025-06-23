const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	{ name: 'Cat Ears Hat', value: 'cat-ears-hat' },
	{ name: 'Cat Ears Headband', value: 'cat-ears-headband' },
	{ name: 'Cat Ears Headphones', value: 'cat-ears-headphones' },
	{ name: 'Cat Ears Hoodie', value: 'cat-ears-hoodie' },
	{ name: 'Cat Ears Maid', value: 'cat-ears-maid' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat-ears')
		.setDescription('Get an image of anime characters featuring cat ears.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the cat ears style.')
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
		const tag = inter.options.getString('type') || 'cat-ears';
		await fetchImage(inter, tag);
	},
};