const {
	CommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageSelectOption,
	MessageSelectMenu,
	MessageSelectOptionData
} = require("discord.js");
const admin = require('../../models/admin')
const node = require("nodeactyl");
const wait = require("util").promisify(setTimeout);
const config = require('../../settings/config.json')


module.exports = {
	name: "admin",
	description: "work in progress",
	usage: 'admin',
	permissions: ["MANAGE_MESSAGES"],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let panelURL;
		let panelAPI;
		let panelNAME;

		let panelTitle = "PteroControl | Panel Management";
		let footer = "PteroControl For Pterodactyl 1.x | Sponsored By ScarceHost.uk";
		let color = "E5BE11";
		let thumbnail = interaction.user.avatarURL();
		const id = interaction.user.id;

		if (id !== "139466122171908096")
			return interaction.channel.send(
				"This command are a **Work In Progress** only bot owner can access it for now!"
			);

		const Support = new MessageButton()
			.setLabel("Support")
			.setStyle("LINK")
			.setURL(config.inviteSupport);

		const errorDB = new MessageEmbed()
			.setDescription(
				"We are currently experiencing some downtime with our database provider. It is expected to be resolved within the next 30 minutes. Sorry for any inconvenience caused!"
			)
			.setTitle(panelTitle)
			.setFooter({
				text: footer
			})
			.setColor(color)
			.setThumbnail(thumbnail);

		const close = new MessageButton()
			.setLabel("Close")
			.setStyle("DANGER")
			.setCustomId("close");

		const closeEmbed = new MessageEmbed()
			.setDescription("Proccess Cancelled")
			.setTitle(panelTitle)
			.setFooter({
				text: footer
			})
			.setColor(color)
			.setThumbnail(thumbnail);

		const loading = new MessageEmbed()
			.setTitle(panelTitle)
			.setFooter({
				text: footer
			})
			.setColor(color)
			.setThumbnail(thumbnail)
			.setDescription("Processing Requests");

		const embedExit = new MessageEmbed()
			.setTitle(panelTitle)
			.setFooter({
				text: footer
			})
			.setColor(color)
			.setThumbnail(thumbnail)
			.setDescription(
				"Panel with that name are already exist in your discord account, please use other name"
			);

		admin
			.find({
				ids: id,
			})
			.then((panels) => {
				const noPanel = new MessageEmbed()
					.setDescription(
						"You currently dont have a panel linked to our API. You can click register button to register one. All you need is the panel URL and a Client API Key!"
					)
					.setTitle(panelTitle)
					.setFooter({
						text: footer
					})
					.setColor(color)
					.setThumbnail(thumbnail);

				const register = new MessageButton()
					.setLabel("Register new panel")
					.setStyle("SUCCESS")
					.setCustomId("register");

				const registerRow = new MessageActionRow().addComponents(
					register,
					Support
				);

				const reSucess = new MessageEmbed()
					.setColor(color)
					.setThumbnail(thumbnail)
					.setFooter({
						text: footer
					})
					.setDescription(
						"Your panel has been successfully registered on our api. You can now access it via the panel menu\n\n[Join our support server (Click Me)](https://discord.gg/jU4fQvhDCz)"
					);

				const reEmbed = new MessageEmbed()
					.setColor(color)
					.setFooter({
						text: footer
					})
					.setImage(
						"https://cdn.glitch.com/b0cc99ff-cc1d-46a0-8146-a13e39873cd9%2F20210625_111805.jpg?v=1624612831266"
					);

				const reName = new MessageEmbed()
					.setFooter({
						text: footer
					})
					.setColor(color)
					.setDescription(
						"Now enter a name that will be used for multi panels **(Any value)**"
					);

				const reUrl = new MessageEmbed()
					.setFooter({
						text: footer
					})
					.setColor(color)
					.setDescription(
						"Please send your panel url. Example: **(https://panel.scarcehost.uk)**"
					);

				const reApi = new MessageEmbed()
					.setFooter({
						text: footer
					})
					.setColor(color)
					.setDescription(
						"Please send your client api key. Example: `h9eVJyejq3d97yQfuY55CxSWs73u9lC9gFfW0FutBR9hNfw`\n\nRemember to use `Client Api key` and not `Admin Api key`"
					);

				const reDm = new MessageEmbed()
					.setColor(color)
					.setTitle(panelTitle)
					.setThumbnail(thumbnail)
					.setFooter({
						text: footer
					})
					.setDescription(
						"For privacy precautions, the requested action will take place in your DMS. Please ensure that you are allowed to received DMS from this server"
					);

				if (panels.length < 1)
					interaction.channel
					.send({
						embeds: [noPanel],
						components: [registerRow]
					})
					.then((remsg) => {
						const filter = i => {
							i.deferUpdate();
							return i.user.id === interaction.user.id;
						}

						const Registercollector = remsg.createMessageComponentCollector({
							filter,
							componentType: 'BUTTON',
							time: 30000,
						});

						Registercollector.on("collect", i => {

							if (i.customId === "register") {
								remsg.edit({
									embeds: [reDm],
									components: [new MessageActionRow().addComponents([Support])]
								});

								i.user.send({
									embeds: [reEmbed],
								}).then((m) => {
									// console.log(`IntID: ${interaction.user.id}\n mID: ${m.author.id}\n\n ${i.user.id}`);
									let c = m.channel;

									c.send({
										embeds: [reUrl]
									}).then(async function() {
										const msg_filter = (m) => m.author.id === interaction.user.id;
										await c
											.awaitMessages({
												filter: msg_filter,
												max: 1,
												time: 30000,
											})
											.then(async (collected) => {

												console.log(collected.first());
												panelURL = collected.first().content;
												console.log(panelURL);
											})
											.then(async function() {
												await c.send({
													embeds: [reApi]
												}).then(async function() {
													c.awaitMessages({
															filter: msg_filter,
															max: 1,
															time: 30000,
														})
														.then(async (collected) => {
															panelAPI = collected.first().content;
														})
														.then(async function() {
															await c.send({
																embeds: [reName]
															}).then(async function() {
																c.awaitMessages({
																	filter: msg_filter,
																	max: 1,
																	time: 30000,
																}).then(async (collected) => {
																	panelNAME = collected.first().content;
																	if (panelNAME.length > 100)
																		return c.send(
																			"Please keep the character limit to 25"
																		);
																	admin
																		.find({
																			ids: id,
																			NAME: panelNAME.trim(),
																		})
																		.then((exit) => {
																			if (exit.length > 0)
																				return c.send({
																					embeds: [embedExit]
																				});
																		})
																		.catch((error) => {
																			console.log(error);
																			c.send({
																				embeds: [errorDB]
																			});
																		});
																	try {
																		const npanel = new admin({
																			ids: id,
																			API: panelAPI.trim(),
																			URL: panelURL.trim(),
																			NAME: panelNAME.trim(),
																		});
																		await npanel.save();
																		c.send({
																			embeds: [reSucess]
																		});
																	} catch (error) {
																		console.log(error);
																		c.send({
																			embeds: [errorDB]
																		});
																	}
																});
															});
														});
												});
											});
									});
								});
							}
						});
					});

				if (panels.length < 1) return;

				let panelist;
				let options = [];

				// const reMenu = new MessageSelectMenu()
				// 	.setCustomId('reMenu')
				// 	.addOptions([{
				// 		label: 'Register new panel',
				// 		description: 'Select this to register new panel',
				// 		value: 'register',
				// 	}]);
				//
				// const closeMenu = new MessageSelectMenu()
				// 	.setCustomId('closeMenu')
				// 	.addOptions([{
				// 		label: 'Close',
				// 		description: 'Select this to close the menu',
				// 		value: 'close',
				// 	}]);
				//
				// options.push(reMenu);
				// options.push(closeMenu);
				panels.forEach((data) => {
					const option = new MessageSelectMenu()
						.setCustomId('auto_panels')
						.addOptions([{
								label: data.NAME,
								description: 'Select to manage panel',
								value: data.NAME,
							},
							{
								label: 'Register new panel',
								description: 'Select this to register new panel',
								value: 'register',
							},
							{
								label: 'Close',
								description: 'Select this to close the menu',
								value: 'close',
							}
						]);

					options.push(option);

					if (!panelist) return (panelist = "**" + data.NAME + "**\n");
					panelist = panelist + "**" + data.NAME + "**\n";
				});

				const panelEmbed = new MessageEmbed()
					.setTitle(panelTitle)
					.setFooter({
						text: footer
					})
					.setThumbnail(thumbnail)
					.setColor(color)
					.setDescription("Please select a panel to manage\n\n" + panelist);

				const panelMenu = new MessageActionRow().addComponents(options);

				interaction.channel
					.send({
						embeds: [panelEmbed],
						components: [panelMenu]
					})
					.then((panelmsg) => {
						const filter = i => {
							i.deferUpdate();
							return i.user.id === interaction.user.id;
						}
						const Panelcollector = panelmsg.createMessageComponentCollector({
							filter,
							max: 1,
							time: 30000,
						});
						Panelcollector.on("collect", async (m) => {
							if (m.values[0] === "close") {
								panelmsg
									.edit({
										embeds: [closeEmbed],
										components: []
									})
									.then((msg) => {
										msg.delete({
											timeout: 5000
										});
									});
							}
							if (m.values[0] === "register") {
								panelmsg.edit({
									embeds: [reDm],
									components: [new MessageActionRow().addComponents([Support])],
								});
								m.user.send({
									embeds: [reEmbed]
								}).then((m) => {
									let c = m.channel;

									c.send({
										embeds: [reUrl]
									}).then(async function() {
										const msg_filter = (m) => m.author.id === interaction.user.id;
										await c
											.awaitMessages({
												filter: msg_filter,
												max: 1,
												time: 30000,
											})
											.then(async (collected) => {
												panelURL = collected.first().content;
											})
											.then(async function() {
												await c.send({
													embeds: [reApi]
												}).then(async function() {
													c.awaitMessages({
															filter: msg_filter,
															max: 1,
															time: 30000
														})
														.then(async (collected) => {
															panelAPI = collected.first().content;
														})
														.then(async function() {
															await c.send({
																embeds: [reName]
															}).then(async function() {
																c.awaitMessages({
																	filter: msg_filter,
																	max: 1,
																	time: 30000
																}).then(async (collected) => {
																	panelNAME = collected.first().content;
																	if (panelNAME.length > 100)
																		return c.send(
																			"Please keep the character limit to 25"
																		);
																	admin
																		.find({
																			ids: id,
																			NAME: panelNAME.trim(),
																		})
																		.then((exit) => {
																			if (exit.length > 0)
																				return c.send({
																					embeds: [embedExit]
																				});
																		})
																		.catch((error) => {
																			console.log(error);
																			c.send({
																				embeds: [errorDB]
																			});
																		});
																	try {
																		const npanel = new admin({
																			ids: id,
																			API: panelAPI.trim(),
																			URL: panelURL.trim(),
																			NAME: panelNAME.trim(),
																		});
																		await npanel.save();
																		c.send({
																			embeds: [reSucess]
																		});
																	} catch (error) {
																		console.log(error);
																		c.send({
																			embeds: [errorDB]
																		});
																	}
																});
															});
														});
												});
											});
									});
								});
							} else {
								await panelmsg.edit({
									embeds: [loading],
									components: []
								});
								await wait(1500);
								admin
									.find({
										ids: id,
										NAME: m.values[0],
									})
									.then((fpanel) => {

										const Admin = new node.NodeactylApplication(
											fpanel[0].URL,
											fpanel[0].API
										);
										const panelManage = new MessageEmbed()
											.setTitle(panelTitle)
											.setFooter({
												text: footer
											})
											.setThumbnail(thumbnail)
											.setColor(color)
											.setDescription(
												"Hey, what do you want to do with this panel:\n" + m.values[0]
											);

										const pManage = new MessageButton()
											.setLabel("Manage Panel")
											.setStyle("PRIMARY")
											.setCustomId("pManage");

										const pUrl = new MessageButton()
											.setLabel("URL")
											.setStyle("PRIMARY")
											.setCustomId("pUrl");

										const manageServers = new MessageButton()
											.setLabel("Servers")
											.setStyle("PRIMARY")
											.setCustomId("servers");

										const manageNodes = new MessageButton()
											.setLabel("Nodes")
											.setStyle("PRIMARY")
											.setCustomId("nodes");

										const manageEggs = new MessageButton()
											.setLabel("Eggs and Nests")
											.setStyle("PRIMARY")
											.setCustomId("eggs");

										const manageUsers = new MessageButton()
											.setLabel("Users")
											.setStyle("PRIMARY")
											.setCustomId("users");

										const pDelete = new MessageButton()
											.setLabel("Delete")
											.setStyle("DANGER")
											.setCustomId("pDelete");

										const pEdit = new MessageButton()
											.setLabel("Edit")
											.setStyle("PRIMARY")
											.setCustomId("pEdit");

										const pManageRow = new MessageActionRow().addComponents(
											pManage,
											pEdit,
											pUrl,
											pDelete,
											close
										);
										const manageRow = new MessageActionRow().addComponents(
											manageServers,
											manageUsers,
											manageNodes,
											manageEggs,
											close
										);

										panelmsg.edit({
											embeds: [panelManage],
											components: [pManageRow],
										});

										Panelcollector.stop();
										const panelManageCollector = panelmsg.createMessageComponentCollector({
											filter,
											max: 1,
											time: 30000,
										}, );

										panelManageCollector.on("collect", async (pm) => {
											if (pm.customId === "close") {
												panelmsg
													.edit({
														embeds: [closeEmbed],
														components: []
													})
													.then((msg) => {
														msg.delete({
															timeout: 5000
														});
													});
											}
											if (pm.customId === "pEdit") {
												const embedEdit = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer
													})
													.setColor(color)
													.setThumbnail(thumbnail)
													.setDescription(
														"Please select which one you want to edit"
													);

												const updated = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer
													})
													.setColor(color)
													.setThumbnail(thumbnail)
													.setDescription(fpanel[0].NAME + " updated!");

												const editName = new MessageButton()
													.setLabel("Name")
													.setStyle("PRIMARY")
													.setCustomId("ename");

												const editUrl = new MessageButton()
													.setLabel("Url/Link")
													.setStyle("PRIMARY")
													.setCustomId("eurl");

												const editApi = new MessageButton()
													.setLabel("Apikey")
													.setStyle("PRIMARY")
													.setCustomId("ekey");

												const editRows = new MessageActionRow().addComponents(
													editName,
													editUrl,
													editApi
												);

												panelmsg.edit({
													embeds: [embedEdit],
													components: [editRows]
												});

												const EditManageCollector =
													panelmsg.createMessageComponentCollector({
														filter,
														max: 1,
														time: 30000,
													});

												EditManageCollector.on("collect", async (ep) => {
													if (ep.customId === "ename") {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																"Set a new Name for your panel"
															);

														panelmsg.edit({
															embeds: [editm],
															components: []
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000
															})
															.then(async (collected) => {
																let newcontent = collected.first().content.trim();

																admin
																	.find({
																		ids: id,
																		NAME: newcontent,
																	})
																	.then((exit) => {
																		if (exit.length > 0)
																			return panelmsg.edit(embedExit);
																		collected.first().delete();
																	})
																	.catch((error) => {
																		console.log(error);
																		panelmsg.edit({
																			embeds: [errorDB]
																		});
																		collected.first().delete();
																	});

																admin
																	.findOneAndUpdate({
																		ids: id,
																		NAME: m.values[0],
																	}, {
																		NAME: newcontent,
																	})
																	.then(() => {
																		panelmsg.edit({
																			embeds: [updated],
																			components: [],
																		});
																	})
																	.catch((Error) => {
																		console.log(Error);
																		panelmsg.edit({
																			embeds: [errorDB],
																			components: [],
																		});
																	});
															})
															.catch((error) => {
																interaction.channel.send("Sorry I didn't recieved a reply");
															});
													}
													if (ep.customId === "eurl") {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																"Please send the new panel url"
															);

														panelmsg.edit({
															embeds: [editm],
															components: []
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000
															})
															.then(async (collected) => {
																let newcontent = collected.first().content.trim();

																admin
																	.findOneAndUpdate({
																		ids: id,
																		NAME: m.values[0],
																	}, {
																		URL: newcontent,
																	})
																	.then(() => {
																		panelmsg.edit({
																			embeds: [updated],
																			components: [],
																		});
																		collected.first().delete();
																	})
																	.catch((Error) => {
																		panelmsg.edit({
																			embeds: [errorDB],
																			components: [],
																		});
																		collected.first().delete();
																	});
															})
															.catch((error) => {
																interaction.channel.send("Sorry I didn't recieved a reply");
															});
													}
													if (ep.customId === "eapi") {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																"Please send the new API for this panel"
															);

														panelmsg.edit({
															embeds: [editm],
															components: []
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000
															})
															.then(async (collected) => {
																let newcontent = collected.first().content.trim();

																admin
																	.findOneAndUpdate({
																		ids: id,
																		NAME: m.values[0],
																	}, {
																		API: newcontent,
																	})
																	.then(() => {
																		panelmsg.edit({
																			embeds: [updated],
																			components: [],
																		});
																		collected.first().delete();
																	})
																	.catch((Error) => {
																		panelmsg.edit({
																			embeds: [errorDB],
																			components: [],
																		});
																		collected.first().delete();
																	});
															})
															.catch((error) => {
																interaction.channel.send("Sorry I didn't recieved a reply");
															});
													}
												});
											}
											if (pm.customId === "pUrl") {
												const embedUrl = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer
													})
													.setColor(color)
													.setThumbnail(thumbnail)
													.setDescription("Your panel url is " + fpanel[0].URL);

												panelmsg.delete();
												pm.channel.send({
													embeds: [embedUrl],
													ephemeral: true
												});
											}
											if (pm.customId === "pDelete") {
												const pDelEmbed = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer
													})
													.setThumbnail(thumbnail)
													.setColor(color)
													.setDescription(
														"Panel succesfully deleted from our databases"
													);

												admin
													.deleteOne({
														ids: id,
														NAME: m.values[0],
													})
													.then((res) => {
														panelmsg
															.edit({
																embeds: [pDelEmbed],
																components: []
															})
															.then((msg) => {
																msg.delete({
																	timeout: 5000
																});
															});
													})
													.catch((error) => {
														panelmsg.edit({
															embeds: [errorDB],
															components: []
														});
													});
											}
											if (pm.customId === "pManage") {
												await panelmsg.edit({
													embeds: [loading],
													components: []
												});
												await wait(1500);

												const manageEmbed = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer
													})
													.setThumbnail(thumbnail)
													.setColor(color)
													.setDescription("Which options you want to manage?");
												panelmsg.edit({
													embeds: [manageEmbed],
													components: [manageRow],
												});

												const manageCollector = panelmsg.createMessageComponentCollector({
													filter,
													max: 1,
													time: 30000
												});

												manageCollector.on("collect", async (mc) => {
													if (mc.customId === "nodes") {}
													if (mc.customId === "eggs") {
														let temp;
														axios(
															fpanel[0].URL +
															"api/application/nests?include=eggs", {
																method: "GET",
																headers: {
																	Accept: "application/json",
																	"Content-Type": "application/json",
																	Authorization: "Bearer " + fpanel[0].API,
																},
															}
														).then((nests) => {
															nests.data.data.forEach((nest) => {
																if (!temp) {
																	temp =
																		"** " + nest.name + "**[`" + nest.id + "`]\n";
																	nest.attributes.relationships.eggs.data.forEach(
																		(egg) => {
																			if (
																				nest.attributes.relationships.eggs.data
																				.length === 0 ||
																				!temp
																			)
																				return (temp = "-\n");
																			if (
																				nest.attributes.relationships.eggs.data
																				.length === 0
																			)
																				return (temp = temp + "-\n");
																			if (!temp)
																				return (temp =
																					"- ** " +
																					egg.attributes.name +
																					"**[`" +
																					egg.attributes.id +
																					"`]\n");
																			temp =
																				temp +
																				"- ** " +
																				egg.attributes.name +
																				"**[`" +
																				egg.attributes.id +
																				"`]\n";
																		}
																	);
																	return;
																} else {
																	temp =
																		temp +
																		"** " +
																		egg.attributes.name +
																		"**[`" +
																		egg.attributes.id +
																		"`]\n";
																	nest.attributes.relationships.eggs.data.forEach(
																		(egg) => {
																			if (
																				nest.attributes.relationships.eggs.data
																				.length === 0 ||
																				!temp
																			)
																				return (temp = "-\n");
																			if (
																				nest.attributes.relationships.eggs.data
																				.length === 0
																			)
																				return (temp = temp + "-\n");
																			if (!temp)
																				return (temp =
																					"- ** " +
																					egg.attributes.name +
																					"**[`" +
																					egg.attributes.id +
																					"`]\n");
																			temp =
																				temp +
																				"- ** " +
																				egg.attributes.name +
																				"**[`" +
																				egg.attributes.id +
																				"`]\n";
																		}
																	);
																}
															});
															const embed = new MessageEmbed()
																.setTitle(data.name + " > Eggs Management")
																.setFooter(
																	"PteroAdmin (beta) For Pterodactyl 1.x"
																)
																.setThumbnail(client.user.avatarURL())
																.setColor("E5BE11")
																.setDescription(temp);
															m.edit({
																content: '',
																embeds: [embed],
																components: [],
															});
														});
													}
													const createdDone = new MessageEmbed()
														.setTitle(panelTitle)
														.setFooter({
															text: footer
														})
														.setColor(color)
														.setThumbnail(thumbnail)
														.setDescription("Successfully created");

													const actionCreate = new MessageButton()
														.setLabel("Create")
														.setStyle("PRIMARY")
														.setCustomId("create");

													const actionDelete = new MessageButton()
														.setLabel("Delete")
														.setStyle("DANGER")
														.setCustomId("delete");

													const actionEdit = new MessageButton()
														.setLabel("Edit")
														.setStyle("PRIMARY")
														.setCustomId("edit");

													const ManageRow = new MessageActionRow().addComponents(
														actionCreate,
														actionEdit,
														actionDelete,
														close
													);

													if (mc.customId === "users") {
														const usersManage = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																"What you want to do with users management?"
															);

														panelmsg.edit({
															embeds: [usersManage],
															components: ManageRow,
														});

														const actionsCollector =
															panelmsg.createMessageComponentCollector({
																filter,
																max: 1,
																time: 30000,
															});

														actionsCollector.on("collect", async (uc) => {
															if (uc.customId === "close") {
																panelmsg
																	.edit({
																		embeds: [closeEmbed],
																		components: []
																	})
																	.then((msg) => {
																		msg.delete({
																			timeout: 5000
																		});
																	});
															}
															if (uc.customId === "create") {
																const editm = new MessageEmbed()
																	.setTitle(panelTitle)
																	.setFooter({
																		text: footer
																	})
																	.setColor(color)
																	.setThumbnail(thumbnail)
																	.setDescription(
																		"Please send what the user name for this user"
																	);

																panelmsg.edit({
																	embeds: [editm],
																	components: []
																});
																const msg_filter = (m) => m.author.id === interaction.user.id;
																await interaction.channel
																	.awaitMessages({
																		filter: msg_filter,
																		max: 1,
																		time: 30000
																	})
																	.then(async (collected) => {
																		let name = collected.first().content.trim();
																		await interaction.channel
																			.awaitMessages({
																				filter: msg_filter,
																				max: 1,
																				time: 30000
																			})
																			.then(async (collected) => {
																				let email = collected
																					.first()
																					.content.trim();

																				Admin.createUser(
																					name,
																					email,
																					name,
																					name
																				).then((created) => {
																					panelmsg.edit({
																						embeds: [createdDone],
																						components: [null],
																					});
																				});
																			})
																			.catch((error) => {
																				interaction.channel.send("Sorry I didn't recieved a reply");
																			});
																	})
																	.catch((error) => {
																		interaction.channel.send("Sorry I didn't recieved a reply");
																	});
															}
															if (uc.customId === "edit") {}
															if (uc.customId === "delete") {}
														});
													}
													if (mc.customId === "servers") {
														const serversManage = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																"What you want to do with servers management?"
															);

														panelmsg.edit({
															embeds: [serversManage],
															components: [ManageRow],
														});

														const actionsCollector =
															panelmsg.createMessageComponentCollector({
																filter,
																max: 1,
																time: 30000,
															});

														actionsCollector.on("collect", (uc) => {
															if (uc.customId === "close") {
																panelmsg
																	.edit({
																		embeds: [closeEmbed],
																		components: []
																	})
																	.then((msg) => {
																		msg.delete({
																			timeout: 5000
																		});
																	});
															}
														});
													}
												});
											}
										});
									});
							}
						});
					});
			})
			.catch((error) => {
				console.log(error);
				interaction.channel.send(errorDB);
			});
	},
};