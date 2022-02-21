const {
	CommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow
} = require("discord.js");
const config = require('../../settings/config.json');


module.exports = {
	name: "info",
	description: "Server information",
	usage: '/info',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let totalSeconds = client.uptime / 1000;
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

		let button = new MessageButton()
			.setLabel("Support Server")
			.setStyle("LINK")
			.setURL(config.inviteSupport);
		let button1 = new MessageButton()
			.setLabel("Invite Bot")
			.setStyle("LINK")
			.setURL(
				config.inviteLink
			);
		let row = new MessageActionRow().addComponents(button, button1);
		let helpEmbed = new MessageEmbed()
			.setColor("E5BE11")
			.setTitle("PteroControl | Information")
			.setThumbnail(client.user.avatarURL())
			.setDescription(
				`**Ping** : ${client.ws.ping}ms\n**Uptime** : ${uptime}\n\nSponsored By:\n\[ScarceHost.uk](https://ScarceHost.uk)`
			)
			.setFooter({
				text: `(C) 2022 PteroControl | For Pterodactyl V1.x | Sponsored By ScarceHost.uk`
			});
		interaction.reply({
			embeds: [helpEmbed],
			components: [row]
		});

	},
};