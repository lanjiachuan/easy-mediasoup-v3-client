import UrlParse from 'url-parse';
import {
	applyMiddleware as applyReduxMiddleware,
	createStore as createReduxStore
} from 'redux';
import thunk from 'redux-thunk';
import Logger from './Logger';
import * as utils from './utils';
import deviceInfo from './deviceInfo';
import RoomClient from './RoomClient';
import * as stateActions from './redux/stateActions';
import reducers from './redux/reducers';
import * as emitter from 'wildemitter';

const version = "0.0.2";
console.warn(`Mediasoup-v3 lite client version ${version}`)

export class Init
{
	constructor(config) 
	{
		const logger = new Logger();
		const reduxMiddlewares = [ thunk ];

		global.emitter = this.emitter = new emitter.default();

		// if (process.env.NODE_ENV === 'development')
		// {
		// 	const reduxLogger = createReduxLogger(
		// 		{
		// 			duration  : true,
		// 			timestamp : false,
		// 			level     : 'log',
		// 			logErrors : true
		// 		});

		// 	reduxMiddlewares.push(reduxLogger);
		// }

		let roomClient;
		const store = this.store = createReduxStore(
			reducers,
			undefined,
			applyReduxMiddleware(...reduxMiddlewares)
		);

		window.STORE = store;

		RoomClient.init({ store });

		utils.initialize();

		this.run = async () =>
		{
			logger.debug('run() [environment:%s]', process.env.NODE_ENV, config);
			console.log(config)
			const urlParser = new UrlParse(window.location.href, true);

			const peerId = config.peerId || Math.round(Math.random()* 1e8).toString()
			let roomId = config.roomId;
			let displayName = config.displayName;
			const media_server_wss = config.media_server_wss;
			const video_constrains = config.video_constrains;
			const video_encodings = config.video_encodings;
			const turnservers = config.turnservers;
			const handler = urlParser.query.handler;
			const useSimulcast = config.useSimulcast || urlParser.query.simulcast == 'false';
			const useSharingSimulcast = config.useSharingSimulcast || urlParser.query.sharingSimulcast == 'false';
			const forceTcp = config.forceTcp || urlParser.query.forceTcp === 'true';
			const produce = config.produce == true;
			const consume = config.consume == true;
			const forceH264 = config.forceH264 || urlParser.query.forceH264 === 'true';
			const forceVP9 = config.forceVP9 || urlParser.query.forceVP9 === 'true';
			const svc = config.svc || urlParser.query.svc;
			const datachannel = config.datachannel || urlParser.query.datachannel !== 'false';
			const info = config.info || urlParser.query.info === 'true';
			const faceDetection = config.faceDetection || urlParser.query.faceDetection === 'true';
			const externalVideo = config.externalVideo || urlParser.query.externalVideo === 'true';
			const throttleSecret = config.throttleSecret || urlParser.query.throttleSecret;
			const camDeviceId = config.cam_device_id || 'default';
			const micDeviceId = config.mic_device_id || 'default';
			const args = {
				video_constrains,
				video_encodings,
				turnservers,
				camDeviceId,
				micDeviceId
			};

			if (info)
			{
				// eslint-disable-next-line require-atomic-updates
				window.SHOW_INFO = true;
			}

			if (throttleSecret)
			{
				// eslint-disable-next-line require-atomic-updates
				window.NETWORK_THROTTLE_SECRET = throttleSecret;
			}

			if (!roomId)
			{
				roomId = randomString({ length: 8 }).toLowerCase();

				urlParser.query.roomId = roomId;
				window.history.pushState('', '', urlParser.toString());
			}

			// Get the effective/shareable Room URL.
			const roomUrlParser = new UrlParse(window.location.href, true);

			for (const key of Object.keys(roomUrlParser.query))
			{
				// Don't keep some custom params.
				switch (key)
				{
					case 'roomId':
					case 'simulcast':
					case 'sharingSimulcast':
					case 'produce':
					case 'consume':
					case 'forceH264':
					case 'forceVP9':
					case 'forceTcp':
					case 'svc':
					case 'datachannel':
					case 'info':
					case 'faceDetection':
					case 'externalVideo':
					case 'throttleSecret':
						break;
					default:
						delete roomUrlParser.query[key];
				}
			}
			delete roomUrlParser.hash;

			const roomUrl = roomUrlParser.toString();

			let displayNameSet;

			// If displayName was provided via URL or Cookie, we are done.
			if (displayName)
			{
				displayNameSet = true;
			}
			// Otherwise pick a random name and mark as "not set".
			else
			{
				displayNameSet = false;
			}

			// Get current device info.
			const device = deviceInfo();

			store.dispatch(
				stateActions.setRoomUrl(roomUrl));

			store.dispatch(
				stateActions.setRoomFaceDetection(faceDetection));

			store.dispatch(
				stateActions.setMe({ peerId, displayName, displayNameSet, device }));
			
			const roomClientConfig = {
				roomId,
				peerId,
				displayName,
				device,
				handler,
				useSimulcast,
				useSharingSimulcast,
				forceTcp,
				produce,
				consume,
				forceH264,
				forceVP9,
				svc,
				datachannel,
				externalVideo,
				media_server_wss,
				...args
			};

			console.log(roomClientConfig);

			this.client = roomClient = new RoomClient(roomClientConfig);

			// NOTE: For debugging.
			window.CLIENT = roomClient; // eslint-disable-line require-atomic-updates
			window.CC = roomClient; // eslint-disable-line require-atomic-updates
		};

		if (config.autorun) 
		{
			this.run();
		}
		
		// NOTE: Debugging stuff.

		// window.__sendSdps = function()
		// {
		// 	logger.warn('>>> send transport local SDP offer:');
		// 	logger.warn(
		// 		roomClient._sendTransport._handler._pc.localDescription.sdp);

		// 	logger.warn('>>> send transport remote SDP answer:');
		// 	logger.warn(
		// 		roomClient._sendTransport._handler._pc.remoteDescription.sdp);
		// };

		// window.__recvSdps = function()
		// {
		// 	logger.warn('>>> recv transport remote SDP offer:');
		// 	logger.warn(
		// 		roomClient._recvTransport._handler._pc.remoteDescription.sdp);

		// 	logger.warn('>>> recv transport local SDP answer:');
		// 	logger.warn(
		// 		roomClient._recvTransport._handler._pc.localDescription.sdp);
		// };

		// let dataChannelTestInterval = null;

		// window.__startDataChannelTest = function()
		// {
		// 	let number = 0;

		// 	const buffer = new ArrayBuffer(32);
		// 	const view = new DataView(buffer);

		// 	dataChannelTestInterval = window.setInterval(() =>
		// 	{
		// 		if (window.DP)
		// 		{
		// 			view.setUint32(0, number++);
		// 			window.DP.send(buffer);
		// 		}
		// 	}, 100);
		// };

		// window.__stopDataChannelTest = function()
		// {
		// 	window.clearInterval(dataChannelTestInterval);

		// 	const buffer = new ArrayBuffer(32);
		// 	const view = new DataView(buffer);

		// 	if (window.DP)
		// 	{
		// 		view.setUint32(0, Math.pow(2, 32) - 1);
		// 		window.DP.send(buffer);
		// 	}
		// };

		// window.__testSctp = async function({ timeout = 100, bot = false } = {})
		// {
		// 	let dp;

		// 	if (!bot)
		// 	{
		// 		await window.CLIENT.enableChatDataProducer();

		// 		dp = window.CLIENT._chatDataProducer;
		// 	}
		// 	else
		// 	{
		// 		await window.CLIENT.enableBotDataProducer();

		// 		dp = window.CLIENT._botDataProducer;
		// 	}

		// 	logger.warn(
		// 		'<<< testSctp: DataProducer created [bot:%s, streamId:%d, readyState:%s]',
		// 		bot ? 'true' : 'false',
		// 		dp.sctpStreamParameters.streamId,
		// 		dp.readyState);

		// 	function send()
		// 	{
		// 		dp.send(`I am streamId ${dp.sctpStreamParameters.streamId}`);
		// 	}

		// 	if (dp.readyState === 'open')
		// 	{
		// 		send();
		// 	}
		// 	else
		// 	{
		// 		dp.on('open', () =>
		// 		{
		// 			logger.warn(
		// 				'<<< testSctp: DataChannel open [streamId:%d]',
		// 				dp.sctpStreamParameters.streamId);

		// 			send();
		// 		});
		// 	}

		// 	setTimeout(() => window.__testSctp({ timeout, bot }), timeout);
		// };

		// setInterval(() =>
		// {
		// 	if (window.CLIENT._sendTransport)
		// 	{
		// 		window.PC1 = window.CLIENT._sendTransport._handler._pc;
		// 		window.DP = window.CLIENT._chatDataProducer;
		// 	}
		// 	else
		// 	{
		// 		delete window.PC1;
		// 		delete window.DP;
		// 	}

		// 	if (window.CLIENT._recvTransport)
		// 		window.PC2 = window.CLIENT._recvTransport._handler._pc;
		// 	else
		// 		delete window.PC2;
		// }, 2000);

	}
}
