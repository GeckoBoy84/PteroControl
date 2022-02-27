const {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
} = require('discord.js');
const config = require('../settings/config.json');
const client = require('../bot');


client.on('guildCreate', async (guild) => {
	const owner = await guild.fetchOwner();
	const embed = new MessageEmbed()
		.setAuthor({
			name: 'PteroControl | Information',
			iconURL: client.user.avatarURL(),
		})
		.setColor('RANDOM')
		.setThumbnail(guild.iconURL())
    	.setFooter({ text: 'PteroControl For Pterodactyl 1.x | Sponsored By ScarceHost.uk'})
    	.setTimestamp()
		.setDescription(
			'Thank you for adding me to your discord server! to get all command information type `/help`, if you needing help join our support server by clicking the button!',
		);
	const button = new MessageButton()
		.setLabel('Support Server')
		.setStyle('LINK')
		.setURL(config.inviteSupport);
	owner.send({
		embeds: [embed],
		components: [new MessageActionRow().addComponents([button])],
	});

	const newEmbed = new MessageEmbed()
		.setAuthor({
			name: 'PteroControl | Information',
			iconURL: client.user.avatarURL(),
		})
		.setColor('GREEN')
		.setThumbnail(guild.iconURL())
		.setDescription(

			'GUILD ADDED',
		)
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