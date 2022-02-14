const {
	MessageEmbed,
	MessageAttachment,
	Client,
} = require('discord.js');
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	client.logger('Starting AntiCrash'.bold.yellow);
	process.on('beforeExit', (code) => { // If You Want You Can Use
		console.log('=== [antiCrash] :: [beforeExit] :: [start] ==='.yellow.dim);
		console.log(code);
		console.log('=== [antiCrash] :: [beforeExit] :: [end] ==='.yellow.dim);
	});
	// process.on('exit', (error) => { // If You Want You Can Use
	// 	console.log('=== [antiCrash] :: [exit] :: [start] ==='.yellow.dim);
	// 	console.log(error);
	// 	console.log('=== [antiCrash] :: [exit] :: [end] ==='.yellow.dim);
	// });
	process.on('multipleResolves', (type, promise, reason) => { // Needed
		console.log('=== [antiCrash] :: [multipleResolves] :: [start] ==='.yellow.dim);
		console.log(type, promise, reason);
		console.log('=== [antiCrash] :: [multipleResolves] :: [end] ==='.yellow.dim);
	});
	process.on('unhandledRejection', async (reason, promise) => { // Needed
		console.log('=== [antiCrash] :: [unhandledRejection] :: [start] ==='.yellow.dim);
		console.log(reason);
		console.log('=== [antiCrash] :: [unhandledRejection] :: [end] ==='.yellow.dim);
	});
	process.on('rejectionHandled', (promise) => { // If You Want You Can Use
		console.log('=== [antiCrash] :: [rejectionHandled] :: [start] ==='.yellow.dim);
		console.log(promise);
		console.log('=== [antiCrash] :: [rejectionHandled] :: [end] ==='.yellow.dim);
	});
	process.on('uncaughtException', (err, origin) => { // Needed
		console.log('=== [antiCrash] :: [uncaughtException] :: [start] ==='.yellow.dim);
		console.log(err);
		console.log('=== [antiCrash] :: [uncaughtException] :: [end] ==='.yellow.dim);
	});
	process.on('uncaughtExceptionMonitor', (err, origin) => { // Needed
		console.log('=== [antiCrash] :: [uncaughtExceptionMonitor] :: [start] ==='.yellow.dim);
		console.log(err);
		console.log('=== [antiCrash] :: [uncaughtExceptionMonitor] :: [end] ==='.yellow.dim);
	});
	process.on('warning', (warning) => { // If You Want You Can Use
		console.log('=== [antiCrash] :: [warning] :: [start] ==='.yellow.dim);
		console.log(warning);
		console.log('=== [antiCrash] :: [warning] :: [end] ==='.yellow.dim);
	});
	process.on('SIGINT', () => { // If You Want You Can Use
		console.log('=== [antiCrash] :: [SIGINT] ==='.yellow.dim);
	});
	client.logger('AntiCrash Started'.brightGreen);
};