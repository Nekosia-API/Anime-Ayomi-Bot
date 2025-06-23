const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetchImage = require('../../services/fetchImage.js');

const choices = [
	// colors
	{ name: 'Black Hair', value: 'black-hair' },
	{ name: 'Blonde Hair', value: 'blonde' },
	{ name: 'Blue Hair', value: 'blue-hair' },
	{ name: 'Brown Hair', value: 'brown-hair' },
	{ name: 'Green Hair', value: 'green-hair' },
	{ name: 'Pink Hair', value: 'pink-hair' },
	{ name: 'Purple Hair', value: 'purple-hair' },
	{ name: 'Red Hair', value: 'red-hair' },
	{ name: 'Silver Hair', value: 'silver-hair' },
	{ name: 'White Hair', value: 'white-hair' },
	{ name: 'Orange Hair', value: 'orange-hair' },

	// length
	{ name: 'Long Hair', value: 'long-hair' },
	{ name: 'Short Hair', value: 'short-hair' },

	// style
	{ name: 'Twintails', value: 'twintails' },
	{ name: 'Pigtails', value: 'pigtails' },
	{ name: 'Ponytail', value: 'ponytail' },
	{ name: 'Straight Fringe', value: 'straight-fringe' },
	{ name: 'Half-Up Hairstyle', value: 'half-up-hairstyle' },
	{ name: 'Half Pigtails', value: 'half-pigtails' },
	{ name: 'Hairstyle Change', value: 'hairstyle-change' },
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hair')
		.setDescription('Get an image of anime characters based on hair color, length, or style.')
		.addStringOption(option =>
			option.setName('tag')
				.setDescription('Choose hair color, length, or style.')
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