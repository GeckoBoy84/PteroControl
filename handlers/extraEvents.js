const {
	MessageEmbed,
} = require('discord.js');
const moment = require('moment');
module.exports = async (client) => {

	// Console Logger
	client.logger = (data) => {
		// if (!settings[`debug-logs`]) return;
		const logstring = `${String('PteroControl').brightGreen}${' | '.grey}${`${moment().format('ddd DD-MM-YYYY HH:mm:ss.SSSS')}`.cyan}${' 〢 '.magenta}`;
		if (typeof data == 'string') {
			return console.log(logstring, data.split('\n').map(d => `${d}`.green).join(`\n${logstring} `));
		}
		if (typeof data == 'object') {
			return console.log(logstring, JSON.stringify(data, null, 3).green);
		}
		if (typeof data == 'boolean') {
			return console.log(logstring, String(data).cyan);
		}
		return console.log(logstring, data);
	};
};