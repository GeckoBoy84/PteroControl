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
					"https://media.discordapp.net/attachments/796243715014131714/870935938413494302/Screenshot_2021-07-31-14-14-00-45.jpg"
				);

			let embed1 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 2")
				.setColor("E5BE11")
				.setDescription("Go to Profile button on the top right")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870929432846671932/20210731_142210.jpg"
				);

			let embed2 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 3")
				.setColor("E5BE11")
				.setDescription("Go to API Credentials button on the top left")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870929432595009576/20210731_142103.jpg"
				);

			let embed3 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 4")
				.setColor("E5BE11")
				.setDescription(
					"Fill the description anything you want and press create, you don't need to fill Allowed Ips"
				)
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870929432095911946/20210731_142012.jpg"
				);

			let embed4 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 5")
				.setColor("E5BE11")
				.setDescription("Copy the Panel ApiKey that just appear on your screen")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870929431848435762/20210731_141910.jpg"
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
					"https://media.discordapp.net/attachments/796243715014131714/870929906182258728/20210731_142350.jpg"
				);

			let embed6 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 7")
				.setColor("E5BE11")
				.setDescription("Type your Panel URL/LINK")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870931067849302066/IMG_20210731_142808.jpg"
				);

			let embed7 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 8")
				.setColor("E5BE11")
				.setDescription("Paste your Panel ApiKey")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870931068084191272/IMG_20210731_142820.jpg"
				);

			let embed8 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 9")
				.setColor("E5BE11")
				.setDescription("Type the Panel name")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870931068407136296/IMG_20210731_142835.jpg"
				);

			let embed9 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial Step 10")
				.setColor("E5BE11")
				.setDescription(
					"Type `" +
					gprefix +
					"control` again and select your server the the button name"
				)
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870931249169055795/Screenshot_2021-07-31-14-29-47-46_572064f74bd5f9fa804b05334aa4f912.jpg"
				);

			let embed10 = new MessageEmbed()
				.setTitle("PteroControl | Tutorial End")
				.setColor("E5BE11")
				.setDescription("Thank you for using PteroControl, have fun!")
				.setImage(
					"https://media.discordapp.net/attachments/796243715014131714/870932824046338089/20210731_143542.jpg"
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
				embed8,
				embed9,
				embed10,
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