const ICONS = { 0: '📝', 2: '🔊', 5: '📰' };

module.exports = (guild, { sentChannel = null } = {}) => {
	const me = guild.members.me;

	const visible = ch => (me?.permissionsIn(ch).has('ViewChannel') ? '✔' : '✘');
	const format = ch => {
		const mark = sentChannel && ch.id === sentChannel.id ? ' (sent msg)' : '';
		return `${ICONS[ch.type] || (ch.isThread() ? '💬' : '❓')} ${ch.name} (${ch.id}) ${visible(ch)}${mark}`;
	};

	const categories = guild.channels.cache.filter(ch => ch.type === 4);
	const childrenMap = new Map();

	guild.channels.cache
		.filter(ch => ch.type !== 4)
		.forEach(ch => {
			const key = ch.parentId || 'uncategorized';
			if (!childrenMap.has(key)) childrenMap.set(key, []);
			childrenMap.get(key).push(ch);
		});

	const lines = [];

	categories.sort((a, b) => a.rawPosition - b.rawPosition).forEach(cat => {
		lines.push(`> ${cat.name}`);
		(childrenMap.get(cat.id) || [])
			.sort((a, b) => a.rawPosition - b.rawPosition)
			.forEach(ch => lines.push(format(ch)));
	});

	(childrenMap.get('uncategorized') || [])
		.sort((a, b) => a.rawPosition - b.rawPosition)
		.forEach(ch => lines.push(format(ch)));

	return lines.join('\n');
};