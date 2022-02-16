const {
	Client,
	Message,
	MessageEmbed,
	Collection,
	Intents,
	MessageAttachment
} = require('discord.js');
const colors = require("colors");
const libsodium = require("libsodium-wrappers");
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const {
	inspect,
} = require('util');

require('dotenv').config();
const allIntents = new Intents(32767);
const client = new Client({
	messageCacheLifetime: 60,
	fetchAllMembers: false,
	messageCacheMaxSize: 10,
	restTimeOffset: 0,
	restWsBridgetimeout: 100,
	shards: 'auto',
	allowedMentions: {
		parse: ['roles', 'users', 'everyone'],
		repliedUser: true,
	},
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', "DIRECT_MESSAGES"],
	intents: allIntents,
});
module.exports = client;

const config = require('./settings/config.json');
const prefix = config.prefix;

// Global Variables
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync(path.resolve(__dirname, 'commands'));


// Initializing the project
// Loading files, with the client variable like Command Handler, Event Handler, ...
['extraEvents', 'antiCrash', 'command_handler', 'event_handler', 'slash_handler'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

client.on('ready', async () => {
	const messageChannel = await client.channels.cache.get('config.logChannel');
	process.on('beforeExit', async (code) => { // If You Want You Can Use

		if (typeof code !== 'string') {
			code = inspect(code);
		}
		if (code instanceof Promise) {
			code = await code;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true,
				}),
			})
			.setTitle('[beforeExit]')
			.setDescription(` \`\`\` ${code} \`\`\` `)
			.setTimestamp();


		if (code.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(code), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('exit', async (error) => { // If You Want You Can Use

		if (typeof error !== 'string') {
			error = inspect(error);
		}
		if (error instanceof Promise) {
			error = await error;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[Exit]')
			.setDescription(` \`\`\` ${error} \`\`\` `)
			.setTimestamp();


		if (error.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(error), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('multipleResolves', async (type, promise, reason) => { // Needed

		if (typeof reason !== 'string') {
			reason = inspect(reason);
		}
		if (reason instanceof Promise) {
			reason = await reason;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[multipleResolves]')
			.setDescription(` \`\`\` ${type, promise, reason} \`\`\` `)
			.setTimestamp();


		if (reason.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(type, promise, reason), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('unhandledRejection', async (reason, promise) => { // Needed

		if (typeof reason !== 'string') {
			reason = inspect(reason);
		}
		if (reason instanceof Promise) {
			reason = await reason;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[unhandledRejection]')
			.setDescription(` \`\`\` ${reason} \`\`\` `)
			.setTimestamp();


		if (reason.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(reason), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('rejectionHandled', async (promise) => { // If You Want You Can Use

		if (typeof promise !== 'string') {
			promise = inspect(promise);
		}
		if (promise instanceof Promise) {
			promise = await promise;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[rejectionHandled]')
			.setDescription(` \`\`\` ${promise} \`\`\` `)
			.setTimestamp();


		if (promise.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(promise), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('uncaughtException', async (err, origin) => { // Needed

		if (typeof err !== 'string') {
			err = inspect(err);
		}
		if (err instanceof Promise) {
			err = await err;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[uncaughtException]')
			.setDescription(` \`\`\` ${err} \`\`\` `)
			.setTimestamp();


		if (err.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(err), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('uncaughtExceptionMonitor', async (err, origin) => { // Needed

		if (typeof err !== 'string') {
			err = inspect(err);
		}
		if (err instanceof Promise) {
			err = await err;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[uncaughtExceptionMonitor]')
			.setDescription(` \`\`\` ${err} \`\`\` `)
			.setTimestamp();


		if (err.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(err), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
	process.on('warning', async (warning) => { // If You Want You Can Use

		if (typeof warning !== 'string') {
			warning = inspect(warning);
		}
		if (warning instanceof Promise) {
			warning = await warning;
		}
		const Embed = new MessageEmbed()
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL({
					dynamic: true
				})
			})
			.setTitle('[warning]')
			.setDescription(` \`\`\` ${warning} \`\`\` `)
			.setTimestamp();


		if (warning.length < 2000) {
			await messageChannel.send({
				embeds: [Embed],

			});
		} else {
			const output = new MessageAttachment(Buffer.from(warning), 'output.js');
			await messageChannel.send({
				files: [output],

			});
		}

	});
});

client.login(config.TOKEN);