const {
	CommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow
} = require("discord.js");
const config = require('../../settings/config.json');
module.exports = {
	name: "invite",
	description: "invite the bot",
	usage: '/invite',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let embed = new MessageEmbed()
			.setDescription("You can invite this bot by pressing the invite button")
			.setColor("E5BE11")
			.setTitle("PteroControl | Information")
			.setThumbnail(client.user.avatarURL())
			.setFooter({
				text: `PteroControl For Pterodactyl V1.x | Sponsored By ScarceHost.uk`
			});

		let button = new MessageButton()
			.setLabel("Invite Bot")
			.setStyle("LINK")
			.setURL(
				config.inviteLink
			);
		let row = new MessageActionRow().addComponents(button);

		interaction.reply({
			embeds: [embed],
			components: [row]
		});
	},
};