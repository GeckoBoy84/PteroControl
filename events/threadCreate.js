const client = require('../bot')

client.on('threadCreate', (thread) => {
	try {
		thread.join();
	} catch (e) {
		console.log(e.message);
	}
});