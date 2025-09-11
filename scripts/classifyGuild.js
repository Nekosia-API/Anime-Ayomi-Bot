module.exports = guild => {
	const visibleChannels = guild.channels.cache.filter(ch => {
		const perms = ch.permissionsFor(guild.members.me);
		return perms && perms.has('ViewChannel');
	}).size;

	return visibleChannels <= 1;
};