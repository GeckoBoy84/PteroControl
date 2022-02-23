const {
	MessageEmbed,
	Message,
	CommandInteraction,
	Client,
} = require('discord.js');
const {
	readdirSync,
} = require('fs');
const {
	stripIndent,
} = require('common-tags');
const color = '#ff0000';
const moment = require('moment');

const create_mh = require('../../handlers/menu.js');
module.exports = {
	name: 'help',
	usage: '/help', // This is how you set the usage for the command.
	description: 'Shows all available bot commands',
	options: [{
		name: 'command',
		description: 'Enter the command or category that you want to get help with.',
		required: false,
		type: '3',
	}],

	run: async (client, interaction) => {
		const helpcmd = interaction.options.getString('command');
		const mbr = interaction.user.tag;

		const categories = [];
		const cots = [];

		if (!helpcmd) {
			const ignored = ['the ingored commands'];
			const emo = {
				information: ':grey_question:',
				setup: `:tools:`,
			};

			const ccate = [];
			readdirSync('./slscommands/').forEach((dir) => {
				if (ignored.includes(dir.toLowerCase())) return;
				const commands = readdirSync(`./slscommands/${dir}/`).filter((file) =>
					file.endsWith('.js'),
				);

				if (ignored.includes(dir.toLowerCase())) return;

				const name = `${emo[dir]} - ${dir}`;
				const nome = dir.toUpperCase();

				let cats = new Object();
				cats = {
					name: name,
					value: `\`/help ${dir.toLowerCase()}\``,
					inline: true,
				};

				categories.push(cats);
				ccate.push(nome);
			});

			const description = stripIndent `
            Use the drop down menu or follow given commands below
            You can also type /help [command]
            `;
			const embed = new MessageEmbed()
				.setTitle('Bot Commands')
				.setDescription(`\`\`\`asciidoc\n${description}\`\`\``)
				.addFields(categories)
				.setFooter({
					text: `Requested by ${mbr} | Sponsored By ScarceHost.uk`,
					iconURL: interaction.user.displayAvatarURL({
						dynamic: true,
					}),
				})
				.setTimestamp()
				.setColor(color);

			const menus = create_mh(ccate);

			return await interaction.reply({
				embeds: [embed],
				components: menus.smenu,
				fetchReply: true,
				ephemeral: true,
			}).then(async (interactionn) => {
				const menuID = menus.sid;

				const select = async (interaction) => {
					if (interaction.customId != menuID) return;

					const {
						values,
					} = interaction;

					const value = values[0];

					const catts = [];

					readdirSync('./slscommands/').forEach((dir) => {
						if (dir.toLowerCase() !== value.toLowerCase()) return;
						const commands = readdirSync(`./slscommands/${dir}/`).filter(
							(file) => file.endsWith('.js'),
						);
						const cmds = commands.map((command) => {
							const file = require(`../../slscommands/${dir}/${command}`);

							if (!file.name) return 'No command name.';

							const name = file.name.replace('.js', '');

							if (client.slashCommands.get(name).hidden) return;

							const des = client.slashCommands.get(name).description;
							let usg = client.slashCommands.get(name).usage;
							if (!usg) {
								usg = 'No usage provided';
							}
							const emo = client.slashCommands.get(name).emoji;
							const emoe = emo ? `${emo} - ` : '';

							const obj = {
								cname: `${emoe}\`${name}\` |  **${usg}**`,
								des,
							};

							return obj;
						});

						let dota = new Object();

						cmds.map((co) => {
							if (co == undefined) return;

							dota = {
								name: `${cmds.length === 0 ? 'In progress.' : co.cname}`,
								value: co.des ? co.des : 'No Description',
								inline: true,
							};
							catts.push(dota);
						});

						cots.push(dir.toLowerCase());
					});

					if (cots.includes(value.toLowerCase())) {
						const combed = new MessageEmbed()
							.setTitle(
								`__${
									value.charAt(0).toUpperCase() + value.slice(1)
								} Commands__`,
							)
							.setDescription(
								'Use `/help` followed by a command name to get more information on a command.\nFor example: `/help control`.\n\n',
							)
							.addFields(catts)
							.setColor(color);

						await interaction.deferUpdate();

						return interaction.editReply({
							embeds: [combed],
							components: menus.smenu,
						});
					}
				};
				const filter = (interaction) => {
					return (
						!interaction.user.bot &&
						interaction.user.id == interaction.member.id
					);
				};

				const collector = interactionn.createMessageComponentCollector({
					filter,
					componentType: 'SELECT_MENU',
				});
				collector.on('collect', select);
				collector.on('end', () => null);
			});
		} else {
			const catts = [];

			readdirSync('./slscommands/').forEach((dir) => {
				if (dir.toLowerCase() !== helpcmd.toLowerCase()) return;
				const commands = readdirSync(`./slscommands/${dir}/`).filter((file) =>
					file.endsWith('.js'),
				);

				const cmds = commands.map((command) => {
					const file = require(`../../slscommands/${dir}/${command}`);
					if (!file.name) return 'No command name.';
					const name = file.name.replace('.js', '');
					if (client.slashCommands.get(name).hidden) return;
					let usg = client.slashCommands.get(name).usage;
					if (!usg) {
						usg = 'No usage provided';
					}

					const des = client.slashCommands.get(name).description;
					const emo = client.slashCommands.get(name).emoji;
					const emoe = emo ? `${emo} - ` : '';
					const obj = {
						cname: `${emoe}\`${name}\` |  **${usg}**`,
						des,
					};
					return obj;
				});
				let dota = new Object();
				cmds.map((co) => {
					if (co == undefined) return;
					dota = {
						name: `${cmds.length === 0 ? 'In progress.' : co.cname}`,
						value: co.des ? co.des : 'No Description',
						inline: true,
					};
					catts.push(dota);
				});

				cots.push(dir.toLowerCase());
			});

			const command = client.slashCommands.get(helpcmd.toLowerCase());

			if (cots.includes(helpcmd.toLowerCase())) {
				const combed = new MessageEmbed()
					.setTitle(
						`__${
							helpcmd.charAt(0).toUpperCase() + helpcmd.slice(1)
						} Commands__`,
					)
					.setDescription(
						'Use `/help` followed by a command name to get more information on a command.\nFor example: `/help dt`.\n\n',
					)
					.addFields(catts)
					.setColor(color);

				return interaction.reply({
					embeds: [combed],
					ephemeral: true,
				});
			}

			if (!command) {
				const embed = new MessageEmbed()
					.setTitle('Invalid command! Make sure you didn\'t use spaces. Use `/help` for all of my commands.')
					.setColor('RED');
				return await interaction.reply({
					embeds: [embed],
					ephemeral: true,
					allowedMentions: {
						repliedUser: false,
					},
				});
			}
			const embed = new MessageEmbed()
				.setTitle('Command Details:')
				.addField(
					'Command:',
					command.name ? `\`${command.name}\`` : 'No name for this command.',
				)
				.addField(
					'Usage:',
					command.usage ?
					`\`${command.usage}\`` :
					`\`/${command.name}\``,
				)
				.addField(
					'Command Description:',
					command.description ?
					command.description :
					'No description for this command.',
				)
				.setFooter({
					text: `Requested by ${mbr}`,
					iconURL: interaction.user.displayAvatarURL({
						dynamic: true,
					}),
				})
				.setTimestamp()
				.setColor(color);
			return await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};