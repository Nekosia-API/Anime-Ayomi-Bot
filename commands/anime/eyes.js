const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	{ name: 'Blue Eyes', value: 'blue-eyes' },
	{ name: 'Red Eyes', value: 'red-eyes' },
	{ name: 'Purple Eyes', value: 'purple-eyes' },
	{ name: 'Green Eyes', value: 'green-eyes' },
	{ name: 'Yellow Eyes', value: 'yellow-eyes' },
	{ name: 'Pink Eyes', value: 'pink-eyes' },
	{ name: 'Orange Eyes', value: 'orange-eyes' },
	{ name: 'Spiral Eyes', value: 'spiral-eyes' },
	{ name: 'Scornful Eyes', value: 'scornful-eyes' },
	{ name: 'Heart-Eyes', value: 'heart-eyes' },
	{ name: 'Teary-Eyed', value: 'teary-eyed' },
	{ name: 'Heterochromia', value: 'heterochromia' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eyes')
		.setDescription('Get an image of anime characters based on eye color or style.')
		.addStringOption(option =>
			option.setName('tag')
				.setDescription('Choose eye color or style.')
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