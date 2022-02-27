const {
	CommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageSelectOption,
	MessageSelectMenu,
	MessageSelectOptionData,
} = require('discord.js');
const panel = require('../../models/panel');
const node = require('nodeactyl');
const wait = require('util').promisify(setTimeout);
const config = require('../../settings/config.json');

module.exports = {
	name: 'control',
	description: 'control your panel',
	permissions: [' '],
	usage: '/control',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction) => {
		let panelURL;
		let panelAPI;
		let panelNAME;
		const panelTitle = 'PteroControl | Panel Management';
		const serverTitle = 'PteroControl | Server Management';
		const accountTitle = 'PteroControl | Account Management';
		const footer = 'PteroControl For Pterodactyl 1.x | Sponsored By ScarceHost.uk';
		const color = '0000FF';
		const thumbnail = client.user.avatarURL();
		const id = interaction.user.id;

		const Support = new MessageButton()
			.setLabel('Support')
			.setStyle('LINK')
			.setURL(config.inviteSupport);

		const errorDB = new MessageEmbed()
			.setDescription(
				'We are currently experiencing some downtime with our database provider. It is expected to be resolved within the next 30 minutes. Sorry for any inconvenience caused!',
			)
			.setTitle(panelTitle)
			.setFooter({
				text: footer,
			})
			.setColor(color)
			.setThumbnail(thumbnail);

		const close = new MessageButton()
			.setLabel('Close')
			.setStyle('DANGER')
			.setCustomId('close');

		const closeEmbed = new MessageEmbed()
			.setDescription('Proccess Cancelled')
			.setTitle(panelTitle)
			.setFooter({
				text: footer,
			})
			.setColor(color)
			.setThumbnail(thumbnail);

		const loading = new MessageEmbed()
			.setTitle(panelTitle)
			.setFooter({
				text: footer,
			})
			.setColor(color)
			.setThumbnail(thumbnail)
			.setDescription('Processing Requests');

		const embedExit = new MessageEmbed()
			.setTitle(panelTitle)
			.setFooter({
				text: footer,
			})
			.setColor(color)
			.setThumbnail(thumbnail)
			.setDescription(
				'Panel with that name are already exist in your discord account, please use other name',
			);


		panel
			.find({
				ID: id,
			})
			.then((panels) => {
				const noPanel = new MessageEmbed()
					.setDescription(
						'You currently dont have a panel linked to our API. You can click register button to register one. All you need is the panel URL and a Client API Key!',
					)
					.setTitle(panelTitle)
					.setFooter({
						text: footer,
					})
					.setColor(color)
					.setThumbnail(thumbnail);

				const register = new MessageButton()
					.setLabel('Register new panel')
					.setStyle('SUCCESS')
					.setCustomId('register');

				const registerRow = new MessageActionRow().addComponents(
					register,
					Support,
				);

				const reSucess = new MessageEmbed()
					.setColor(color)
					.setThumbnail(thumbnail)
					.setFooter({
						text: footer,
					})
					.setDescription(
						'Your panel has been successfully registered on our api. You can now access it via the panel menu\n\n[Join our support server (Click Me)](https://discord.gg/jU4fQvhDCz)',
					);

				const reEmbed = new MessageEmbed()
					.setColor(color)
					.setFooter({
						text: footer,
					})
					.setImage(
						'https://cdn.glitch.com/b0cc99ff-cc1d-46a0-8146-a13e39873cd9%2F20210625_111805.jpg?v=1624612831266',
					);

				const reName = new MessageEmbed()
					.setFooter({
						text: footer,
					})
					.setColor(color)
					.setDescription(
						'Now enter a name that will be used for multi panels **(Any value)**',
					);

				const reUrl = new MessageEmbed()
					.setFooter({
						text: footer,
					})
					.setColor(color)
					.setDescription(
						'Please send your panel url. Example: **(https://panel.scarcehost.uk)**',
					);

				const reApi = new MessageEmbed()
					.setFooter({
						text: footer,
					})
					.setColor(color)
					.setDescription(
						'Please send your client api key. Example: `h9eVJyejq3d97yQfuY55CxSWs73u9lC9gFfW0FutBR9hNfw`\n\nRemember to use `Client Api key` and not `Admin Api key`',
					);

				const reDm = new MessageEmbed()
					.setColor(color)
					.setTitle(panelTitle)
					.setThumbnail(thumbnail)
					.setFooter({
						text: footer,
					})
					.setDescription(
						'For privacy precautions, the requested action will take place in your DMS. Please ensure that you are allowed to received DMS from this server',
					);

				const timesUp = new MessageEmbed()
					.setColor("RED")
					.setTitle(panelTitle)
					.setThumbnail(thumbnail)
					.setFooter({
						text: footer,
					})
					.setDescription('I havent recieved a reply from you');

				if (panels.length < 1) {
					interaction.channel
						.send({
							embeds: [noPanel],
							components: [registerRow],
						})
						.then((remsg) => {
							const filter = i => {
								i.deferUpdate();
								return i.user.id === interaction.user.id;
							};
							const Registercollector = remsg.createMessageComponentCollector({
								filter,
								componentType: 'BUTTON',
								time: 30000,
								errors: ['time']
							});

							Registercollector.on('collect', (i) => {
								if (i.customId === 'register') {
									remsg.edit({
										embeds: [reDm],
										components: [new MessageActionRow().addComponents([Support])],
									});
									i.user.send({
										embeds: [reEmbed],
									}).then((m) => {
										const c = m.channel;

										c.send({
											embeds: [reUrl],
										}).then(async function() {
											const msg_filter = (m) => m.author.id === interaction.user.id;
											await c
												.awaitMessages({
													filter: msg_filter,
													max: 1,
													time: 30000,
													errors: ['time']
												})
												.then(async (collected) => {
													panelURL = collected.first().content;
												})
												.then(async function() {
													await c.send({
														embeds: [reApi],
													}).then(async function() {
														c.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000,
																errors: ['time']
															})
															.then(async (collected) => {
																panelAPI = collected.first().content;

															})
															.then(async function() {
																await c.send({
																	embeds: [reName],
																}).then(async function() {
																	c.awaitMessages({
																		filter: msg_filter,
																		max: 1,
																		time: 30000,
																		errors: ['time']
																	}).then(async (collected) => {
																		panelNAME = collected.first().content;
																		if (panelNAME.length > 100) {
																			return c.send(
																				'Please keep the character limit to 25',
																			);
																		}
																		panel
																			.find({
																				ID: id,
																				NAME: panelNAME.trim(),
																			}).catch(() => c.send({
																				embeds: [timesUp],
																			}))
																			.then((exit) => {
																				if (exit.length > 0) {
																					return c.send({
																						embeds: [embedExit],
																					});
																				}
																			})
																			.catch((error) => {
																				console.log(error);
																				c.send({
																					embeds: [errorDB],
																				});
																			});
																		try {
																			const npanel = new panel({
																				ID: id,
																				API: panelAPI.trim(),
																				URL: panelURL.trim(),
																				NAME: panelNAME.trim(),
																			});
																			await npanel.save();
																			c.send({
																				embeds: [reSucess],
																			});
																		} catch (error) {
																			console.log(error);
																			c.send({
																				embeds: [errorDB],
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
				}

				if (panels.length < 1) return;

				const closeMenu = new MessageSelectMenu()
					.setCustomId('close')
					.addOptions([{
						label: 'Close',
						description: 'Select this to close the menu',
						value: 'close',
					}]);
				let panelist;
				const options = [];


				panels.forEach((data) => {
					options.push([{
						label: data.NAME,
						description: 'Select to manage panel',
						value: data.NAME,
					}]);
					if (!panelist) return (panelist = '**' + data.NAME + '**\n');
					panelist = panelist + '**' + data.NAME + '**\n';

				});


				const paneloptions = new MessageSelectMenu()
					.setCustomId('paneloptions')
					.addOptions([{
							label: 'Register new panel',
							description: 'Select this to register new panel',
							value: 'register',
						},
						{
							label: 'Close',
							description: 'Select this to close the menu',
							value: 'close',
						},
					]);

				const panelMenu = new MessageActionRow();
				const paneloptionsrow = new MessageActionRow().addComponents(paneloptions);

				panelMenu.addComponents(
					new MessageSelectMenu()
					.setCustomId('auto_panels')
					.setPlaceholder('Select a server')
					.addOptions(options),
				);

				const panelEmbed = new MessageEmbed()
					.setTitle(panelTitle)
					.setFooter({
						text: footer,
					})
					.setThumbnail(thumbnail)
					.setColor(color)
					.setDescription('Please select a panel to manage\n\n' + panelist);
				interaction.channel
					.send({
						embeds: [panelEmbed],
						components: [panelMenu, paneloptionsrow],
					})
					.then((panelmsg) => {
						const filter = i => {
							i.deferUpdate();
							return i.user.id === interaction.user.id;
						};
						const Panelcollector = panelmsg.createMessageComponentCollector({
							filter,
							max: 1,
							time: 30000,
							errors: ['time']
						});
						Panelcollector.on('collect', async (m) => {
							if (m.values[0] === 'close') {
								panelmsg
									.edit({
										embeds: [closeEmbed],
										components: [],
									})
									.then((msg) => {
										msg.delete({
											timeout: 5000,
										});
									});
							}
							if (m.values[0] === 'register') {
								panelmsg.edit({
									embeds: [reDm],
									components: [new MessageActionRow().addComponents([Support])],
								});
								m.user.send({
									embeds: [reEmbed],
								}).then((m) => {
									const c = m.channel;

									c.send({
										embeds: [reUrl],
									}).then(async function() {
										const msg_filter = (m) => m.author.id === interaction.user.id;
										await c
											.awaitMessages({
												filter: msg_filter,
												max: 1,
												time: 30000,
												errors: ['time']
											})
											.then(async (collected) => {
												panelURL = collected.first().content;
											})
											.then(async function() {
												await c.send({
													embeds: [reApi],
												}).then(async function() {
													c.awaitMessages({
															filter: msg_filter,
															max: 1,
															time: 30000,
															errors: ['time']
														})
														.then(async (collected) => {
															panelAPI = collected.first().content;
														})
														.then(async function() {
															await c.send({
																embeds: [reName],
															}).then(async function() {
																c.awaitMessages({
																	filter: msg_filter,
																	max: 1,
																	time: 30000,
																	errors: ['time']
																}).then(async (collected) => {
																	panelNAME = collected.first().content;
																	if (panelNAME.length > 100) {
																		return c.send(
																			'Please keep the character limit to 25',
																		);
																	}
																	panel
																		.find({
																			ID: id,
																			NAME: panelNAME.trim(),
																		})
																		.then((exit) => {
																			if (exit.length > 0) {
																				return c.send({
																					embeds: [embedExit],
																				});
																			}
																		})
																		.catch(async () => c.send({
																			embeds: [timesUp],
																		}))
																		.catch((error) => {
																			console.log(error);
																			c.send({
																				embeds: [errorDB],
																			});
																		});
																	try {
																		const npanel = new panel({
																			ID: id,
																			API: panelAPI.trim(),
																			URL: panelURL.trim(),
																			NAME: panelNAME.trim(),
																		});
																		await npanel.save();
																		c.send({
																			embeds: [reSucess],
																		});
																	} catch (error) {
																		console.log(error);
																		c.send({
																			embeds: [errorDB],
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
									components: [],
								});
								await wait(1500);
								panel
									.find({
										ID: id,
										NAME: m.values[0],
									})
									.then((fpanel) => {
										const panelManage = new MessageEmbed()
											.setTitle(panelTitle)
											.setFooter({
												text: footer,
											})
											.setThumbnail(thumbnail)
											.setColor(color)
											.setDescription(
												'Hey, what do you want to do with this panel:\n' + m.values[0],
											);

										const pManage = new MessageButton()
											.setLabel('Servers')
											.setStyle('PRIMARY')
											.setCustomId('pManage');

										const pDelete = new MessageButton()
											.setLabel('Delete')
											.setStyle('DANGER')
											.setCustomId('pDelete');

										const pUrl = new MessageButton()
											.setLabel('Panel Link')
											.setStyle('PRIMARY')
											.setCustomId('pUrl');

										const pEdit = new MessageButton()
											.setLabel('Edit')
											.setStyle('PRIMARY')
											.setCustomId('pEdit');

										const pAcc = new MessageButton()
											.setLabel('Account')
											.setStyle('PRIMARY')
											.setCustomId('pAcc');

										const pManageRow = new MessageActionRow().addComponents(
											pManage,
											pEdit,
											pUrl,
											pAcc,
											pDelete,
										);
										const pCloseRow = new MessageActionRow().addComponents(close);

										panelmsg.edit({
											embeds: [panelManage],
											components: [pManageRow, pCloseRow],
										});

										Panelcollector.stop();
										const panelManageCollector = panelmsg.createMessageComponentCollector({
											filter,
											max: 1,
											time: 30000,
											errors: ['time']
										});

										panelManageCollector.on('collect', async (pm) => {
											if (pm.customId === 'close') {
												panelmsg
													.edit({
														embeds: [closeEmbed],
														components: [],
													})
													.then((msg) => {
														msg.delete({
															timeout: 5000,
														});
													});
											}
											if (pm.customId === 'pAcc') {
												await panelmsg.edit({
													embeds: [loading],
													components: [],
												});
												await wait(1500);
												const Client = new node.NodeactylClient(
													fpanel[0].URL,
													fpanel[0].API,
												);

												Client.getAccountDetails().then((acc) => {
													let content;
													let newcontent;

													const currectPass = new MessageEmbed()
														.setFooter({
															text: footer,
														})
														.setColor(color)
														.setDescription(
															'Please send your currect password on this panel',
														);

													const newEmail = new MessageEmbed()
														.setFooter({
															text: footer,
														})
														.setColor(color)
														.setDescription(
															'Please send your new email for this panel',
														);

													const newPassword = new MessageEmbed()
														.setFooter({
															text: footer,
														})
														.setColor(color)
														.setDescription(
															'Please send your new password for this panel',
														);

													const successAcc = new MessageEmbed()
														.setFooter({
															text: footer,
														})
														.setColor(color)
														.setDescription(
															'Sended request to panel, if you didn\'t logged out from panel, that means your currect password is wrong, for future update this will send a error embed if you put wrong currect password',
														);

													const accEmbed = new MessageEmbed()
														.setTitle(accountTitle)
														.setFooter({
															text: footer,
														})
														.setColor(color)
														.setThumbnail(thumbnail)
														.setDescription(
															'So you wanna manage your pterodactyl account?\n```\nUsername: ' +
															acc.username +
															'\nID: ' +
															acc.id +
															'\nAdmin: ' +
															acc.admin +
															'\n```',
														);

													const updateEmail = new MessageButton()
														.setLabel('Update Email')
														.setStyle('PRIMARY')
														.setCustomId('email');

													const updatePass = new MessageButton()
														.setLabel('Update Password')
														.setStyle('PRIMARY')
														.setCustomId('password');

													const viewEmail = new MessageButton()
														.setLabel('View Email')
														.setStyle('PRIMARY')
														.setCustomId('vemail');

													const accRow = new MessageActionRow().addComponents(
														updateEmail,
														updatePass,
														viewEmail,
														close,
													);

													panelmsg.edit({
														embeds: [accEmbed],
														components: [accRow],
													});

													const accountCollector = panelmsg.createMessageComponentCollector(
														filter, {
															max: 1,
															time: 30000,
															errors: ['time']
														},
													);

													accountCollector.on('collect', (ac) => {
														if (ac.customId === 'email') {
															panelmsg.edit({
																embeds: [reDm],
																components: [new MessageActionRow().addComponents([Support])],
															});
															m.user
																.send({
																	embeds: [reEmbed],
																})
																.then((m) => {
																	const c = m.channel;

																	c.send({
																		embeds: [currectPass],
																	}).then(async function() {
																		const msg_filter = (m) => m.author.id === interaction.user.id;
																		await c
																			.awaitMessages({
																				filter: msg_filter,
																				max: 1,
																				time: 30000,
																				errors: ['time']
																			})
																			.then(async (collected) => {
																				content = collected.first().content;
																			})
																			.then(async function() {
																				await c
																					.send({
																						embeds: [newEmail],
																					})
																					.then(async function() {
																						c.awaitMessages({
																							filter: msg_filter,
																							max: 1,
																							time: 30000,
																							errors: ['time']
																						}).then(async (collected) => {
																							newcontent =
																								collected.first().content;

																							Client.updateEmail(
																									newcontent,
																									content,
																								)
																								.then((success) => {
																									return c.send({
																										embeds: [successAcc],
																									});
																								})
																								.catch((error) => {
																									console.log(error);
																									return c.send(
																										'something happen',
																									);
																								});
																						});
																					});
																			});
																	});
																});
														}
														if (ac.customId === 'password') {
															panelmsg.edit({
																embeds: [reDm],
																components: [new MessageActionRow().addComponents([Support])],
															});
															m.user
																.send({
																	embeds: [reEmbed],
																})
																.then((m) => {
																	const c = m.channel;

																	c.send({
																		embeds: [currectPass],
																	}).then(async function() {
																		const msg_filter = (m) => m.author.id === interaction.user.id;
																		await c
																			.awaitMessages({
																				filter: msg_filter,
																				max: 1,
																				time: 30000,
																				errors: ['time']
																			})
																			.then(async (collected) => {
																				content = collected.first().content;
																			})
																			.then(async function() {
																				await c
																					.send({
																						embeds: [newPassword],
																					})
																					.then(async function() {
																						c.awaitMessages({
																							filter: msg_filter,
																							max: 1,
																							time: 30000,
																							errors: ['time']
																						}).then(async (collected) => {
																							newcontent =
																								collected.first().content;

																							Client.updatePassword(
																									newcontent,
																									content,
																								)
																								.then((success) => {
																									console.log('test' + success);
																									return c.send({
																										embeds: [successAcc],
																									});
																								})
																								.catch((error) => {
																									console.log(error);
																									return c.send(
																										'An Error accured',
																									);
																								});
																						});
																					});
																			});
																	});
																});
														}
														if (ac.customId === 'vemail') {
															const emailEmbed = new MessageEmbed()
																.setTitle(accountTitle)
																.setFooter({
																	text: footer,
																})
																.setColor(color)
																.setThumbnail(thumbnail)
																.setDescription(
																	'Your email from this pterodactyl panel is `' +
																	acc.email +
																	'`',
																);

															ac.reply({
																embeds: [emailEmbed],
																ephemeral: true,
															});
															panelmsg.delete();
														}
													});
												});
											}
											if (pm.customId === 'pEdit') {
												const embedEdit = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer,
													})
													.setColor(color)
													.setThumbnail(thumbnail)
													.setDescription(
														'Please select which one you want to edit',
													);

												const updated = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer,
													})
													.setColor(`00ff00`)
													.setThumbnail(thumbnail)
													.setDescription(fpanel[0].NAME + ' updated!');

												const editName = new MessageButton()
													.setLabel('Name')
													.setStyle('PRIMARY')
													.setCustomId('ename');

												const editUrl = new MessageButton()
													.setLabel('Url/Link')
													.setStyle('PRIMARY')
													.setCustomId('eurl');

												const editApi = new MessageButton()
													.setLabel('Apikey')
													.setStyle('PRIMARY')
													.setCustomId('ekey');

												const editRows = new MessageActionRow().addComponents(
													editName,
													editUrl,
													editApi,
												);

												panelmsg.edit({
													embeds: [embedEdit],
													components: [editRows],
												});


												const EditManageCollector =
													panelmsg.createMessageComponentCollector({
														filter,
														max: 1,
														time: 30000,
														errors: ['time']
													});

												EditManageCollector.on('collect', async (ep) => {
													if (ep.customId === 'ename') {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer,
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																'Please send the new name for this panel',
															);

														panelmsg.edit({
															embeds: [editm],
															components: [],
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000,
																errors: ['time']
															})
															.then(async (collected) => {
																const newcontent = collected.first().content.trim();

																panel
																	.find({
																		ID: id,
																		NAME: newcontent,
																	})
																	.then((exit) => {
																		if (exit.length > 0) {
																			return panelmsg.edit(embedExit);
																		}
																		collected.first().delete();
																	})
																	.catch((error) => {
																		console.log(error);
																		panelmsg.edit({
																			embeds: [errorDB],
																		});
																		collected.first().delete();
																	});

																panel
																	.findOneAndUpdate({
																		ID: id,
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
																interaction.channel.send({embeds: [timesUp]});
															});
													}
													if (ep.customId === 'eurl') {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer,
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																'Please send the new url for this panel',
															);

														panelmsg.edit({
															embeds: [editm],
															components: [],
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000,
																errors: ['time']
															})
															.then(async (collected) => {
																const newcontent = collected.first().content.trim();

																panel
																	.findOneAndUpdate({
																		ID: id,
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
																interaction.channel.send({embeds: [timesUp]});
															});
													}
													if (ep.customId === 'eapi') {
														const editm = new MessageEmbed()
															.setTitle(panelTitle)
															.setFooter({
																text: footer,
															})
															.setColor(color)
															.setThumbnail(thumbnail)
															.setDescription(
																'Please send the new api for this panel',
															);

														panelmsg.edit({
															embeds: [editm],
															components: [],
														});
														const msg_filter = (m) => m.author.id === interaction.user.id;
														await interaction.channel
															.awaitMessages({
																filter: msg_filter,
																max: 1,
																time: 30000,
																errors: ['time']
															})
															.then(async (collected) => {
																const newcontent = collected.first().content.trim();

																panel
																	.findOneAndUpdate({
																		ID: id,
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
																interaction.channel.send({embeds: [timesUp]});
															});
													}
												});
											}
											if (pm.customId === 'pUrl') {
												const embedUrl = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer,
													})
													.setColor(color)
													.setThumbnail(thumbnail)
													.setDescription('Your panel url is ' + fpanel[0].URL);

												panelmsg.delete();
												pm.reply({
													embeds: [embedUrl],
													ephemeral: true,
												});
											}
											if (pm.customId === 'pDelete') {
												const pDelEmbed = new MessageEmbed()
													.setTitle(panelTitle)
													.setFooter({
														text: footer,
													})
													.setThumbnail(thumbnail)
													.setColor(color)
													.setDescription(
														'Panel succesfully deleted from our databases',
													);

												panel
													.deleteOne({
														ID: id,
														NAME: m.values[0],
													})
													.then((res) => {
														panelmsg
															.edit({
																embeds: [pDelEmbed],
																components: [],
															})
															.then((msg) => {
																msg.delete({
																	timeout: 5000,
																});
															});
													})
													.catch((error) => {
														panelmsg.edit({
															embeds: [errorDB],
															components: [],
														});
													});
											}
											if (pm.customId === 'pManage') {
												await panelmsg.edit({
													embeds: [loading],
													components: [],
												});
												await wait(1500);
												const Client = new node.NodeactylClient(
													fpanel[0].URL,
													fpanel[0].API,
												);
												Client.getAllServers()
													.then((response) => {
														const serverEmbed = new MessageEmbed();
														serverEmbed.setColor(color);
														serverEmbed.setTitle(serverTitle);
														serverEmbed.setThumbnail(thumbnail);
														serverEmbed.setFooter({
															text: footer,
														});

														if (response.length == 0) {
															serverEmbed.setDescription(
																'No servers were found on this pterodactyl account',
															);
															return panelmsg.edit({
																embeds: [serverEmbed],
															});
														} else {
															const anothertemp = [];
															let servers;
															response.data.map((S) => {
																const name = S.attributes.name;
																if (name.length > 50) name + 'Name Limit';
																const somemenu = new MessageSelectMenu();
																somemenu.setCustomId('somemenuid');
																somemenu.addOptions([{
																	label: name,
																	description: 'Select this menu to manage this server',
																	value: S.attributes.identifier,
																}]);
																anothertemp.push(somemenu.options);


																const srv = S.attributes;

																if (!servers) {
																	return (servers =
																		'**' +
																		srv.name +
																		'** [`' +
																		srv.identifier +
																		'`]\n```\nnode: ' +
																		srv.node +
																		'\nip: ' +
																		srv.relationships.allocations.data[0]
																		.attributes.ip +
																		':' +
																		srv.relationships.allocations.data[0]
																		.attributes.port +
																		'\nSuspended: ' +
																		srv.is_suspended +
																		'\nInstalling: ' +
																		srv.is_installing +
																		'\n```\n');
																}
																servers =
																	servers +
																	'**' +
																	srv.name +
																	'** [`' +
																	srv.identifier +
																	'`]\n```\nnode: ' +
																	srv.node +
																	'\nip: ' +
																	srv.relationships.allocations.data[0].attributes
																	.ip +
																	':' +
																	srv.relationships.allocations.data[0].attributes
																	.port +
																	'\nSuspended: ' +
																	srv.is_suspended +
																	'\nInstalling: ' +
																	srv.is_installing +
																	'\n```\n';
															});
															serverEmbed.setDescription(servers);

															const anothermenus = [];
															anothertemp.map((data) => {
																const dat = data[0];
																// const label = [{
																// 	label: dat.label
																// }];
																// const value = [{
																// 	value: dat.value
																// }];
																anothermenus.push([{
																	label: dat.label,
																	description: 'Select this menu to manage this server',
																	value: dat.value,
																}]);
																// anothermenus.push(value)
																// console.log(anothermenu);
															});

															// const anothermenurow = new MessageActionRow().addComponents(anothermenus)
															// console.log(anothermenus);

															const row = new MessageActionRow();

															row.addComponents(
																new MessageSelectMenu()
																.setCustomId('auto_servers')
																.setPlaceholder('Select a server')
																.addOptions(anothermenus),
															);
															panelmsg.edit({
																embeds: [serverEmbed],
																components: [row],
															});

															const Panelcollector = panelmsg.createMessageComponentCollector({
																filter,
																max: 1,
																time: 30000,
																errors: ['time']
															});
															Panelcollector.on('collect', async (sm) => {
																if (sm.values[0] === 'close') {
																	panelmsg
																		.edit({
																			embeds: [closeEmbed],
																			components: [],
																		})
																		.then((msg) => {
																			msg.delete({
																				timeout: 5000,
																			});
																		});
																} else {
																	await panelmsg.edit({
																		embeds: [loading],
																		components: [],
																	});
																	await wait(1500);

																	try {
																		const server = await Client.getServerDetails(
																			sm.values[0],
																		);
																		const stats = await Client.getServerUsages(
																			sm.values[0],
																		);
																		const account =
																			await Client.getAccountDetails(
																				fpanel[0].URL,
																				fpanel[0].API,
																			);
																		const status = stats.current_state;

																		const currectStatus =
																			'[Status: ' + status + ']';
																		let maxMemory = server.limits.memory;
																		if (maxMemory === 0) maxMemory = 'unlimited';
																		if (maxMemory !== 'unlimited') {
																			maxMemory = maxMemory + ' MB';
																		}
																		let maxDisk = server.limits.disk;
																		if (maxDisk === 0) maxDisk = 'unlimited';
																		if (maxDisk !== 'unlimited') {
																			maxDisk = maxDisk + ' MB';
																		}
																		let maxCPU = server.limits.cpu;
																		if (maxCPU === 0) maxCPU = 'unlimited';
																		if (maxCPU !== 'unlimited') {
																			maxCPU = maxCPU + '%';
																		}

																		const currectMemory = formatBytes(
																			stats.resources.memory_bytes,
																		);
																		const currectDisk = formatBytes(
																			stats.resources.disk_bytes,
																		);
																		const currectCPU = stats.resources.cpu_absolute;

																		const memory =
																			'[Memory: ' +
																			currectMemory +
																			'/' +
																			maxMemory +
																			']';
																		const disk =
																			'[Disk: ' +
																			currectDisk +
																			'/' +
																			maxDisk +
																			']';
																		const cpu =
																			'[CPU: ' + currectCPU + '%/' + maxCPU + ']';

																		let currectDB = server.databases;
																		if (`${currectDB}` === 'undefined') {
																			currectDB = 0;
																		}
																		let currectBK = server.backups;

																		if (`${currectBK}` === 'undefined') {
																			currectBK = 0;
																		}

																		const databases =
																			'[Databases: ' +
																			currectDB +
																			'/' +
																			server.feature_limits.databases +
																			']';
																		const backups =
																			'[Backups: ' +
																			currectBK +
																			'/' +
																			server.feature_limits.backups +
																			']';
																		const allocations =
																			'[Allocations: ' +
																			server.relationships.allocations.data
																			.length +
																			'/' +
																			server.feature_limits.allocations +
																			']';

																		const sftpLink =
																			server.sftp_details.ip +
																			':' +
																			server.sftp_details.port;
																		const sftpUser =
																			account.username + '.' + server.identifier;

																		const sftpEmbed = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setColor(color)
																			.setFooter({
																				text: footer,
																			})
																			.setDescription(
																				'SFTP Details:\n```\nServer Address: ' +
																				sftpLink +
																				'\nUsername: ' +
																				sftpUser +
																				'\n```',
																			);

																		const serverSelected = new MessageEmbed()
																			.setAuthor({
																				name: serverTitle,
																			})
																			.setTitle(
																				'[Controling: ' + server.name + ']',
																			)
																			.setColor(color)
																			.setFooter({
																				text: footer,
																			})
																			.setDescription(
																				'Server Resource:\n```\n' +
																				currectStatus +
																				'\n' +
																				cpu +
																				'\n' +
																				memory +
																				'\n' +
																				disk +
																				'\n```\nServer Feature:\n```\n' +
																				databases +
																				'\n' +
																				backups +
																				'\n' +
																				allocations +
																				'\n```',
																			);

																		const serverStart = new MessageButton();
																		serverStart.setLabel('Start');
																		serverStart.setStyle('PRIMARY');
																		serverStart.setCustomId('start');

																		const serverSFTP = new MessageButton()
																			.setLabel('SFTP')
																			.setStyle('PRIMARY')
																			.setCustomId('sftp');

																		const serverStop = new MessageButton();
																		serverStop.setLabel('Stop');
																		serverStop.setStyle('DANGER');
																		serverStop.setCustomId('stop');

																		const serverKill = new MessageButton();
																		serverKill.setLabel('Kill');
																		serverKill.setStyle('DANGER');
																		serverKill.setCustomId('kill');

																		const serverRestart = new MessageButton();
																		serverRestart.setLabel('Restart');
																		serverRestart.setStyle('PRIMARY');
																		serverRestart.setCustomId('restart');

																		const serverSend = new MessageButton();
																		serverSend.setLabel('Send Command');
																		serverSend.setStyle('PRIMARY');
																		serverSend.setCustomId('send');

																		const serverUser = new MessageButton();
																		serverUser.setLabel('Subusers');
																		serverUser.setStyle('PRIMARY');
																		serverUser.setCustomId('user');
																		// serverUser.setDisabled(true)

																		const serverMnBkp = new MessageButton();
																		serverMnBkp.setLabel('Backups');
																		serverMnBkp.setStyle('PRIMARY');
																		serverMnBkp.setCustomId('backup');
																		// serverMnBkp.setDisabled(true)

																		const serverInstal = new MessageButton();
																		serverInstal.setLabel('Reinstall');
																		serverInstal.setStyle('DANGER');
																		serverInstal.setCustomId('install');

																		const serverRename = new MessageButton()
																			.setLabel('Rename')
																			.setStyle('PRIMARY')
																			.setCustomId('rename');

																		const serverStopped = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Server succesfully stopped',
																			);

																		const serverKilled = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Server succesfully killed',
																			);

																		const serverStarted = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Server succesfully started',
																			);

																		const serverRestarted = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Server succesfully restarted',
																			);

																		const serverReinstalled = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Server succesfully reinstalled',
																			);

																		const serverSended = new MessageEmbed()
																			.setTitle(serverTitle)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color)
																			.setThumbnail(thumbnail)
																			.setDescription(
																				'Command succesfully sended',
																			);

																		const userAdd = new MessageButton()
																			.setLabel('New Subuser')
																			.setStyle('PRIMARY')
																			.setCustomId('newUser');

																		const bkpAdd = new MessageButton()
																			.setLabel('New Backup')
																			.setStyle('PRIMARY')
																			.setCustomId('newBkp');

																		const userRow =
																			new MessageActionRow().addComponents(
																				userAdd,
																				close,
																			);

																		const bkpRow =
																			new MessageActionRow().addComponents(
																				bkpAdd,
																				close,
																			);

																		if (
																			status === 'running' ||
																			status === 'starting'
																		) {
																			serverStart.setDisabled(true);

																			const serverControl =
																				new MessageActionRow().addComponents(
																					serverStart,
																					serverRestart,
																					serverSend,
																					serverStop,
																					serverKill,
																				);

																			const serverMngControl =
																				new MessageActionRow().addComponents(
																					serverSFTP,
																					serverUser,
																					serverMnBkp,
																					serverRename,
																					serverInstal,
																				);

																			const closerow =
																				new MessageActionRow().addComponents(
																					close,
																				);

																			panelmsg.edit({
																				embeds: [serverSelected],
																				components: [
																					serverControl,
																					serverMngControl,
																					closerow,
																				],
																			});

																			const serverControlCollector =
																				panelmsg.createMessageComponentCollector({
																					filter,
																					max: 1,
																					time: 30000,
																					errors: ['time']
																				});

																			serverControlCollector.on(
																				'collect',
																				async (control) => {
																					if (control.customId === 'start') {
																						Client.startServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverStarted],
																							components: [],
																						});
																					}
																					if (control.customId === 'restart') {
																						Client.restartServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverRestarted],
																							components: [],
																						});
																					}
																					if (control.customId === 'stop') {
																						Client.stopServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverStopped],
																							components: [],
																						});
																					}
																					if (control.customId === 'kill') {
																						Client.killServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverKilled],
																							components: [],
																						});
																					}
																					if (control.customId === 'send') {
																						const editm = new MessageEmbed()
																							.setTitle(panelTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setColor(color)
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Please send a message for the command to be sent to the server',
																							);

																						panelmsg.edit({
																							embeds: [editm],
																							components: [],
																						});
																						const msg_filter = (m) => m.author.id === interaction.user.id;
																						await interaction.channel
																							.awaitMessages({
																								filter: msg_filter,
																								max: 1,
																								time: 30000,
																								errors: ['time']
																							})
																							.then(async (collected) => {
																								const newcontent = collected
																									.first()
																									.content.trim();

																								await Client.sendServerCommand(
																									sm.values[0],
																									newcontent,
																								);
																								panelmsg.edit({
																									embeds: [serverSended],
																									components: [],
																								});
																								collected.first().delete();
																							})
																							.catch((error) => {
																								interaction.channel.send({embeds: [timesUp]});
																							});
																					}
																					if (control.customId === 'install') {
																						Client.reInstallServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverReinstalled],
																							components: [],
																						});
																					}
																					if (control.customId === 'sftp') {
																						panelmsg.delete();
																						control.reply({
																							embeds: [sftpEmbed],
																							ephemeral: true,
																						});
																					}
																					if (control.customId === 'user') {
																						Client.getSubUsers(sm.values[0]).then(
																							(users) => {
																								console.log(users);
																								let embedDesc;
																								const usrEmbed =
																									new MessageEmbed()
																									.setColor(color)
																									.setTitle(serverTitle)
																									.setFooter({
																										text: footer,
																									})
																									.setThumbnail(thumbnail);

																								if (users.length === 0) {
																									usrEmbed.setDescription(
																										'No sub-users found!',
																									);
																									return panelmsg.edit({
																										embeds: [usrEmbed],
																										components: [userRow],
																									});
																								}

																								users.forEach((usr) => {
																									const user = usr.attributes;
																									if (!embedDesc) {
																										return (embedDesc =
																											'**' +
																											user.username +
																											'**\n```\nUUID: ' +
																											user.uuid +
																											'\nCreated At: ' +
																											user.created_at +
																											'\n```\n');
																									}
																									embedDesc =
																										embedDesc +
																										'**' +
																										user.username +
																										'**\n```\nUUID: ' +
																										user.uuid +
																										'\nCreated At: ' +
																										user.created_at +
																										'\n```\n';
																								});
																								usrEmbed.setDescription(
																									embedDesc,
																								);
																								panelmsg.edit({
																									embeds: [usrEmbed],
																									components: [userRow],
																								});
																								const serverBkpUsrCollector =
																									panelmsg.createMessageComponentCollector({
																										filter,
																										max: 1,
																										time: 30000,
																										errors: ['time']
																									});

																								serverBkpUsrCollector.on(
																									'collect',
																									async (bs) => {
																										if (bs.customId === 'close') {
																											panelmsg
																												.edit({
																													embeds: [closeEmbed],
																													components: [],
																												})
																												.then((msg) => {
																													msg.delete({
																														timeout: 5000,
																													});
																												});
																										}
																										if (bs.customId === 'newUser') {
																											const embedUser =
																												new MessageEmbed()
																												.setColor(color)
																												.setTitle(serverTitle)
																												.setFooter({
																													text: footer,
																												})
																												.setThumbnail(thumbnail)
																												.setDescription(
																													'Please send the email of the user',
																												);

																											panelmsg.edit({
																												embeds: [embedUser],
																												components: [null],
																											});
																											const embedAdded =
																												new MessageEmbed()
																												.setColor(color)
																												.setTitle(serverTitle)
																												.setFooter({
																													text: footer,
																												})
																												.setThumbnail(thumbnail)
																												.setDescription(
																													'User added!, for security reason user added by this bot will only has start, restart, and stop permission',
																												);
																											const msg_filter = (m) => m.author.id === interaction.user.id;
																											await interaction.channel
																												.awaitMessages({
																													filter: msg_filter,
																													max: 1,
																													time: 30000,
																													errors: ['time']
																												})
																												.then(
																													async (collected) => {
																														const newcontent =
																															collected
																															.first()
																															.content.trim();

																														const evalid =
																															/[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/;
																														const check =
																															evalid.test(
																																newcontent,
																															);

																														if (check === false) {
																															return panelmsg.edit({
																																content: 'invalid email',
																																embeds: [null],
																																components: [],
																															});
																														}

																														Client.createSubUser(
																															sm.values[0],
																															newcontent,
																															[
																																'control.start',
																																'control.restart',
																																'control.stop',
																															],
																														);
																														panelmsg.edit({
																															embeds: [embedAdded],
																															components: [],
																														});
																														collected
																															.first()
																															.delete();
																													},
																												)
																												.catch((error) => {
																													console.log(error);

																													interaction.channel.send({embeds: [timesUp]});

																												});
																										}
																									},
																								);
																							},
																						);
																					}
																					if (control.customId === 'backup') {
																						Client.listServerBackups(
																							sm.values[0],
																						).then((bkps) => {
																							console.log(bkps);
																							let embedDesc;
																							const usrEmbed = new MessageEmbed()
																								.setColor(color)
																								.setTitle(serverTitle)
																								.setFooter({
																									text: footer,
																								})
																								.setThumbnail(thumbnail);

																							if (bkps.length === 0) {
																								usrEmbed.setDescription(
																									'There is no backup on this server',
																								);
																								return panelmsg.edit({
																									embeds: [usrEmbed],
																									components: [bkpRow],
																								});
																							}

																							bkps.forEach((usr) => {
																								const user = usr.attributes;
																								if (!embedDesc) {
																									return (embedDesc =
																										'**' +
																										user.name +
																										'**\n```\nUUID: ' +
																										user.uuid +
																										'\nSuccess: ' +
																										user.is_successful +
																										'\nSize: ' +
																										formatBytes(user.bytes) +
																										'\nCreated At: ' +
																										user.created_at +
																										'\n```\n');
																								}
																								embedDesc =
																									embedDesc +
																									'**' +
																									user.name +
																									'**\n```\nUUID: ' +
																									user.uuid +
																									'\nSuccess: ' +
																									user.is_successful +
																									'\nSize: ' +
																									formatBytes(user.bytes) +
																									'\nCreated At: ' +
																									user.created_at +
																									'\n```\n';
																							});
																							usrEmbed.setDescription(embedDesc);
																							panelmsg.edit({
																								embeds: [usrEmbed],
																								components: [bkpRow],
																							});
																							const serverBkpUsrCollector =
																								panelmsg.createMessageComponentCollector({
																									filter,
																									max: 1,
																									time: 30000,
																									errors: ['time']
																								});

																							serverBkpUsrCollector.on(
																								'collect',
																								async (bs) => {
																									if (bs.customId === 'close') {
																										panelmsg
																											.edit({
																												embeds: [closeEmbed],
																												components: [],
																											})
																											.then((msg) => {
																												msg.delete({
																													timeout: 5000,
																												});
																											});
																									}
																									if (bs.customId === 'newBkp') {
																										const sucBkp =
																											new MessageEmbed()
																											.setTitle(serverTitle)
																											.setFooter({
																												text: footer,
																											})
																											.setThumbnail(thumbnail)
																											.setColor(color);

																										Client.createServerBackup(
																												sm.values[0],
																											)
																											.then((done) => {
																												sucBkp.setDescription(
																													'Successfuly created backup for your server!',
																												);
																												panelmsg.edit({
																													embeds: [sucBkp],
																													components: [null],
																												});
																											})
																											.catch((error) => {
																												if (error === 924) {
																													sucBkp.setDescription(
																														'You need to wait 10 minutes to create another backup',
																													);
																													panelmsg.edit({
																														embeds: [sucBkp],
																														components: [null],
																													});
																												}
																											});
																									}
																								},
																							);
																						});
																					}
																					if (control.customId === 'rename') {
																						const embedUser = new MessageEmbed()
																							.setColor(color)
																							.setTitle(serverTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Please send a new name for this server',
																							);

																						panelmsg.edit({
																							embeds: [embedUser],
																							components: [null],
																						});
																						const embedAdded = new MessageEmbed()
																							.setColor(color)
																							.setTitle(serverTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Server has been renamed',
																							);
																						const msg_filter = (m) => m.author.id === interaction.user.id;
																						await interaction.channel
																							.awaitMessages({
																								filter: msg_filter,
																								max: 1,
																								time: 30000,
																								errors: ['time']
																							})
																							.then(async (collected) => {
																								const newcontent = collected
																									.first()
																									.content.trim();

																								Client.renameServer(
																									sm.values[0],
																									newcontent,
																								);
																								panelmsg.edit({
																									embeds: [embedAdded],
																									components: [],
																								});
																								collected.first().delete();
																							})
																							.catch((error) => {
																								console.log(error);
																								interaction.channel.send({embeds: [timesUp]});
																							});
																					}
																					if (control.customId === 'close') {
																						panelmsg.edit({
																							embeds: [closeEmbed],
																							components: [],
																						});
																					}
																				},
																			);
																		} else if (
																			status === 'stopping' ||
																			status === 'offline'
																		) {
																			serverStop.setDisabled(true);
																			serverRestart.setDisabled(true);
																			serverKill.setDisabled(true);
																			serverSend.setDisabled(true);

																			const serverControl =
																				new MessageActionRow().addComponents(
																					serverStart,
																					serverRestart,
																					serverSend,
																					serverStop,
																					serverKill,
																				);

																			const serverMngControl =
																				new MessageActionRow().addComponents(
																					serverSFTP,
																					serverUser,
																					serverMnBkp,
																					serverRename,
																					serverInstal,
																				);

																			const closerow =
																				new MessageActionRow().addComponents(
																					close,
																				);

																			panelmsg.edit({
																				embeds: [serverSelected],
																				components: [
																					serverControl,
																					serverMngControl,
																					closerow,
																				],
																			});

																			const serverControlCollector =
																				panelmsg.createMessageComponentCollector({
																					filter,
																					max: 1,
																					time: 30000,
																					errors: ['time']
																				});

																			serverControlCollector.on(
																				'collect',
																				async (control) => {
																					if (control.customId === 'start') {
																						Client.startServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverStarted],
																							components: [],
																						});
																					}
																					if (control.customId === 'restart') {
																						Client.restartServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverRestarted],
																							components: [],
																						});
																					}
																					if (control.customId === 'stop') {
																						Client.stopServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverStopped],
																							components: [],
																						});
																					}
																					if (control.customId === 'kill') {
																						Client.killServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverKilled],
																							components: [],
																						});
																					}
																					if (control.customId === 'send') {
																						const editm = new MessageEmbed()
																							.setTitle(panelTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setColor(color)
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Please send a message for the command to be sent to the server',
																							);

																						panelmsg.edit({
																							embeds: [editm],
																							components: [],
																						});
																						const msg_filter = (m) => m.author.id === interaction.user.id;
																						await interaction.channel
																							.awaitMessages({
																								filter: msg_filter,
																								max: 1,
																								time: 30000,
																								errors: ['time']
																							})
																							.then(async (collected) => {
																								const newcontent = collected
																									.first()
																									.content.trim();

																								await Client.sendServerCommand(
																									sm.values[0],
																									newcontent,
																								);
																								panelmsg.edit({
																									embeds: [serverSended],
																									components: [],
																								});
																								collected.first().delete();
																							})
																							.catch((error) => {
																								interaction.channel.send({embeds: [timesUp]});
																							});
																					}
																					if (control.customId === 'install') {
																						Client.reInstallServer(sm.values[0]);
																						panelmsg.edit({
																							embeds: [serverReinstalled],
																							components: [],
																						});
																					}
																					if (control.customId === 'sftp') {
																						panelmsg.delete();
																						control.reply({
																							embeds: [sftpEmbed],
																							ephemeral: true,
																						});
																					}
																					if (control.customId === 'user') {
																						Client.getSubUsers(sm.values[0]).then(
																							(users) => {
																								console.log(users);
																								let embedDesc;
																								const usrEmbed =
																									new MessageEmbed()
																									.setColor(color)
																									.setTitle(serverTitle)
																									.setFooter({
																										text: footer,
																									})
																									.setThumbnail(thumbnail);

																								if (users.length === 0) {
																									usrEmbed.setDescription(
																										'No sub-users found!',
																									);
																									return panelmsg.edit({
																										embeds: [usrEmbed],
																										components: [userRow],
																									});
																								}

																								users.forEach((usr) => {
																									const user = usr.attributes;
																									if (!embedDesc) {
																										return (embedDesc =
																											'**' +
																											user.username +
																											'**\n```\nUUID: ' +
																											user.uuid +
																											'\nCreated At: ' +
																											user.created_at +
																											'\n```\n');
																									}
																									embedDesc =
																										embedDesc +
																										'**' +
																										user.username +
																										'**\n```\nUUID: ' +
																										user.uuid +
																										'\nCreated At: ' +
																										user.created_at +
																										'\n```\n';
																								});
																								usrEmbed.setDescription(
																									embedDesc,
																								);
																								panelmsg.edit({
																									embeds: [usrEmbed],
																									components: [userRow],
																								});
																								const serverBkpUsrCollector =
																									panelmsg.createMessageComponentCollector({
																										filter,
																										max: 1,
																										time: 30000,
																										errors: ['time']
																									});

																								serverBkpUsrCollector.on(
																									'collect',
																									async (bs) => {
																										if (bs.customId === 'close') {
																											panelmsg
																												.edit({
																													embeds: [closeEmbed],
																													components: [],
																												})
																												.then((msg) => {
																													msg.delete({
																														timeout: 5000,
																													});
																												});
																										}
																										if (bs.customId === 'newUser') {
																											const embedUser =
																												new MessageEmbed()
																												.setColor(color)
																												.setTitle(serverTitle)
																												.setFooter({
																													text: footer,
																												})
																												.setThumbnail(thumbnail)
																												.setDescription(
																													'Please send the email of the user',
																												);

																											panelmsg.edit({
																												embeds: [embedUser],
																												components: [null],
																											});
																											const embedAdded =
																												new MessageEmbed()
																												.setColor(color)
																												.setTitle(serverTitle)
																												.setFooter({
																													text: footer,
																												})
																												.setThumbnail(thumbnail)
																												.setDescription(
																													'User added!, for security reason user added by this bot will only has start, restart, and stop permission',
																												);
																											const msg_filter = (m) => m.author.id === interaction.user.id;
																											await interaction.channel
																												.awaitMessages({
																													filter: msg_filter,
																													max: 1,
																													time: 30000,
																													errors: ['time']
																												})
																												.then(
																													async (collected) => {
																														const newcontent =
																															collected
																															.first()
																															.content.trim();

																														const evalid =
																															/[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/;
																														const check =
																															evalid.test(
																																newcontent,
																															);

																														if (check === false) {
																															return panelmsg.edit({
																																content: 'invalid email',
																																embeds: [null],
																																components: [],
																															});
																														}

																														Client.createSubUser(
																															sm.values[0],
																															newcontent,
																															[
																																'control.start',
																																'control.restart',
																																'control.stop',
																															],
																														);
																														panelmsg.edit({
																															embeds: [embedAdded],
																															components: [],
																														});
																														collected
																															.first()
																															.delete();
																													},
																												)
																												.catch((error) => {
																													console.log(error);
																													interaction.channel.send({embeds: [timesUp]});
																												});
																										}
																									},
																								);
																							},
																						);
																					}
																					if (control.customId === 'backup') {
																						Client.listServerBackups(
																							sm.values[0],
																						).then((bkps) => {
																							console.log(bkps);
																							let embedDesc;
																							const usrEmbed = new MessageEmbed()
																								.setColor(color)
																								.setTitle(serverTitle)
																								.setFooter({
																									text: footer,
																								})
																								.setThumbnail(thumbnail);

																							if (bkps.length === 0) {
																								usrEmbed.setDescription(
																									'There is no backup on this server',
																								);
																								return panelmsg.edit({
																									embeds: [usrEmbed],
																									components: [bkpRow],
																								});
																							}

																							bkps.forEach((usr) => {
																								const user = usr.attributes;
																								if (!embedDesc) {
																									return (embedDesc =
																										'**' +
																										user.name +
																										'**\n```\nUUID: ' +
																										user.uuid +
																										'\nSuccess: ' +
																										user.is_successful +
																										'\nSize: ' +
																										formatBytes(user.bytes) +
																										'\nCreated At: ' +
																										user.created_at +
																										'\n```\n');
																								}
																								embedDesc =
																									embedDesc +
																									'**' +
																									user.name +
																									'**\n```\nUUID: ' +
																									user.uuid +
																									'\nSuccess: ' +
																									user.is_successful +
																									'\nSize: ' +
																									formatBytes(user.bytes) +
																									'\nCreated At: ' +
																									user.created_at +
																									'\n```\n';
																							});
																							usrEmbed.setDescription(embedDesc);
																							panelmsg.edit({
																								embeds: [usrEmbed],
																								components: [bkpRow],
																							});
																							const serverBkpUsrCollector =
																								panelmsg.createMessageComponentCollector({
																									filter,
																									max: 1,
																									time: 30000,
																									errors: ['time']
																								});

																							serverBkpUsrCollector.on(
																								'collect',
																								async (bs) => {
																									if (bs.customId === 'close') {
																										panelmsg
																											.edit({
																												embeds: [closeEmbed],
																												components: [],
																											})
																											.then((msg) => {
																												msg.delete({
																													timeout: 5000,
																												});
																											});
																									}
																									if (bs.customId === 'newBkp') {
																										const sucBkp =
																											new MessageEmbed()
																											.setTitle(serverTitle)
																											.setFooter({
																												text: footer,
																											})
																											.setThumbnail(thumbnail)
																											.setColor(color);

																										Client.createServerBackup(
																												sm.values[0],
																											)
																											.then((done) => {
																												sucBkp.setDescription(
																													'Successfuly created backup for your server!',
																												);
																												panelmsg.edit({
																													embeds: [sucBkp],
																													components: [null],
																												});
																											})
																											.catch((error) => {
																												if (error === 924) {
																													sucBkp.setDescription(
																														'You need to wait 10 minutes to create another backup',
																													);
																													panelmsg.edit({
																														embeds: [sucBkp],
																														components: [null],
																													});
																												}
																											});
																									}
																								},
																							);
																						});
																					}
																					if (control.customId === 'rename') {
																						const embedUser = new MessageEmbed()
																							.setColor(color)
																							.setTitle(serverTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Please send a new name for this server',
																							);

																						panelmsg.edit({
																							embeds: [embedUser],
																							components: [null],
																						});
																						const embedAdded = new MessageEmbed()
																							.setColor(color)
																							.setTitle(serverTitle)
																							.setFooter({
																								text: footer,
																							})
																							.setThumbnail(thumbnail)
																							.setDescription(
																								'Server new name has been seted',
																							);
																						const msg_filter = (m) => m.author.id === interaction.user.id;
																						await interaction.channel
																							.awaitMessages({
																								filter: msg_filter,
																								max: 1,
																								time: 30000,
																								errors: ['time']
																							})
																							.then(async (collected) => {
																								const newcontent = collected
																									.first()
																									.content.trim();

																								Client.renameServer(
																									sm.values[0],
																									newcontent,
																								);
																								panelmsg.edit({
																									embeds: [embedAdded],
																									components: [],
																								});
																								collected.first().delete();
																							})
																							.catch((error) => {
																								console.log(error);
																								interaction.channel.send({embeds: [timesUp]});
																							});
																					}
																					if (control.customId === 'close') {
																						panelmsg.edit({
																							embeds: [closeEmbed],
																							components: [],
																						});
																					}
																				},
																			);
																		}
																	} catch (e) {
																		const ErrCon = new MessageEmbed()
																			.setTitle(
																				'PteroControl ¦ Server Server Management',
																			)
																			.setThumbnail(client.user.avatarURL())
																			.setColor(color)
																			.setDescription(
																				'An error just occurred please report this to our support server!',
																			);

																		const err305 = new MessageEmbed()
																			.setTitle('PteroControl | Error 305')
																			.setColor(color)
																			.setDescription(
																				'An error occured while fetching your servers. This can occur if your host has cloudflare enabled on their panel which will prevent the bot from connecting to the endpoints',
																			)
																			.setImage('https://http.cat/305');
																		if (e === 305) {
																			return interaction.channel.send({
																				embeds: [err305],
																			});
																		}

																		const err304 = new MessageEmbed()
																			.setTitle('PteroControl | Error 304')
																			.setColor(color)
																			.setDescription(
																				'An error occured while fetching your servers. This can occur if you put wrong apikeys, make sure the apikeys are client not admin',
																			)
																			.setImage('https://http.cat/304');
																		if (e === 304) {
																			return interaction.channel.send({
																				embeds: [err304],
																			});
																		}

																		const err344 = new MessageEmbed()
																			.setTitle('PteroControl | Error 344')
																			.setColor(color)
																			.setDescription(
																				'An error occured while fetching your servers. This can occur if the panel is down',
																			)
																			.setImage('https://http.cat/344');
																		if (e === 344) {
																			return interaction.channel.send({
																				embeds: [err344],
																			});
																		}

																		const err8 = new MessageEmbed()
																			.setTitle(
																				'PteroControl | Error 8',
																				client.user.avatarURL(),
																			)
																			.setColor(color)
																			.setDescription(
																				'An error occured while fetching your servers. This can occur if your put invalid website link',
																			);
																		if (e === 8) {
																			return interaction.channel.send({
																				embeds: [err8],
																			});
																		}

																		const errNaN = new MessageEmbed()
																			.setTitle(
																				'PteroControl | Not a Pterodactyl Panel',
																				client.user.avatarURL(),
																			)
																			.setColor(color)
																			.setDescription(
																				'An error occured while fetching your servers. This can occur if you put website link that doesn\'t have pterodactyl panel',
																			);
																		if (`${e}` === 'NaN') {
																			return interaction.channel.send({
																				embeds: [errNaN],
																			});
																		}

																		const errorCODE = new MessageEmbed()
																			.setTitle('PteroControl | Error!')
																			.setDescription('Error Code ' + e)
																			.setFooter({
																				text: footer,
																			})
																			.setColor(color);

																		// .setImage(`https://http.cat/${e}`);
																		console.log(e);

																		panelmsg.edit({
																			embeds: [errorCODE],
																			components: [new MessageActionRow().addComponents([Support])],
																		});
																	}
																}
															});
														}
													})
													.catch((e) => {
														const ErrCon = new MessageEmbed()
															.setTitle('PteroControl ¦ Server Server Management')
															.setThumbnail(client.user.avatarURL())
															.setColor(color)
															.setDescription(
																'An error just occurred please report this to our support server!',
															);

														const err305 = new MessageEmbed()
															.setTitle('PteroControl | Error 305')
															.setColor(color)
															.setDescription(
																'An error occured while fetching your servers. This can occur if your host has cloudflare enabled on their panel which will prevent the bot from connecting to the endpoints',
															)
															.setImage('https://http.cat/305');
														if (e === 305) {
															return interaction.channel.send({
																embeds: [err305],
															});
														}

														const err304 = new MessageEmbed()
															.setTitle('PteroControl | Error 304')
															.setColor(color)
															.setDescription(
																'An error occured while fetching your servers. This can occur if you put wrong apikeys, make sure the apikeys are client not admin',
															)
															.setImage('https://http.cat/304');
														if (e === 304) {
															return interaction.channel.send({
																embeds: [err304],
															});
														}

														const err344 = new MessageEmbed()
															.setTitle('PteroControl | Error 344')
															.setColor(color)
															.setDescription(
																'An error occured while fetching your servers. This can occur if the panel is down',
															)
															.setImage('https://http.cat/344');
														if (e === 344) {
															return interaction.channel.send({
																embeds: [err344],
															});
														}

														const err8 = new MessageEmbed()
															.setTitle(
																'PteroControl | Error 8',
																client.user.avatarURL(),
															)
															.setColor(color)
															.setDescription(
																'An error occured while fetching your servers. This can occur if your put invalid website link',
															);
														if (e === 8) {
															return interaction.channel.send({
																embeds: [err8],
															});
														}

														const errNaN = new MessageEmbed()
															.setTitle(
																'PteroControl | Not a Pterodactyl Panel',
																client.user.avatarURL(),
															)
															.setColor(color)
															.setDescription(
																'An error occured while fetching your servers. This can occur if you put website link that doesn\'t have pterodactyl panel',
															);
														if (`${e}` === 'NaN') {
															return interaction.channel.send({
																embeds: [errNaN],
															});
														}

														const errorCODE = new MessageEmbed()
															.setTitle('PteroControl | Error!')
															.setDescription('Error Code ' + e)
															// .setImage(`https://http.cat/${e}`)
															.setFooter({
																text: footer,
															})
															.setColor(color);

														console.log(e);

														panelmsg.edit({
															embeds: [errorCODE],
															components: [new MessageActionRow().addComponents([Support])],
														});
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
				interaction.channel.send({
					embeds: [errorDB],
				});
			});
	},
};

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 MB';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}