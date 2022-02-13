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
			console.log(logstring, data.split('\n').map(d => `${d}`.green).join(`\n${logstring} `));
		} else if (typeof data == 'object') {
			console.log(logstring, JSON.stringify(data, null, 3).green);
		} else if (typeof data == 'boolean') {
			console.log(logstring, String(data).cyan);
		} else {
			console.log(logstring, data);
		}
	};

};