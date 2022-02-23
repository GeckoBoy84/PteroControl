let prefix = require("../models/prefix.js");
const client = require('../bot')
const config = require('../settings/config.json');
const mongoose = require('mongoose');

client.on('messageCreate', async message => {
	let deprefix = "-";

	// if (message.channel.type !== "dm") {
	// 	prefix
	// 		.find({
	// 			GUILDID: message.guild.id,
	// 		})
	// 		.then((guildprefix) => {
	// 			console.log(message.guild.id)
	// 			if (guildprefix.length === 0) {
	// 				if (message.author.bot) return;
	// 				if (message.content.indexOf(deprefix) !== 0) return;
	//
	// 				const args = message.content.slice(1).trim().split(/ +/g);
	// 				const command = args.shift().toLowerCase();
	// 				const cmd = client.commands.get(command.toLowerCase()) || client.commands.find((cmds) => command.aliases && command.aliases.includes(command));
	//
	// 				if (!cmd) return;
	// 				if (cmd) {
	// 					if (!message.member.permissions.has(cmd.permissions || [])) {
	// 						return message.reply({
	// 							embeds: [
	// 								new MessageEmbed()
	// 								.setColor("BLUE")
	// 								.setDescription(`** ❌ You don't Have ${command.permissions} To Run Command.. **`),
	// 							],
	// 						});
	// 					}
	// 					cmd.run(client, message, args);
	// 				}
	// 			}
	// 			if (guildprefix.length > 0) {
	// 				deprefix = guildprefix[0].PREFIX;
	//
	// 				if (message.author.bot) return;
	// 				if (message.content.indexOf(deprefix) !== 0) return;
	//
	// 				const args = message.content.slice(1).trim().split(/ +/g);
	// 				const command = args.shift().toLowerCase();
	// 				const cmd = client.commands.get(command.toLowerCase()) || client.commands.find((cmds) => command.aliases && command.aliases.includes(command));
	//
	// 				if (!cmd) return;
	// 				if (cmd) {
	// 					if (!message.member.permissions.has(cmd.permissions || [])) {
	// 						return message.reply({
	// 							embeds: [
	// 								new MessageEmbed()
	// 								.setColor("BLUE")
	// 								.setDescription(`** ❌ You don't Have ${command.permissions} To Run Command.. **`),
	// 							],
	// 						});
	// 					}
	// 					cmd.run(client, message, args);
	// 				}
	// 			}
	// 		});
	// } else {
	if (message.author.bot) return;
	if (message.content.indexOf(deprefix) !== 0) return;

	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command.toLowerCase()) || client.commands.find((cmds) => command.aliases && command.aliases.includes(command));

	// if (!cmd) return;
	if (cmd) {
		if (!message.member.permissions.has(cmd.permissions || [])) {
			return message.reply({
				embeds: [
					new MessageEmbed()
					.setColor("BLUE")
					.setDescription(`** ❌ You don't have ${command.permissions} to run that command. **`),
				],
			});
		}
		cmd.run(client, message, args);
	}
	// }
});