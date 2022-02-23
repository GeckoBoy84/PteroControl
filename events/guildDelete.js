const {
	MessageEmbed,
} = require('discord.js');
const config = require('../settings/config.json');
const client = require('../bot');


client.on('guildDelete', async (guild) => {
	const owner = await guild.fetchOwner();
	const newEmbed = new MessageEmbed()
		.setAuthor({
			name: 'PteroControl | Information',
			iconURL: client.user.avatarURL(),
		})
		.setColor('RED')
		.setThumbnail(guild.iconURL())
		.setDescription(

			`GUILD REMOVED`,)
		.addFields(
			{
				name: 'Guild Name',
				value: `${guild.name}`,
			},
			{
				name: 'Guild ID',
				value: `${guild.id}`,
			},
			{
				name: 'Guild Member Count',
				value: `${guild.memberCount}`,
			},
			{
				name: 'Owner Info',
				value: `<@${owner.id}> (${owner.id})`,
			},
			{
				name: 'Total Member Count',
				value: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`,
			},
			{
				name: 'Total Guilds',
				value: `${client.guilds.cache.size}`,
			},
		);
	const loggingchannel = client.channels.cache.get('939844393425317951');
	loggingchannel.send({
		embeds: [newEmbed],
	});
});