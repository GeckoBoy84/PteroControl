const {
	Message,
	Client,
	MessageEmbed
} = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
	name: "shutdown",
	aliases: ['sd'],
	permissions: ["ADMINISTRATOR"],
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const ownerIDs = ['INSERT_OWNER_ID_HERE'];
		const shutdownembed = new MessageEmbed()
			.setTitle("Shutting down")
			.setDescription("Bye bye");
		if (!ownerIDs.includes(message.author.id)) {

			return message.channel.reply({
				content: 'You do not have enough permissions to use this command.',
				ephemeral: true,
			});
		}

		try {
			message.channel.send({
				embeds: [shutdownembed]
			}).then(msg => {
				msg.react('🆗');
				message.delete()
				wait(5000)
				msg.delete()
			}).then(() => {
				wait(10000)
				client.destroy()
				process.exit()

			});
		} catch (e) {
			console.log(e);
		}

	},
};