const {
	MessageEmbed,
} = require('discord.js');
const config = require('../settings/config.json');
const client = require('../bot');


client.on('guildDelete', async (guild) => {

	const newEmbed = new MessageEmbed()
		.setAuthor({
			name: 'PteroControl | Information',
			iconURL: client.user.avatarURL(),
		})
		.setColor('RANDOM')
		.setThumbnail(guild.iconURL())
		.setDescription(

			`I've left a guild:\n\n **${guild.name}**`,
		);
	const loggingchannel = client.channels.cache.get('939844393425317951');
	loggingchannel.send({
		embeds: [newEmbed],
	});
});