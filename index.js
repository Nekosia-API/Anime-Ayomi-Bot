process.loadEnvFile();
const { Client, Events, Collection } = require('discord.js');
const setActivity = require('./scripts/setActivity.js');

// Init client and collections
const client = new Client({ intents: [1] });
client.interactions = new Collection();
client.cooldowns = new Collection();

// Load event and slash command handlers
['./handlers/events.js', './handlers/interactions.js'].forEach(handler => require(handler)(client));

// Shard events
client.on(Events.ShardDisconnect, (event, id) => console.warn(`Shard${id} » Disconnected unexpectedly. Event:`, event));
client.on(Events.ShardResume, async (id, events) => {
	await setActivity(client.user);
	console.info(`Shard${id} » Resumed. Replayed events:`, events);
});

// Login
client.login(process.env.TOKEN).catch(console.error);