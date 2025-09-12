process.loadEnvFile();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const isSpamGuild = require('../scripts/classifyGuild.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const baseStyles = `
	body{background:#121212;color:#e0e0e0;font-family:'Segoe UI',sans-serif;margin:0;padding:40px}
	h1{margin:0 0 30px;text-align:center}
	.grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(340px,1fr))}
	.guild{background:#1e1e2e;border-radius:12px;box-shadow:0 6px 14px #0009;display:flex;flex-direction:column;overflow:hidden;position:relative}
	.banner{background-position:center;background-size:cover;filter:brightness(0.55);height:160px}
	.guild-avatar{background:#2b2b3c;border:6px solid #1e1e2e;border-radius:50%;display:block;height:128px;margin:0 auto;object-fit:cover;width:128px}
	.with-banner{position:relative;top:-64px}
	.no-banner{margin-top:20px}
	.guild-content{padding:20px;text-align:center}
	.with-banner + .guild-content{margin-top:-40px}
	.no-banner + .guild-content{margin-top:10px}
	.guild h2{color:#fff;font-size:1.25em;margin:12px 0 8px}
	.guild p{color:#bbb;font-size:.9em;margin:5px 0}
	.desc{color:#aaa;font-size:.85em;font-style:italic;margin-top:10px}
	ul{font-size:.85em;margin:10px 0;padding-left:20px;text-align:left}
	li{margin:3px 0}
	.visible{color:#8f8}
	.hidden{color:#f88}
	a{color:#4ea1ff;text-decoration:none}
	a:hover{text-decoration:underline}`;

const wrapHtml = (title, color, body, count) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${baseStyles}</style>
</head>
<body>
    <h1 style="color:${color};">${title} (${count})</h1>
    <div class="grid">${body}</div>
</body>
</html>`;

const makeCard = (guild, extras = '', showChannelsTop = true) => {
	const bannerUrl = guild.bannerURL() || null;
	const iconUrl = guild.iconURL() || 'https://noel.sefinek.net/images/null.jpg';
	const bannerHtml = bannerUrl
		? `<div class="banner" style="background-image:url('${bannerUrl}')"></div>`
		: '';

	return `
    <div class="guild">
        ${bannerHtml}
        <img src="${iconUrl}" alt="Server icon" class="guild-avatar ${bannerUrl ? 'with-banner' : 'no-banner'}">
        <div class="guild-content">
            <h2>${guild.name}</h2>
            <p><strong>Server ID:</strong> ${guild.id}</p>
            <p><strong>Owner ID:</strong> ${guild.ownerId}</p>
            <p><strong>Members:</strong> ${guild.memberCount}</p>
            ${showChannelsTop ? `<p><strong>Channels:</strong> ${guild.channels.cache.size}</p>` : ''}
            <p><strong>Roles:</strong> ${guild.roles.cache.size}</p>
            <p><strong>Boosts:</strong> ${guild.premiumSubscriptionCount} (Tier ${guild.premiumTier})</p>
            <p><strong>Region:</strong> ${guild.preferredLocale}</p>
            <p><strong>Created:</strong> ${new Date(guild.createdTimestamp).toLocaleString()}</p>
            <p><a href="https://disboard.org/server/${guild.id}" target="_blank">Disboard page</a></p>
            ${guild.vanityURLUses !== null ? `<p><strong>Vanity URL uses:</strong> ${guild.vanityURLUses}</p>` : ''}
            ${guild.description ? `<p class="desc">${guild.description}</p>` : ''}
            ${extras}
        </div>
    </div>`;
};

client.on(Events.ClientReady, async c => {
	console.log(`Logged in as ${c.user.tag} (${c.user.id}), fetching guilds...`);
	await c.guilds.fetch();

	console.log(`Found ${c.guilds.cache.size} servers, sorting by member count...`);
	const guildsSorted = [...c.guilds.cache.values()].sort((a, b) => b.memberCount - a.memberCount);

	console.log('Fetching invites for all guilds...');
	const invitesMap = await Promise.all(
		guildsSorted.map(async g => {
			try {
				const invites = await g.invites.fetch();
				return [g.id, invites];
			} catch {
				return [g.id, null];
			}
		})
	);

	const invitesByGuild = new Map(invitesMap);
	const normalGuilds = [], spamGuilds = [];

	console.log('Classifying servers...');
	for (const guild of guildsSorted) {
		const invites = invitesByGuild.get(guild.id);
		let inviteLinks = '';
		if (invites && invites.size > 0) {
			const top3 = invites.map(i => `<a href="${i.url}" target="_blank">${i.code}</a>`).slice(0, 3);
			inviteLinks = `<p>${top3.join(', ')}${invites.size > 3 ? '...' : ''}</p>`;
		}
		if (isSpamGuild(guild)) {
			const extras = `${inviteLinks}<h3>Channels (${guild.channels.cache.size} total):</h3><ul>${
				guild.channels.cache.map(ch => {
					const perms = ch.permissionsFor(guild.members.me);
					const vis = perms && perms.has('ViewChannel') ? '✔ visible' : '✘ hidden';
					return `<li>${ch.name} (${ch.id}) - <span class="${vis.includes('✔') ? 'visible' : 'hidden'}">${vis}</span></li>`;
				}).join('')
			}</ul>`;
			spamGuilds.push({ guild, extras });
		} else {
			normalGuilds.push({ guild, extras: inviteLinks });
		}
	}

	console.log(`Classification complete: ${normalGuilds.length} normal | ${spamGuilds.length} spam/farm`);

	console.log('Generating HTML reports...');
	let normalCards = '', spamCards = '';
	for (const { guild, extras } of normalGuilds) normalCards += makeCard(guild, extras);
	const htmlNormal = wrapHtml('Normal servers', '#4ea1ff', normalCards, normalGuilds.length);
	for (const { guild, extras } of spamGuilds) spamCards += makeCard(guild, extras, false);
	const htmlSpam = wrapHtml('Spam/Farm servers', '#ff4e4e', spamCards, spamGuilds.length);

	fs.writeFileSync(path.join(path.resolve(), 'tools', 'servers_normal.html'), htmlNormal, 'utf8');
	fs.writeFileSync(path.join(path.resolve(), 'tools', 'servers_spam.html'), htmlSpam, 'utf8');

	console.log('Reports saved: tools/servers_normal.html & tools/servers_spam.html');
	process.exit(0);
});

console.log('Logging in, please wait...');
client.login(process.env.TOKEN).catch(err => console.error('Failed to login:', err));