module.exports = async client => {
	await client.setActivity({ name: 'nyaaa~~', type: 3 });
	await client.setStatus('dnd');
};