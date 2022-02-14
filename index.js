const {
	ShardingManager
} = require('discord.js');
const config = require('./settings/config.json')

const manager = new ShardingManager('./bot.js', {
	token: config.TOKEN
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();