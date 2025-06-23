const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../scripts/fetchImage.js');

const poseChoices = [
	{ name: 'Crossed Legs', value: 'crossed-legs' },
	{ name: 'Reverse Sitting', value: 'reverse-sitting' },
	{ name: 'W Sitting', value: 'w-sitting' },
	{ name: 'Sitting', value: 'sitting' },
	{ name: 'Lying Down', value: 'lying-down' },
	{ name: 'Lying on One Side', value: 'lying-on-one-side' },
	{ name: 'Tongue Out', value: 'tongue-out' },
	{ name: 'Pinching Garments', value: 'pinching-garments' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pose')
		.setDescription('Get an image of anime characters in a specific pose.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Choose the pose type.')
				.addChoices(...poseChoices))
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
			const randomChoice = poseChoices[Math.floor(Math.random() * poseChoices.length)];
			tag = randomChoice.value;
		}
		await fetchImage(inter, tag);
	},
};