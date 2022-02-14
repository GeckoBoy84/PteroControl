const {
	REST
} = require('@discordjs/rest');
const {
	Routes
} = require('discord-api-types/v9');
const {
	TOKEN,
	UseGlobal,
	clientId,
	guildId
} = require('../settings/config.json');

const {
	Client
} = require('discord.js');
const fs = require('fs');

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
	console.log(UseGlobal);
	console.log(clientId);
	console.log(guildId);

	(async () => {
		try {
			let commandli = 0;
			const commands = [];
			fs.readdirSync('./slscommands').forEach(async (cmd) => {
				const commandFiles = fs.readdirSync(`./slscommands/${cmd}/`).filter((file) => file.endsWith('.js'));
				for (cmds of commandFiles) {
					const command = require(`../slscommands/${cmd}/${cmds}`);
					if (command) {
						client.slashCommands.set(command.name, command);
						commands.push(command);
						commandli++;
					} else {
						console.log(`${cmds} Command is not Ready`);
						continue;
					}
				}
				// client.on('ready', async () => {
				// 	client.guilds.cache.forEach(async (g) => {
				// 		await client.guilds.cache.get(g.id).commands.set(commands);
				// 	});
				//
				//
				// });

				const rest = new REST({
					version: '9'
				}).setToken(TOKEN);



				// console.log('Started refreshing application (/) commands.');
				client.logger(`Started refreshing application (/) commands.`.brightGreen);

				if (UseGlobal === 'true') {
					client.logger('Global application set true'.brightGreen);
					await rest.put(
						Routes.applicationCommands(clientId), {
							body: commands
						},
					);
				} else {
					client.logger('Global application set false'.brightGreen);
					await rest.put(
						Routes.applicationGuildCommands(clientId, guildId), {
							body: commands
						},
					);
				}
				// console.log('Successfully reloaded application (/) commands.');
				client.logger(`Successfully reloaded application (/) commands.✅`.brightGreen);

			});
			// console.log(`${command} Slashcommands Loaded✅`);
		} catch (e) {
			console.log(e.message);
		}
	})();

};