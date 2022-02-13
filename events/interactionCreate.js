const {
	MessageEmbed,
} = require('discord.js');
const client = require('../bot')
const config = require('../settings/config.json');
const mongoose = require('mongoose');

const util = require('util');
const moment = require('moment');

client.on('interactionCreate', async interaction => {
	// Slash Command Handling
	if (interaction.isCommand()) {
		// await interaction.deferReply({ ephemeral: false }).catch(() => { });

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) {
			return interaction.followUp({
				content: 'An error has occured ',
			});
		}

		const args = [];

		for (const option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach((x) => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) {
				args.push(option.value);
			}
		}
		interaction.member = interaction.guild.members.cache.get(interaction.user.id);

		if (cmd) {
			// checking user perms
			if (!interaction.member.permissions.has(cmd.permissions || [])) {
				return interaction.reply({
					embeds: [
						new MessageEmbed()
						.setColor(ee.embed_color)
						.setDescription(`You don't Have ${cmd.permissions} To Run Command..`),
					],
					ephemeral: true,
				});
			}
			cmd.run(client, interaction, args);
					const messageChannel = client.channels.cache.get('941049199846379561');

					const embedLog = new MessageEmbed()
						.setColor('AQUA')
						.setAuthor({
							name: `${interaction.user.tag} used slashcommand`,
							iconURL: interaction.user.avatarURL({
								dynamic: true,
								size: 512,
							}),
						})

						.setDescription(`${interaction.user}`)
						.setThumbnail(interaction.user.avatarURL({
							dynamic: true,
							size: 512,
						}))
						// .setTimestamp(moment().format('ddd DD-MM-YYYY HH:mm:ss'))
						.setFooter({
							text: moment().format('ddd DD-MM-YYYY HH:mm:ss'),
						})
						.addField('**Command**', `${cmd.name}: ` + `${args}`)
						.addField('**Can run:**', `${interaction.member.permissions.has(cmd.permissions || [])}`, true)
						.addField('**Channel**:', `${interaction.channel}`, true);

					if (cmd.permissions == ' ') {
						embedLog.addField('**Permissions**:', 'None', true);
					} else {
						embedLog.addField('**Permissions**:', `${cmd.permissions}`, true);
					}

					messageChannel.send({
						embeds: [embedLog],
					});
            		}
	}
	// Context Menu Handling
	if (interaction.isContextMenu()) {
		const command = client.slashCommands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}

	if (!interaction.isSelectMenu()) {
		return;
	}

	const {
		customId,
		values,
		member,
	} = interaction;

	if (customId === 'auto_roles') {
		const component = interaction.component;
		const removed = component.options.filter((option) => {
			return !values.includes(option.value);
		});
		for (const id of removed) {
			member.roles.remove(id.value);
		}
		for (const id of values) {
			member.roles.add(id);
		}
		interaction.reply({
			content: '**Your Roles have been updated!**',
			ephemeral: true,
		});
	}
});