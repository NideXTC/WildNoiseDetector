const request = require('request');
const conf = require('./conf.json');

let authenticated = false;
let authToken = null;
let userId = null;

const rocketchatAdapter = {
	login: () => {
		return new Promise((resolve, reject) => {
			request.post({
				url: `${conf.rocketchatProtocol}://${conf.rocketchatHost}/api/v1/login`,
				form: {
					user: conf.rocketchatUsername,
					password: conf.rocketchatPassword
				}
			}, (error, response, body) => {
				body = JSON.parse(body);

				if (error) {
					return reject(error);
				}

				if (body.status === 'success') {
					authenticated = true;
					authToken = body.data.authToken;
					userId = body.data.userId;
					return resolve(body);
				} else {
					return reject(body.message);
				}
			});
		});
	},
	post: msg => {
		request.post({
			url: 'https://demo.rocket.chat/api/v1/chat.postMessage',
			headers: {
				'X-Auth-Token': authToken,
				'X-User-Id': userId
			},
			form: {
				channel: conf.rocketchatChannel,
				text: msg
			}
		}, error => {
			if (error) {
				console.log(error);
			}
		});
	},
	sendMessage: msg => {
		if (authenticated) {
			rocketchatAdapter.post(msg);
		} else {
			rocketchatAdapter.login().then(() => {
				rocketchatAdapter.post(msg);
			}, err => console.log(err));
		}
	}
};

module.exports = rocketchatAdapter;
