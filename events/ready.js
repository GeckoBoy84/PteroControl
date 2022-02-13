const {
	MessageEmbed,
	Client,
} = require('discord.js');
const Discord = require('discord.js');
const moment = require('moment');
const config = require('../settings/config.json');
const panel = require("../models/panel.js");
const mongoose = require('mongoose');


const client = require('../bot')

client.on('ready', () => {
	client.logger(
		'Bot User: '.brightBlue + `${client.user.tag}`.blue + '\n' +
		'Guild(s): '.brightBlue + `${client.guilds.cache.size} Servers`.blue + '\n' +
		'Watching: '.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`.blue + '\n' +
		'Commands: '.brightBlue + `${client.commands.size}`.blue + '\n' +
		'Slash Commands: '.brightBlue + `${client.slashCommands.size}`.blue + '\n' +
		'Discord.js: '.brightBlue + `v${Discord.version}`.blue + '\n' +
		'Node.js: '.brightBlue + `${process.version}`.blue + '\n' +
		'Plattform: '.brightBlue + `${process.platform} ${process.arch}`.blue + '\n' +
		'Memory: '.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue,
	);
    
    const loggingchannel = client.channels.cache.get('939844393425317952');
	if (loggingchannel) {


		const embedlog = new MessageEmbed()
			.setColor('GREY')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription('Restarted **' + client.user.tag + '**. Up and ready to serve on ' + client.guilds.cache.size + ' servers, ' + client.channels.cache.size + ' channels, and ' + client.users.cache.size + ' unique users, with over ' + client.commands.size + ' commands and ' + client.slashCommands.size + ' slash commands readily available for use!')
			.setFooter({
				text: `Last Boot: ${moment().format('ddd DD-MM-YYYY HH:mm:ss')}`,
			});
		loggingchannel.send({
			embeds: [embedlog],
		});
	}

	setInterval(() => {

		panel
			.find({})
			.then((total) => {
				let totals = total.length;
				client.user.setPresence({
					activities: [{
						name: `/help | Managing ${totals} Panel's in ${client.guilds.cache.size} server's`
					}],
					status: "WATCHING"
				});

			})
			.catch((error) => {
				console.log(error);
			});

	}, 60000);

	if (!config.Database) return;
	mongoose.connect(config.Database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() => {
		client.logger(
			'Database: '.brightBlue + 'connection established'.blue,
		);
	}).catch((err) => {
		console.log(err);
	});
});