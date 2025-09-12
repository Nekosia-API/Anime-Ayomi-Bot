module.exports = (guild, { isDelete = false } = {}) => {
	const totalRaw = guild.memberCount;
	const total = Math.max(0, totalRaw - (isDelete ? 1 : 0));
	if (isDelete) return { users: total, bots: '-', total };

	const cachedBots = guild.members.cache.filter(m => m.user.bot).size;
	const users = Math.max(0, total - cachedBots);

	return { users, bots: cachedBots, total };
};