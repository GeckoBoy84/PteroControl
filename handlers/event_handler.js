const {
	Client
} = require('discord.js');
const fs = require('fs');

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
	try {
		let amount = 0;
		fs.readdirSync('./events/').forEach((file) => {
			const events = fs.readdirSync('./events/').filter((file) =>
				file.endsWith('.js'),
			);
			for (const file of events) {
				const pull = require(`../events/${file}`);
				if (pull.name) {
					client.events.set(pull.name, pull);
				}
			}
			amount++;
			// console.log((`${file}  Events Loaded Successfullly`));
			client.logger(`${amount} Events Loaded`.brightGreen);
		});
	} catch (e) {
		console.log(e.message);
	}
};