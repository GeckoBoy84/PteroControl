const {
	CommandInteraction,
	Client,
	MessageEmbed,
	MessageButton
} = require("discord.js");
const {
	createSlider
} = require("discord-epagination");
const paginationEmbed = require('discordjs-button-pagination');
const prefix = require('../../models/prefix');

module.exports = {
	name: "tutorial",
	description: "tutorial of the bot",
	usage: '/tutorial',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let gprefix = "/";

		if (interaction.channel.type !== "dm") {
			//DMS

			const button1 = new MessageButton()
				.setCustomId('previousbtn')
				.setLabel('Previous')
				.setStyle('DANGER');

			const button2 = new MessageButton()
				.setCustomId('nextbtn')
				.setLabel('Next')
				.setStyle('SUCCESS');

			let embed0 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 1")
				.setColor("E5BE11")
				.setDescription("Go to your Hosting Panel and copy the Panel URL/LINK")
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941497941749821461/unknown.png"
				);

			let embed1 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 2")
				.setColor("E5BE11")
				.setDescription("Click the Profile button on the top right")
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941498180628004864/unknown.png"
				);

			let embed2 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 3")
				.setColor("E5BE11")
				.setDescription("Click the API Credentials button on the top left")
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941498327873224764/unknown.png"
				);

			let embed3 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 4")
				.setColor("E5BE11")
				.setDescription(
					"Fill the description with anything you want and press create, don't type in Allowed Ips"
				)
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941498451450011668/unknown.png"
				);

			let embed4 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 5")
				.setColor("E5BE11")
				.setDescription("Copy the Panel ApiKey that appears on your screen")
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941498613933174824/unknown.png"
				);

			let embed5 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 6")
				.setColor("E5BE11")
				.setDescription(
					"Type `" +
					gprefix +
					"control`, select register button or register new panel menu, and check your dms"
				)
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941499045480898590/unknown.png"
				);

			let embed6 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 7")
				.setColor("E5BE11")
				.setDescription("Type your Panel information")
				.setImage(
					"https://cdn.discordapp.com/attachments/941497404136517672/941499825524981770/unknown.png"
				);

			let embed7 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial End")
				.setColor("E5BE11")
				.setDescription("Thank you for using PteroControl, have fun!")
				.setImage(
					"https://cdn.glitch.com/b0cc99ff-cc1d-46a0-8146-a13e39873cd9%2F20210625_111805.jpg?v=1624612831266"
				);
			pages = [
				embed0,
				embed1,
				embed2,
				embed3,
				embed4,
				embed5,
				embed6,
				embed7,
			];

			buttonList = [
				button1,
				button2,
			]

			paginationEmbed(interaction, pages, buttonList);
			// createSlider({
			// 	message: interaction,
			// 	embeds: [
			// 		embed0,
			// 		embed1,
			// 		embed2,
			// 		embed3,
			// 		embed4,
			// 		embed5,
			// 		embed6,
			// 		embed7,
			// 		embed8,
			// 		embed9,
			// 		embed10
			// 	],
			// 	otherButtons: {
			// 		// First page button
			// 		firstButton: {
			// 			enabled: false,
			// 			// Make the button behind the back and foward buttons. [..., "previous", "next"]
			// 			position: 0,
			// 		},
			// 		// Last page button
			// 		lastButton: {
			// 			enabled: false,
			// 			// Make the button in front of the back and foward buttons. ["first", "previous", "next", ...]
			// 			position: 3,
			// 		},
			// 		// Delete button
			// 		deleteButton: {
			// 			enabled: true,
			// 			// Make the button in the middle of all the buttons. ["first", "previous", ... , "next", "last"]
			// 			position: 1,
			// 		},
			// 	},
			//
			// 	buttons: [
			// 		// Customization for the back button
			// 		{
			// 			name: "back",
			// 			emoji: "◀",
			// 			style: "PRIMARY"
			// 		},
			// 		// Customization for the foward button
			// 		{
			// 			name: "foward",
			// 			emoji: "▶",
			// 			style: "PRIMARY"
			// 		},
			// 		// Customization for the first page button
			// 		{
			// 			name: "first",
			// 			emoji: "⏪",
			// 			style: "PRIMARY"
			// 		},
			// 		// Customization for the last page button
			// 		{
			// 			name: "last",
			// 			emoji: "⏩",
			// 			style: "PRIMARY"
			// 		},
			// 		// Customization for the delete button
			// 		{
			// 			name: "delete",
			// 			emoji: "❌",
			// 			style: "DANGER"
			// 		},
			// 	],
			// 	time: 120000,
			// });

		}
	},
};