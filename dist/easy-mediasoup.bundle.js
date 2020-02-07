(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EasyMediasoup = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _debug = _interopRequireDefault(require("debug"));

var APP_NAME = 'mediasoup-demo';

var Logger =
/*#__PURE__*/
function () {
  function Logger(prefix) {
    (0, _classCallCheck2["default"])(this, Logger);

    if (prefix) {
      this._debug = (0, _debug["default"])("".concat(APP_NAME, ":").concat(prefix));
      this._warn = (0, _debug["default"])("".concat(APP_NAME, ":WARN:").concat(prefix));
      this._error = (0, _debug["default"])("".concat(APP_NAME, ":ERROR:").concat(prefix));
    } else {
      this._debug = (0, _debug["default"])(APP_NAME);
      this._warn = (0, _debug["default"])("".concat(APP_NAME, ":WARN"));
      this._error = (0, _debug["default"])("".concat(APP_NAME, ":ERROR"));
    }
    /* eslint-disable no-console */


    this._debug.log = console.info.bind(console);
    this._warn.log = console.warn.bind(console);
    this._error.log = console.error.bind(console);
    /* eslint-enable no-console */
  }

  (0, _createClass2["default"])(Logger, [{
    key: "debug",
    get: function get() {
      return this._debug;
    }
  }, {
    key: "warn",
    get: function get() {
      return this._warn;
    }
  }, {
    key: "error",
    get: function get() {
      return this._error;
    }
  }]);
  return Logger;
}();

exports["default"] = Logger;
},{"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/interopRequireDefault":24,"debug":36}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _protooClient = _interopRequireDefault(require("protoo-client"));

var mediasoupClient = _interopRequireWildcard(require("mediasoup-client"));

var _Logger = _interopRequireDefault(require("./Logger"));

var _urlFactory = require("./urlFactory");

var cookiesManager = _interopRequireWildcard(require("./cookiesManager"));

var requestActions = _interopRequireWildcard(require("./redux/requestActions"));

var stateActions = _interopRequireWildcard(require("./redux/stateActions"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var VIDEO_CONSTRAINS_DEFAULT = {
  qvga: {
    width: {
      ideal: 320
    },
    height: {
      ideal: 240
    }
  },
  vga: {
    width: {
      ideal: 640
    },
    height: {
      ideal: 480
    }
  },
  hd: {
    width: {
      ideal: 1280
    },
    height: {
      ideal: 720
    }
  }
};
var PC_PROPRIETARY_CONSTRAINTS = {
  optional: [{
    googDscp: true
  }]
};
var VIDEO_SIMULCAST_ENCODINGS_DEFAULT = [{
  maxBitrate: 180000,
  scaleResolutionDownBy: 4
}, {
  maxBitrate: 360000,
  scaleResolutionDownBy: 2
}, {
  maxBitrate: 1500000,
  scaleResolutionDownBy: 1
}];
var VIDEO_CONSTRAINS;
var VIDEO_SIMULCAST_ENCODINGS; // Used for VP9 webcam video.

var VIDEO_KSVC_ENCODINGS = [{
  scalabilityMode: 'S3T3_KEY'
}]; // Used for VP9 desktop sharing.

var VIDEO_SVC_ENCODINGS = [{
  scalabilityMode: 'S3T3',
  dtx: true
}];
var EXTERNAL_VIDEO_SRC = '/resources/videos/video-audio-stereo.mp4';
var logger = new _Logger["default"]('RoomClient');
var store;

var RoomClient =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(RoomClient, null, [{
    key: "init",

    /**
     * @param  {Object} data
     * @param  {Object} data.store - The Redux store.
     */
    value: function init(data) {
      store = data.store;
    }
  }]);

  function RoomClient(_ref) {
    var roomId = _ref.roomId,
        peerId = _ref.peerId,
        displayName = _ref.displayName,
        device = _ref.device,
        handler = _ref.handler,
        useSimulcast = _ref.useSimulcast,
        useSharingSimulcast = _ref.useSharingSimulcast,
        forceTcp = _ref.forceTcp,
        produce = _ref.produce,
        consume = _ref.consume,
        forceH264 = _ref.forceH264,
        forceVP9 = _ref.forceVP9,
        svc = _ref.svc,
        datachannel = _ref.datachannel,
        externalVideo = _ref.externalVideo,
        media_server_wss = _ref.media_server_wss,
        args = (0, _objectWithoutProperties2["default"])(_ref, ["roomId", "peerId", "displayName", "device", "handler", "useSimulcast", "useSharingSimulcast", "forceTcp", "produce", "consume", "forceH264", "forceVP9", "svc", "datachannel", "externalVideo", "media_server_wss"]);
    (0, _classCallCheck2["default"])(this, RoomClient);
    logger.debug('constructor() [roomId:"%s", peerId:"%s", displayName:"%s", device:%s]', roomId, peerId, displayName, device.flag);
    VIDEO_CONSTRAINS = args.video_constrains | VIDEO_CONSTRAINS_DEFAULT;
    VIDEO_SIMULCAST_ENCODINGS = args.video_encodings | VIDEO_SIMULCAST_ENCODINGS_DEFAULT;
    this.turnservers = args.turnservers; // Closed flag.
    // @type {Boolean}

    this._closed = false; // Display name.
    // @type {String}

    this._displayName = displayName; // Device info.
    // @type {Object}

    this._device = device; // Whether we want to force RTC over TCP.
    // @type {Boolean}

    this._forceTcp = forceTcp; // Whether we want to produce audio/video.
    // @type {Boolean}

    this._produce = produce; // Whether we should consume.
    // @type {Boolean}

    this._consume = consume; // Whether we want DataChannels.
    // @type {Boolean}

    this._useDataChannel = datachannel; // External video.
    // @type {HTMLVideoElement}

    this._externalVideo = null; // MediaStream of the external video.
    // @type {MediaStream}

    this._externalVideoStream = null; // Next expected dataChannel test number.
    // @type {Number}

    this._nextDataChannelTestNumber = 0;

    if (externalVideo) {
      this._externalVideo = document.createElement('video');
      this._externalVideo.controls = true;
      this._externalVideo.muted = true;
      this._externalVideo.loop = true;

      this._externalVideo.setAttribute('playsinline', '');

      this._externalVideo.src = EXTERNAL_VIDEO_SRC;

      this._externalVideo.play()["catch"](function (error) {
        return logger.warn('externalVideo.play() failed:%o', error);
      });
    } // Custom mediasoup-client handler (to override default browser detection if
    // desired).
    // @type {String}


    this._handler = handler; // Whether simulcast should be used.
    // @type {Boolean}

    this._useSimulcast = useSimulcast; // Whether simulcast should be used in desktop sharing.
    // @type {Boolean}

    this._useSharingSimulcast = useSharingSimulcast; // Protoo URL.
    // @type {String}

    this._protooUrl = (0, _urlFactory.getProtooUrl)({
      media_server_wss: media_server_wss,
      roomId: roomId,
      peerId: peerId,
      forceH264: forceH264,
      forceVP9: forceVP9
    }); // protoo-client Peer instance.
    // @type {protooClient.Peer}

    this._protoo = null; // mediasoup-client Device instance.
    // @type {mediasoupClient.Device}

    this._mediasoupDevice = null; // mediasoup Transport for sending.
    // @type {mediasoupClient.Transport}

    this._sendTransport = null; // mediasoup Transport for receiving.
    // @type {mediasoupClient.Transport}

    this._recvTransport = null; // Local mic mediasoup Producer.
    // @type {mediasoupClient.Producer}

    this._micProducer = null; // Local webcam mediasoup Producer.
    // @type {mediasoupClient.Producer}

    this._webcamProducer = null; // Local share mediasoup Producer.
    // @type {mediasoupClient.Producer}

    this._shareProducer = null; // Local chat DataProducer.
    // @type {mediasoupClient.DataProducer}

    this._chatDataProducer = null; // Local bot DataProducer.
    // @type {mediasoupClient.DataProducer}

    this._botDataProducer = null; // mediasoup Consumers.
    // @type {Map<String, mediasoupClient.Consumer>}

    this._consumers = new Map(); // mediasoup DataConsumers.
    // @type {Map<String, mediasoupClient.DataConsumer>}

    this._dataConsumers = new Map(); // Map of webcam MediaDeviceInfos indexed by deviceId.
    // @type {Map<String, MediaDeviceInfos>}

    this._webcams = new Map(); // Local Webcam.
    // @type {Object} with:
    // - {MediaDeviceInfo} [device]
    // - {String} [resolution] - 'qvga' / 'vga' / 'hd'.

    this._webcam = {
      device: args.camDeviceId ? {
        deviceId: args.camDeviceId
      } : null,
      resolution: 'hd'
    };
    this._mic = {
      device: args.micDeviceId ? {
        deviceId: args.micDeviceId
      } : null
    }; // Set custom SVC scalability mode.

    if (svc) {
      VIDEO_SVC_ENCODINGS[0].scalabilityMode = svc;
      VIDEO_KSVC_ENCODINGS[0].scalabilityMode = "".concat(svc, "_KEY");
    }

    this.join();
  }

  (0, _createClass2["default"])(RoomClient, [{
    key: "close",
    value: function close() {
      if (this._closed) return;
      this._closed = true;
      logger.debug('close()'); // Close protoo Peer

      this._protoo.close(); // Close mediasoup Transports.


      if (this._sendTransport) this._sendTransport.close();
      if (this._recvTransport) this._recvTransport.close();
      store.dispatch(stateActions.setRoomState('closed'));
    }
  }, {
    key: "join",
    value: function () {
      var _join = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var _this = this;

        var protooTransport;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                protooTransport = new _protooClient["default"].WebSocketTransport(this._protooUrl);
                this._protoo = new _protooClient["default"].Peer(protooTransport);
                store.dispatch(stateActions.setRoomState('connecting'));

                this._protoo.on('open', function () {
                  return _this._joinRoom();
                });

                this._protoo.on('failed', function () {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'WebSocket connection failed'
                  }));
                });

                this._protoo.on('disconnected', function () {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'WebSocket disconnected'
                  })); // Close mediasoup Transports.

                  if (_this._sendTransport) {
                    _this._sendTransport.close();

                    _this._sendTransport = null;
                  }

                  if (_this._recvTransport) {
                    _this._recvTransport.close();

                    _this._recvTransport = null;
                  }

                  store.dispatch(stateActions.setRoomState('closed'));
                });

                this._protoo.on('close', function () {
                  if (_this._closed) return;

                  _this.close();
                }); // eslint-disable-next-line no-unused-vars


                this._protoo.on('request',
                /*#__PURE__*/
                function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee(request, accept, reject) {
                    var _request$data, peerId, producerId, id, kind, rtpParameters, type, appData, producerPaused, codecOptions, consumer, _mediasoupClient$pars, spatialLayers, temporalLayers, _request$data2, _peerId2, dataProducerId, _id, sctpStreamParameters, label, protocol, _appData, dataConsumer;

                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            logger.debug('proto "request" event [method:%s, data:%o]', request.method, request.data);
                            _context.t0 = request.method;
                            _context.next = _context.t0 === 'newConsumer' ? 4 : _context.t0 === 'newDataConsumer' ? 26 : 53;
                            break;

                          case 4:
                            if (_this._consume) {
                              _context.next = 7;
                              break;
                            }

                            reject(403, 'I do not want to consume');
                            return _context.abrupt("return");

                          case 7:
                            _request$data = request.data, peerId = _request$data.peerId, producerId = _request$data.producerId, id = _request$data.id, kind = _request$data.kind, rtpParameters = _request$data.rtpParameters, type = _request$data.type, appData = _request$data.appData, producerPaused = _request$data.producerPaused;

                            if (kind === 'audio') {
                              codecOptions = {
                                opusStereo: 1
                              };
                            }

                            _context.prev = 9;
                            _context.next = 12;
                            return _this._recvTransport.consume({
                              id: id,
                              producerId: producerId,
                              kind: kind,
                              rtpParameters: rtpParameters,
                              codecOptions: codecOptions,
                              appData: _objectSpread({}, appData, {
                                peerId: peerId
                              }) // Trick.

                            });

                          case 12:
                            consumer = _context.sent;

                            // Store in the map.
                            _this._consumers.set(consumer.id, consumer);

                            consumer.on('transportclose', function () {
                              _this._consumers["delete"](consumer.id);
                            });
                            _mediasoupClient$pars = mediasoupClient.parseScalabilityMode(consumer.rtpParameters.encodings[0].scalabilityMode), spatialLayers = _mediasoupClient$pars.spatialLayers, temporalLayers = _mediasoupClient$pars.temporalLayers;
                            store.dispatch(stateActions.addConsumer({
                              id: consumer.id,
                              type: type,
                              locallyPaused: false,
                              remotelyPaused: producerPaused,
                              rtpParameters: consumer.rtpParameters,
                              spatialLayers: spatialLayers,
                              temporalLayers: temporalLayers,
                              preferredSpatialLayer: spatialLayers - 1,
                              preferredTemporalLayer: temporalLayers - 1,
                              priority: 1,
                              codec: consumer.rtpParameters.codecs[0].mimeType.split('/')[1],
                              track: consumer.track
                            }, peerId)); // We are ready. Answer the protoo request so the server will
                            // resume this Consumer (which was paused for now if video).

                            accept(); // If audio-only mode is enabled, pause it.

                            if (consumer.kind === 'video' && store.getState().me.audioOnly) _this._pauseConsumer(consumer);
                            _context.next = 25;
                            break;

                          case 21:
                            _context.prev = 21;
                            _context.t1 = _context["catch"](9);
                            logger.error('"newConsumer" request failed:%o', _context.t1);
                            store.dispatch(requestActions.notify({
                              type: 'error',
                              text: "Error creating a Consumer: ".concat(_context.t1)
                            }));

                          case 25:
                            return _context.abrupt("break", 53);

                          case 26:
                            if (_this._consume) {
                              _context.next = 29;
                              break;
                            }

                            reject(403, 'I do not want to data consume');
                            return _context.abrupt("return");

                          case 29:
                            if (_this._useDataChannel) {
                              _context.next = 32;
                              break;
                            }

                            reject(403, 'I do not want DataChannels');
                            return _context.abrupt("return");

                          case 32:
                            _request$data2 = request.data, _peerId2 = _request$data2.peerId, dataProducerId = _request$data2.dataProducerId, _id = _request$data2.id, sctpStreamParameters = _request$data2.sctpStreamParameters, label = _request$data2.label, protocol = _request$data2.protocol, _appData = _request$data2.appData;
                            _context.prev = 33;
                            _context.next = 36;
                            return _this._recvTransport.consumeData({
                              id: _id,
                              dataProducerId: dataProducerId,
                              sctpStreamParameters: sctpStreamParameters,
                              label: label,
                              protocol: protocol,
                              appData: _objectSpread({}, _appData, {
                                peerId: _peerId2
                              }) // Trick.

                            });

                          case 36:
                            dataConsumer = _context.sent;

                            // Store in the map.
                            _this._dataConsumers.set(dataConsumer.id, dataConsumer);

                            dataConsumer.on('transportclose', function () {
                              _this._dataConsumers["delete"](dataConsumer.id);
                            });
                            dataConsumer.on('open', function () {
                              logger.debug('DataConsumer "open" event');
                            });
                            dataConsumer.on('close', function () {
                              logger.warn('DataConsumer "close" event');

                              _this._dataConsumers["delete"](dataConsumer.id);

                              store.dispatch(requestActions.notify({
                                type: 'error',
                                text: 'DataConsumer closed'
                              }));
                            });
                            dataConsumer.on('error', function (error) {
                              logger.error('DataConsumer "error" event:%o', error);
                              store.dispatch(requestActions.notify({
                                type: 'error',
                                text: "DataConsumer error: ".concat(error)
                              }));
                            });
                            dataConsumer.on('message', function (message) {
                              logger.debug('DataConsumer "message" event [streamId:%d]', dataConsumer.sctpStreamParameters.streamId); // TODO: For debugging.

                              window.DC_MESSAGE = message;

                              if (message instanceof ArrayBuffer) {
                                var view = new DataView(message);
                                var number = view.getUint32();

                                if (number == Math.pow(2, 32) - 1) {
                                  logger.warn('dataChannelTest finished!');
                                  _this._nextDataChannelTestNumber = 0;
                                  return;
                                }

                                if (number > _this._nextDataChannelTestNumber) {
                                  logger.warn('dataChannelTest: %s packets missing', number - _this._nextDataChannelTestNumber);
                                }

                                _this._nextDataChannelTestNumber = number + 1;
                                return;
                              } else if (typeof message !== 'string') {
                                logger.warn('ignoring DataConsumer "message" (not a string)');
                                return;
                              }

                              switch (dataConsumer.label) {
                                case 'chat':
                                  {
                                    var _store$getState = store.getState(),
                                        peers = _store$getState.peers;

                                    var peersArray = Object.keys(peers).map(function (_peerId) {
                                      return peers[_peerId];
                                    });
                                    var sendingPeer = peersArray.find(function (peer) {
                                      return peer.dataConsumers.includes(dataConsumer.id);
                                    }); // TODO: Don't check this for bot messages.

                                    if (!sendingPeer) logger.warn('DataConsumer "message" from unknown peer');
                                    store.dispatch(requestActions.notify({
                                      title: "".concat(sendingPeer.displayName, " says:"),
                                      text: message,
                                      timeout: 5000
                                    }));
                                    break;
                                  }

                                case 'bot':
                                  {
                                    store.dispatch(requestActions.notify({
                                      title: 'Message from Bot:',
                                      text: message,
                                      timeout: 5000
                                    }));
                                    break;
                                  }
                              }
                            }); // TODO: REMOVE

                            window.DC = dataConsumer;
                            store.dispatch(stateActions.addDataConsumer({
                              id: dataConsumer.id,
                              sctpStreamParameters: dataConsumer.sctpStreamParameters,
                              label: dataConsumer.label,
                              protocol: dataConsumer.protocol
                            }, _peerId2)); // We are ready. Answer the protoo request.

                            accept();
                            _context.next = 52;
                            break;

                          case 48:
                            _context.prev = 48;
                            _context.t2 = _context["catch"](33);
                            logger.error('"newDataConsumer" request failed:%o', _context.t2);
                            store.dispatch(requestActions.notify({
                              type: 'error',
                              text: "Error creating a DataConsumer: ".concat(_context.t2)
                            }));

                          case 52:
                            return _context.abrupt("break", 53);

                          case 53:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[9, 21], [33, 48]]);
                  }));

                  return function (_x, _x2, _x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

                this._protoo.on('notification', function (notification) {
                  logger.debug('proto "notification" event [method:%s, data:%o]', notification.method, notification.data);

                  switch (notification.method) {
                    case 'producerScore':
                      {
                        var _notification$data = notification.data,
                            producerId = _notification$data.producerId,
                            score = _notification$data.score;
                        store.dispatch(stateActions.setProducerScore(producerId, score));
                        break;
                      }

                    case 'newPeer':
                      {
                        var peer = notification.data;
                        store.dispatch(stateActions.addPeer(_objectSpread({}, peer, {
                          consumers: [],
                          dataConsumers: []
                        })));
                        store.dispatch(requestActions.notify({
                          text: "".concat(peer.displayName, " has joined the room")
                        }));
                        break;
                      }

                    case 'peerClosed':
                      {
                        var peerId = notification.data.peerId;
                        store.dispatch(stateActions.removePeer(peerId));
                        break;
                      }

                    case 'peerDisplayNameChanged':
                      {
                        var _notification$data2 = notification.data,
                            _peerId3 = _notification$data2.peerId,
                            displayName = _notification$data2.displayName,
                            oldDisplayName = _notification$data2.oldDisplayName;
                        store.dispatch(stateActions.setPeerDisplayName(displayName, _peerId3));
                        store.dispatch(requestActions.notify({
                          text: "".concat(oldDisplayName, " is now ").concat(displayName)
                        }));
                        break;
                      }

                    case 'consumerClosed':
                      {
                        var consumerId = notification.data.consumerId;

                        var consumer = _this._consumers.get(consumerId);

                        if (!consumer) break;
                        consumer.close();

                        _this._consumers["delete"](consumerId);

                        var _peerId4 = consumer.appData.peerId;
                        store.dispatch(stateActions.removeConsumer(consumerId, _peerId4));
                        break;
                      }

                    case 'consumerPaused':
                      {
                        var _consumerId = notification.data.consumerId;

                        var _consumer = _this._consumers.get(_consumerId);

                        if (!_consumer) break;
                        store.dispatch(stateActions.setConsumerPaused(_consumerId, 'remote'));
                        break;
                      }

                    case 'consumerResumed':
                      {
                        var _consumerId2 = notification.data.consumerId;

                        var _consumer2 = _this._consumers.get(_consumerId2);

                        if (!_consumer2) break;
                        store.dispatch(stateActions.setConsumerResumed(_consumerId2, 'remote'));
                        break;
                      }

                    case 'consumerLayersChanged':
                      {
                        var _notification$data3 = notification.data,
                            _consumerId3 = _notification$data3.consumerId,
                            spatialLayer = _notification$data3.spatialLayer,
                            temporalLayer = _notification$data3.temporalLayer;

                        var _consumer3 = _this._consumers.get(_consumerId3);

                        if (!_consumer3) break;
                        store.dispatch(stateActions.setConsumerCurrentLayers(_consumerId3, spatialLayer, temporalLayer));
                        break;
                      }

                    case 'consumerScore':
                      {
                        var _notification$data4 = notification.data,
                            _consumerId4 = _notification$data4.consumerId,
                            _score = _notification$data4.score;
                        store.dispatch(stateActions.setConsumerScore(_consumerId4, _score));
                        break;
                      }

                    case 'dataConsumerClosed':
                      {
                        var dataConsumerId = notification.data.dataConsumerId;

                        var dataConsumer = _this._dataConsumers.get(dataConsumerId);

                        if (!dataConsumer) break;
                        dataConsumer.close();

                        _this._dataConsumers["delete"](dataConsumerId);

                        var _peerId5 = dataConsumer.appData.peerId;
                        store.dispatch(stateActions.removeDataConsumer(dataConsumerId, _peerId5));
                        break;
                      }

                    case 'activeSpeaker':
                      {
                        var _peerId6 = notification.data.peerId;
                        store.dispatch(stateActions.setRoomActiveSpeaker(_peerId6));
                        break;
                      }

                    default:
                      {
                        logger.error('unknown protoo notification.method "%s"', notification.method);
                      }
                  }
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function join() {
        return _join.apply(this, arguments);
      }

      return join;
    }()
  }, {
    key: "enableMic",
    value: function () {
      var _enableMic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        var _this2 = this;

        var track, deviceId, stream, _stream;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                logger.debug('enableMic()');

                if (!this._micProducer) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                if (this._mediasoupDevice.canProduce('audio')) {
                  _context3.next = 6;
                  break;
                }

                logger.error('enableMic() | cannot produce audio');
                return _context3.abrupt("return");

              case 6:
                _context3.prev = 6;

                if (this._externalVideo) {
                  _context3.next = 16;
                  break;
                }

                logger.debug('enableMic() | calling getUserMedia()');
                deviceId = this._mic.device ? this._mic.device.deviceId : null;
                _context3.next = 12;
                return navigator.mediaDevices.getUserMedia({
                  audio: {
                    deviceId: {
                      exact: deviceId
                    }
                  }
                });

              case 12:
                stream = _context3.sent;
                track = stream.getAudioTracks()[0];
                _context3.next = 20;
                break;

              case 16:
                _context3.next = 18;
                return this._getExternalVideoStream();

              case 18:
                _stream = _context3.sent;
                track = _stream.getAudioTracks()[0].clone();

              case 20:
                _context3.next = 22;
                return this._sendTransport.produce({
                  track: track,
                  codecOptions: {
                    opusStereo: 1,
                    opusDtx: 1
                  }
                });

              case 22:
                this._micProducer = _context3.sent;
                store.dispatch(stateActions.addProducer({
                  id: this._micProducer.id,
                  paused: this._micProducer.paused,
                  track: this._micProducer.track,
                  rtpParameters: this._micProducer.rtpParameters,
                  codec: this._micProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
                }));

                this._micProducer.on('transportclose', function () {
                  _this2._micProducer = null;
                });

                this._micProducer.on('trackended', function () {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'Microphone disconnected!'
                  }));

                  _this2.disableMic()["catch"](function () {});
                });

                _context3.next = 33;
                break;

              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](6);
                logger.error('enableMic() | failed:%o', _context3.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error enabling microphone: ".concat(_context3.t0)
                }));
                if (track) track.stop();

              case 33:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[6, 28]]);
      }));

      function enableMic() {
        return _enableMic.apply(this, arguments);
      }

      return enableMic;
    }()
  }, {
    key: "disableMic",
    value: function () {
      var _disableMic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                logger.debug('disableMic()');

                if (this._micProducer) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt("return");

              case 3:
                this._micProducer.close();

                store.dispatch(stateActions.removeProducer(this._micProducer.id));
                _context4.prev = 5;
                _context4.next = 8;
                return this._protoo.request('closeProducer', {
                  producerId: this._micProducer.id
                });

              case 8:
                _context4.next = 13;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](5);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error closing server-side mic Producer: ".concat(_context4.t0)
                }));

              case 13:
                this._micProducer = null;

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 10]]);
      }));

      function disableMic() {
        return _disableMic.apply(this, arguments);
      }

      return disableMic;
    }()
  }, {
    key: "muteMic",
    value: function () {
      var _muteMic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                logger.debug('muteMic()');

                this._micProducer.pause();

                _context5.prev = 2;
                _context5.next = 5;
                return this._protoo.request('pauseProducer', {
                  producerId: this._micProducer.id
                });

              case 5:
                store.dispatch(stateActions.setProducerPaused(this._micProducer.id));
                _context5.next = 12;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](2);
                logger.error('muteMic() | failed: %o', _context5.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error pausing server-side mic Producer: ".concat(_context5.t0)
                }));

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 8]]);
      }));

      function muteMic() {
        return _muteMic.apply(this, arguments);
      }

      return muteMic;
    }()
  }, {
    key: "unmuteMic",
    value: function () {
      var _unmuteMic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                logger.debug('unmuteMic()');

                this._micProducer.resume();

                _context6.prev = 2;
                _context6.next = 5;
                return this._protoo.request('resumeProducer', {
                  producerId: this._micProducer.id
                });

              case 5:
                store.dispatch(stateActions.setProducerResumed(this._micProducer.id));
                _context6.next = 12;
                break;

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](2);
                logger.error('unmuteMic() | failed: %o', _context6.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error resuming server-side mic Producer: ".concat(_context6.t0)
                }));

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 8]]);
      }));

      function unmuteMic() {
        return _unmuteMic.apply(this, arguments);
      }

      return unmuteMic;
    }()
  }, {
    key: "enableWebcam",
    value: function () {
      var _enableWebcam = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7() {
        var _this3 = this;

        var track, device, resolution, stream, _stream2, firstVideoCodec, encodings;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                logger.debug('enableWebcam()');

                if (!this._webcamProducer) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt("return");

              case 5:
                if (!this._shareProducer) {
                  _context7.next = 8;
                  break;
                }

                _context7.next = 8;
                return this.disableShare();

              case 8:
                if (this._mediasoupDevice.canProduce('video')) {
                  _context7.next = 11;
                  break;
                }

                logger.error('enableWebcam() | cannot produce video');
                return _context7.abrupt("return");

              case 11:
                store.dispatch(stateActions.setWebcamInProgress(true));
                _context7.prev = 12;

                if (this._externalVideo) {
                  _context7.next = 27;
                  break;
                }

                _context7.next = 16;
                return this._updateWebcams();

              case 16:
                device = this._webcam.device;
                resolution = this._webcam.resolution;

                if (device) {
                  _context7.next = 20;
                  break;
                }

                throw new Error('no webcam devices');

              case 20:
                logger.debug('enableWebcam() | calling getUserMedia()');
                _context7.next = 23;
                return navigator.mediaDevices.getUserMedia({
                  video: _objectSpread({
                    deviceId: {
                      exact: device.deviceId
                    }
                  }, VIDEO_CONSTRAINS[resolution])
                });

              case 23:
                stream = _context7.sent;
                track = stream.getVideoTracks()[0];
                _context7.next = 32;
                break;

              case 27:
                device = {
                  label: 'external video'
                };
                _context7.next = 30;
                return this._getExternalVideoStream();

              case 30:
                _stream2 = _context7.sent;
                track = _stream2.getVideoTracks()[0].clone();

              case 32:
                if (!this._useSimulcast) {
                  _context7.next = 40;
                  break;
                }

                // If VP9 is the only available video codec then use SVC.
                firstVideoCodec = this._mediasoupDevice.rtpCapabilities.codecs.find(function (c) {
                  return c.kind === 'video';
                });
                if (firstVideoCodec.mimeType.toLowerCase() === 'video/vp9') encodings = VIDEO_KSVC_ENCODINGS;else encodings = VIDEO_SIMULCAST_ENCODINGS;
                _context7.next = 37;
                return this._sendTransport.produce({
                  track: track,
                  encodings: encodings,
                  codecOptions: {
                    videoGoogleStartBitrate: 1000
                  }
                });

              case 37:
                this._webcamProducer = _context7.sent;
                _context7.next = 43;
                break;

              case 40:
                _context7.next = 42;
                return this._sendTransport.produce({
                  track: track
                });

              case 42:
                this._webcamProducer = _context7.sent;

              case 43:
                store.dispatch(stateActions.addProducer({
                  id: this._webcamProducer.id,
                  deviceLabel: device.label,
                  type: this._getWebcamType(device),
                  paused: this._webcamProducer.paused,
                  track: this._webcamProducer.track,
                  rtpParameters: this._webcamProducer.rtpParameters,
                  codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
                }));

                this._webcamProducer.on('transportclose', function () {
                  _this3._webcamProducer = null;
                });

                this._webcamProducer.on('trackended', function () {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'Webcam disconnected!'
                  }));

                  _this3.disableWebcam()["catch"](function () {});
                });

                _context7.next = 53;
                break;

              case 48:
                _context7.prev = 48;
                _context7.t0 = _context7["catch"](12);
                logger.error('enableWebcam() | failed:%o', _context7.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error enabling webcam: ".concat(_context7.t0)
                }));
                if (track) track.stop();

              case 53:
                store.dispatch(stateActions.setWebcamInProgress(false));

              case 54:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[12, 48]]);
      }));

      function enableWebcam() {
        return _enableWebcam.apply(this, arguments);
      }

      return enableWebcam;
    }()
  }, {
    key: "disableWebcam",
    value: function () {
      var _disableWebcam = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                logger.debug('disableWebcam()');

                if (this._webcamProducer) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt("return");

              case 3:
                this._webcamProducer.close();

                store.dispatch(stateActions.removeProducer(this._webcamProducer.id));
                _context8.prev = 5;
                _context8.next = 8;
                return this._protoo.request('closeProducer', {
                  producerId: this._webcamProducer.id
                });

              case 8:
                _context8.next = 13;
                break;

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8["catch"](5);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error closing server-side webcam Producer: ".concat(_context8.t0)
                }));

              case 13:
                this._webcamProducer = null;

              case 14:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[5, 10]]);
      }));

      function disableWebcam() {
        return _disableWebcam.apply(this, arguments);
      }

      return disableWebcam;
    }()
  }, {
    key: "changeMic",
    value: function () {
      var _changeMic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9() {
        var deviceId, stream, track;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                logger.debug('changeWebcam()');
                _context9.prev = 1;
                deviceId = this._mic.device ? this._mic.device.deviceId : undefined; // this._mic.device = this._mic.device.deviceId = deviceId;
                // Closing the current video track before asking for a new one (mobiles do not like
                // having both front/back cameras open at the same time).

                this._micProducer.track.stop();

                _context9.next = 6;
                return navigator.mediaDevices.getUserMedia({
                  audio: {
                    deviceId: {
                      exact: deviceId
                    }
                  }
                });

              case 6:
                stream = _context9.sent;
                track = stream.getVideoTracks()[0];
                _context9.next = 10;
                return this._micProducer.replaceTrack({
                  track: track
                });

              case 10:
                _context9.next = 16;
                break;

              case 12:
                _context9.prev = 12;
                _context9.t0 = _context9["catch"](1);
                logger.error('changeWebcam() | failed: %o', _context9.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Could not change webcam: ".concat(_context9.t0)
                }));

              case 16:
                store.dispatch(stateActions.setWebcamInProgress(false));

              case 17:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[1, 12]]);
      }));

      function changeMic() {
        return _changeMic.apply(this, arguments);
      }

      return changeMic;
    }()
  }, {
    key: "changeWebcam",
    value: function () {
      var _changeWebcam = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10() {
        var array, len, deviceId, idx, stream, track;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                logger.debug('changeWebcam()');
                store.dispatch(stateActions.setWebcamInProgress(true));
                _context10.prev = 2;
                _context10.next = 5;
                return this._updateWebcams();

              case 5:
                array = Array.from(this._webcams.keys());
                len = array.length;
                deviceId = this._webcam.device ? this._webcam.device.deviceId : undefined;
                idx = array.indexOf(deviceId);
                if (idx < len - 1) idx++;else idx = 0;
                this._webcam.device = this._webcams.get(array[idx]);
                logger.debug('changeWebcam() | new selected webcam [device:%o]', this._webcam.device); // Reset video resolution to HD.

                this._webcam.resolution = 'hd';

                if (this._webcam.device) {
                  _context10.next = 15;
                  break;
                }

                throw new Error('no webcam devices');

              case 15:
                // Closing the current video track before asking for a new one (mobiles do not like
                // having both front/back cameras open at the same time).
                this._webcamProducer.track.stop();

                logger.debug('changeWebcam() | calling getUserMedia()');
                _context10.next = 19;
                return navigator.mediaDevices.getUserMedia({
                  video: _objectSpread({
                    deviceId: {
                      exact: this._webcam.device.deviceId
                    }
                  }, VIDEO_CONSTRAINS[this._webcam.resolution])
                });

              case 19:
                stream = _context10.sent;
                track = stream.getVideoTracks()[0];
                _context10.next = 23;
                return this._webcamProducer.replaceTrack({
                  track: track
                });

              case 23:
                store.dispatch(stateActions.setProducerTrack(this._webcamProducer.id, track));
                _context10.next = 30;
                break;

              case 26:
                _context10.prev = 26;
                _context10.t0 = _context10["catch"](2);
                logger.error('changeWebcam() | failed: %o', _context10.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Could not change webcam: ".concat(_context10.t0)
                }));

              case 30:
                store.dispatch(stateActions.setWebcamInProgress(false));

              case 31:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[2, 26]]);
      }));

      function changeWebcam() {
        return _changeWebcam.apply(this, arguments);
      }

      return changeWebcam;
    }()
  }, {
    key: "changeWebcamResolution",
    value: function () {
      var _changeWebcamResolution = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11() {
        var stream, track;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                logger.debug('changeWebcamResolution()');
                store.dispatch(stateActions.setWebcamInProgress(true));
                _context11.prev = 2;
                _context11.t0 = this._webcam.resolution;
                _context11.next = _context11.t0 === 'qvga' ? 6 : _context11.t0 === 'vga' ? 8 : _context11.t0 === 'hd' ? 10 : 12;
                break;

              case 6:
                this._webcam.resolution = 'vga';
                return _context11.abrupt("break", 13);

              case 8:
                this._webcam.resolution = 'hd';
                return _context11.abrupt("break", 13);

              case 10:
                this._webcam.resolution = 'qvga';
                return _context11.abrupt("break", 13);

              case 12:
                this._webcam.resolution = 'hd';

              case 13:
                logger.debug('changeWebcamResolution() | calling getUserMedia()');
                _context11.next = 16;
                return navigator.mediaDevices.getUserMedia({
                  video: _objectSpread({
                    deviceId: {
                      exact: this._webcam.device.deviceId
                    }
                  }, VIDEO_CONSTRAINS[this._webcam.resolution])
                });

              case 16:
                stream = _context11.sent;
                track = stream.getVideoTracks()[0];
                _context11.next = 20;
                return this._webcamProducer.replaceTrack({
                  track: track
                });

              case 20:
                store.dispatch(stateActions.setProducerTrack(this._webcamProducer.id, track));
                _context11.next = 27;
                break;

              case 23:
                _context11.prev = 23;
                _context11.t1 = _context11["catch"](2);
                logger.error('changeWebcamResolution() | failed: %o', _context11.t1);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Could not change webcam resolution: ".concat(_context11.t1)
                }));

              case 27:
                store.dispatch(stateActions.setWebcamInProgress(false));

              case 28:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[2, 23]]);
      }));

      function changeWebcamResolution() {
        return _changeWebcamResolution.apply(this, arguments);
      }

      return changeWebcamResolution;
    }()
  }, {
    key: "enableShare",
    value: function () {
      var _enableShare = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12() {
        var _this4 = this;

        var track, stream, firstVideoCodec, encodings;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                logger.debug('enableShare()');

                if (!this._shareProducer) {
                  _context12.next = 5;
                  break;
                }

                return _context12.abrupt("return");

              case 5:
                if (!this._webcamProducer) {
                  _context12.next = 8;
                  break;
                }

                _context12.next = 8;
                return this.disableWebcam();

              case 8:
                if (this._mediasoupDevice.canProduce('video')) {
                  _context12.next = 11;
                  break;
                }

                logger.error('enableShare() | cannot produce video');
                return _context12.abrupt("return");

              case 11:
                store.dispatch(stateActions.setShareInProgress(true));
                _context12.prev = 12;
                logger.debug('enableShare() | calling getUserMedia()');
                _context12.next = 16;
                return navigator.mediaDevices.getDisplayMedia({
                  audio: false,
                  video: {
                    displaySurface: 'monitor',
                    logicalSurface: true,
                    cursor: true,
                    width: {
                      max: 1920
                    },
                    height: {
                      max: 1080
                    },
                    frame: {
                      max: 30
                    }
                  }
                });

              case 16:
                stream = _context12.sent;

                if (stream) {
                  _context12.next = 20;
                  break;
                }

                store.dispatch(stateActions.setShareInProgress(true));
                return _context12.abrupt("return");

              case 20:
                track = stream.getVideoTracks()[0];

                if (!this._useSharingSimulcast) {
                  _context12.next = 29;
                  break;
                }

                // If VP9 is the only available video codec then use SVC.
                firstVideoCodec = this._mediasoupDevice.rtpCapabilities.codecs.find(function (c) {
                  return c.kind === 'video';
                });

                if (firstVideoCodec.mimeType.toLowerCase() === 'video/vp9') {
                  encodings = VIDEO_SVC_ENCODINGS;
                } else {
                  encodings = VIDEO_SIMULCAST_ENCODINGS.map(function (encoding) {
                    return _objectSpread({}, encoding, {
                      dtx: true
                    });
                  });
                }

                _context12.next = 26;
                return this._sendTransport.produce({
                  track: track,
                  encodings: encodings,
                  codecOptions: {
                    videoGoogleStartBitrate: 1000
                  },
                  appData: {
                    share: true
                  }
                });

              case 26:
                this._shareProducer = _context12.sent;
                _context12.next = 32;
                break;

              case 29:
                _context12.next = 31;
                return this._sendTransport.produce({
                  track: track
                });

              case 31:
                this._shareProducer = _context12.sent;

              case 32:
                store.dispatch(stateActions.addProducer({
                  id: this._shareProducer.id,
                  type: 'share',
                  paused: this._shareProducer.paused,
                  track: this._shareProducer.track,
                  rtpParameters: this._shareProducer.rtpParameters,
                  codec: this._shareProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
                }));

                this._shareProducer.on('transportclose', function () {
                  _this4._shareProducer = null;
                });

                this._shareProducer.on('trackended', function () {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'Share disconnected!'
                  }));

                  _this4.disableShare()["catch"](function () {});
                });

                _context12.next = 42;
                break;

              case 37:
                _context12.prev = 37;
                _context12.t0 = _context12["catch"](12);
                logger.error('enableShare() | failed:%o', _context12.t0);

                if (_context12.t0.name !== 'NotAllowedError') {
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "Error sharing: ".concat(_context12.t0)
                  }));
                }

                if (track) track.stop();

              case 42:
                store.dispatch(stateActions.setShareInProgress(false));

              case 43:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[12, 37]]);
      }));

      function enableShare() {
        return _enableShare.apply(this, arguments);
      }

      return enableShare;
    }()
  }, {
    key: "disableShare",
    value: function () {
      var _disableShare = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee13() {
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                logger.debug('disableShare()');

                if (this._shareProducer) {
                  _context13.next = 3;
                  break;
                }

                return _context13.abrupt("return");

              case 3:
                this._shareProducer.close();

                store.dispatch(stateActions.removeProducer(this._shareProducer.id));
                _context13.prev = 5;
                _context13.next = 8;
                return this._protoo.request('closeProducer', {
                  producerId: this._shareProducer.id
                });

              case 8:
                _context13.next = 13;
                break;

              case 10:
                _context13.prev = 10;
                _context13.t0 = _context13["catch"](5);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error closing server-side share Producer: ".concat(_context13.t0)
                }));

              case 13:
                this._shareProducer = null;

              case 14:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[5, 10]]);
      }));

      function disableShare() {
        return _disableShare.apply(this, arguments);
      }

      return disableShare;
    }()
  }, {
    key: "enableAudioOnly",
    value: function () {
      var _enableAudioOnly = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee14() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, consumer;

        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                logger.debug('enableAudioOnly()');
                store.dispatch(stateActions.setAudioOnlyInProgress(true));
                this.disableWebcam();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context14.prev = 6;
                _iterator = this._consumers.values()[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context14.next = 16;
                  break;
                }

                consumer = _step.value;

                if (!(consumer.kind !== 'video')) {
                  _context14.next = 12;
                  break;
                }

                return _context14.abrupt("continue", 13);

              case 12:
                this._pauseConsumer(consumer);

              case 13:
                _iteratorNormalCompletion = true;
                _context14.next = 8;
                break;

              case 16:
                _context14.next = 22;
                break;

              case 18:
                _context14.prev = 18;
                _context14.t0 = _context14["catch"](6);
                _didIteratorError = true;
                _iteratorError = _context14.t0;

              case 22:
                _context14.prev = 22;
                _context14.prev = 23;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 25:
                _context14.prev = 25;

                if (!_didIteratorError) {
                  _context14.next = 28;
                  break;
                }

                throw _iteratorError;

              case 28:
                return _context14.finish(25);

              case 29:
                return _context14.finish(22);

              case 30:
                store.dispatch(stateActions.setAudioOnlyState(true));
                store.dispatch(stateActions.setAudioOnlyInProgress(false));

              case 32:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[6, 18, 22, 30], [23,, 25, 29]]);
      }));

      function enableAudioOnly() {
        return _enableAudioOnly.apply(this, arguments);
      }

      return enableAudioOnly;
    }()
  }, {
    key: "disableAudioOnly",
    value: function () {
      var _disableAudioOnly = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee15() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, consumer;

        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                logger.debug('disableAudioOnly()');
                store.dispatch(stateActions.setAudioOnlyInProgress(true));

                if (!this._webcamProducer && this._produce && (cookiesManager.getDevices() || {}).webcamEnabled) {
                  this.enableWebcam();
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context15.prev = 6;
                _iterator2 = this._consumers.values()[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context15.next = 16;
                  break;
                }

                consumer = _step2.value;

                if (!(consumer.kind !== 'video')) {
                  _context15.next = 12;
                  break;
                }

                return _context15.abrupt("continue", 13);

              case 12:
                this._resumeConsumer(consumer);

              case 13:
                _iteratorNormalCompletion2 = true;
                _context15.next = 8;
                break;

              case 16:
                _context15.next = 22;
                break;

              case 18:
                _context15.prev = 18;
                _context15.t0 = _context15["catch"](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context15.t0;

              case 22:
                _context15.prev = 22;
                _context15.prev = 23;

                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }

              case 25:
                _context15.prev = 25;

                if (!_didIteratorError2) {
                  _context15.next = 28;
                  break;
                }

                throw _iteratorError2;

              case 28:
                return _context15.finish(25);

              case 29:
                return _context15.finish(22);

              case 30:
                store.dispatch(stateActions.setAudioOnlyState(false));
                store.dispatch(stateActions.setAudioOnlyInProgress(false));

              case 32:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[6, 18, 22, 30], [23,, 25, 29]]);
      }));

      function disableAudioOnly() {
        return _disableAudioOnly.apply(this, arguments);
      }

      return disableAudioOnly;
    }()
  }, {
    key: "muteAudio",
    value: function () {
      var _muteAudio = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee16() {
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                logger.debug('muteAudio()');
                store.dispatch(stateActions.setAudioMutedState(true));

              case 2:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }));

      function muteAudio() {
        return _muteAudio.apply(this, arguments);
      }

      return muteAudio;
    }()
  }, {
    key: "unmuteAudio",
    value: function () {
      var _unmuteAudio = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee17() {
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                logger.debug('unmuteAudio()');
                store.dispatch(stateActions.setAudioMutedState(false));

              case 2:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }));

      function unmuteAudio() {
        return _unmuteAudio.apply(this, arguments);
      }

      return unmuteAudio;
    }()
  }, {
    key: "restartIce",
    value: function () {
      var _restartIce = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee18() {
        var iceParameters, _iceParameters;

        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                logger.debug('restartIce()');
                store.dispatch(stateActions.setRestartIceInProgress(true));
                _context18.prev = 2;

                if (!this._sendTransport) {
                  _context18.next = 9;
                  break;
                }

                _context18.next = 6;
                return this._protoo.request('restartIce', {
                  transportId: this._sendTransport.id
                });

              case 6:
                iceParameters = _context18.sent;
                _context18.next = 9;
                return this._sendTransport.restartIce({
                  iceParameters: iceParameters
                });

              case 9:
                if (!this._recvTransport) {
                  _context18.next = 15;
                  break;
                }

                _context18.next = 12;
                return this._protoo.request('restartIce', {
                  transportId: this._recvTransport.id
                });

              case 12:
                _iceParameters = _context18.sent;
                _context18.next = 15;
                return this._recvTransport.restartIce({
                  iceParameters: _iceParameters
                });

              case 15:
                store.dispatch(requestActions.notify({
                  text: 'ICE restarted'
                }));
                _context18.next = 22;
                break;

              case 18:
                _context18.prev = 18;
                _context18.t0 = _context18["catch"](2);
                logger.error('restartIce() | failed:%o', _context18.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "ICE restart failed: ".concat(_context18.t0)
                }));

              case 22:
                store.dispatch(stateActions.setRestartIceInProgress(false));

              case 23:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this, [[2, 18]]);
      }));

      function restartIce() {
        return _restartIce.apply(this, arguments);
      }

      return restartIce;
    }()
  }, {
    key: "setMaxSendingSpatialLayer",
    value: function () {
      var _setMaxSendingSpatialLayer = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee19(spatialLayer) {
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                logger.debug('setMaxSendingSpatialLayer() [spatialLayer:%s]', spatialLayer);
                _context19.prev = 1;

                if (!this._webcamProducer) {
                  _context19.next = 7;
                  break;
                }

                _context19.next = 5;
                return this._webcamProducer.setMaxSpatialLayer(spatialLayer);

              case 5:
                _context19.next = 10;
                break;

              case 7:
                if (!this._shareProducer) {
                  _context19.next = 10;
                  break;
                }

                _context19.next = 10;
                return this._shareProducer.setMaxSpatialLayer(spatialLayer);

              case 10:
                _context19.next = 16;
                break;

              case 12:
                _context19.prev = 12;
                _context19.t0 = _context19["catch"](1);
                logger.error('setMaxSendingSpatialLayer() | failed:%o', _context19.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error setting max sending video spatial layer: ".concat(_context19.t0)
                }));

              case 16:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[1, 12]]);
      }));

      function setMaxSendingSpatialLayer(_x4) {
        return _setMaxSendingSpatialLayer.apply(this, arguments);
      }

      return setMaxSendingSpatialLayer;
    }()
  }, {
    key: "setConsumerPreferredLayers",
    value: function () {
      var _setConsumerPreferredLayers = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee20(consumerId, spatialLayer, temporalLayer) {
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                logger.debug('setConsumerPreferredLayers() [consumerId:%s, spatialLayer:%s, temporalLayer:%s]', consumerId, spatialLayer, temporalLayer);
                _context20.prev = 1;
                _context20.next = 4;
                return this._protoo.request('setConsumerPreferredLayers', {
                  consumerId: consumerId,
                  spatialLayer: spatialLayer,
                  temporalLayer: temporalLayer
                });

              case 4:
                store.dispatch(stateActions.setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer));
                _context20.next = 11;
                break;

              case 7:
                _context20.prev = 7;
                _context20.t0 = _context20["catch"](1);
                logger.error('setConsumerPreferredLayers() | failed:%o', _context20.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error setting Consumer preferred layers: ".concat(_context20.t0)
                }));

              case 11:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[1, 7]]);
      }));

      function setConsumerPreferredLayers(_x5, _x6, _x7) {
        return _setConsumerPreferredLayers.apply(this, arguments);
      }

      return setConsumerPreferredLayers;
    }()
  }, {
    key: "setConsumerPriority",
    value: function () {
      var _setConsumerPriority = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee21(consumerId, priority) {
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                logger.debug('setConsumerPriority() [consumerId:%s, priority:%d]', consumerId, priority);
                _context21.prev = 1;
                _context21.next = 4;
                return this._protoo.request('setConsumerPriority', {
                  consumerId: consumerId,
                  priority: priority
                });

              case 4:
                store.dispatch(stateActions.setConsumerPriority(consumerId, priority));
                _context21.next = 11;
                break;

              case 7:
                _context21.prev = 7;
                _context21.t0 = _context21["catch"](1);
                logger.error('setConsumerPriority() | failed:%o', _context21.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error setting Consumer priority: ".concat(_context21.t0)
                }));

              case 11:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this, [[1, 7]]);
      }));

      function setConsumerPriority(_x8, _x9) {
        return _setConsumerPriority.apply(this, arguments);
      }

      return setConsumerPriority;
    }()
  }, {
    key: "requestConsumerKeyFrame",
    value: function () {
      var _requestConsumerKeyFrame = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee22(consumerId) {
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                logger.debug('requestConsumerKeyFrame() [consumerId:%s]', consumerId);
                _context22.prev = 1;
                _context22.next = 4;
                return this._protoo.request('requestConsumerKeyFrame', {
                  consumerId: consumerId
                });

              case 4:
                store.dispatch(requestActions.notify({
                  text: 'Keyframe requested for video consumer'
                }));
                _context22.next = 11;
                break;

              case 7:
                _context22.prev = 7;
                _context22.t0 = _context22["catch"](1);
                logger.error('requestConsumerKeyFrame() | failed:%o', _context22.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error requesting key frame for Consumer: ".concat(_context22.t0)
                }));

              case 11:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this, [[1, 7]]);
      }));

      function requestConsumerKeyFrame(_x10) {
        return _requestConsumerKeyFrame.apply(this, arguments);
      }

      return requestConsumerKeyFrame;
    }()
  }, {
    key: "enableChatDataProducer",
    value: function () {
      var _enableChatDataProducer = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee23() {
        var _this5 = this;

        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                logger.debug('enableChatDataProducer()');

                if (this._useDataChannel) {
                  _context23.next = 3;
                  break;
                }

                return _context23.abrupt("return");

              case 3:
                _context23.prev = 3;
                _context23.next = 6;
                return this._sendTransport.produceData({
                  ordered: false,
                  maxRetransmits: 1,
                  label: 'chat',
                  priority: 'medium',
                  appData: {
                    info: 'my-chat-DataProducer'
                  }
                });

              case 6:
                this._chatDataProducer = _context23.sent;
                store.dispatch(stateActions.addDataProducer({
                  id: this._chatDataProducer.id,
                  sctpStreamParameters: this._chatDataProducer.sctpStreamParameters,
                  label: this._chatDataProducer.label,
                  protocol: this._chatDataProducer.protocol
                }));

                this._chatDataProducer.on('transportclose', function () {
                  _this5._chatDataProducer = null;
                });

                this._chatDataProducer.on('open', function () {
                  logger.debug('chat DataProducer "open" event');
                });

                this._chatDataProducer.on('close', function () {
                  logger.error('chat DataProducer "close" event');
                  _this5._chatDataProducer = null;
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'Chat DataProducer closed'
                  }));
                });

                this._chatDataProducer.on('error', function (error) {
                  logger.error('chat DataProducer "error" event:%o', error);
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "Chat DataProducer error: ".concat(error)
                  }));
                });

                this._chatDataProducer.on('bufferedamountlow', function () {
                  logger.debug('chat DataProducer "bufferedamountlow" event');
                });

                _context23.next = 20;
                break;

              case 15:
                _context23.prev = 15;
                _context23.t0 = _context23["catch"](3);
                logger.error('enableChatDataProducer() | failed:%o', _context23.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error enabling chat DataProducer: ".concat(_context23.t0)
                }));
                throw _context23.t0;

              case 20:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this, [[3, 15]]);
      }));

      function enableChatDataProducer() {
        return _enableChatDataProducer.apply(this, arguments);
      }

      return enableChatDataProducer;
    }()
  }, {
    key: "enableBotDataProducer",
    value: function () {
      var _enableBotDataProducer = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee24() {
        var _this6 = this;

        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                logger.debug('enableBotDataProducer()');

                if (this._useDataChannel) {
                  _context24.next = 3;
                  break;
                }

                return _context24.abrupt("return");

              case 3:
                _context24.prev = 3;
                _context24.next = 6;
                return this._sendTransport.produceData({
                  ordered: false,
                  maxPacketLifeTime: 2000,
                  label: 'bot',
                  priority: 'medium',
                  appData: {
                    info: 'my-bot-DataProducer'
                  }
                });

              case 6:
                this._botDataProducer = _context24.sent;
                store.dispatch(stateActions.addDataProducer({
                  id: this._botDataProducer.id,
                  sctpStreamParameters: this._botDataProducer.sctpStreamParameters,
                  label: this._botDataProducer.label,
                  protocol: this._botDataProducer.protocol
                }));

                this._botDataProducer.on('transportclose', function () {
                  _this6._botDataProducer = null;
                });

                this._botDataProducer.on('open', function () {
                  logger.debug('bot DataProducer "open" event');
                });

                this._botDataProducer.on('close', function () {
                  logger.error('bot DataProducer "close" event');
                  _this6._botDataProducer = null;
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: 'Bot DataProducer closed'
                  }));
                });

                this._botDataProducer.on('error', function (error) {
                  logger.error('bot DataProducer "error" event:%o', error);
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "Bot DataProducer error: ".concat(error)
                  }));
                });

                this._botDataProducer.on('bufferedamountlow', function () {
                  logger.debug('bot DataProducer "bufferedamountlow" event');
                });

                _context24.next = 20;
                break;

              case 15:
                _context24.prev = 15;
                _context24.t0 = _context24["catch"](3);
                logger.error('enableBotDataProducer() | failed:%o', _context24.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error enabling bot DataProducer: ".concat(_context24.t0)
                }));
                throw _context24.t0;

              case 20:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this, [[3, 15]]);
      }));

      function enableBotDataProducer() {
        return _enableBotDataProducer.apply(this, arguments);
      }

      return enableBotDataProducer;
    }()
  }, {
    key: "sendChatMessage",
    value: function () {
      var _sendChatMessage = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee25(text) {
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                logger.debug('sendChatMessage() [text:"%s]', text);

                if (this._chatDataProducer) {
                  _context25.next = 4;
                  break;
                }

                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: 'No chat DataProducer'
                }));
                return _context25.abrupt("return");

              case 4:
                try {
                  this._chatDataProducer.send(text);
                } catch (error) {
                  logger.error('chat DataProducer.send() failed:%o', error);
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "chat DataProducer.send() failed: ".concat(error)
                  }));
                }

              case 5:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function sendChatMessage(_x11) {
        return _sendChatMessage.apply(this, arguments);
      }

      return sendChatMessage;
    }()
  }, {
    key: "sendBotMessage",
    value: function () {
      var _sendBotMessage = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee26(text) {
        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                logger.debug('sendBotMessage() [text:"%s]', text);

                if (this._botDataProducer) {
                  _context26.next = 4;
                  break;
                }

                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: 'No bot DataProducer'
                }));
                return _context26.abrupt("return");

              case 4:
                try {
                  this._botDataProducer.send(text);
                } catch (error) {
                  logger.error('bot DataProducer.send() failed:%o', error);
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "bot DataProducer.send() failed: ".concat(error)
                  }));
                }

              case 5:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function sendBotMessage(_x12) {
        return _sendBotMessage.apply(this, arguments);
      }

      return sendBotMessage;
    }()
  }, {
    key: "changeDisplayName",
    value: function () {
      var _changeDisplayName = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee27(displayName) {
        return _regenerator["default"].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                logger.debug('changeDisplayName() [displayName:"%s"]', displayName); // Store in cookie.

                cookiesManager.setUser({
                  displayName: displayName
                });
                _context27.prev = 2;
                _context27.next = 5;
                return this._protoo.request('changeDisplayName', {
                  displayName: displayName
                });

              case 5:
                this._displayName = displayName;
                store.dispatch(stateActions.setDisplayName(displayName));
                store.dispatch(requestActions.notify({
                  text: 'Display name changed'
                }));
                _context27.next = 15;
                break;

              case 10:
                _context27.prev = 10;
                _context27.t0 = _context27["catch"](2);
                logger.error('changeDisplayName() | failed: %o', _context27.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Could not change display name: ".concat(_context27.t0)
                })); // We need to refresh the component for it to render the previous
                // displayName again.

                store.dispatch(stateActions.setDisplayName());

              case 15:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this, [[2, 10]]);
      }));

      function changeDisplayName(_x13) {
        return _changeDisplayName.apply(this, arguments);
      }

      return changeDisplayName;
    }()
  }, {
    key: "getSendTransportRemoteStats",
    value: function () {
      var _getSendTransportRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee28() {
        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                logger.debug('getSendTransportRemoteStats()');

                if (this._sendTransport) {
                  _context28.next = 3;
                  break;
                }

                return _context28.abrupt("return");

              case 3:
                return _context28.abrupt("return", this._protoo.request('getTransportStats', {
                  transportId: this._sendTransport.id
                }));

              case 4:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function getSendTransportRemoteStats() {
        return _getSendTransportRemoteStats.apply(this, arguments);
      }

      return getSendTransportRemoteStats;
    }()
  }, {
    key: "getRecvTransportRemoteStats",
    value: function () {
      var _getRecvTransportRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee29() {
        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                logger.debug('getRecvTransportRemoteStats()');

                if (this._recvTransport) {
                  _context29.next = 3;
                  break;
                }

                return _context29.abrupt("return");

              case 3:
                return _context29.abrupt("return", this._protoo.request('getTransportStats', {
                  transportId: this._recvTransport.id
                }));

              case 4:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function getRecvTransportRemoteStats() {
        return _getRecvTransportRemoteStats.apply(this, arguments);
      }

      return getRecvTransportRemoteStats;
    }()
  }, {
    key: "getAudioRemoteStats",
    value: function () {
      var _getAudioRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee30() {
        return _regenerator["default"].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                logger.debug('getAudioRemoteStats()');

                if (this._micProducer) {
                  _context30.next = 3;
                  break;
                }

                return _context30.abrupt("return");

              case 3:
                return _context30.abrupt("return", this._protoo.request('getProducerStats', {
                  producerId: this._micProducer.id
                }));

              case 4:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function getAudioRemoteStats() {
        return _getAudioRemoteStats.apply(this, arguments);
      }

      return getAudioRemoteStats;
    }()
  }, {
    key: "getVideoRemoteStats",
    value: function () {
      var _getVideoRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee31() {
        var producer;
        return _regenerator["default"].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                logger.debug('getVideoRemoteStats()');
                producer = this._webcamProducer || this._shareProducer;

                if (producer) {
                  _context31.next = 4;
                  break;
                }

                return _context31.abrupt("return");

              case 4:
                return _context31.abrupt("return", this._protoo.request('getProducerStats', {
                  producerId: producer.id
                }));

              case 5:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function getVideoRemoteStats() {
        return _getVideoRemoteStats.apply(this, arguments);
      }

      return getVideoRemoteStats;
    }()
  }, {
    key: "getConsumerRemoteStats",
    value: function () {
      var _getConsumerRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee32(consumerId) {
        var consumer;
        return _regenerator["default"].wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                logger.debug('getConsumerRemoteStats()');
                consumer = this._consumers.get(consumerId);

                if (consumer) {
                  _context32.next = 4;
                  break;
                }

                return _context32.abrupt("return");

              case 4:
                return _context32.abrupt("return", this._protoo.request('getConsumerStats', {
                  consumerId: consumerId
                }));

              case 5:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function getConsumerRemoteStats(_x14) {
        return _getConsumerRemoteStats.apply(this, arguments);
      }

      return getConsumerRemoteStats;
    }()
  }, {
    key: "getChatDataProducerRemoteStats",
    value: function () {
      var _getChatDataProducerRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee33() {
        var dataProducer;
        return _regenerator["default"].wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                logger.debug('getChatDataProducerRemoteStats()');
                dataProducer = this._chatDataProducer;

                if (dataProducer) {
                  _context33.next = 4;
                  break;
                }

                return _context33.abrupt("return");

              case 4:
                return _context33.abrupt("return", this._protoo.request('getDataProducerStats', {
                  dataProducerId: dataProducer.id
                }));

              case 5:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function getChatDataProducerRemoteStats() {
        return _getChatDataProducerRemoteStats.apply(this, arguments);
      }

      return getChatDataProducerRemoteStats;
    }()
  }, {
    key: "getBotDataProducerRemoteStats",
    value: function () {
      var _getBotDataProducerRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee34() {
        var dataProducer;
        return _regenerator["default"].wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                logger.debug('getBotDataProducerRemoteStats()');
                dataProducer = this._botDataProducer;

                if (dataProducer) {
                  _context34.next = 4;
                  break;
                }

                return _context34.abrupt("return");

              case 4:
                return _context34.abrupt("return", this._protoo.request('getDataProducerStats', {
                  dataProducerId: dataProducer.id
                }));

              case 5:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function getBotDataProducerRemoteStats() {
        return _getBotDataProducerRemoteStats.apply(this, arguments);
      }

      return getBotDataProducerRemoteStats;
    }()
  }, {
    key: "getDataConsumerRemoteStats",
    value: function () {
      var _getDataConsumerRemoteStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee35(dataConsumerId) {
        var dataConsumer;
        return _regenerator["default"].wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                logger.debug('getDataConsumerRemoteStats()');
                dataConsumer = this._dataConsumers.get(dataConsumerId);

                if (dataConsumer) {
                  _context35.next = 4;
                  break;
                }

                return _context35.abrupt("return");

              case 4:
                return _context35.abrupt("return", this._protoo.request('getDataConsumerStats', {
                  dataConsumerId: dataConsumerId
                }));

              case 5:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function getDataConsumerRemoteStats(_x15) {
        return _getDataConsumerRemoteStats.apply(this, arguments);
      }

      return getDataConsumerRemoteStats;
    }()
  }, {
    key: "getSendTransportLocalStats",
    value: function () {
      var _getSendTransportLocalStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee36() {
        return _regenerator["default"].wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                logger.debug('getSendTransportLocalStats()');

                if (this._sendTransport) {
                  _context36.next = 3;
                  break;
                }

                return _context36.abrupt("return");

              case 3:
                return _context36.abrupt("return", this._sendTransport.getStats());

              case 4:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function getSendTransportLocalStats() {
        return _getSendTransportLocalStats.apply(this, arguments);
      }

      return getSendTransportLocalStats;
    }()
  }, {
    key: "getRecvTransportLocalStats",
    value: function () {
      var _getRecvTransportLocalStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee37() {
        return _regenerator["default"].wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                logger.debug('getRecvTransportLocalStats()');

                if (this._recvTransport) {
                  _context37.next = 3;
                  break;
                }

                return _context37.abrupt("return");

              case 3:
                return _context37.abrupt("return", this._recvTransport.getStats());

              case 4:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this);
      }));

      function getRecvTransportLocalStats() {
        return _getRecvTransportLocalStats.apply(this, arguments);
      }

      return getRecvTransportLocalStats;
    }()
  }, {
    key: "getAudioLocalStats",
    value: function () {
      var _getAudioLocalStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee38() {
        return _regenerator["default"].wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                logger.debug('getAudioLocalStats()');

                if (this._micProducer) {
                  _context38.next = 3;
                  break;
                }

                return _context38.abrupt("return");

              case 3:
                return _context38.abrupt("return", this._micProducer.getStats());

              case 4:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function getAudioLocalStats() {
        return _getAudioLocalStats.apply(this, arguments);
      }

      return getAudioLocalStats;
    }()
  }, {
    key: "getVideoLocalStats",
    value: function () {
      var _getVideoLocalStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee39() {
        var producer;
        return _regenerator["default"].wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                logger.debug('getVideoLocalStats()');
                producer = this._webcamProducer || this._shareProducer;

                if (producer) {
                  _context39.next = 4;
                  break;
                }

                return _context39.abrupt("return");

              case 4:
                return _context39.abrupt("return", producer.getStats());

              case 5:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function getVideoLocalStats() {
        return _getVideoLocalStats.apply(this, arguments);
      }

      return getVideoLocalStats;
    }()
  }, {
    key: "getConsumerLocalStats",
    value: function () {
      var _getConsumerLocalStats = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee40(consumerId) {
        var consumer;
        return _regenerator["default"].wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                consumer = this._consumers.get(consumerId);

                if (consumer) {
                  _context40.next = 3;
                  break;
                }

                return _context40.abrupt("return");

              case 3:
                return _context40.abrupt("return", consumer.getStats());

              case 4:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));

      function getConsumerLocalStats(_x16) {
        return _getConsumerLocalStats.apply(this, arguments);
      }

      return getConsumerLocalStats;
    }()
  }, {
    key: "applyNetworkThrottle",
    value: function () {
      var _applyNetworkThrottle = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee41(_ref3) {
        var uplink, downlink, rtt, secret;
        return _regenerator["default"].wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                uplink = _ref3.uplink, downlink = _ref3.downlink, rtt = _ref3.rtt, secret = _ref3.secret;
                logger.debug('applyNetworkThrottle() [uplink:%s, downlink:%s, rtt:%s]', uplink, downlink, rtt);
                _context41.prev = 2;
                _context41.next = 5;
                return this._protoo.request('applyNetworkThrottle', {
                  uplink: uplink,
                  downlink: downlink,
                  rtt: rtt,
                  secret: secret
                });

              case 5:
                _context41.next = 11;
                break;

              case 7:
                _context41.prev = 7;
                _context41.t0 = _context41["catch"](2);
                logger.error('applyNetworkThrottle() | failed:%o', _context41.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error applying network throttle: ".concat(_context41.t0)
                }));

              case 11:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this, [[2, 7]]);
      }));

      function applyNetworkThrottle(_x17) {
        return _applyNetworkThrottle.apply(this, arguments);
      }

      return applyNetworkThrottle;
    }()
  }, {
    key: "resetNetworkThrottle",
    value: function () {
      var _resetNetworkThrottle = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee42(_ref4) {
        var _ref4$silent, silent, secret;

        return _regenerator["default"].wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                _ref4$silent = _ref4.silent, silent = _ref4$silent === void 0 ? false : _ref4$silent, secret = _ref4.secret;
                logger.debug('resetNetworkThrottle()');
                _context42.prev = 2;
                _context42.next = 5;
                return this._protoo.request('resetNetworkThrottle', {
                  secret: secret
                });

              case 5:
                _context42.next = 10;
                break;

              case 7:
                _context42.prev = 7;
                _context42.t0 = _context42["catch"](2);

                if (!silent) {
                  logger.error('resetNetworkThrottle() | failed:%o', _context42.t0);
                  store.dispatch(requestActions.notify({
                    type: 'error',
                    text: "Error resetting network throttle: ".concat(_context42.t0)
                  }));
                }

              case 10:
              case "end":
                return _context42.stop();
            }
          }
        }, _callee42, this, [[2, 7]]);
      }));

      function resetNetworkThrottle(_x18) {
        return _resetNetworkThrottle.apply(this, arguments);
      }

      return resetNetworkThrottle;
    }()
  }, {
    key: "_joinRoom",
    value: function () {
      var _joinRoom2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee45() {
        var _this7 = this;

        var routerRtpCapabilities, deviceId, stream, audioTrack, transportInfo, id, iceParameters, iceCandidates, dtlsParameters, sctpParameters, _transportInfo, _id4, _iceParameters2, _iceCandidates, _dtlsParameters, _sctpParameters, _ref13, peers, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, peer, devicesCookie, _store$getState2, me;

        return _regenerator["default"].wrap(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                logger.debug('_joinRoom()');
                _context45.prev = 1;
                this._mediasoupDevice = new mediasoupClient.Device({
                  Handler: this._handler
                });
                _context45.next = 5;
                return this._protoo.request('getRouterRtpCapabilities');

              case 5:
                routerRtpCapabilities = _context45.sent;
                _context45.next = 8;
                return this._mediasoupDevice.load({
                  routerRtpCapabilities: routerRtpCapabilities
                });

              case 8:
                if (!this._produce) {
                  _context45.next = 16;
                  break;
                }

                deviceId = this._mic.device ? this._mic.device.deviceId : null;
                _context45.next = 12;
                return navigator.mediaDevices.getUserMedia({
                  audio: {
                    deviceId: deviceId
                  }
                });

              case 12:
                stream = _context45.sent;
                audioTrack = stream.getAudioTracks()[0];
                audioTrack.enabled = false;
                setTimeout(function () {
                  return audioTrack.stop();
                }, 120000);

              case 16:
                if (!this._produce) {
                  _context45.next = 25;
                  break;
                }

                _context45.next = 19;
                return this._protoo.request('createWebRtcTransport', {
                  forceTcp: this._forceTcp,
                  producing: true,
                  consuming: false,
                  sctpCapabilities: this._useDataChannel ? this._mediasoupDevice.sctpCapabilities : undefined
                });

              case 19:
                transportInfo = _context45.sent;
                id = transportInfo.id, iceParameters = transportInfo.iceParameters, iceCandidates = transportInfo.iceCandidates, dtlsParameters = transportInfo.dtlsParameters, sctpParameters = transportInfo.sctpParameters;
                this._sendTransport = this._mediasoupDevice.createSendTransport({
                  id: id,
                  iceParameters: iceParameters,
                  iceServers: this.turnservers,
                  iceCandidates: iceCandidates,
                  dtlsParameters: dtlsParameters,
                  sctpParameters: sctpParameters,
                  proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS
                });

                this._sendTransport.on('connect', function (_ref5, callback, errback) // eslint-disable-line no-shadow
                {
                  var dtlsParameters = _ref5.dtlsParameters;

                  _this7._protoo.request('connectWebRtcTransport', {
                    transportId: _this7._sendTransport.id,
                    dtlsParameters: dtlsParameters
                  }).then(callback)["catch"](errback);
                });

                this._sendTransport.on('produce',
                /*#__PURE__*/
                function () {
                  var _ref7 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee43(_ref6, callback, errback) {
                    var kind, rtpParameters, appData, _ref8, _id2;

                    return _regenerator["default"].wrap(function _callee43$(_context43) {
                      while (1) {
                        switch (_context43.prev = _context43.next) {
                          case 0:
                            kind = _ref6.kind, rtpParameters = _ref6.rtpParameters, appData = _ref6.appData;
                            _context43.prev = 1;
                            _context43.next = 4;
                            return _this7._protoo.request('produce', {
                              transportId: _this7._sendTransport.id,
                              kind: kind,
                              rtpParameters: rtpParameters,
                              appData: appData
                            });

                          case 4:
                            _ref8 = _context43.sent;
                            _id2 = _ref8.id;
                            callback({
                              id: _id2
                            });
                            _context43.next = 12;
                            break;

                          case 9:
                            _context43.prev = 9;
                            _context43.t0 = _context43["catch"](1);
                            errback(_context43.t0);

                          case 12:
                          case "end":
                            return _context43.stop();
                        }
                      }
                    }, _callee43, null, [[1, 9]]);
                  }));

                  return function (_x19, _x20, _x21) {
                    return _ref7.apply(this, arguments);
                  };
                }());

                this._sendTransport.on('producedata',
                /*#__PURE__*/
                function () {
                  var _ref10 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee44(_ref9, callback, errback) {
                    var sctpStreamParameters, label, protocol, appData, _ref11, _id3;

                    return _regenerator["default"].wrap(function _callee44$(_context44) {
                      while (1) {
                        switch (_context44.prev = _context44.next) {
                          case 0:
                            sctpStreamParameters = _ref9.sctpStreamParameters, label = _ref9.label, protocol = _ref9.protocol, appData = _ref9.appData;
                            logger.debug('"producedata" event: [sctpStreamParameters:%o, appData:%o]', sctpStreamParameters, appData);
                            _context44.prev = 2;
                            _context44.next = 5;
                            return _this7._protoo.request('produceData', {
                              transportId: _this7._sendTransport.id,
                              sctpStreamParameters: sctpStreamParameters,
                              label: label,
                              protocol: protocol,
                              appData: appData
                            });

                          case 5:
                            _ref11 = _context44.sent;
                            _id3 = _ref11.id;
                            callback({
                              id: _id3
                            });
                            _context44.next = 13;
                            break;

                          case 10:
                            _context44.prev = 10;
                            _context44.t0 = _context44["catch"](2);
                            errback(_context44.t0);

                          case 13:
                          case "end":
                            return _context44.stop();
                        }
                      }
                    }, _callee44, null, [[2, 10]]);
                  }));

                  return function (_x22, _x23, _x24) {
                    return _ref10.apply(this, arguments);
                  };
                }());

              case 25:
                if (!this._consume) {
                  _context45.next = 32;
                  break;
                }

                _context45.next = 28;
                return this._protoo.request('createWebRtcTransport', {
                  forceTcp: this._forceTcp,
                  producing: false,
                  consuming: true,
                  sctpCapabilities: this._useDataChannel ? this._mediasoupDevice.sctpCapabilities : undefined
                });

              case 28:
                _transportInfo = _context45.sent;
                _id4 = _transportInfo.id, _iceParameters2 = _transportInfo.iceParameters, _iceCandidates = _transportInfo.iceCandidates, _dtlsParameters = _transportInfo.dtlsParameters, _sctpParameters = _transportInfo.sctpParameters;
                this._recvTransport = this._mediasoupDevice.createRecvTransport({
                  id: _id4,
                  iceParameters: _iceParameters2,
                  iceCandidates: _iceCandidates,
                  dtlsParameters: _dtlsParameters,
                  sctpParameters: _sctpParameters
                });

                this._recvTransport.on('connect', function (_ref12, callback, errback) // eslint-disable-line no-shadow
                {
                  var dtlsParameters = _ref12.dtlsParameters;

                  _this7._protoo.request('connectWebRtcTransport', {
                    transportId: _this7._recvTransport.id,
                    dtlsParameters: dtlsParameters
                  }).then(callback)["catch"](errback);
                });

              case 32:
                _context45.next = 34;
                return this._protoo.request('join', {
                  displayName: this._displayName,
                  device: this._device,
                  rtpCapabilities: this._consume ? this._mediasoupDevice.rtpCapabilities : undefined,
                  sctpCapabilities: this._useDataChannel && this._consume ? this._mediasoupDevice.sctpCapabilities : undefined
                });

              case 34:
                _ref13 = _context45.sent;
                peers = _ref13.peers;
                store.dispatch(stateActions.setRoomState('connected')); // Clean all the existing notifcations.

                store.dispatch(stateActions.removeAllNotifications());
                store.dispatch(requestActions.notify({
                  text: 'You are in the room!',
                  timeout: 3000
                }));
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context45.prev = 42;

                for (_iterator3 = peers[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  peer = _step3.value;
                  store.dispatch(stateActions.addPeer(_objectSpread({}, peer, {
                    consumers: [],
                    dataConsumers: []
                  })));
                } // Enable mic/webcam.


                _context45.next = 50;
                break;

              case 46:
                _context45.prev = 46;
                _context45.t0 = _context45["catch"](42);
                _didIteratorError3 = true;
                _iteratorError3 = _context45.t0;

              case 50:
                _context45.prev = 50;
                _context45.prev = 51;

                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }

              case 53:
                _context45.prev = 53;

                if (!_didIteratorError3) {
                  _context45.next = 56;
                  break;
                }

                throw _iteratorError3;

              case 56:
                return _context45.finish(53);

              case 57:
                return _context45.finish(50);

              case 58:
                if (this._produce) {
                  // Set our media capabilities.
                  store.dispatch(stateActions.setMediaCapabilities({
                    canSendMic: this._mediasoupDevice.canProduce('audio'),
                    canSendWebcam: this._mediasoupDevice.canProduce('video')
                  }));
                  this.enableMic();
                  devicesCookie = cookiesManager.getDevices();
                  if (!devicesCookie || devicesCookie.webcamEnabled || this._externalVideo) this.enableWebcam();

                  this._sendTransport.on('connectionstatechange', function (connectionState) {
                    if (connectionState === 'connected') {
                      _this7.enableChatDataProducer();

                      _this7.enableBotDataProducer();
                    }
                  });
                } // NOTE: For testing.


                if (window.SHOW_INFO) {
                  _store$getState2 = store.getState(), me = _store$getState2.me;
                  store.dispatch(stateActions.setRoomStatsPeerId(me.id));
                }

                _context45.next = 67;
                break;

              case 62:
                _context45.prev = 62;
                _context45.t1 = _context45["catch"](1);
                logger.error('_joinRoom() failed:%o', _context45.t1);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Could not join the room: ".concat(_context45.t1)
                }));
                this.close();

              case 67:
              case "end":
                return _context45.stop();
            }
          }
        }, _callee45, this, [[1, 62], [42, 46, 50, 58], [51,, 53, 57]]);
      }));

      function _joinRoom() {
        return _joinRoom2.apply(this, arguments);
      }

      return _joinRoom;
    }()
  }, {
    key: "_updateWebcams",
    value: function () {
      var _updateWebcams2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee46() {
        var devices, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, device, array, len, currentWebcamId;

        return _regenerator["default"].wrap(function _callee46$(_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                logger.debug('_updateWebcams()'); // Reset the list.

                this._webcams = new Map();
                logger.debug('_updateWebcams() | calling enumerateDevices()');
                _context46.next = 5;
                return navigator.mediaDevices.enumerateDevices();

              case 5:
                devices = _context46.sent;
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context46.prev = 9;
                _iterator4 = devices[Symbol.iterator]();

              case 11:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context46.next = 19;
                  break;
                }

                device = _step4.value;

                if (!(device.kind !== 'videoinput')) {
                  _context46.next = 15;
                  break;
                }

                return _context46.abrupt("continue", 16);

              case 15:
                this._webcams.set(device.deviceId, device);

              case 16:
                _iteratorNormalCompletion4 = true;
                _context46.next = 11;
                break;

              case 19:
                _context46.next = 25;
                break;

              case 21:
                _context46.prev = 21;
                _context46.t0 = _context46["catch"](9);
                _didIteratorError4 = true;
                _iteratorError4 = _context46.t0;

              case 25:
                _context46.prev = 25;
                _context46.prev = 26;

                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }

              case 28:
                _context46.prev = 28;

                if (!_didIteratorError4) {
                  _context46.next = 31;
                  break;
                }

                throw _iteratorError4;

              case 31:
                return _context46.finish(28);

              case 32:
                return _context46.finish(25);

              case 33:
                array = Array.from(this._webcams.values());
                len = array.length;
                currentWebcamId = this._webcam.device ? this._webcam.device.deviceId : undefined;
                logger.debug('_updateWebcams() [webcams:%o]', array);
                if (len === 0) this._webcam.device = null;else if (!this._webcams.has(currentWebcamId)) this._webcam.device = array[0];
                store.dispatch(stateActions.setCanChangeWebcam(this._webcams.size > 1));

              case 39:
              case "end":
                return _context46.stop();
            }
          }
        }, _callee46, this, [[9, 21, 25, 33], [26,, 28, 32]]);
      }));

      function _updateWebcams() {
        return _updateWebcams2.apply(this, arguments);
      }

      return _updateWebcams;
    }()
  }, {
    key: "_getWebcamType",
    value: function _getWebcamType(device) {
      if (/(back|rear)/i.test(device.label)) {
        logger.debug('_getWebcamType() | it seems to be a back camera');
        return 'back';
      } else {
        logger.debug('_getWebcamType() | it seems to be a front camera');
        return 'front';
      }
    }
  }, {
    key: "_pauseConsumer",
    value: function () {
      var _pauseConsumer2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee47(consumer) {
        return _regenerator["default"].wrap(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                if (!consumer.paused) {
                  _context47.next = 2;
                  break;
                }

                return _context47.abrupt("return");

              case 2:
                _context47.prev = 2;
                _context47.next = 5;
                return this._protoo.request('pauseConsumer', {
                  consumerId: consumer.id
                });

              case 5:
                consumer.pause();
                store.dispatch(stateActions.setConsumerPaused(consumer.id, 'local'));
                _context47.next = 13;
                break;

              case 9:
                _context47.prev = 9;
                _context47.t0 = _context47["catch"](2);
                logger.error('_pauseConsumer() | failed:%o', _context47.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error pausing Consumer: ".concat(_context47.t0)
                }));

              case 13:
              case "end":
                return _context47.stop();
            }
          }
        }, _callee47, this, [[2, 9]]);
      }));

      function _pauseConsumer(_x25) {
        return _pauseConsumer2.apply(this, arguments);
      }

      return _pauseConsumer;
    }()
  }, {
    key: "_resumeConsumer",
    value: function () {
      var _resumeConsumer2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee48(consumer) {
        return _regenerator["default"].wrap(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                if (consumer.paused) {
                  _context48.next = 2;
                  break;
                }

                return _context48.abrupt("return");

              case 2:
                _context48.prev = 2;
                _context48.next = 5;
                return this._protoo.request('resumeConsumer', {
                  consumerId: consumer.id
                });

              case 5:
                consumer.resume();
                store.dispatch(stateActions.setConsumerResumed(consumer.id, 'local'));
                _context48.next = 13;
                break;

              case 9:
                _context48.prev = 9;
                _context48.t0 = _context48["catch"](2);
                logger.error('_resumeConsumer() | failed:%o', _context48.t0);
                store.dispatch(requestActions.notify({
                  type: 'error',
                  text: "Error resuming Consumer: ".concat(_context48.t0)
                }));

              case 13:
              case "end":
                return _context48.stop();
            }
          }
        }, _callee48, this, [[2, 9]]);
      }));

      function _resumeConsumer(_x26) {
        return _resumeConsumer2.apply(this, arguments);
      }

      return _resumeConsumer;
    }()
  }, {
    key: "_getExternalVideoStream",
    value: function () {
      var _getExternalVideoStream2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee49() {
        var _this8 = this;

        return _regenerator["default"].wrap(function _callee49$(_context49) {
          while (1) {
            switch (_context49.prev = _context49.next) {
              case 0:
                if (!this._externalVideoStream) {
                  _context49.next = 2;
                  break;
                }

                return _context49.abrupt("return", this._externalVideoStream);

              case 2:
                if (!(this._externalVideo.readyState < 3)) {
                  _context49.next = 5;
                  break;
                }

                _context49.next = 5;
                return new Promise(function (resolve) {
                  return _this8._externalVideo.addEventListener('canplay', resolve);
                });

              case 5:
                if (!this._externalVideo.captureStream) {
                  _context49.next = 9;
                  break;
                }

                this._externalVideoStream = this._externalVideo.captureStream();
                _context49.next = 14;
                break;

              case 9:
                if (!this._externalVideo.mozCaptureStream) {
                  _context49.next = 13;
                  break;
                }

                this._externalVideoStream = this._externalVideo.mozCaptureStream();
                _context49.next = 14;
                break;

              case 13:
                throw new Error('video.captureStream() not supported');

              case 14:
                return _context49.abrupt("return", this._externalVideoStream);

              case 15:
              case "end":
                return _context49.stop();
            }
          }
        }, _callee49, this);
      }));

      function _getExternalVideoStream() {
        return _getExternalVideoStream2.apply(this, arguments);
      }

      return _getExternalVideoStream;
    }()
  }]);
  return RoomClient;
}();

exports["default"] = RoomClient;
},{"./Logger":1,"./cookiesManager":3,"./redux/requestActions":15,"./redux/stateActions":16,"./urlFactory":17,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/interopRequireWildcard":25,"@babel/runtime/helpers/objectWithoutProperties":28,"@babel/runtime/regenerator":32,"mediasoup-client":65,"protoo-client":76}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = getUser;
exports.setUser = setUser;
exports.getDevices = getDevices;
exports.setDevices = setDevices;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var USER_COOKIE = 'mediasoup-demo.user';
var DEVICES_COOKIE = 'mediasoup-demo.devices';

function getUser() {
  return _jsCookie["default"].getJSON(USER_COOKIE);
}

function setUser(_ref) {
  var displayName = _ref.displayName;

  _jsCookie["default"].set(USER_COOKIE, {
    displayName: displayName
  });
}

function getDevices() {
  return _jsCookie["default"].getJSON(DEVICES_COOKIE);
}

function setDevices(_ref2) {
  var webcamEnabled = _ref2.webcamEnabled;

  _jsCookie["default"].set(DEVICES_COOKIE, {
    webcamEnabled: webcamEnabled
  });
}
},{"@babel/runtime/helpers/interopRequireDefault":24,"js-cookie":39}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _bowser = _interopRequireDefault(require("bowser"));

// TODO: For testing.
window.BOWSER = _bowser["default"];

function _default() {
  var ua = navigator.userAgent;

  var browser = _bowser["default"].getParser(ua);

  var flag;
  if (browser.satisfies({
    chrome: '>=0',
    chromium: '>=0'
  })) flag = 'chrome';else if (browser.satisfies({
    firefox: '>=0'
  })) flag = 'firefox';else if (browser.satisfies({
    safari: '>=0'
  })) flag = 'safari';else if (browser.satisfies({
    opera: '>=0'
  })) flag = 'opera';else if (browser.satisfies({
    'microsoft edge': '>=0'
  })) flag = 'edge';else flag = 'unknown';
  return {
    flag: flag,
    name: browser.getBrowserName(),
    version: browser.getBrowserVersion()
  };
}
},{"@babel/runtime/helpers/interopRequireDefault":24,"bowser":34}],5:[function(require,module,exports){
(function (process,global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Init = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _urlParse = _interopRequireDefault(require("url-parse"));

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _Logger = _interopRequireDefault(require("./Logger"));

var utils = _interopRequireWildcard(require("./utils"));

var _deviceInfo = _interopRequireDefault(require("./deviceInfo"));

var _RoomClient = _interopRequireDefault(require("./RoomClient"));

var stateActions = _interopRequireWildcard(require("./redux/stateActions"));

var _reducers = _interopRequireDefault(require("./redux/reducers"));

var emitter = _interopRequireWildcard(require("wildemitter"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var version = "0.0.1";
console.warn("Mediasoup-v3 lite client version ".concat(version));

var Init = function Init(config) {
  var _this = this;

  (0, _classCallCheck2["default"])(this, Init);
  var logger = new _Logger["default"]();
  var reduxMiddlewares = [_reduxThunk["default"]];
  global.emitter = this.emitter = new emitter["default"](); // if (process.env.NODE_ENV === 'development')
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

  var roomClient;
  var store = this.store = (0, _redux.createStore)(_reducers["default"], undefined, _redux.applyMiddleware.apply(void 0, reduxMiddlewares));
  window.STORE = store;

  _RoomClient["default"].init({
    store: store
  });

  utils.initialize();
  this.run =
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var urlParser, peerId, roomId, displayName, media_server_wss, video_constrains, video_encodings, turnservers, handler, useSimulcast, useSharingSimulcast, forceTcp, produce, consume, forceH264, forceVP9, svc, datachannel, info, faceDetection, externalVideo, throttleSecret, camDeviceId, micDeviceId, args, roomUrlParser, _i, _Object$keys, key, roomUrl, displayNameSet, device, roomClientConfig;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            logger.debug('run() [environment:%s]', process.env.NODE_ENV);
            urlParser = new _urlParse["default"](window.location.href, true);
            peerId = config.peerId || Math.round(Math.random() * 1e8).toString();
            roomId = config.roomId;
            displayName = config.displayName;
            media_server_wss = config.media_server_wss;
            video_constrains = config.video_constrains;
            video_encodings = config.video_encodings;
            turnservers = config.turnservers;
            handler = urlParser.query.handler;
            useSimulcast = config.useSimulcast || urlParser.query.simulcast !== 'false';
            useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
            forceTcp = urlParser.query.forceTcp === 'true';
            produce = config.produce == true;
            consume = config.consume == true;
            forceH264 = urlParser.query.forceH264 === 'true';
            forceVP9 = urlParser.query.forceVP9 === 'true';
            svc = urlParser.query.svc;
            datachannel = urlParser.query.datachannel !== 'false';
            info = urlParser.query.info === 'true';
            faceDetection = urlParser.query.faceDetection === 'true';
            externalVideo = urlParser.query.externalVideo === 'true';
            throttleSecret = urlParser.query.throttleSecret;
            camDeviceId = config.cam_device_id;
            micDeviceId = config.mic_device_id;
            args = {
              video_constrains: video_constrains,
              video_encodings: video_encodings,
              turnservers: turnservers,
              camDeviceId: camDeviceId,
              micDeviceId: micDeviceId
            };

            if (info) {
              // eslint-disable-next-line require-atomic-updates
              window.SHOW_INFO = true;
            }

            if (throttleSecret) {
              // eslint-disable-next-line require-atomic-updates
              window.NETWORK_THROTTLE_SECRET = throttleSecret;
            }

            if (!roomId) {
              roomId = randomString({
                length: 8
              }).toLowerCase();
              urlParser.query.roomId = roomId;
              window.history.pushState('', '', urlParser.toString());
            } // Get the effective/shareable Room URL.


            roomUrlParser = new _urlParse["default"](window.location.href, true);
            _i = 0, _Object$keys = Object.keys(roomUrlParser.query);

          case 31:
            if (!(_i < _Object$keys.length)) {
              _context.next = 41;
              break;
            }

            key = _Object$keys[_i];
            _context.t0 = key;
            _context.next = _context.t0 === 'roomId' ? 36 : _context.t0 === 'simulcast' ? 36 : _context.t0 === 'sharingSimulcast' ? 36 : _context.t0 === 'produce' ? 36 : _context.t0 === 'consume' ? 36 : _context.t0 === 'forceH264' ? 36 : _context.t0 === 'forceVP9' ? 36 : _context.t0 === 'forceTcp' ? 36 : _context.t0 === 'svc' ? 36 : _context.t0 === 'datachannel' ? 36 : _context.t0 === 'info' ? 36 : _context.t0 === 'faceDetection' ? 36 : _context.t0 === 'externalVideo' ? 36 : _context.t0 === 'throttleSecret' ? 36 : 37;
            break;

          case 36:
            return _context.abrupt("break", 38);

          case 37:
            delete roomUrlParser.query[key];

          case 38:
            _i++;
            _context.next = 31;
            break;

          case 41:
            delete roomUrlParser.hash;
            roomUrl = roomUrlParser.toString();

            // If displayName was provided via URL or Cookie, we are done.
            if (displayName) {
              displayNameSet = true;
            } // Otherwise pick a random name and mark as "not set".
            else {
                displayNameSet = false;
              } // Get current device info.


            device = (0, _deviceInfo["default"])();
            store.dispatch(stateActions.setRoomUrl(roomUrl));
            store.dispatch(stateActions.setRoomFaceDetection(faceDetection));
            store.dispatch(stateActions.setMe({
              peerId: peerId,
              displayName: displayName,
              displayNameSet: displayNameSet,
              device: device
            }));
            roomClientConfig = _objectSpread({
              roomId: roomId,
              peerId: peerId,
              displayName: displayName,
              device: device,
              handler: handler,
              useSimulcast: useSimulcast,
              useSharingSimulcast: useSharingSimulcast,
              forceTcp: forceTcp,
              produce: produce,
              consume: consume,
              forceH264: forceH264,
              forceVP9: forceVP9,
              svc: svc,
              datachannel: datachannel,
              externalVideo: externalVideo,
              media_server_wss: media_server_wss
            }, args);
            console.log(roomClientConfig);
            _this.client = roomClient = new _RoomClient["default"](roomClientConfig); // NOTE: For debugging.

            window.CLIENT = roomClient; // eslint-disable-line require-atomic-updates

            window.CC = roomClient; // eslint-disable-line require-atomic-updates

          case 53:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  if (config.autorun) {
    this.run();
  } // NOTE: Debugging stuff.
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

};

exports.Init = Init;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Logger":1,"./RoomClient":2,"./deviceInfo":4,"./redux/reducers":9,"./redux/stateActions":16,"./utils":18,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/interopRequireWildcard":25,"@babel/runtime/regenerator":32,"_process":71,"redux":82,"redux-thunk":81,"url-parse":94,"wildemitter":98}],6:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {};

var consumers = function consumers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        if (roomState === 'closed') return {};else return state;
      }

    case 'ADD_CONSUMER':
      {
        var consumer = action.payload.consumer;
        global.emitter.emit("ADD_CONSUMER", action.payload);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, consumer.id, consumer));
      }

    case 'REMOVE_CONSUMER':
      {
        var consumerId = action.payload.consumerId;

        var newState = _objectSpread({}, state);

        delete newState[consumerId];
        global.emitter.emit("REMOVE_CONSUMER", action.payload);
        return newState;
      }

    case 'SET_CONSUMER_PAUSED':
      {
        var _action$payload = action.payload,
            _consumerId = _action$payload.consumerId,
            originator = _action$payload.originator;
        var _consumer = state[_consumerId];
        var newConsumer;
        if (originator === 'local') newConsumer = _objectSpread({}, _consumer, {
          locallyPaused: true
        });else newConsumer = _objectSpread({}, _consumer, {
          remotelyPaused: true
        });
        global.emitter.emit("SET_CONSUMER_PAUSED", action.payload);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId, newConsumer));
      }

    case 'SET_CONSUMER_RESUMED':
      {
        var _action$payload2 = action.payload,
            _consumerId2 = _action$payload2.consumerId,
            _originator = _action$payload2.originator;
        var _consumer2 = state[_consumerId2];

        var _newConsumer;

        if (_originator === 'local') _newConsumer = _objectSpread({}, _consumer2, {
          locallyPaused: false
        });else _newConsumer = _objectSpread({}, _consumer2, {
          remotelyPaused: false
        });
        global.emitter.emit("SET_CONSUMER_RESUMED", action.payload);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId2, _newConsumer));
      }

    case 'SET_CONSUMER_CURRENT_LAYERS':
      {
        var _action$payload3 = action.payload,
            _consumerId3 = _action$payload3.consumerId,
            spatialLayer = _action$payload3.spatialLayer,
            temporalLayer = _action$payload3.temporalLayer;
        var _consumer3 = state[_consumerId3];

        var _newConsumer2 = _objectSpread({}, _consumer3, {
          currentSpatialLayer: spatialLayer,
          currentTemporalLayer: temporalLayer
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId3, _newConsumer2));
      }

    case 'SET_CONSUMER_PREFERRED_LAYERS':
      {
        var _action$payload4 = action.payload,
            _consumerId4 = _action$payload4.consumerId,
            _spatialLayer = _action$payload4.spatialLayer,
            _temporalLayer = _action$payload4.temporalLayer;
        var _consumer4 = state[_consumerId4];

        var _newConsumer3 = _objectSpread({}, _consumer4, {
          preferredSpatialLayer: _spatialLayer,
          preferredTemporalLayer: _temporalLayer
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId4, _newConsumer3));
      }

    case 'SET_CONSUMER_PRIORITY':
      {
        var _action$payload5 = action.payload,
            _consumerId5 = _action$payload5.consumerId,
            priority = _action$payload5.priority;
        var _consumer5 = state[_consumerId5];

        var _newConsumer4 = _objectSpread({}, _consumer5, {
          priority: priority
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId5, _newConsumer4));
      }

    case 'SET_CONSUMER_TRACK':
      {
        var _action$payload6 = action.payload,
            _consumerId6 = _action$payload6.consumerId,
            track = _action$payload6.track;
        var _consumer6 = state[_consumerId6];

        var _newConsumer5 = _objectSpread({}, _consumer6, {
          track: track
        });

        global.emitter.emit("SET_CONSUMER_TRACK", _newConsumer5);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId6, _newConsumer5));
      }

    case 'SET_CONSUMER_SCORE':
      {
        var _action$payload7 = action.payload,
            _consumerId7 = _action$payload7.consumerId,
            score = _action$payload7.score;
        var _consumer7 = state[_consumerId7];
        if (!_consumer7) return state;

        var _newConsumer6 = _objectSpread({}, _consumer7, {
          score: score
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _consumerId7, _newConsumer6));
      }

    default:
      {
        return state;
      }
  }
};

var _default = consumers;
exports["default"] = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {};

var dataConsumers = function dataConsumers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        if (roomState === 'closed') return {};else return state;
      }

    case 'ADD_DATA_CONSUMER':
      {
        var dataConsumer = action.payload.dataConsumer;
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, dataConsumer.id, dataConsumer));
      }

    case 'REMOVE_DATA_CONSUMER':
      {
        var dataConsumerId = action.payload.dataConsumerId;

        var newState = _objectSpread({}, state);

        delete newState[dataConsumerId];
        return newState;
      }

    default:
      {
        return state;
      }
  }
};

var _default = dataConsumers;
exports["default"] = _default;
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {};

var dataProducers = function dataProducers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        if (roomState === 'closed') return {};else return state;
      }

    case 'ADD_DATA_PRODUCER':
      {
        var dataProducer = action.payload.dataProducer;
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, dataProducer.id, dataProducer));
      }

    case 'REMOVE_DATA_PRODUCER':
      {
        var dataProducerId = action.payload.dataProducerId;

        var newState = _objectSpread({}, state);

        delete newState[dataProducerId];
        return newState;
      }

    default:
      {
        return state;
      }
  }
};

var _default = dataProducers;
exports["default"] = _default;
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _room = _interopRequireDefault(require("./room"));

var _me = _interopRequireDefault(require("./me"));

var _producers = _interopRequireDefault(require("./producers"));

var _dataProducers = _interopRequireDefault(require("./dataProducers"));

var _peers = _interopRequireDefault(require("./peers"));

var _consumers = _interopRequireDefault(require("./consumers"));

var _dataConsumers = _interopRequireDefault(require("./dataConsumers"));

var _notifications = _interopRequireDefault(require("./notifications"));

var reducers = (0, _redux.combineReducers)({
  room: _room["default"],
  me: _me["default"],
  producers: _producers["default"],
  dataProducers: _dataProducers["default"],
  peers: _peers["default"],
  consumers: _consumers["default"],
  dataConsumers: _dataConsumers["default"],
  notifications: _notifications["default"]
});
var _default = reducers;
exports["default"] = _default;
},{"./consumers":6,"./dataConsumers":7,"./dataProducers":8,"./me":10,"./notifications":11,"./peers":12,"./producers":13,"./room":14,"@babel/runtime/helpers/interopRequireDefault":24,"redux":82}],10:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {
  id: null,
  displayName: null,
  displayNameSet: false,
  device: null,
  canSendMic: false,
  canSendWebcam: false,
  canChangeWebcam: false,
  webcamInProgress: false,
  shareInProgress: false,
  audioOnly: false,
  audioOnlyInProgress: false,
  audioMuted: false,
  restartIceInProgress: false
};

var me = function me() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;

        if (roomState === 'closed') {
          return _objectSpread({}, state, {
            webcamInProgress: false,
            shareInProgress: false,
            audioOnly: false,
            audioOnlyInProgress: false,
            audioMuted: false,
            restartIceInProgress: false
          });
        } else {
          return state;
        }
      }

    case 'SET_ME':
      {
        var _action$payload = action.payload,
            peerId = _action$payload.peerId,
            displayName = _action$payload.displayName,
            displayNameSet = _action$payload.displayNameSet,
            device = _action$payload.device;
        global.emitter.emit("SET_ME", action.payload);
        return _objectSpread({}, state, {
          id: peerId,
          displayName: displayName,
          displayNameSet: displayNameSet,
          device: device
        });
      }

    case 'SET_MEDIA_CAPABILITIES':
      {
        var _action$payload2 = action.payload,
            canSendMic = _action$payload2.canSendMic,
            canSendWebcam = _action$payload2.canSendWebcam;
        return _objectSpread({}, state, {
          canSendMic: canSendMic,
          canSendWebcam: canSendWebcam
        });
      }

    case 'SET_CAN_CHANGE_WEBCAM':
      {
        var canChangeWebcam = action.payload;
        global.emitter.emit("SET_CAN_CHANGE_WEBCAM", action.payload);
        return _objectSpread({}, state, {
          canChangeWebcam: canChangeWebcam
        });
      }

    case 'SET_WEBCAM_IN_PROGRESS':
      {
        var flag = action.payload.flag;
        global.emitter.emit("SET_WEBCAM_IN_PROGRESS", action.payload);
        return _objectSpread({}, state, {
          webcamInProgress: flag
        });
      }

    case 'SET_SHARE_IN_PROGRESS':
      {
        var _flag = action.payload.flag;
        return _objectSpread({}, state, {
          shareInProgress: _flag
        });
      }

    case 'SET_DISPLAY_NAME':
      {
        var _displayName = action.payload.displayName; // Be ready for undefined displayName (so keep previous one).

        if (!_displayName) _displayName = state.displayName;
        return _objectSpread({}, state, {
          displayName: _displayName,
          displayNameSet: true
        });
      }

    case 'SET_AUDIO_ONLY_STATE':
      {
        var enabled = action.payload.enabled;
        return _objectSpread({}, state, {
          audioOnly: enabled
        });
      }

    case 'SET_AUDIO_ONLY_IN_PROGRESS':
      {
        var _flag2 = action.payload.flag;
        return _objectSpread({}, state, {
          audioOnlyInProgress: _flag2
        });
      }

    case 'SET_AUDIO_MUTED_STATE':
      {
        var _enabled = action.payload.enabled;
        return _objectSpread({}, state, {
          audioMuted: _enabled
        });
      }

    case 'SET_RESTART_ICE_IN_PROGRESS':
      {
        var _flag3 = action.payload.flag;
        return _objectSpread({}, state, {
          restartIceInProgress: _flag3
        });
      }

    default:
      return state;
  }
};

var _default = me;
exports["default"] = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],11:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var initialState = [];

var notifications = function notifications() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ADD_NOTIFICATION':
      {
        var notification = action.payload.notification;
        return [].concat((0, _toConsumableArray2["default"])(state), [notification]);
      }

    case 'REMOVE_NOTIFICATION':
      {
        var notificationId = action.payload.notificationId;
        return state.filter(function (notification) {
          return notification.id !== notificationId;
        });
      }

    case 'REMOVE_ALL_NOTIFICATIONS':
      {
        return [];
      }

    default:
      return state;
  }
};

var _default = notifications;
exports["default"] = _default;
},{"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/toConsumableArray":30}],12:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {};

var peers = function peers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        if (roomState === 'closed') return {};else return state;
      }

    case 'ADD_PEER':
      {
        var peer = action.payload.peer;
        global.emitter.emit("peerAdded", peer);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, peer.id, peer));
      }

    case 'REMOVE_PEER':
      {
        var peerId = action.payload.peerId;

        var newState = _objectSpread({}, state);

        delete newState[peerId];
        global.emitter.emit("peerRemoved", peerId);
        return newState;
      }

    case 'SET_PEER_DISPLAY_NAME':
      {
        var _action$payload = action.payload,
            displayName = _action$payload.displayName,
            _peerId = _action$payload.peerId;
        var _peer = state[_peerId];
        if (!_peer) throw new Error('no Peer found');

        var newPeer = _objectSpread({}, _peer, {
          displayName: displayName
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, newPeer.id, newPeer));
      }

    case 'ADD_CONSUMER':
      {
        var _action$payload2 = action.payload,
            consumer = _action$payload2.consumer,
            _peerId2 = _action$payload2.peerId;
        var _peer2 = state[_peerId2];
        if (!_peer2) throw new Error('no Peer found for new Consumer');
        var newConsumers = [].concat((0, _toConsumableArray2["default"])(_peer2.consumers), [consumer.id]);

        var _newPeer = _objectSpread({}, _peer2, {
          consumers: newConsumers
        });

        global.emitter.emit("peerConsumerAdded", _newPeer);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _newPeer.id, _newPeer));
      }

    case 'REMOVE_CONSUMER':
      {
        var _action$payload3 = action.payload,
            consumerId = _action$payload3.consumerId,
            _peerId3 = _action$payload3.peerId;
        var _peer3 = state[_peerId3]; // NOTE: This means that the Peer was closed before, so it's ok.

        if (!_peer3) return state;

        var idx = _peer3.consumers.indexOf(consumerId);

        if (idx === -1) throw new Error('Consumer not found');

        var _newConsumers = _peer3.consumers.slice();

        _newConsumers.splice(idx, 1);

        var _newPeer2 = _objectSpread({}, _peer3, {
          consumers: _newConsumers
        });

        global.emitter.emit("peerConsumerRemoved", _newPeer2);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _newPeer2.id, _newPeer2));
      }

    case 'ADD_DATA_CONSUMER':
      {
        var _action$payload4 = action.payload,
            dataConsumer = _action$payload4.dataConsumer,
            _peerId4 = _action$payload4.peerId; // special case for bot DataConsumer.

        if (!_peerId4) return state;
        var _peer4 = state[_peerId4];
        if (!_peer4) throw new Error('no Peer found for new DataConsumer');
        var newDataConsumers = [].concat((0, _toConsumableArray2["default"])(_peer4.dataConsumers), [dataConsumer.id]);

        var _newPeer3 = _objectSpread({}, _peer4, {
          dataConsumers: newDataConsumers
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _newPeer3.id, _newPeer3));
      }

    case 'REMOVE_DATA_CONSUMER':
      {
        var _action$payload5 = action.payload,
            dataConsumerId = _action$payload5.dataConsumerId,
            _peerId5 = _action$payload5.peerId; // special case for bot DataConsumer.

        if (!_peerId5) return state;
        var _peer5 = state[_peerId5]; // NOTE: This means that the Peer was closed before, so it's ok.

        if (!_peer5) return state;

        var _idx = _peer5.dataConsumers.indexOf(dataConsumerId);

        if (_idx === -1) throw new Error('DataConsumer not found');

        var _newDataConsumers = _peer5.dataConsumers.slice();

        _newDataConsumers.splice(_idx, 1);

        var _newPeer4 = _objectSpread({}, _peer5, {
          dataConsumers: _newDataConsumers
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _newPeer4.id, _newPeer4));
      }

    default:
      {
        return state;
      }
  }
};

var _default = peers;
exports["default"] = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24,"@babel/runtime/helpers/toConsumableArray":30}],13:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {};

var producers = function producers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        if (roomState === 'closed') return {};else return state;
      }

    case 'ADD_PRODUCER':
      {
        var producer = action.payload.producer;
        global.emitter.emit("ADD_PRODUCER", producer);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, producer.id, producer));
      }

    case 'REMOVE_PRODUCER':
      {
        var producerId = action.payload.producerId;

        var newState = _objectSpread({}, state);

        delete newState[producerId];
        global.emitter.emit("REMOVE_PRODUCER", producerId);
        return newState;
      }

    case 'SET_PRODUCER_PAUSED':
      {
        var _producerId = action.payload.producerId;
        var _producer = state[_producerId];

        var newProducer = _objectSpread({}, _producer, {
          paused: true
        });

        global.emitter.emit("SET_PRODUCER_PAUSED", newProducer);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _producerId, newProducer));
      }

    case 'SET_PRODUCER_RESUMED':
      {
        var _producerId2 = action.payload.producerId;
        var _producer2 = state[_producerId2];

        var _newProducer = _objectSpread({}, _producer2, {
          paused: false
        });

        global.emitter.emit("SET_PRODUCER_RESUMED", _newProducer);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _producerId2, _newProducer));
      }

    case 'SET_PRODUCER_TRACK':
      {
        var _action$payload = action.payload,
            _producerId3 = _action$payload.producerId,
            track = _action$payload.track;
        var _producer3 = state[_producerId3];

        var _newProducer2 = _objectSpread({}, _producer3, {
          track: track
        });

        global.emitter.emit("SET_PRODUCER_TRACK", _newProducer2);
        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _producerId3, _newProducer2));
      }

    case 'SET_PRODUCER_SCORE':
      {
        var _action$payload2 = action.payload,
            _producerId4 = _action$payload2.producerId,
            score = _action$payload2.score;
        var _producer4 = state[_producerId4];
        if (!_producer4) return state;

        var _newProducer3 = _objectSpread({}, _producer4, {
          score: score
        });

        return _objectSpread({}, state, (0, _defineProperty2["default"])({}, _producerId4, _newProducer3));
      }

    default:
      {
        return state;
      }
  }
};

var _default = producers;
exports["default"] = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],14:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var initialState = {
  url: null,
  state: 'new',
  // new/connecting/connected/disconnected/closed,
  activeSpeakerId: null,
  statsPeerId: null,
  faceDetection: false
};

var room = function room() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ROOM_URL':
      {
        var url = action.payload.url;
        return _objectSpread({}, state, {
          url: url
        });
      }

    case 'SET_ROOM_STATE':
      {
        var roomState = action.payload.state;
        global.emitter.emit("SET_ROOM_STATE", roomState);
        if (roomState === 'connected') return _objectSpread({}, state, {
          state: roomState
        });else return _objectSpread({}, state, {
          state: roomState,
          activeSpeakerId: null,
          statsPeerId: null
        });
      }

    case 'SET_ROOM_ACTIVE_SPEAKER':
      {
        var peerId = action.payload.peerId;
        global.emitter.emit("SET_ROOM_ACTIVE_SPEAKER", peerId);
        return _objectSpread({}, state, {
          activeSpeakerId: peerId
        });
      }

    case 'SET_ROOM_STATS_PEER_ID':
      {
        var _peerId = action.payload.peerId;
        if (state.statsPeerId === _peerId) return _objectSpread({}, state, {
          statsPeerId: null
        });
        return _objectSpread({}, state, {
          statsPeerId: _peerId
        });
      }

    case 'SET_FACE_DETECTION':
      {
        var flag = action.payload;
        return _objectSpread({}, state, {
          faceDetection: flag
        });
      }

    case 'REMOVE_PEER':
      {
        var _peerId2 = action.payload.peerId;

        var newState = _objectSpread({}, state);

        if (_peerId2 && _peerId2 === state.activeSpeakerId) newState.activeSpeakerId = null;
        if (_peerId2 && _peerId2 === state.statsPeerId) newState.statsPeerId = null;
        return newState;
      }

    default:
      return state;
  }
};

var _default = room;
exports["default"] = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"@babel/runtime/helpers/defineProperty":23,"@babel/runtime/helpers/interopRequireDefault":24}],15:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notify = void 0;

var stateActions = _interopRequireWildcard(require("./stateActions"));

// This returns a redux-thunk action (a function).
var notify = function notify(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'info' : _ref$type,
      text = _ref.text,
      title = _ref.title,
      timeout = _ref.timeout;

  if (!timeout) {
    switch (type) {
      case 'info':
        timeout = 3000;
        break;

      case 'error':
        timeout = 5000;
        break;
    }
  }

  var notification = {
    id: Math.round(Math.random() * 1e6).toString(),
    type: type,
    title: title,
    text: text,
    timeout: timeout
  };
  return function (dispatch) {
    dispatch(stateActions.addNotification(notification));
    setTimeout(function () {
      dispatch(stateActions.removeNotification(notification.id));
    }, timeout);
  };
};

exports.notify = notify;
},{"./stateActions":16,"@babel/runtime/helpers/interopRequireWildcard":25}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAllNotifications = exports.removeNotification = exports.addNotification = exports.removeDataConsumer = exports.addDataConsumer = exports.setConsumerScore = exports.setConsumerTrack = exports.setConsumerPriority = exports.setConsumerPreferredLayers = exports.setConsumerCurrentLayers = exports.setConsumerResumed = exports.setConsumerPaused = exports.removeConsumer = exports.addConsumer = exports.setPeerDisplayName = exports.removePeer = exports.addPeer = exports.setShareInProgress = exports.setWebcamInProgress = exports.removeDataProducer = exports.addDataProducer = exports.setProducerScore = exports.setProducerTrack = exports.setProducerResumed = exports.setProducerPaused = exports.removeProducer = exports.addProducer = exports.setRestartIceInProgress = exports.setAudioMutedState = exports.setAudioOnlyInProgress = exports.setAudioOnlyState = exports.setDisplayName = exports.setCanChangeWebcam = exports.setMediaCapabilities = exports.setMe = exports.setRoomFaceDetection = exports.setRoomStatsPeerId = exports.setRoomActiveSpeaker = exports.setRoomState = exports.setRoomUrl = void 0;

var setRoomUrl = function setRoomUrl(url) {
  return {
    type: 'SET_ROOM_URL',
    payload: {
      url: url
    }
  };
};

exports.setRoomUrl = setRoomUrl;

var setRoomState = function setRoomState(state) {
  return {
    type: 'SET_ROOM_STATE',
    payload: {
      state: state
    }
  };
};

exports.setRoomState = setRoomState;

var setRoomActiveSpeaker = function setRoomActiveSpeaker(peerId) {
  return {
    type: 'SET_ROOM_ACTIVE_SPEAKER',
    payload: {
      peerId: peerId
    }
  };
};

exports.setRoomActiveSpeaker = setRoomActiveSpeaker;

var setRoomStatsPeerId = function setRoomStatsPeerId(peerId) {
  return {
    type: 'SET_ROOM_STATS_PEER_ID',
    payload: {
      peerId: peerId
    }
  };
};

exports.setRoomStatsPeerId = setRoomStatsPeerId;

var setRoomFaceDetection = function setRoomFaceDetection(flag) {
  return {
    type: 'SET_FACE_DETECTION',
    payload: flag
  };
};

exports.setRoomFaceDetection = setRoomFaceDetection;

var setMe = function setMe(_ref) {
  var peerId = _ref.peerId,
      displayName = _ref.displayName,
      displayNameSet = _ref.displayNameSet,
      device = _ref.device;
  return {
    type: 'SET_ME',
    payload: {
      peerId: peerId,
      displayName: displayName,
      displayNameSet: displayNameSet,
      device: device
    }
  };
};

exports.setMe = setMe;

var setMediaCapabilities = function setMediaCapabilities(_ref2) {
  var canSendMic = _ref2.canSendMic,
      canSendWebcam = _ref2.canSendWebcam;
  return {
    type: 'SET_MEDIA_CAPABILITIES',
    payload: {
      canSendMic: canSendMic,
      canSendWebcam: canSendWebcam
    }
  };
};

exports.setMediaCapabilities = setMediaCapabilities;

var setCanChangeWebcam = function setCanChangeWebcam(flag) {
  return {
    type: 'SET_CAN_CHANGE_WEBCAM',
    payload: flag
  };
};

exports.setCanChangeWebcam = setCanChangeWebcam;

var setDisplayName = function setDisplayName(displayName) {
  return {
    type: 'SET_DISPLAY_NAME',
    payload: {
      displayName: displayName
    }
  };
};

exports.setDisplayName = setDisplayName;

var setAudioOnlyState = function setAudioOnlyState(enabled) {
  return {
    type: 'SET_AUDIO_ONLY_STATE',
    payload: {
      enabled: enabled
    }
  };
};

exports.setAudioOnlyState = setAudioOnlyState;

var setAudioOnlyInProgress = function setAudioOnlyInProgress(flag) {
  return {
    type: 'SET_AUDIO_ONLY_IN_PROGRESS',
    payload: {
      flag: flag
    }
  };
};

exports.setAudioOnlyInProgress = setAudioOnlyInProgress;

var setAudioMutedState = function setAudioMutedState(enabled) {
  return {
    type: 'SET_AUDIO_MUTED_STATE',
    payload: {
      enabled: enabled
    }
  };
};

exports.setAudioMutedState = setAudioMutedState;

var setRestartIceInProgress = function setRestartIceInProgress(flag) {
  return {
    type: 'SET_RESTART_ICE_IN_PROGRESS',
    payload: {
      flag: flag
    }
  };
};

exports.setRestartIceInProgress = setRestartIceInProgress;

var addProducer = function addProducer(producer) {
  return {
    type: 'ADD_PRODUCER',
    payload: {
      producer: producer
    }
  };
};

exports.addProducer = addProducer;

var removeProducer = function removeProducer(producerId) {
  return {
    type: 'REMOVE_PRODUCER',
    payload: {
      producerId: producerId
    }
  };
};

exports.removeProducer = removeProducer;

var setProducerPaused = function setProducerPaused(producerId) {
  return {
    type: 'SET_PRODUCER_PAUSED',
    payload: {
      producerId: producerId
    }
  };
};

exports.setProducerPaused = setProducerPaused;

var setProducerResumed = function setProducerResumed(producerId) {
  return {
    type: 'SET_PRODUCER_RESUMED',
    payload: {
      producerId: producerId
    }
  };
};

exports.setProducerResumed = setProducerResumed;

var setProducerTrack = function setProducerTrack(producerId, track) {
  return {
    type: 'SET_PRODUCER_TRACK',
    payload: {
      producerId: producerId,
      track: track
    }
  };
};

exports.setProducerTrack = setProducerTrack;

var setProducerScore = function setProducerScore(producerId, score) {
  return {
    type: 'SET_PRODUCER_SCORE',
    payload: {
      producerId: producerId,
      score: score
    }
  };
};

exports.setProducerScore = setProducerScore;

var addDataProducer = function addDataProducer(dataProducer) {
  return {
    type: 'ADD_DATA_PRODUCER',
    payload: {
      dataProducer: dataProducer
    }
  };
};

exports.addDataProducer = addDataProducer;

var removeDataProducer = function removeDataProducer(dataProducerId) {
  return {
    type: 'REMOVE_DATA_PRODUCER',
    payload: {
      dataProducerId: dataProducerId
    }
  };
};

exports.removeDataProducer = removeDataProducer;

var setWebcamInProgress = function setWebcamInProgress(flag) {
  return {
    type: 'SET_WEBCAM_IN_PROGRESS',
    payload: {
      flag: flag
    }
  };
};

exports.setWebcamInProgress = setWebcamInProgress;

var setShareInProgress = function setShareInProgress(flag) {
  return {
    type: 'SET_SHARE_IN_PROGRESS',
    payload: {
      flag: flag
    }
  };
};

exports.setShareInProgress = setShareInProgress;

var addPeer = function addPeer(peer) {
  return {
    type: 'ADD_PEER',
    payload: {
      peer: peer
    }
  };
};

exports.addPeer = addPeer;

var removePeer = function removePeer(peerId) {
  return {
    type: 'REMOVE_PEER',
    payload: {
      peerId: peerId
    }
  };
};

exports.removePeer = removePeer;

var setPeerDisplayName = function setPeerDisplayName(displayName, peerId) {
  return {
    type: 'SET_PEER_DISPLAY_NAME',
    payload: {
      displayName: displayName,
      peerId: peerId
    }
  };
};

exports.setPeerDisplayName = setPeerDisplayName;

var addConsumer = function addConsumer(consumer, peerId) {
  return {
    type: 'ADD_CONSUMER',
    payload: {
      consumer: consumer,
      peerId: peerId
    }
  };
};

exports.addConsumer = addConsumer;

var removeConsumer = function removeConsumer(consumerId, peerId) {
  return {
    type: 'REMOVE_CONSUMER',
    payload: {
      consumerId: consumerId,
      peerId: peerId
    }
  };
};

exports.removeConsumer = removeConsumer;

var setConsumerPaused = function setConsumerPaused(consumerId, originator) {
  return {
    type: 'SET_CONSUMER_PAUSED',
    payload: {
      consumerId: consumerId,
      originator: originator
    }
  };
};

exports.setConsumerPaused = setConsumerPaused;

var setConsumerResumed = function setConsumerResumed(consumerId, originator) {
  return {
    type: 'SET_CONSUMER_RESUMED',
    payload: {
      consumerId: consumerId,
      originator: originator
    }
  };
};

exports.setConsumerResumed = setConsumerResumed;

var setConsumerCurrentLayers = function setConsumerCurrentLayers(consumerId, spatialLayer, temporalLayer) {
  return {
    type: 'SET_CONSUMER_CURRENT_LAYERS',
    payload: {
      consumerId: consumerId,
      spatialLayer: spatialLayer,
      temporalLayer: temporalLayer
    }
  };
};

exports.setConsumerCurrentLayers = setConsumerCurrentLayers;

var setConsumerPreferredLayers = function setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer) {
  return {
    type: 'SET_CONSUMER_PREFERRED_LAYERS',
    payload: {
      consumerId: consumerId,
      spatialLayer: spatialLayer,
      temporalLayer: temporalLayer
    }
  };
};

exports.setConsumerPreferredLayers = setConsumerPreferredLayers;

var setConsumerPriority = function setConsumerPriority(consumerId, priority) {
  return {
    type: 'SET_CONSUMER_PRIORITY',
    payload: {
      consumerId: consumerId,
      priority: priority
    }
  };
};

exports.setConsumerPriority = setConsumerPriority;

var setConsumerTrack = function setConsumerTrack(consumerId, track) {
  return {
    type: 'SET_CONSUMER_TRACK',
    payload: {
      consumerId: consumerId,
      track: track
    }
  };
};

exports.setConsumerTrack = setConsumerTrack;

var setConsumerScore = function setConsumerScore(consumerId, score) {
  return {
    type: 'SET_CONSUMER_SCORE',
    payload: {
      consumerId: consumerId,
      score: score
    }
  };
};

exports.setConsumerScore = setConsumerScore;

var addDataConsumer = function addDataConsumer(dataConsumer, peerId) {
  return {
    type: 'ADD_DATA_CONSUMER',
    payload: {
      dataConsumer: dataConsumer,
      peerId: peerId
    }
  };
};

exports.addDataConsumer = addDataConsumer;

var removeDataConsumer = function removeDataConsumer(dataConsumerId, peerId) {
  return {
    type: 'REMOVE_DATA_CONSUMER',
    payload: {
      dataConsumerId: dataConsumerId,
      peerId: peerId
    }
  };
};

exports.removeDataConsumer = removeDataConsumer;

var addNotification = function addNotification(notification) {
  return {
    type: 'ADD_NOTIFICATION',
    payload: {
      notification: notification
    }
  };
};

exports.addNotification = addNotification;

var removeNotification = function removeNotification(notificationId) {
  return {
    type: 'REMOVE_NOTIFICATION',
    payload: {
      notificationId: notificationId
    }
  };
};

exports.removeNotification = removeNotification;

var removeAllNotifications = function removeAllNotifications() {
  return {
    type: 'REMOVE_ALL_NOTIFICATIONS'
  };
};

exports.removeAllNotifications = removeAllNotifications;
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProtooUrl = getProtooUrl;

function getProtooUrl(_ref) {
  var media_server_wss = _ref.media_server_wss,
      roomId = _ref.roomId,
      peerId = _ref.peerId,
      forceH264 = _ref.forceH264,
      forceVP9 = _ref.forceVP9;
  if (!media_server_wss) console.error("config.media_server_wss don't set.");
  var url = "".concat(media_server_wss, "/?roomId=").concat(roomId, "&peerId=").concat(peerId);
  if (forceH264) url = "".concat(url, "&forceH264=true");else if (forceVP9) url = "".concat(url, "&forceVP9=true");
  return url;
}
},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.isDesktop = isDesktop;
exports.isMobile = isMobile;
var mediaQueryDetectorElem;

function initialize() {
  // Media query detector stuff.
  mediaQueryDetectorElem = document.getElementById('mediasoup-demo-app-media-query-detector');
  return Promise.resolve();
}

function isDesktop() {
  return Boolean(mediaQueryDetectorElem.offsetParent);
}

function isMobile() {
  return !mediaQueryDetectorElem.offsetParent;
}
},{}],19:[function(require,module,exports){
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],20:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],21:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],22:[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],23:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],24:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],25:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
},{"../helpers/typeof":31}],26:[function(require,module,exports){
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],27:[function(require,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],28:[function(require,module,exports){
var objectWithoutPropertiesLoose = require("./objectWithoutPropertiesLoose");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
},{"./objectWithoutPropertiesLoose":29}],29:[function(require,module,exports){
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
},{}],30:[function(require,module,exports){
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":19,"./iterableToArray":26,"./nonIterableSpread":27}],31:[function(require,module,exports){
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],32:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":83}],33:[function(require,module,exports){
class AwaitQueue
{
	constructor({ ClosedErrorClass = Error } = {})
	{
		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Queue of pending tasks. Each task is a function that returns a promise
		// or a value directly.
		// @type {Array<Function>}
		this._tasks = [];

		// Error used when rejecting a task after the AwaitQueue has been closed.
		// @type {Error}
		this._closedErrorClass = ClosedErrorClass;
	}

	close()
	{
		this._closed = true;
	}

	/**
	 * @param {Function} task - Function that returns a promise or a value directly.
	 *
	 * @async
	 */
	async push(task)
	{
		if (typeof task !== 'function')
			throw new TypeError('given task is not a function');

		return new Promise((resolve, reject) =>
		{
			task._resolve = resolve;
			task._reject = reject;

			// Append task to the queue.
			this._tasks.push(task);

			// And run it if the only task in the queue is the new one.
			if (this._tasks.length === 1)
				this._next();
		});
	}

	async _next()
	{
		// Take the first task.
		const task = this._tasks[0];

		if (!task)
			return;

		// Execute it.
		await this._runTask(task);

		// Remove the first task (the completed one) from the queue.
		this._tasks.shift();

		// And continue.
		this._next();
	}

	async _runTask(task)
	{
		if (this._closed)
		{
			task._reject(new this._closedErrorClass('AwaitQueue closed'));

			return;
		}

		try
		{
			const result = await task();

			if (this._closed)
			{
				task._reject(new this._closedErrorClass('AwaitQueue closed'));

				return;
			}

			// Resolve the task with the given result (if any).
			task._resolve(result);
		}
		catch (error)
		{
			if (this._closed)
			{
				task._reject(new this._closedErrorClass('AwaitQueue closed'));

				return;
			}

			// Reject the task with the error.
			task._reject(error);
		}
	}
}

module.exports = AwaitQueue;

},{}],34:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.bowser=t():e.bowser=t()}(this,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=90)}({17:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n=r(18),i=function(){function e(){}return e.getFirstMatch=function(e,t){var r=t.match(e);return r&&r.length>0&&r[1]||""},e.getSecondMatch=function(e,t){var r=t.match(e);return r&&r.length>1&&r[2]||""},e.matchAndReturnConst=function(e,t,r){if(e.test(t))return r},e.getWindowsVersionName=function(e){switch(e){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}},e.getMacOSVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),10===t[0])switch(t[1]){case 5:return"Leopard";case 6:return"Snow Leopard";case 7:return"Lion";case 8:return"Mountain Lion";case 9:return"Mavericks";case 10:return"Yosemite";case 11:return"El Capitan";case 12:return"Sierra";case 13:return"High Sierra";case 14:return"Mojave";case 15:return"Catalina";default:return}},e.getAndroidVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),!(1===t[0]&&t[1]<5))return 1===t[0]&&t[1]<6?"Cupcake":1===t[0]&&t[1]>=6?"Donut":2===t[0]&&t[1]<2?"Eclair":2===t[0]&&2===t[1]?"Froyo":2===t[0]&&t[1]>2?"Gingerbread":3===t[0]?"Honeycomb":4===t[0]&&t[1]<1?"Ice Cream Sandwich":4===t[0]&&t[1]<4?"Jelly Bean":4===t[0]&&t[1]>=4?"KitKat":5===t[0]?"Lollipop":6===t[0]?"Marshmallow":7===t[0]?"Nougat":8===t[0]?"Oreo":9===t[0]?"Pie":void 0},e.getVersionPrecision=function(e){return e.split(".").length},e.compareVersions=function(t,r,n){void 0===n&&(n=!1);var i=e.getVersionPrecision(t),s=e.getVersionPrecision(r),o=Math.max(i,s),a=0,u=e.map([t,r],(function(t){var r=o-e.getVersionPrecision(t),n=t+new Array(r+1).join(".0");return e.map(n.split("."),(function(e){return new Array(20-e.length).join("0")+e})).reverse()}));for(n&&(a=o-Math.min(i,s)),o-=1;o>=a;){if(u[0][o]>u[1][o])return 1;if(u[0][o]===u[1][o]){if(o===a)return 0;o-=1}else if(u[0][o]<u[1][o])return-1}},e.map=function(e,t){var r,n=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(r=0;r<e.length;r+=1)n.push(t(e[r]));return n},e.find=function(e,t){var r,n;if(Array.prototype.find)return Array.prototype.find.call(e,t);for(r=0,n=e.length;r<n;r+=1){var i=e[r];if(t(i,r))return i}},e.assign=function(e){for(var t,r,n=e,i=arguments.length,s=new Array(i>1?i-1:0),o=1;o<i;o++)s[o-1]=arguments[o];if(Object.assign)return Object.assign.apply(Object,[e].concat(s));var a=function(){var e=s[t];"object"==typeof e&&null!==e&&Object.keys(e).forEach((function(t){n[t]=e[t]}))};for(t=0,r=s.length;t<r;t+=1)a();return e},e.getBrowserAlias=function(e){return n.BROWSER_ALIASES_MAP[e]},e.getBrowserTypeByAlias=function(e){return n.BROWSER_MAP[e]||""},e}();t.default=i,e.exports=t.default},18:function(e,t,r){"use strict";t.__esModule=!0,t.ENGINE_MAP=t.OS_MAP=t.PLATFORMS_MAP=t.BROWSER_MAP=t.BROWSER_ALIASES_MAP=void 0;t.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};t.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};t.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};t.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};t.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"}},90:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(91))&&n.__esModule?n:{default:n},s=r(18);function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var a=function(){function e(){}var t,r,n;return e.getParser=function(e,t){if(void 0===t&&(t=!1),"string"!=typeof e)throw new Error("UserAgent should be a string");return new i.default(e,t)},e.parse=function(e){return new i.default(e).getResult()},t=e,n=[{key:"BROWSER_MAP",get:function(){return s.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return s.ENGINE_MAP}},{key:"OS_MAP",get:function(){return s.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return s.PLATFORMS_MAP}}],(r=null)&&o(t.prototype,r),n&&o(t,n),e}();t.default=a,e.exports=t.default},91:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n=u(r(92)),i=u(r(93)),s=u(r(94)),o=u(r(95)),a=u(r(17));function u(e){return e&&e.__esModule?e:{default:e}}var d=function(){function e(e,t){if(void 0===t&&(t=!1),null==e||""===e)throw new Error("UserAgent parameter can't be empty");this._ua=e,this.parsedResult={},!0!==t&&this.parse()}var t=e.prototype;return t.getUA=function(){return this._ua},t.test=function(e){return e.test(this._ua)},t.parseBrowser=function(){var e=this;this.parsedResult.browser={};var t=a.default.find(n.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.browser=t.describe(this.getUA())),this.parsedResult.browser},t.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},t.getBrowserName=function(e){return e?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},t.getBrowserVersion=function(){return this.getBrowser().version},t.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},t.parseOS=function(){var e=this;this.parsedResult.os={};var t=a.default.find(i.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.os=t.describe(this.getUA())),this.parsedResult.os},t.getOSName=function(e){var t=this.getOS().name;return e?String(t).toLowerCase()||"":t||""},t.getOSVersion=function(){return this.getOS().version},t.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},t.getPlatformType=function(e){void 0===e&&(e=!1);var t=this.getPlatform().type;return e?String(t).toLowerCase()||"":t||""},t.parsePlatform=function(){var e=this;this.parsedResult.platform={};var t=a.default.find(s.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.platform=t.describe(this.getUA())),this.parsedResult.platform},t.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},t.getEngineName=function(e){return e?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},t.parseEngine=function(){var e=this;this.parsedResult.engine={};var t=a.default.find(o.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.engine=t.describe(this.getUA())),this.parsedResult.engine},t.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},t.getResult=function(){return a.default.assign({},this.parsedResult)},t.satisfies=function(e){var t=this,r={},n=0,i={},s=0;if(Object.keys(e).forEach((function(t){var o=e[t];"string"==typeof o?(i[t]=o,s+=1):"object"==typeof o&&(r[t]=o,n+=1)})),n>0){var o=Object.keys(r),u=a.default.find(o,(function(e){return t.isOS(e)}));if(u){var d=this.satisfies(r[u]);if(void 0!==d)return d}var c=a.default.find(o,(function(e){return t.isPlatform(e)}));if(c){var f=this.satisfies(r[c]);if(void 0!==f)return f}}if(s>0){var l=Object.keys(i),h=a.default.find(l,(function(e){return t.isBrowser(e,!0)}));if(void 0!==h)return this.compareVersion(i[h])}},t.isBrowser=function(e,t){void 0===t&&(t=!1);var r=this.getBrowserName().toLowerCase(),n=e.toLowerCase(),i=a.default.getBrowserTypeByAlias(n);return t&&i&&(n=i.toLowerCase()),n===r},t.compareVersion=function(e){var t=[0],r=e,n=!1,i=this.getBrowserVersion();if("string"==typeof i)return">"===e[0]||"<"===e[0]?(r=e.substr(1),"="===e[1]?(n=!0,r=e.substr(2)):t=[],">"===e[0]?t.push(1):t.push(-1)):"="===e[0]?r=e.substr(1):"~"===e[0]&&(n=!0,r=e.substr(1)),t.indexOf(a.default.compareVersions(i,r,n))>-1},t.isOS=function(e){return this.getOSName(!0)===String(e).toLowerCase()},t.isPlatform=function(e){return this.getPlatformType(!0)===String(e).toLowerCase()},t.isEngine=function(e){return this.getEngineName(!0)===String(e).toLowerCase()},t.is=function(e){return this.isBrowser(e)||this.isOS(e)||this.isPlatform(e)},t.some=function(e){var t=this;return void 0===e&&(e=[]),e.some((function(e){return t.is(e)}))},e}();t.default=d,e.exports=t.default},92:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n};var s=/version\/(\d+(\.?_?\d+)+)/i,o=[{test:[/googlebot/i],describe:function(e){var t={name:"Googlebot"},r=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/opera/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opr\/|opios/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/SamsungBrowser/i],describe:function(e){var t={name:"Samsung Internet for Android"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Whale/i],describe:function(e){var t={name:"NAVER Whale Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MZBrowser/i],describe:function(e){var t={name:"MZ Browser"},r=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/focus/i],describe:function(e){var t={name:"Focus"},r=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/swing/i],describe:function(e){var t={name:"Swing"},r=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/coast/i],describe:function(e){var t={name:"Opera Coast"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/yabrowser/i],describe:function(e){var t={name:"Yandex Browser"},r=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/ucbrowser/i],describe:function(e){var t={name:"UC Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Maxthon|mxios/i],describe:function(e){var t={name:"Maxthon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/epiphany/i],describe:function(e){var t={name:"Epiphany"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/puffin/i],describe:function(e){var t={name:"Puffin"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sleipnir/i],describe:function(e){var t={name:"Sleipnir"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/k-meleon/i],describe:function(e){var t={name:"K-Meleon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/micromessenger/i],describe:function(e){var t={name:"WeChat"},r=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qqbrowser/i],describe:function(e){var t={name:/qqbrowserlite/i.test(e)?"QQ Browser Lite":"QQ Browser"},r=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/msie|trident/i],describe:function(e){var t={name:"Internet Explorer"},r=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/\sedg\//i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/edg([ea]|ios)/i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/vivaldi/i],describe:function(e){var t={name:"Vivaldi"},r=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/seamonkey/i],describe:function(e){var t={name:"SeaMonkey"},r=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sailfish/i],describe:function(e){var t={name:"Sailfish"},r=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,e);return r&&(t.version=r),t}},{test:[/silk/i],describe:function(e){var t={name:"Amazon Silk"},r=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/phantom/i],describe:function(e){var t={name:"PhantomJS"},r=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/slimerjs/i],describe:function(e){var t={name:"SlimerJS"},r=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t={name:"BlackBerry"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t={name:"WebOS Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/bada/i],describe:function(e){var t={name:"Bada"},r=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/tizen/i],describe:function(e){var t={name:"Tizen"},r=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qupzilla/i],describe:function(e){var t={name:"QupZilla"},r=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/firefox|iceweasel|fxios/i],describe:function(e){var t={name:"Firefox"},r=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/electron/i],describe:function(e){var t={name:"Electron"},r=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/chromium/i],describe:function(e){var t={name:"Chromium"},r=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/chrome|crios|crmo/i],describe:function(e){var t={name:"Chrome"},r=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/GSA/i],describe:function(e){var t={name:"Google Search"},r=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t={name:"Android Browser"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/playstation 4/i],describe:function(e){var t={name:"PlayStation 4"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/safari|applewebkit/i],describe:function(e){var t={name:"Safari"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/.*/i],describe:function(e){var t=-1!==e.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return{name:i.default.getFirstMatch(t,e),version:i.default.getSecondMatch(t,e)}}}];t.default=o,e.exports=t.default},93:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:[/Roku\/DVP/],describe:function(e){var t=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,e);return{name:s.OS_MAP.Roku,version:t}}},{test:[/windows phone/i],describe:function(e){var t=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.WindowsPhone,version:t}}},{test:[/windows /i],describe:function(e){var t=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,e),r=i.default.getWindowsVersionName(t);return{name:s.OS_MAP.Windows,version:t,versionName:r}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(e){var t=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,e);return{name:s.OS_MAP.iOS,version:t}}},{test:[/macintosh/i],describe:function(e){var t=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,e).replace(/[_\s]/g,"."),r=i.default.getMacOSVersionName(t),n={name:s.OS_MAP.MacOS,version:t};return r&&(n.versionName=r),n}},{test:[/(ipod|iphone|ipad)/i],describe:function(e){var t=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,e).replace(/[_\s]/g,".");return{name:s.OS_MAP.iOS,version:t}}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,e),r=i.default.getAndroidVersionName(t),n={name:s.OS_MAP.Android,version:t};return r&&(n.versionName=r),n}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,e),r={name:s.OS_MAP.WebOS};return t&&t.length&&(r.version=t),r}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,e)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,e)||i.default.getFirstMatch(/\bbb(\d+)/i,e);return{name:s.OS_MAP.BlackBerry,version:t}}},{test:[/bada/i],describe:function(e){var t=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.Bada,version:t}}},{test:[/tizen/i],describe:function(e){var t=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.Tizen,version:t}}},{test:[/linux/i],describe:function(){return{name:s.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return{name:s.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(e){var t=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.PlayStation4,version:t}}}];t.default=o,e.exports=t.default},94:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:[/googlebot/i],describe:function(){return{type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(e){var t=i.default.getFirstMatch(/(can-l01)/i,e)&&"Nova",r={type:s.PLATFORMS_MAP.mobile,vendor:"Huawei"};return t&&(r.model=t),r}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet}}},{test:function(e){var t=e.test(/ipod|iphone/i),r=e.test(/like (ipod|iphone)/i);return t&&!r},describe:function(e){var t=i.default.getFirstMatch(/(ipod|iphone)/i,e);return{type:s.PLATFORMS_MAP.mobile,vendor:"Apple",model:t}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"blackberry"===e.getBrowserName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(e){return"bada"===e.getBrowserName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"windows phone"===e.getBrowserName()},describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(e){var t=Number(String(e.getOSVersion()).split(".")[0]);return"android"===e.getOSName(!0)&&t>=3},describe:function(){return{type:s.PLATFORMS_MAP.tablet}}},{test:function(e){return"android"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"macos"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(e){return"windows"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return"linux"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return"playstation 4"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.tv}}},{test:function(e){return"roku"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.tv}}}];t.default=o,e.exports=t.default},95:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:function(e){return"microsoft edge"===e.getBrowserName(!0)},describe:function(e){if(/\sedg\//i.test(e))return{name:s.ENGINE_MAP.Blink};var t=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,e);return{name:s.ENGINE_MAP.EdgeHTML,version:t}}},{test:[/trident/i],describe:function(e){var t={name:s.ENGINE_MAP.Trident},r=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){return e.test(/presto/i)},describe:function(e){var t={name:s.ENGINE_MAP.Presto},r=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=e.test(/gecko/i),r=e.test(/like gecko/i);return t&&!r},describe:function(e){var t={name:s.ENGINE_MAP.Gecko},r=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return{name:s.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(e){var t={name:s.ENGINE_MAP.WebKit},r=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}}];t.default=o,e.exports=t.default}})}));
},{}],35:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],36:[function(require,module,exports){
(function (process){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this,require('_process'))
},{"./common":37,"_process":71}],37:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":70}],38:[function(require,module,exports){
const debug = require('debug')('h264-profile-level-id');

/* eslint-disable no-console */
debug.log = console.info.bind(console);
/* eslint-enable no-console */

const ProfileConstrainedBaseline = 1;
const ProfileBaseline = 2;
const ProfileMain = 3;
const ProfileConstrainedHigh = 4;
const ProfileHigh = 5;

exports.ProfileConstrainedBaseline = ProfileConstrainedBaseline;
exports.ProfileBaseline = ProfileBaseline;
exports.ProfileMain = ProfileMain;
exports.ProfileConstrainedHigh = ProfileConstrainedHigh;
exports.ProfileHigh = ProfileHigh;

// All values are equal to ten times the level number, except level 1b which is
// special.
const Level1_b = 0;
const Level1 = 10;
const Level1_1 = 11;
const Level1_2 = 12;
const Level1_3 = 13;
const Level2 = 20;
const Level2_1 = 21;
const Level2_2 = 22;
const Level3 = 30;
const Level3_1 = 31;
const Level3_2 = 32;
const Level4 = 40;
const Level4_1 = 41;
const Level4_2 = 42;
const Level5 = 50;
const Level5_1 = 51;
const Level5_2 = 52;

exports.Level1_b = Level1_b;
exports.Level1 = Level1;
exports.Level1_1 = Level1_1;
exports.Level1_2 = Level1_2;
exports.Level1_3 = Level1_3;
exports.Level2 = Level2;
exports.Level2_1 = Level2_1;
exports.Level2_2 = Level2_2;
exports.Level3 = Level3;
exports.Level3_1 = Level3_1;
exports.Level3_2 = Level3_2;
exports.Level4 = Level4;
exports.Level4_1 = Level4_1;
exports.Level4_2 = Level4_2;
exports.Level5 = Level5;
exports.Level5_1 = Level5_1;
exports.Level5_2 = Level5_2;

class ProfileLevelId
{
	constructor(profile, level)
	{
		this.profile = profile;
		this.level = level;
	}
}

exports.ProfileLevelId = ProfileLevelId;

// Default ProfileLevelId.
//
// TODO: The default should really be profile Baseline and level 1 according to
// the spec: https://tools.ietf.org/html/rfc6184#section-8.1. In order to not
// break backwards compatibility with older versions of WebRTC where external
// codecs don't have any parameters, use profile ConstrainedBaseline level 3_1
// instead. This workaround will only be done in an interim period to allow
// external clients to update their code.
//
// http://crbug/webrtc/6337.
const DefaultProfileLevelId =
	new ProfileLevelId(ProfileConstrainedBaseline, Level3_1);

// For level_idc=11 and profile_idc=0x42, 0x4D, or 0x58, the constraint set3
// flag specifies if level 1b or level 1.1 is used.
const ConstraintSet3Flag = 0x10;

// Class for matching bit patterns such as "x1xx0000" where 'x' is allowed to be
// either 0 or 1.
class BitPattern
{
	constructor(str)
	{
		this._mask = ~byteMaskString('x', str);
		this._maskedValue = byteMaskString('1', str);
	}

	isMatch(value)
	{
		return this._maskedValue === (value & this._mask);
	}
}

// Class for converting between profile_idc/profile_iop to Profile.
class ProfilePattern
{
	constructor(profile_idc, profile_iop, profile)
	{
		this.profile_idc = profile_idc;
		this.profile_iop = profile_iop;
		this.profile = profile;
	}
}

// This is from https://tools.ietf.org/html/rfc6184#section-8.1.
const ProfilePatterns =
[
	new ProfilePattern(0x42, new BitPattern('x1xx0000'), ProfileConstrainedBaseline),
	new ProfilePattern(0x4D, new BitPattern('1xxx0000'), ProfileConstrainedBaseline),
	new ProfilePattern(0x58, new BitPattern('11xx0000'), ProfileConstrainedBaseline),
	new ProfilePattern(0x42, new BitPattern('x0xx0000'), ProfileBaseline),
	new ProfilePattern(0x58, new BitPattern('10xx0000'), ProfileBaseline),
	new ProfilePattern(0x4D, new BitPattern('0x0x0000'), ProfileMain),
	new ProfilePattern(0x64, new BitPattern('00000000'), ProfileHigh),
	new ProfilePattern(0x64, new BitPattern('00001100'), ProfileConstrainedHigh)
];

/**
 * Parse profile level id that is represented as a string of 3 hex bytes.
 * Nothing will be returned if the string is not a recognized H264 profile
 * level id.
 *
 * @param {String} str - profile-level-id value as a string of 3 hex bytes.
 *
 * @returns {ProfileLevelId}
 */
exports.parseProfileLevelId = function(str)
{
	// The string should consist of 3 bytes in hexadecimal format.
	if (typeof str !== 'string' || str.length !== 6)
		return null;

	const profile_level_id_numeric = parseInt(str, 16);

	if (profile_level_id_numeric === 0)
		return null;

	// Separate into three bytes.
	const level_idc = profile_level_id_numeric & 0xFF;
	const profile_iop = (profile_level_id_numeric >> 8) & 0xFF;
	const profile_idc = (profile_level_id_numeric >> 16) & 0xFF;

	// Parse level based on level_idc and constraint set 3 flag.
	let level;

	switch (level_idc)
	{
		case Level1_1:
		{
			level = (profile_iop & ConstraintSet3Flag) !== 0 ? Level1_b : Level1_1;
			break;
		}
		case Level1:
		case Level1_2:
		case Level1_3:
		case Level2:
		case Level2_1:
		case Level2_2:
		case Level3:
		case Level3_1:
		case Level3_2:
		case Level4:
		case Level4_1:
		case Level4_2:
		case Level5:
		case Level5_1:
		case Level5_2:
		{
			level = level_idc;
			break;
		}
		// Unrecognized level_idc.
		default:
		{
			debug('parseProfileLevelId() | unrecognized level_idc:%s', level_idc);

			return null;
		}
	}

	// Parse profile_idc/profile_iop into a Profile enum.
	for (const pattern of ProfilePatterns)
	{
		if (
			profile_idc === pattern.profile_idc &&
			pattern.profile_iop.isMatch(profile_iop)
		)
		{
			return new ProfileLevelId(pattern.profile, level);
		}
	}

	debug('parseProfileLevelId() | unrecognized profile_idc/profile_iop combination');

	return null;
};

/**
 * Returns canonical string representation as three hex bytes of the profile
 * level id, or returns nothing for invalid profile level ids.
 *
 * @param {ProfileLevelId} profile_level_id
 *
 * @returns {String}
 */
exports.profileLevelIdToString = function(profile_level_id)
{
	// Handle special case level == 1b.
	if (profile_level_id.level == Level1_b)
	{
		switch (profile_level_id.profile)
		{
			case ProfileConstrainedBaseline:
			{
				return '42f00b';
			}
			case ProfileBaseline:
			{
				return '42100b';
			}
			case ProfileMain:
			{
				return '4d100b';
			}
			// Level 1_b is not allowed for other profiles.
			default:
			{
				debug(
					'profileLevelIdToString() | Level 1_b not is allowed for profile:%s',
					profile_level_id.profile);

				return null;
			}
		}
	}

	let profile_idc_iop_string;

	switch (profile_level_id.profile)
	{
		case ProfileConstrainedBaseline:
		{
			profile_idc_iop_string = '42e0';
			break;
		}
		case ProfileBaseline:
		{
			profile_idc_iop_string = '4200';
			break;
		}
		case ProfileMain:
		{
			profile_idc_iop_string = '4d00';
			break;
		}
		case ProfileConstrainedHigh:
		{
			profile_idc_iop_string = '640c';
			break;
		}
		case ProfileHigh:
		{
			profile_idc_iop_string = '6400';
			break;
		}
		default:
		{
			debug(
				'profileLevelIdToString() | unrecognized profile:%s',
				profile_level_id.profile);

			return null;
		}
	}

	let levelStr = (profile_level_id.level).toString(16);

	if (levelStr.length === 1)
		levelStr = `0${levelStr}`;

	return `${profile_idc_iop_string}${levelStr}`;
};

/**
 * Parse profile level id that is represented as a string of 3 hex bytes
 * contained in an SDP key-value map. A default profile level id will be
 * returned if the profile-level-id key is missing. Nothing will be returned if
 * the key is present but the string is invalid.
 *
 * @param {Object} [params={}] - Codec parameters object.
 *
 * @returns {ProfileLevelId}
 */
exports.parseSdpProfileLevelId = function(params = {})
{
	const profile_level_id = params['profile-level-id'];

	return !profile_level_id
		? DefaultProfileLevelId
		: exports.parseProfileLevelId(profile_level_id);
};

/**
 * Returns true if the parameters have the same H264 profile, i.e. the same
 * H264 profile (Baseline, High, etc).
 *
 * @param {Object} [params1={}] - Codec parameters object.
 * @param {Object} [params2={}] - Codec parameters object.
 *
 * @returns {Boolean}
 */
exports.isSameProfile = function(params1 = {}, params2 = {})
{
	const profile_level_id_1 = exports.parseSdpProfileLevelId(params1);
	const profile_level_id_2 = exports.parseSdpProfileLevelId(params2);

	// Compare H264 profiles, but not levels.
	return Boolean(
		profile_level_id_1 &&
		profile_level_id_2 &&
		profile_level_id_1.profile === profile_level_id_2.profile
	);
};

/**
 * Generate codec parameters that will be used as answer in an SDP negotiation
 * based on local supported parameters and remote offered parameters. Both
 * local_supported_params and remote_offered_params represent sendrecv media
 * descriptions, i.e they are a mix of both encode and decode capabilities. In
 * theory, when the profile in local_supported_params represent a strict superset
 * of the profile in remote_offered_params, we could limit the profile in the
 * answer to the profile in remote_offered_params.
 *
 * However, to simplify the code, each supported H264 profile should be listed
 * explicitly in the list of local supported codecs, even if they are redundant.
 * Then each local codec in the list should be tested one at a time against the
 * remote codec, and only when the profiles are equal should this function be
 * called. Therefore, this function does not need to handle profile intersection,
 * and the profile of local_supported_params and remote_offered_params must be
 * equal before calling this function. The parameters that are used when
 * negotiating are the level part of profile-level-id and level-asymmetry-allowed.
 *
 * @param {Object} [local_supported_params={}]
 * @param {Object} [remote_offered_params={}]
 *
 * @returns {String} Canonical string representation as three hex bytes of the
 *   profile level id, or null if no one of the params have profile-level-id.
 *
 * @throws {TypeError} If Profile mismatch or invalid params.
 */
exports.generateProfileLevelIdForAnswer = function(
	local_supported_params = {},
	remote_offered_params = {}
)
{
	// If both local and remote params do not contain profile-level-id, they are
	// both using the default profile. In this case, don't return anything.
	if (
		!local_supported_params['profile-level-id'] &&
		!remote_offered_params['profile-level-id']
	)
	{
		debug(
			'generateProfileLevelIdForAnswer() | no profile-level-id in local and remote params');

		return null;
	}

	// Parse profile-level-ids.
	const local_profile_level_id =
		exports.parseSdpProfileLevelId(local_supported_params);
	const remote_profile_level_id =
		exports.parseSdpProfileLevelId(remote_offered_params);

	// The local and remote codec must have valid and equal H264 Profiles.
	if (!local_profile_level_id)
		throw new TypeError('invalid local_profile_level_id');

	if (!remote_profile_level_id)
		throw new TypeError('invalid remote_profile_level_id');

	if (local_profile_level_id.profile !== remote_profile_level_id.profile)
		throw new TypeError('H264 Profile mismatch');

	// Parse level information.
	const level_asymmetry_allowed = (
		isLevelAsymmetryAllowed(local_supported_params) &&
		isLevelAsymmetryAllowed(remote_offered_params)
	);

	const local_level = local_profile_level_id.level;
	const remote_level = remote_profile_level_id.level;
	const min_level = minLevel(local_level, remote_level);

	// Determine answer level. When level asymmetry is not allowed, level upgrade
	// is not allowed, i.e., the level in the answer must be equal to or lower
	// than the level in the offer.
	const answer_level = level_asymmetry_allowed ? local_level : min_level;

	debug(
		'generateProfileLevelIdForAnswer() | result: [profile:%s, level:%s]',
		local_profile_level_id.profile, answer_level);

	// Return the resulting profile-level-id for the answer parameters.
	return exports.profileLevelIdToString(
		new ProfileLevelId(local_profile_level_id.profile, answer_level));
};

// Convert a string of 8 characters into a byte where the positions containing
// character c will have their bit set. For example, c = 'x', str = "x1xx0000"
// will return 0b10110000.
function byteMaskString(c, str)
{
	return (
		((str[0] === c) << 7) | ((str[1] === c) << 6) | ((str[2] === c) << 5) |
		((str[3] === c) << 4)	| ((str[4] === c) << 3)	| ((str[5] === c) << 2)	|
		((str[6] === c) << 1)	| ((str[7] === c) << 0)
	);
}

// Compare H264 levels and handle the level 1b case.
function isLessLevel(a, b)
{
	if (a === Level1_b)
		return b !== Level1 && b !== Level1_b;

	if (b === Level1_b)
		return a !== Level1;

	return a < b;
}

function minLevel(a, b)
{
	return isLessLevel(a, b) ? a : b;
}

function isLevelAsymmetryAllowed(params = {})
{
	const level_asymmetry_allowed = params['level-asymmetry-allowed'];

	return (
		level_asymmetry_allowed === 1 ||
		level_asymmetry_allowed === '1'
	);
}

},{"debug":36}],39:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],40:[function(require,module,exports){
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');
const { InvalidStateError } = require('./errors');

const logger = new Logger('Consumer');

class Consumer extends EnhancedEventEmitter
{
	/**
	 * @private
	 *
	 * @emits transportclose
	 * @emits trackended
	 * @emits @getstats
	 * @emits @close
	 */
	constructor({ id, localId, producerId, track, rtpParameters, appData })
	{
		super(logger);

		// Id.
		// @type {String}
		this._id = id;

		// Local id.
		// @type {String}
		this._localId = localId;

		// Associated Producer id.
		// @type {String}
		this._producerId = producerId;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Remote track.
		// @type {MediaStreamTrack}
		this._track = track;

		// RTP parameters.
		// @type {RTCRtpParameters}
		this._rtpParameters = rtpParameters;

		// Paused flag.
		// @type {Boolean}
		this._paused = !track.enabled;

		// App custom data.
		// @type {Object}
		this._appData = appData;

		this._onTrackEnded = this._onTrackEnded.bind(this);

		this._handleTrack();
	}

	/**
	 * Consumer id.
	 *
	 * @returns {String}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Local id.
	 *
	 * @private
	 * @returns {String}
	 */
	get localId()
	{
		return this._localId;
	}

	/**
	 * Associated Producer id.
	 *
	 * @returns {String}
	 */
	get producerId()
	{
		return this._producerId;
	}

	/**
	 * Whether the Consumer is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Media kind.
	 *
	 * @returns {String}
	 */
	get kind()
	{
		return this._track.kind;
	}

	/**
	 * The associated track.
	 *
	 * @returns {MediaStreamTrack}
	 */
	get track()
	{
		return this._track;
	}

	/**
	 * RTP parameters.
	 *
	 * @returns {RTCRtpParameters}
	 */
	get rtpParameters()
	{
		return this._rtpParameters;
	}

	/**
	 * Whether the Consumer is paused.
	 *
	 * @returns {Boolean}
	 */
	get paused()
	{
		return this._paused;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Invalid setter.
	 */
	set appData(appData) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override appData object');
	}

	/**
	 * Closes the Consumer.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;

		this._destroyTrack();

		this.emit('@close');
	}

	/**
	 * Transport was closed.
	 *
	 * @private
	 */
	transportClosed()
	{
		if (this._closed)
			return;

		logger.debug('transportClosed()');

		this._closed = true;

		this._destroyTrack();

		this.safeEmit('transportclose');
	}

	/**
	 * Get associated RTCRtpReceiver stats.
	 *
	 * @async
	 * @returns {RTCStatsReport}
	 * @throws {InvalidStateError} if Consumer closed.
	 */
	async getStats()
	{
		if (this._closed)
			throw new InvalidStateError('closed');

		return this.safeEmitAsPromise('@getstats');
	}

	/**
	 * Pauses receiving media.
	 */
	pause()
	{
		logger.debug('pause()');

		if (this._closed)
		{
			logger.error('pause() | Consumer closed');

			return;
		}

		this._paused = true;
		this._track.enabled = false;
	}

	/**
	 * Resumes receiving media.
	 */
	resume()
	{
		logger.debug('resume()');

		if (this._closed)
		{
			logger.error('resume() | Consumer closed');

			return;
		}

		this._paused = false;
		this._track.enabled = true;
	}

	/**
	 * @private
	 */
	_onTrackEnded()
	{
		logger.debug('track "ended" event');

		this.safeEmit('trackended');
	}

	/**
	 * @private
	 */
	_handleTrack()
	{
		this._track.addEventListener('ended', this._onTrackEnded);
	}

	/**
	 * @private
	 */
	_destroyTrack()
	{
		try
		{
			this._track.removeEventListener('ended', this._onTrackEnded);
			this._track.stop();
		}
		catch (error)
		{}
	}
}

module.exports = Consumer;

},{"./EnhancedEventEmitter":44,"./Logger":45,"./errors":49}],41:[function(require,module,exports){
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');

const logger = new Logger('DataConsumer');

class DataConsumer extends EnhancedEventEmitter
{
	/**
	 * @private
	 *
	 * @emits transportclose
	 * @emits open
	 * @emits {Object} error
	 * @emits close
	 * @emits {Any} message
	 * @emits @close
	 */
	constructor({ id, dataProducerId, dataChannel, sctpStreamParameters, appData })
	{
		super(logger);

		// Id.
		// @type {String}
		this._id = id;

		// Associated DataProducer Id.
		// @type {String}
		this._dataProducerId = dataProducerId;

		// The underlying RTCDataChannel instance.
		// @type {RTCDataChannel}
		this._dataChannel = dataChannel;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// SCTP stream parameters.
		// @type {RTCSctpStreamParameters}
		this._sctpStreamParameters = sctpStreamParameters;

		// App custom data.
		// @type {Object}
		this._appData = appData;

		this._handleDataChannel();
	}

	/**
	 * DataConsumer id.
	 *
	 * @returns {String}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Associated DataProducer id.
	 *
	 * @returns {String}
	 */
	get dataProducerId()
	{
		return this._dataProducerId;
	}

	/**
	 * Whether the DataConsumer is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * SCTP stream parameters.
	 *
	 * @returns {RTCSctpStreamParameters}
	 */
	get sctpStreamParameters()
	{
		return this._sctpStreamParameters;
	}

	/**
	 * DataChannel readyState.
	 *
	 * @returns {String}
	 */
	get readyState()
	{
		return this._dataChannel.readyState;
	}

	/**
	 * DataChannel label.
	 *
	 * @returns {String}
	 */
	get label()
	{
		return this._dataChannel.label;
	}

	/**
	 * DataChannel protocol.
	 *
	 * @returns {String}
	 */
	get protocol()
	{
		return this._dataChannel.protocol;
	}

	/**
	 * DataChannel binaryType.
	 *
	 * @returns {String}
	 */
	get binaryType()
	{
		return this._dataChannel.binaryType;
	}

	/**
	 * Set DataChannel binaryType.
	 *
	 * @param {Number} binaryType
	 */
	set binaryType(binaryType)
	{
		this._dataChannel.binaryType = binaryType;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Invalid setter.
	 */
	set appData(appData) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override appData object');
	}

	/**
	 * Closes the DataConsumer.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;

		this._dataChannel.close();

		this.emit('@close');
	}

	/**
	 * Transport was closed.
	 *
	 * @private
	 */
	transportClosed()
	{
		if (this._closed)
			return;

		logger.debug('transportClosed()');

		this._closed = true;

		this._dataChannel.close();

		this.safeEmit('transportclose');
	}

	/**
	 * @private
	 */
	_handleDataChannel()
	{
		this._dataChannel.addEventListener('open', () =>
		{
			if (this._closed)
				return;

			logger.debug('DataChannel "open" event');

			this.safeEmit('open');
		});

		this._dataChannel.addEventListener('error', (event) =>
		{
			if (this._closed)
				return;

			let { error } = event;

			if (!error)
				error = new Error('unknown DataChannel error');

			if (error.errorDetail === 'sctp-failure')
			{
				logger.error(
					'DataChannel SCTP error [sctpCauseCode:%s]: %s',
					error.sctpCauseCode, error.message);
			}
			else
			{
				logger.error('DataChannel "error" event: %o', error);
			}

			this.safeEmit('error', error);
		});

		this._dataChannel.addEventListener('close', () =>
		{
			if (this._closed)
				return;

			logger.warn('DataChannel "close" event');

			this._closed = true;

			this.emit('@close');
			this.safeEmit('close');
		});

		this._dataChannel.addEventListener('message', (event) =>
		{
			if (this._closed)
				return;

			this.safeEmit('message', event.data);
		});
	}
}

module.exports = DataConsumer;

},{"./EnhancedEventEmitter":44,"./Logger":45}],42:[function(require,module,exports){
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');
const { InvalidStateError } = require('./errors');

const logger = new Logger('DataProducer');

class DataProducer extends EnhancedEventEmitter
{
	/**
	 * @private
	 *
	 * @emits transportclose
	 * @emits open
	 * @emits {Object} error
	 * @emits close
	 * @emits bufferedamountlow
	 * @emits @close
	 */
	constructor({ id, dataChannel, sctpStreamParameters, appData })
	{
		super(logger);

		// Id.
		// @type {String}
		this._id = id;

		// The underlying RTCDataChannel instance.
		// @type {RTCDataChannel}
		this._dataChannel = dataChannel;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// SCTP stream parameters.
		// @type {RTCSctpStreamParameters}
		this._sctpStreamParameters = sctpStreamParameters;

		// App custom data.
		// @type {Object}
		this._appData = appData;

		this._handleDataChannel();
	}

	/**
	 * DataProducer id.
	 *
	 * @returns {String}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Whether the DataProducer is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * SCTP stream parameters.
	 *
	 * @returns {RTCSctpStreamParameters}
	 */
	get sctpStreamParameters()
	{
		return this._sctpStreamParameters;
	}

	/**
	 * DataChannel readyState.
	 *
	 * @returns {String}
	 */
	get readyState()
	{
		return this._dataChannel.readyState;
	}

	/**
	 * DataChannel label.
	 *
	 * @returns {String}
	 */
	get label()
	{
		return this._dataChannel.label;
	}

	/**
	 * DataChannel protocol.
	 *
	 * @returns {String}
	 */
	get protocol()
	{
		return this._dataChannel.protocol;
	}

	/**
	 * DataChannel bufferedAmount.
	 *
	 * @returns {String}
	 */
	get bufferedAmount()
	{
		return this._dataChannel.bufferedAmount;
	}

	/**
	 * DataChannel bufferedAmountLowThreshold.
	 *
	 * @returns {String}
	 */
	get bufferedAmountLowThreshold()
	{
		return this._dataChannel.bufferedAmountLowThreshold;
	}

	/**
	 * Set DataChannel bufferedAmountLowThreshold.
	 *
	 * @param {Number} bufferedAmountLowThreshold
	 */
	set bufferedAmountLowThreshold(bufferedAmountLowThreshold)
	{
		this._dataChannel.bufferedAmountLowThreshold = bufferedAmountLowThreshold;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Invalid setter.
	 */
	set appData(appData) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override appData object');
	}

	/**
	 * Closes the DataProducer.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;

		this._dataChannel.close();

		this.emit('@close');
	}

	/**
	 * Transport was closed.
	 *
	 * @private
	 */
	transportClosed()
	{
		if (this._closed)
			return;

		logger.debug('transportClosed()');

		this._closed = true;

		this._dataChannel.close();

		this.safeEmit('transportclose');
	}

	/**
	 * Send a message.
	 *
	 * @param {String|Blob|ArrayBuffer|ArrayBufferView} data.
	 *
	 * @throws {InvalidStateError} if DataProducer closed.
	 * @throws {TypeError} if wrong arguments.
	 */
	send(data)
	{
		logger.debug('send()');

		if (this._closed)
			throw new InvalidStateError('closed');

		this._dataChannel.send(data);
	}

	/**
	 * @private
	 */
	_handleDataChannel()
	{
		this._dataChannel.addEventListener('open', () =>
		{
			if (this._closed)
				return;

			logger.debug('DataChannel "open" event');

			this.safeEmit('open');
		});

		this._dataChannel.addEventListener('error', (event) =>
		{
			if (this._closed)
				return;

			let { error } = event;

			if (!error)
				error = new Error('unknown DataChannel error');

			if (error.errorDetail === 'sctp-failure')
			{
				logger.error(
					'DataChannel SCTP error [sctpCauseCode:%s]: %s',
					error.sctpCauseCode, error.message);
			}
			else
			{
				logger.error('DataChannel "error" event: %o', error);
			}

			this.safeEmit('error', error);
		});

		this._dataChannel.addEventListener('close', () =>
		{
			if (this._closed)
				return;

			logger.warn('DataChannel "close" event');

			this._closed = true;

			this.emit('@close');
			this.safeEmit('close');
		});

		this._dataChannel.addEventListener('message', () =>
		{
			if (this._closed)
				return;

			logger.warn(
				'DataChannel "message" event in a DataProducer, message discarded');
		});

		this._dataChannel.addEventListener('bufferedamountlow', () =>
		{
			if (this._closed)
				return;

			this.safeEmit('bufferedamountlow');
		});
	}
}

module.exports = DataProducer;

},{"./EnhancedEventEmitter":44,"./Logger":45,"./errors":49}],43:[function(require,module,exports){
const Logger = require('./Logger');
const { UnsupportedError, InvalidStateError } = require('./errors');
const detectDevice = require('./detectDevice');
const ortc = require('./ortc');
const Transport = require('./Transport');
const Chrome74 = require('./handlers/Chrome74');
const Chrome70 = require('./handlers/Chrome70');
const Chrome67 = require('./handlers/Chrome67');
const Chrome55 = require('./handlers/Chrome55');
const Firefox60 = require('./handlers/Firefox60');
const Safari12 = require('./handlers/Safari12');
const Safari11 = require('./handlers/Safari11');
const Edge11 = require('./handlers/Edge11');
const ReactNative = require('./handlers/ReactNative');

const logger = new Logger('Device');

class Device
{
	/**
	 * Create a new Device to connect to mediasoup server.
	 *
	 * @param {Class|String} [Handler] - An optional RTC handler class for unsupported or
	 *   custom devices (not needed when running in a browser). If a String, it will
	 *   force usage of the given built-in handler.
	 *
	 * @throws {UnsupportedError} if device is not supported.
	 */
	constructor({ Handler } = {})
	{
		if (typeof Handler === 'string')
		{
			switch (Handler)
			{
				case 'Chrome74':
					Handler = Chrome74;
					break;
				case 'Chrome70':
					Handler = Chrome70;
					break;
				case 'Chrome67':
					Handler = Chrome67;
					break;
				case 'Chrome55':
					Handler = Chrome55;
					break;
				case 'Firefox60':
					Handler = Firefox60;
					break;
				case 'Safari12':
					Handler = Safari12;
					break;
				case 'Safari11':
					Handler = Safari11;
					break;
				case 'Edge11':
					Handler = Edge11;
					break;
				case 'ReactNative':
					Handler = ReactNative;
					break;
				default:
					throw new TypeError(`unknown Handler "${Handler}"`);
			}
		}

		// RTC handler class.
		this._Handler = Handler || detectDevice();

		if (!this._Handler)
			throw new UnsupportedError('device not supported');

		logger.debug('constructor() [Handler:%s]', this._Handler.name);

		// Loaded flag.
		// @type {Boolean}
		this._loaded = false;

		// Extended RTP capabilities.
		// @type {Object}
		this._extendedRtpCapabilities = null;

		// Local RTP capabilities for receiving media.
		// @type {RTCRtpCapabilities}
		this._recvRtpCapabilities = null;

		// Whether we can produce audio/video based on computed extended RTP
		// capabilities.
		// @type {Object}
		this._canProduceByKind =
		{
			audio : false,
			video : false
		};

		// Local SCTP capabilities.
		// @type {Object}
		this._sctpCapabilities = null;
	}

	/**
	 * The RTC handler class name ('Chrome70', 'Firefox65', etc).
	 *
	 * @returns {String}
	 */
	get handlerName()
	{
		return this._Handler.name;
	}

	/**
	 * Whether the Device is loaded.
	 *
	 * @returns {Boolean}
	 */
	get loaded()
	{
		return this._loaded;
	}

	/**
	 * RTP capabilities of the Device for receiving media.
	 *
	 * @returns {RTCRtpCapabilities}
	 * @throws {InvalidStateError} if not loaded.
	 */
	get rtpCapabilities()
	{
		if (!this._loaded)
			throw new InvalidStateError('not loaded');

		return this._recvRtpCapabilities;
	}

	/**
	 * SCTP capabilities of the Device.
	 *
	 * @returns {Object}
	 * @throws {InvalidStateError} if not loaded.
	 */
	get sctpCapabilities()
	{
		if (!this._loaded)
			throw new InvalidStateError('not loaded');

		return this._sctpCapabilities;
	}

	/**
	 * Initialize the Device.
	 *
	 * @param {RTCRtpCapabilities} routerRtpCapabilities - Router RTP capabilities.
	 *
	 * @async
	 * @throws {TypeError} if missing/wrong arguments.
	 * @throws {InvalidStateError} if already loaded.
	 */
	async load({ routerRtpCapabilities } = {})
	{
		logger.debug('load() [routerRtpCapabilities:%o]', routerRtpCapabilities);

		if (this._loaded)
			throw new InvalidStateError('already loaded');
		else if (typeof routerRtpCapabilities !== 'object')
			throw new TypeError('missing routerRtpCapabilities');

		const nativeRtpCapabilities = await this._Handler.getNativeRtpCapabilities();

		logger.debug(
			'load() | got native RTP capabilities:%o', nativeRtpCapabilities);

		// Get extended RTP capabilities.
		this._extendedRtpCapabilities = ortc.getExtendedRtpCapabilities(
			nativeRtpCapabilities, routerRtpCapabilities);

		logger.debug(
			'load() | got extended RTP capabilities:%o', this._extendedRtpCapabilities);

		// Check whether we can produce audio/video.
		this._canProduceByKind.audio =
			ortc.canSend('audio', this._extendedRtpCapabilities);
		this._canProduceByKind.video =
			ortc.canSend('video', this._extendedRtpCapabilities);

		// Generate our receiving RTP capabilities for receiving media.
		this._recvRtpCapabilities =
			ortc.getRecvRtpCapabilities(this._extendedRtpCapabilities);

		logger.debug(
			'load() | got receiving RTP capabilities:%o', this._recvRtpCapabilities);

		this._sctpCapabilities = await this._Handler.getNativeSctpCapabilities();

		logger.debug(
			'load() | got native SCTP capabilities:%o', this._sctpCapabilities);

		logger.debug('load() succeeded');

		this._loaded = true;
	}

	/**
	 * Whether we can produce audio/video.
	 *
	 * @param {String} kind - 'audio' or 'video'.
	 *
	 * @returns {Boolean}
	 * @throws {InvalidStateError} if not loaded.
	 * @throws {TypeError} if wrong arguments.
	 */
	canProduce(kind)
	{
		if (!this._loaded)
			throw new InvalidStateError('not loaded');
		else if (kind !== 'audio' && kind !== 'video')
			throw new TypeError(`invalid kind "${kind}"`);

		return this._canProduceByKind[kind];
	}

	/**
	 * Creates a Transport for sending media.
	 *
	 * @param {String} - Server-side Transport id.
	 * @param {RTCIceParameters} iceParameters - Server-side Transport ICE parameters.
	 * @param {Array<RTCIceCandidate>} [iceCandidates] - Server-side Transport ICE candidates.
	 * @param {RTCDtlsParameters} dtlsParameters - Server-side Transport DTLS parameters.
	 * @param {Object} [sctpParameters] - Server-side SCTP parameters.
	 * @param {Array<RTCIceServer>} [iceServers] - Array of ICE servers.
	 * @param {RTCIceTransportPolicy} [iceTransportPolicy] - ICE transport
	 *   policy.
	 * @param {Object} [proprietaryConstraints] - RTCPeerConnection proprietary constraints.
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @returns {Transport}
	 * @throws {InvalidStateError} if not loaded.
	 * @throws {TypeError} if wrong arguments.
	 */
	createSendTransport(
		{
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			appData = {}
		} = {}
	)
	{
		logger.debug('createSendTransport()');

		return this._createTransport(
			{
				direction : 'send',
				id,
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				iceServers,
				iceTransportPolicy,
				proprietaryConstraints,
				appData
			});
	}

	/**
	 * Creates a Transport for receiving media.
	 *
	 * @param {String} - Server-side Transport id.
	 * @param {RTCIceParameters} iceParameters - Server-side Transport ICE parameters.
	 * @param {Array<RTCIceCandidate>} [iceCandidates] - Server-side Transport ICE candidates.
	 * @param {RTCDtlsParameters} dtlsParameters - Server-side Transport DTLS parameters.
	 * @param {Object} [sctpParameters] - Server-side SCTP parameters.
	 * @param {Array<RTCIceServer>} [iceServers] - Array of ICE servers.
	 * @param {RTCIceTransportPolicy} [iceTransportPolicy] - ICE transport
	 *   policy.
	 * @param {Object} [proprietaryConstraints] - RTCPeerConnection proprietary constraints.
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @returns {Transport}
	 * @throws {InvalidStateError} if not loaded.
	 * @throws {TypeError} if wrong arguments.
	 */
	createRecvTransport(
		{
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			appData = {}
		} = {}
	)
	{
		logger.debug('createRecvTransport()');

		return this._createTransport(
			{
				direction : 'recv',
				id,
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				iceServers,
				iceTransportPolicy,
				proprietaryConstraints,
				appData
			});
	}

	/**
	 * @private
	 */
	_createTransport(
		{
			direction,
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			appData = {}
		}
	)
	{
		logger.debug('createTransport()');

		if (!this._loaded)
			throw new InvalidStateError('not loaded');
		else if (typeof id !== 'string')
			throw new TypeError('missing id');
		else if (typeof iceParameters !== 'object')
			throw new TypeError('missing iceParameters');
		else if (!Array.isArray(iceCandidates))
			throw new TypeError('missing iceCandidates');
		else if (typeof dtlsParameters !== 'object')
			throw new TypeError('missing dtlsParameters');
		else if (sctpParameters && typeof sctpParameters !== 'object')
			throw new TypeError('wrong sctpParameters');
		else if (appData && typeof appData !== 'object')
			throw new TypeError('if given, appData must be an object');

		// Create a new Transport.
		const transport = new Transport(
			{
				direction,
				id,
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				iceServers,
				iceTransportPolicy,
				proprietaryConstraints,
				appData,
				Handler                 : this._Handler,
				extendedRtpCapabilities : this._extendedRtpCapabilities,
				canProduceByKind        : this._canProduceByKind
			});

		return transport;
	}
}

module.exports = Device;

},{"./Logger":45,"./Transport":47,"./detectDevice":48,"./errors":49,"./handlers/Chrome55":50,"./handlers/Chrome67":51,"./handlers/Chrome70":52,"./handlers/Chrome74":53,"./handlers/Edge11":54,"./handlers/Firefox60":55,"./handlers/ReactNative":56,"./handlers/Safari11":57,"./handlers/Safari12":58,"./ortc":66}],44:[function(require,module,exports){
const { EventEmitter } = require('events');
const Logger = require('./Logger');

class EnhancedEventEmitter extends EventEmitter
{
	constructor(logger)
	{
		super();
		this.setMaxListeners(Infinity);

		this._logger = logger || new Logger('EnhancedEventEmitter');
	}

	safeEmit(event, ...args)
	{
		try
		{
			this.emit(event, ...args);
		}
		catch (error)
		{
			this._logger.error(
				'safeEmit() | event listener threw an error [event:%s]:%o',
				event, error);
		}
	}

	async safeEmitAsPromise(event, ...args)
	{
		return new Promise((resolve, reject) =>
		{
			this.safeEmit(event, ...args, resolve, reject);
		});
	}
}

module.exports = EnhancedEventEmitter;

},{"./Logger":45,"events":35}],45:[function(require,module,exports){
const debug = require('debug');

const APP_NAME = 'mediasoup-client';

class Logger
{
	constructor(prefix)
	{
		if (prefix)
		{
			this._debug = debug(`${APP_NAME}:${prefix}`);
			this._warn = debug(`${APP_NAME}:WARN:${prefix}`);
			this._error = debug(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = debug(APP_NAME);
			this._warn = debug(`${APP_NAME}:WARN`);
			this._error = debug(`${APP_NAME}:ERROR`);
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	get debug()
	{
		return this._debug;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}

module.exports = Logger;

},{"debug":36}],46:[function(require,module,exports){
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');
const { UnsupportedError, InvalidStateError } = require('./errors');

const logger = new Logger('Producer');

class Producer extends EnhancedEventEmitter
{
	/**
	 * @private
	 *
	 * @emits transportclose
	 * @emits trackended
	 * @emits {track: MediaStreamTrack} @replacetrack
	 * @emits {spatialLayer: String} @setmaxspatiallayer
	 * @emits @getstats
	 * @emits @close
	 */
	constructor({ id, localId, track, rtpParameters, appData })
	{
		super(logger);

		// Id.
		// @type {String}
		this._id = id;

		// Local id.
		// @type {String}
		this._localId = localId;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Local track.
		// @type {MediaStreamTrack}
		this._track = track;

		// RTP parameters.
		// @type {RTCRtpParameters}
		this._rtpParameters = rtpParameters;

		// Paused flag.
		// @type {Boolean}
		this._paused = !track.enabled;

		// Video max spatial layer.
		// @type {Number|Undefined}
		this._maxSpatialLayer = undefined;

		// App custom data.
		// @type {Object}
		this._appData = appData;

		this._onTrackEnded = this._onTrackEnded.bind(this);

		this._handleTrack();
	}

	/**
	 * Producer id.
	 *
	 * @returns {String}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Local id.
	 *
	 * @private
	 * @returns {String}
	 */
	get localId()
	{
		return this._localId;
	}

	/**
	 * Whether the Producer is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Media kind.
	 *
	 * @returns {String}
	 */
	get kind()
	{
		return this._track.kind;
	}

	/**
	 * The associated track.
	 *
	 * @returns {MediaStreamTrack}
	 */
	get track()
	{
		return this._track;
	}

	/**
	 * RTP parameters.
	 *
	 * @returns {RTCRtpParameters}
	 */
	get rtpParameters()
	{
		return this._rtpParameters;
	}

	/**
	 * Whether the Producer is paused.
	 *
	 * @returns {Boolean}
	 */
	get paused()
	{
		return this._paused;
	}

	/**
	 * Max spatial layer.
	 *
	 * @type {Number}
	 */
	get maxSpatialLayer()
	{
		return this._maxSpatialLayer;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Invalid setter.
	 */
	set appData(appData) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override appData object');
	}

	/**
	 * Closes the Producer.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;

		this._destroyTrack();

		this.emit('@close');
	}

	/**
	 * Transport was closed.
	 *
	 * @private
	 */
	transportClosed()
	{
		if (this._closed)
			return;

		logger.debug('transportClosed()');

		this._closed = true;

		this._destroyTrack();

		this.safeEmit('transportclose');
	}

	/**
	 * Get associated RTCRtpSender stats.
	 *
	 * @promise
	 * @returns {RTCStatsReport}
	 * @throws {InvalidStateError} if Producer closed.
	 */
	async getStats()
	{
		if (this._closed)
			throw new InvalidStateError('closed');

		return this.safeEmitAsPromise('@getstats');
	}

	/**
	 * Pauses sending media.
	 */
	pause()
	{
		logger.debug('pause()');

		if (this._closed)
		{
			logger.error('pause() | Producer closed');

			return;
		}

		this._paused = true;
		this._track.enabled = false;
	}

	/**
	 * Resumes sending media.
	 */
	resume()
	{
		logger.debug('resume()');

		if (this._closed)
		{
			logger.error('resume() | Producer closed');

			return;
		}

		this._paused = false;
		this._track.enabled = true;
	}

	/**
	 * Replaces the current track with a new one.
	 *
	 * @param {MediaStreamTrack} track - New track.
	 *
	 * @async
	 * @throws {InvalidStateError} if Producer closed or track ended.
	 * @throws {TypeError} if wrong arguments.
	 */
	async replaceTrack({ track } = {})
	{
		logger.debug('replaceTrack() [track:%o]', track);

		if (this._closed)
		{
			// This must be done here. Otherwise there is no chance to stop the given
			// track.
			try { track.stop(); }
			catch (error) {}

			throw new InvalidStateError('closed');
		}
		else if (!track)
		{
			throw new TypeError('missing track');
		}
		else if (track.readyState === 'ended')
		{
			throw new InvalidStateError('track ended');
		}

		await this.safeEmitAsPromise('@replacetrack', track);

		// Destroy the previous track.
		this._destroyTrack();

		// Set the new track.
		this._track = track;

		// If this Producer was paused/resumed and the state of the new
		// track does not match, fix it.
		if (!this._paused)
			this._track.enabled = true;
		else
			this._track.enabled = false;

		// Handle the effective track.
		this._handleTrack();
	}

	/**
	 * Sets the video max spatial layer to be sent.
	 *
	 * @param {Number} spatialLayer
	 *
	 * @async
	 * @throws {InvalidStateError} if Producer closed.
	 * @throws {UnsupportedError} if not a video Producer.
	 * @throws {TypeError} if wrong arguments.
	 */
	async setMaxSpatialLayer(spatialLayer)
	{
		if (this._closed)
			throw new InvalidStateError('closed');
		else if (this._track.kind !== 'video')
			throw new UnsupportedError('not a video Producer');
		else if (typeof spatialLayer !== 'number')
			throw new TypeError('invalid spatialLayer');

		if (spatialLayer === this._maxSpatialLayer)
			return;

		await this.safeEmitAsPromise('@setmaxspatiallayer', spatialLayer);

		this._maxSpatialLayer = spatialLayer;
	}

	/**
	 * @private
	 */
	_onTrackEnded()
	{
		logger.debug('track "ended" event');

		this.safeEmit('trackended');
	}

	/**
	 * @private
	 */
	_handleTrack()
	{
		this._track.addEventListener('ended', this._onTrackEnded);
	}

	/**
	 * @private
	 */
	_destroyTrack()
	{
		try
		{
			this._track.removeEventListener('ended', this._onTrackEnded);
			this._track.stop();
		}
		catch (error)
		{}
	}
}

module.exports = Producer;

},{"./EnhancedEventEmitter":44,"./Logger":45,"./errors":49}],47:[function(require,module,exports){
const AwaitQueue = require('awaitqueue');
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');
const { UnsupportedError, InvalidStateError } = require('./errors');
const ortc = require('./ortc');
const Producer = require('./Producer');
const Consumer = require('./Consumer');
const DataProducer = require('./DataProducer');
const DataConsumer = require('./DataConsumer');

const logger = new Logger('Transport');

class Transport extends EnhancedEventEmitter
{
	/**
	 * @private
	 *
	 * @emits {transportLocalParameters: Object, callback: Function, errback: Function} connect
	 * @emits {connectionState: String} connectionstatechange
	 * @emits {producerLocalParameters: Object, callback: Function, errback: Function} produce
	 * @emits {dataProducerLocalParameters: Object, callback: Function, errback: Function} producedata
	 */
	constructor(
		{
			direction,
			id,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			appData,
			Handler,
			extendedRtpCapabilities,
			canProduceByKind
		}
	)
	{
		super(logger);

		logger.debug('constructor() [id:%s, direction:%s]', id, direction);

		// Id.
		// @type {String}
		this._id = id;

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Direction.
		// @type {String}
		this._direction = direction;

		// Extended RTP capabilities.
		// @type {Object}
		this._extendedRtpCapabilities = extendedRtpCapabilities;

		// Whether we can produce audio/video based on computed extended RTP
		// capabilities.
		// @type {Object}
		this._canProduceByKind = canProduceByKind;

		// SCTP max message size if enabled, null otherwise.
		// @type {Number|Null}
		this._maxSctpMessageSize =
			sctpParameters ? sctpParameters.maxMessageSize : null;

		// RTC handler instance.
		// @type {Handler}
		this._handler = new Handler(
			{
				direction,
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				iceServers,
				iceTransportPolicy,
				proprietaryConstraints,
				extendedRtpCapabilities
			});

		// Transport connection state. Values can be:
		// 'new'/'connecting'/'connected'/'failed'/'disconnected'/'closed'
		// @type {String}
		this._connectionState = 'new';

		// App custom data.
		// @type {Object}
		this._appData = appData;

		// Map of Producers indexed by id.
		// @type {Map<String, Producer>}
		this._producers = new Map();

		// Map of Consumers indexed by id.
		// @type {Map<String, Consumer>}
		this._consumers = new Map();

		// Map of DataProducers indexed by id.
		// @type {Map<String, DataProducer>}
		this._dataProducers = new Map();

		// Map of DataConsumers indexed by id.
		// @type {Map<String, DataConsumer>}
		this._dataConsumers = new Map();

		// Whether the Consumer for RTP probation has been created.
		// @type {Boolean}
		this._probatorConsumerCreated = false;

		// AwaitQueue instance to make async tasks happen sequentially.
		// @type {AwaitQueue}
		this._awaitQueue = new AwaitQueue({ ClosedErrorClass: InvalidStateError });

		this._handleHandler();
	}

	/**
	 * Transport id.
	 *
	 * @returns {String}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Whether the Transport is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Transport direction.
	 *
	 * @returns {String}
	 */
	get direction()
	{
		return this._direction;
	}

	/**
	 * RTC handler instance.
	 *
	 * @returns {Handler}
	 */
	get handler()
	{
		return this._handler;
	}

	/**
	 * Connection state.
	 *
	 * @returns {String}
	 */
	get connectionState()
	{
		return this._connectionState;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get appData()
	{
		return this._appData;
	}

	/**
	 * Invalid setter.
	 */
	set appData(appData) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override appData object');
	}

	/**
	 * Close the Transport.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;

		// Close the AwaitQueue.
		this._awaitQueue.close();

		// Close the handler.
		this._handler.close();

		// Close all Producers.
		for (const producer of this._producers.values())
		{
			producer.transportClosed();
		}
		this._producers.clear();

		// Close all Consumers.
		for (const consumer of this._consumers.values())
		{
			consumer.transportClosed();
		}
		this._consumers.clear();

		// Close all DataProducers.
		for (const dataProducer of this._dataProducers.values())
		{
			dataProducer.transportClosed();
		}
		this._dataProducers.clear();

		// Close all DataConsumers.
		for (const dataConsumer of this._dataConsumers.values())
		{
			dataConsumer.transportClosed();
		}
		this._dataConsumers.clear();
	}

	/**
	 * Get associated Transport (RTCPeerConnection) stats.
	 *
	 * @async
	 * @returns {RTCStatsReport}
	 * @throws {InvalidStateError} if Transport closed.
	 */
	async getStats()
	{
		if (this._closed)
			throw new InvalidStateError('closed');

		return this._handler.getTransportStats();
	}

	/**
	 * Restart ICE connection.
	 *
	 * @param {RTCIceParameters} iceParameters - New Server-side Transport ICE parameters.
	 *
	 * @async
	 * @throws {InvalidStateError} if Transport closed.
	 * @throws {TypeError} if wrong arguments.
	 */
	async restartIce({ iceParameters } = {})
	{
		logger.debug('restartIce()');

		if (this._closed)
			throw new InvalidStateError('closed');
		else if (!iceParameters)
			throw new TypeError('missing iceParameters');

		// Enqueue command.
		return this._awaitQueue.push(
			async () => this._handler.restartIce({ iceParameters }));
	}

	/**
	 * Update ICE servers.
	 *
	 * @param {Array<RTCIceServer>} [iceServers] - Array of ICE servers.
	 *
	 * @async
	 * @throws {InvalidStateError} if Transport closed.
	 * @throws {TypeError} if wrong arguments.
	 */
	async updateIceServers({ iceServers } = {})
	{
		logger.debug('updateIceServers()');

		if (this._closed)
			throw new InvalidStateError('closed');
		else if (!Array.isArray(iceServers))
			throw new TypeError('missing iceServers');

		// Enqueue command.
		return this._awaitQueue.push(
			async () => this._handler.updateIceServers({ iceServers }));
	}

	/**
	 * Create a Producer.
	 *
	 * @param {MediaStreamTrack} track - Track to sent.
	 * @param {Array<RTCRtpCodingParameters>} [encodings] - Encodings.
	 * @param {Object} [codecOptions] - Codec options.
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @async
	 * @returns {Producer}
	 * @throws {InvalidStateError} if Transport closed or track ended.
	 * @throws {TypeError} if wrong arguments.
	 * @throws {UnsupportedError} if Transport direction is incompatible or
	 *   cannot produce the given media kind.
	 */
	async produce(
		{
			track,
			encodings,
			codecOptions,
			appData = {}
		} = {}
	)
	{
		logger.debug('produce() [track:%o]', track);

		if (!track)
			throw new TypeError('missing track');
		else if (this._direction !== 'send')
			throw new UnsupportedError('not a sending Transport');
		else if (!this._canProduceByKind[track.kind])
			throw new UnsupportedError(`cannot produce ${track.kind}`);
		else if (track.readyState === 'ended')
			throw new InvalidStateError('track ended');
		else if (appData && typeof appData !== 'object')
			throw new TypeError('if given, appData must be an object');

		// Enqueue command.
		return this._awaitQueue.push(
			async () =>
			{
				let normalizedEncodings;

				if (encodings && !Array.isArray(encodings))
				{
					throw TypeError('encodings must be an array');
				}
				else if (encodings && encodings.length === 0)
				{
					normalizedEncodings = undefined;
				}
				else if (encodings)
				{
					normalizedEncodings = encodings
						.map((encoding) =>
						{
							const normalizedEncoding = { active: true };

							if (encoding.active === false)
								normalizedEncoding.active = false;
							if (typeof encoding.maxBitrate === 'number')
								normalizedEncoding.maxBitrate = encoding.maxBitrate;
							if (typeof encoding.maxFramerate === 'number')
								normalizedEncoding.maxFramerate = encoding.maxFramerate;
							if (typeof encoding.scaleResolutionDownBy === 'number')
								normalizedEncoding.scaleResolutionDownBy = encoding.scaleResolutionDownBy;
							if (typeof encoding.dtx === 'boolean')
								normalizedEncoding.dtx = encoding.dtx;
							if (typeof encoding.scalabilityMode === 'string')
								normalizedEncoding.scalabilityMode = encoding.scalabilityMode;

							return normalizedEncoding;
						});
				}

				const { localId, rtpParameters } = await this._handler.send(
					{
						track,
						encodings : normalizedEncodings,
						codecOptions
					});

				try
				{
					const { id } = await this.safeEmitAsPromise(
						'produce',
						{
							kind : track.kind,
							rtpParameters,
							appData
						});

					const producer =
						new Producer({ id, localId, track, rtpParameters, appData });

					this._producers.set(producer.id, producer);
					this._handleProducer(producer);

					return producer;
				}
				catch (error)
				{
					this._handler.stopSending({ localId })
						.catch(() => {});

					throw error;
				}
			})
			// This catch is needed to stop the given track if the command above
			// failed due to closed Transport.
			.catch((error) =>
			{
				try { track.stop(); }
				catch (error2) {}

				throw error;
			});
	}

	/**
	 * Create a Consumer to consume a remote Producer.
	 *
	 * @param {String} id - Server-side Consumer id.
	 * @param {String} producerId - Server-side Producer id.
	 * @param {String} kind - 'audio' or 'video'.
	 * @param {RTCRtpParameters} rtpParameters - Server-side Consumer RTP parameters.
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @async
	 * @returns {Consumer}
	 * @throws {InvalidStateError} if Transport closed.
	 * @throws {TypeError} if wrong arguments.
	 * @throws {UnsupportedError} if Transport direction is incompatible.
	 */
	async consume(
		{
			id,
			producerId,
			kind,
			rtpParameters,
			appData = {}
		} = {})
	{
		logger.debug('consume()');

		if (this._closed)
			throw new InvalidStateError('closed');
		else if (this._direction !== 'recv')
			throw new UnsupportedError('not a receiving Transport');
		else if (typeof id !== 'string')
			throw new TypeError('missing id');
		else if (typeof producerId !== 'string')
			throw new TypeError('missing producerId');
		else if (kind !== 'audio' && kind !== 'video')
			throw new TypeError(`invalid kind "${kind}"`);
		else if (typeof rtpParameters !== 'object')
			throw new TypeError('missing rtpParameters');
		else if (appData && typeof appData !== 'object')
			throw new TypeError('if given, appData must be an object');

		// Enqueue command.
		return this._awaitQueue.push(
			async () =>
			{
				// Ensure the device can consume it.
				const canConsume = ortc.canReceive(
					rtpParameters, this._extendedRtpCapabilities);

				if (!canConsume)
					throw new UnsupportedError('cannot consume this Producer');

				const { localId, track } =
					await this._handler.receive({ id, kind, rtpParameters });

				const consumer =
					new Consumer({ id, localId, producerId, track, rtpParameters, appData });

				this._consumers.set(consumer.id, consumer);
				this._handleConsumer(consumer);

				// If this is the first video Consumer and the Consumer for RTP probation
				// has not yet been created, create it now.
				if (!this._probatorConsumerCreated && kind === 'video')
				{
					try
					{
						const probatorRtpParameters =
							ortc.generateProbatorRtpParameters(consumer.rtpParameters);

						await this._handler.receive(
							{
								id            : 'probator',
								kind          : 'video',
								rtpParameters : probatorRtpParameters
							});

						logger.debug('consume() | Consumer for RTP probation created');

						this._probatorConsumerCreated = true;
					}
					catch (error)
					{
						logger.warn(
							'consume() | failed to create Consumer for RTP probation:%o',
							error);
					}
				}

				return consumer;
			});
	}

	/**
	 * Create a DataProducer
	 *
	 * @param {Boolean} [ordered=true]
	 * @param {Number} [maxPacketLifeTime]
	 * @param {Number} [maxRetransmits]
	 * @param {String} [priority='low'] // 'very-low' / 'low' / 'medium' / 'high'
	 * @param {String} [label='']
	 * @param {String} [protocol='']
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @async
	 * @returns {DataProducer}
	 * @throws {InvalidStateError} if Transport closed.
	 * @throws {TypeError} if wrong arguments.
	 * @throws {UnsupportedError} if Transport direction is incompatible or remote
	 *   transport does not enable SCTP.
	 */
	async produceData(
		{
			ordered = true,
			maxPacketLifeTime,
			maxRetransmits,
			priority = 'low',
			label = '',
			protocol = '',
			appData = {}
		} = {}
	)
	{
		logger.debug('produceData()');

		if (this._direction !== 'send')
			throw new UnsupportedError('not a sending Transport');
		else if (!this._maxSctpMessageSize)
			throw new UnsupportedError('SCTP not enabled by remote Transport');
		else if (![ 'very-low', 'low', 'medium', 'high' ].includes(priority))
			throw new TypeError('wrong priority');
		else if (appData && typeof appData !== 'object')
			throw new TypeError('if given, appData must be an object');

		if (maxPacketLifeTime || maxRetransmits)
			ordered = false;

		// Enqueue command.
		return this._awaitQueue.push(
			async () =>
			{
				const {
					dataChannel,
					sctpStreamParameters
				} = await this._handler.sendDataChannel(
					{
						ordered,
						maxPacketLifeTime,
						maxRetransmits,
						priority,
						label,
						protocol
					});

				const { id } = await this.safeEmitAsPromise(
					'producedata',
					{
						sctpStreamParameters,
						label,
						protocol,
						appData
					});

				const dataProducer =
					new DataProducer({ id, dataChannel, sctpStreamParameters, appData });

				this._dataProducers.set(dataProducer.id, dataProducer);
				this._handleDataProducer(dataProducer);

				return dataProducer;
			});
	}

	/**
	 * Create a DataConsumer
	 *
	 * @param {String} id - Server-side DataConsumer id.
	 * @param {String} dataProducerId - Server-side DataProducer id.
	 * @param {RTCSctpStreamParameters} sctpStreamParameters - Server-side DataConsumer
	 *   SCTP parameters.
	 * @param {String} [label='']
	 * @param {String} [protocol='']
	 * @param {Object} [appData={}] - Custom app data.
	 *
	 * @async
	 * @returns {DataConsumer}
	 * @throws {InvalidStateError} if Transport closed.
	 * @throws {TypeError} if wrong arguments.
	 * @throws {UnsupportedError} if Transport direction is incompatible or remote
	 *   transport does not enable SCTP.
	 */
	async consumeData(
		{
			id,
			dataProducerId,
			sctpStreamParameters,
			label = '',
			protocol = '',
			appData = {}
		} = {}
	)
	{
		logger.debug('consumeData()');

		if (this._closed)
			throw new InvalidStateError('closed');
		else if (this._direction !== 'recv')
			throw new UnsupportedError('not a receiving Transport');
		else if (!this._maxSctpMessageSize)
			throw new UnsupportedError('SCTP not enabled by remote Transport');
		else if (typeof id !== 'string')
			throw new TypeError('missing id');
		else if (typeof dataProducerId !== 'string')
			throw new TypeError('missing dataProducerId');
		else if (typeof sctpStreamParameters !== 'object')
			throw new TypeError('missing sctpStreamParameters');
		else if (appData && typeof appData !== 'object')
			throw new TypeError('if given, appData must be an object');

		// Enqueue command.
		return this._awaitQueue.push(
			async () =>
			{
				const {
					dataChannel
				} = await this._handler.receiveDataChannel(
					{
						sctpStreamParameters,
						label,
						protocol
					});

				const dataConsumer = new DataConsumer(
					{
						id,
						dataProducerId,
						dataChannel,
						sctpStreamParameters,
						appData
					});

				this._dataConsumers.set(dataConsumer.id, dataConsumer);
				this._handleDataConsumer(dataConsumer);

				return dataConsumer;
			});
	}

	_handleHandler()
	{
		const handler = this._handler;

		handler.on('@connect', ({ dtlsParameters }, callback, errback) =>
		{
			if (this._closed)
			{
				errback(new InvalidStateError('closed'));

				return;
			}

			this.safeEmit('connect', { dtlsParameters }, callback, errback);
		});

		handler.on('@connectionstatechange', (connectionState) =>
		{
			if (connectionState === this._connectionState)
				return;

			logger.debug('connection state changed to %s', connectionState);

			this._connectionState = connectionState;

			if (!this._closed)
				this.safeEmit('connectionstatechange', connectionState);
		});
	}

	_handleProducer(producer)
	{
		producer.on('@close', () =>
		{
			this._producers.delete(producer.id);

			if (this._closed)
				return;

			this._awaitQueue.push(
				async () => this._handler.stopSending({ localId: producer.localId }))
				.catch((error) => logger.warn('producer.close() failed:%o', error));
		});

		producer.on('@replacetrack', (track, callback, errback) =>
		{
			this._awaitQueue.push(
				async () => this._handler.replaceTrack({ localId: producer.localId, track }))
				.then(callback)
				.catch(errback);
		});

		producer.on('@setmaxspatiallayer', (spatialLayer, callback, errback) =>
		{
			this._awaitQueue.push(
				async () => (
					this._handler.setMaxSpatialLayer({ localId: producer.localId, spatialLayer })
				))
				.then(callback)
				.catch(errback);
		});

		producer.on('@getstats', (callback, errback) =>
		{
			if (this._closed)
				return errback(new InvalidStateError('closed'));

			this._handler.getSenderStats({ localId: producer.localId })
				.then(callback)
				.catch(errback);
		});
	}

	_handleConsumer(consumer)
	{
		consumer.on('@close', () =>
		{
			this._consumers.delete(consumer.id);

			if (this._closed)
				return;

			this._awaitQueue.push(
				async () => this._handler.stopReceiving({ localId: consumer.localId }))
				.catch(() => {});
		});

		consumer.on('@getstats', (callback, errback) =>
		{
			if (this._closed)
				return errback(new InvalidStateError('closed'));

			this._handler.getReceiverStats({ localId: consumer.localId })
				.then(callback)
				.catch(errback);
		});
	}

	_handleDataProducer(dataProducer)
	{
		dataProducer.on('@close', () =>
		{
			this._dataProducers.delete(dataProducer.id);
		});
	}

	_handleDataConsumer(dataConsumer)
	{
		dataConsumer.on('@close', () =>
		{
			this._dataConsumers.delete(dataConsumer.id);
		});
	}
}

module.exports = Transport;

},{"./Consumer":40,"./DataConsumer":41,"./DataProducer":42,"./EnhancedEventEmitter":44,"./Logger":45,"./Producer":46,"./errors":49,"./ortc":66,"awaitqueue":33}],48:[function(require,module,exports){
/* global RTCRtpTransceiver */

const bowser = require('bowser');
const Logger = require('./Logger');
// const Chrome74 = require('./handlers/Chrome74'); // Disabled for now.
const Chrome70 = require('./handlers/Chrome70');
const Chrome67 = require('./handlers/Chrome67');
const Chrome55 = require('./handlers/Chrome55');
const Firefox60 = require('./handlers/Firefox60');
const Safari12 = require('./handlers/Safari12');
const Safari11 = require('./handlers/Safari11');
const Edge11 = require('./handlers/Edge11');
const ReactNative = require('./handlers/ReactNative');

const logger = new Logger('detectDevice');

module.exports = function()
{
	// React-Native.
	// NOTE: react-native-webrtc >= 1.75.0 is required.
	if (typeof navigator === 'object' && navigator.product === 'ReactNative')
	{
		if (typeof RTCPeerConnection === 'undefined')
		{
			logger.warn('unsupported ReactNative without RTCPeerConnection');

			return null;
		}

		return ReactNative;
	}
	// Browser.
	else if (typeof navigator === 'object' && typeof navigator.userAgent === 'string')
	{
		const ua = navigator.userAgent;
		const browser = bowser.getParser(ua);
		const engine = browser.getEngine();

		// Chrome and Chromium.
		// NOTE: Disable Chrome74 handler for now.
		// if (browser.satisfies({ chrome: '>=74', chromium: '>=74' }))
		// {
		// 	return Chrome74;
		// }
		if (browser.satisfies({ chrome: '>=70', chromium: '>=70' }))
		{
			return Chrome70;
		}
		else if (browser.satisfies({ chrome: '>=67', chromium: '>=67' }))
		{
			return Chrome67;
		}
		else if (browser.satisfies({ chrome: '>=55', chromium: '>=55' }))
		{
			return Chrome55;
		}
		// Firefox.
		else if (browser.satisfies({ firefox: '>=60' }))
		{
			return Firefox60;
		}
		// Safari with Unified-Plan support.
		else if (
			browser.satisfies({ safari: '>=12.1' }) &&
			typeof RTCRtpTransceiver !== 'undefined' &&
			RTCRtpTransceiver.prototype.hasOwnProperty('currentDirection')
		)
		{
			return Safari12;
		}
		// Safari with Plab-B support.
		else if (browser.satisfies({ safari: '>=11' }))
		{
			return Safari11;
		}
		// Old Edge with ORTC support.
		else if (
			browser.satisfies({ 'microsoft edge': '>=11' }) &&
			browser.satisfies({ 'microsoft edge': '<=18' })
		)
		{
			return Edge11;
		}
		// Best effort for Chromium based browsers.
		else if (engine.name.toLowerCase() === 'blink')
		{
			logger.debug('best effort Chromium based browser detection');

			const match = ua.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);

			if (match)
			{
				const version = Number(match[1]);

				// NOTE: Disable Chrome74 handler for now.
				// if (version >= 74)
				// 	return Chrome74;
				if (version >= 70)
					return Chrome70;
				else if (version >= 67)
					return Chrome67;
				else
					return Chrome55;
			}
			else
			{
				// NOTE: Disable Chrome74 handler for now.
				// return Chrome74;
				return Chrome70;
			}
		}
		// Unsupported browser.
		else
		{
			logger.warn(
				'browser not supported [name:%s, version:%s]',
				browser.getBrowserName(), browser.getBrowserVersion());

			return null;
		}
	}
	// Unknown device.
	else
	{
		logger.warn('unknown device');

		return null;
	}
};

},{"./Logger":45,"./handlers/Chrome55":50,"./handlers/Chrome67":51,"./handlers/Chrome70":52,"./handlers/Edge11":54,"./handlers/Firefox60":55,"./handlers/ReactNative":56,"./handlers/Safari11":57,"./handlers/Safari12":58,"bowser":34}],49:[function(require,module,exports){
/**
 * Error indicating not support for something.
 */
class UnsupportedError extends Error
{
	constructor(message)
	{
		super(message);

		this.name = 'UnsupportedError';

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
			Error.captureStackTrace(this, UnsupportedError);
		else
			this.stack = (new Error(message)).stack;
	}
}

/**
 * Error produced when calling a method in an invalid state.
 */
class InvalidStateError extends Error
{
	constructor(message)
	{
		super(message);

		this.name = 'InvalidStateError';

		if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
			Error.captureStackTrace(this, InvalidStateError);
		else
			this.stack = (new Error(message)).stack;
	}
}

module.exports =
{
	UnsupportedError,
	InvalidStateError
};

},{}],50:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpPlanBUtils = require('./sdp/planBUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('Chrome55');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				planB : true
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			},
			proprietaryConstraints);

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();

		// Map of MediaStreamTracks indexed by localId.
		// @type {Map<Number, MediaStreamTracks>}
		this._mapIdTrack = new Map();

		// Latest localId.
		// @type {Number}
		this._lastId = 0;
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		this._stream.addTrack(track);
		this._pc.addStream(this._stream);

		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (track.kind === 'video' && encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'video');

			sdpPlanBUtils.addLegacySimulcast(
				{
					offerMediaObject,
					track,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media
			.find((m) => m.type === track.kind);

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpPlanBUtils.getRtpEncodings({ offerMediaObject, track });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// If VP8 and there is effective simulcast, add scalabilityMode to each
		// encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8'
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		this._lastId++;

		// Insert into the map.
		this._mapIdTrack.set(this._lastId, track);

		return { localId: this._lastId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const track = this._mapIdTrack.get(localId);

		if (!track)
			throw new Error('track not found');

		this._mapIdTrack.delete(localId);
		this._stream.removeTrack(track);
		this._pc.addStream(this._stream);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		try
		{
			await this._pc.setLocalDescription(offer);
		}
		catch (error)
		{
			// NOTE: If there are no sending tracks, setLocalDescription() will fail with
			// "Failed to create channels". If so, ignore it.
			if (this._stream.getTracks().length === 0)
			{
				logger.warn(
					'stopSending() | ignoring expected error due no sending tracks: %s',
					error.toString());

				return;
			}

			throw error;
		}

		if (this._pc.signalingState === 'stable')
			return;

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	// eslint-disable-next-line no-unused-vars
	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		throw new UnsupportedError('not supported');
	}

	async getSenderStats({ localId }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated        : true,
			id                : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		// Value is an Object with mid and rtpParameters.
		// @type {Map<String, Object>}
		this._mapIdRtpParameters = new Map();
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = id;
		const mid = kind;
		const streamId = rtpParameters.rtcp.cname;

		this._remoteSdp.receive(
			{
				mid,
				kind,
				offerRtpParameters : rtpParameters,
				streamId,
				trackId            : localId
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === mid);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const stream = this._pc.getRemoteStreams()
			.find((s) => s.id === streamId);
		const track = stream.getTrackById(localId);

		if (!track)
			throw new Error('remote track not found');

		// Insert into the map.
		this._mapIdRtpParameters.set(localId, { mid, rtpParameters });

		return { localId, track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const { mid, rtpParameters } = this._mapIdRtpParameters.get(localId);

		// Remove from the map.
		this._mapIdRtpParameters.delete(localId);

		this._remoteSdp.planBStopReceiving(
			{ mid, offerRtpParameters: rtpParameters });

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated        : true,
			id                : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Chrome55
{
	static get name()
	{
		return 'Chrome55';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			});

		try
		{
			const offer = await pc.createOffer(
				{
					offerToReceiveAudio : true,
					offerToReceiveVideo : true
				});

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Chrome55;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/planBUtils":63,"sdp-transform":89}],51:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpPlanBUtils = require('./sdp/planBUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('Chrome67');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				planB : true
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			},
			proprietaryConstraints);

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();

		// Map of MediaStreamTracks indexed by localId.
		// @type {Map<Number, MediaStreamTracks>}
		this._mapIdTrack = new Map();

		// Latest localId.
		// @type {Number}
		this._lastId = 0;
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		this._stream.addTrack(track);
		this._pc.addTrack(track, this._stream);

		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (track.kind === 'video' && encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'video');

			sdpPlanBUtils.addLegacySimulcast(
				{
					offerMediaObject,
					track,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media
			.find((m) => m.type === track.kind);

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpPlanBUtils.getRtpEncodings({ offerMediaObject, track });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// If VP8 and there is effective simulcast, add scalabilityMode to each
		// encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8'
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		this._lastId++;

		// Insert into the map.
		this._mapIdTrack.set(this._lastId, track);

		return { localId: this._lastId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const track = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === track);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		this._pc.removeTrack(rtpSender);
		this._stream.removeTrack(track);
		this._mapIdTrack.delete(localId);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		try
		{
			await this._pc.setLocalDescription(offer);
		}
		catch (error)
		{
			// NOTE: If there are no sending tracks, setLocalDescription() will fail with
			// "Failed to create channels". If so, ignore it.
			if (this._stream.getTracks().length === 0)
			{
				logger.warn(
					'stopSending() | ignoring expected error due no sending tracks: %s',
					error.toString());

				return;
			}

			throw error;
		}

		if (this._pc.signalingState === 'stable')
			return;

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const oldTrack = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === oldTrack);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		await rtpSender.replaceTrack(track);

		// Remove the old track from the local stream.
		this._stream.removeTrack(oldTrack);

		// Add the new track to the local stream.
		this._stream.addTrack(track);

		// Replace entry in the map.
		this._mapIdTrack.set(localId, track);
	}

	// eslint-disable-next-line no-unused-vars
	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		throw new UnsupportedError('not supported');
	}

	async getSenderStats({ localId })
	{
		const track = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === track);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		return rtpSender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated        : true,
			id                : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		// Value is an Object with mid, rtpParameters and rtpReceiver.
		// @type {Map<String, Object>}
		this._mapIdRtpParameters = new Map();
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = id;
		const mid = kind;

		this._remoteSdp.receive(
			{
				mid,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : localId
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === mid);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const rtpReceiver = this._pc.getReceivers()
			.find((r) => r.track && r.track.id === localId);

		if (!rtpReceiver)
			throw new Error('new RTCRtpReceiver not');

		// Insert into the map.
		this._mapIdRtpParameters.set(localId, { mid, rtpParameters, rtpReceiver });

		return { localId, track: rtpReceiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const { mid, rtpParameters } = this._mapIdRtpParameters.get(localId);

		// Remove from the map.
		this._mapIdRtpParameters.delete(localId);

		this._remoteSdp.planBStopReceiving(
			{ mid, offerRtpParameters: rtpParameters });

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId })
	{
		const { rtpReceiver } = this._mapIdRtpParameters.get(localId);

		if (!rtpReceiver)
			throw new Error('associated RTCRtpReceiver not found');

		return rtpReceiver.getStats();
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated        : true,
			id                : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Chrome67
{
	static get name()
	{
		return 'Chrome67';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			});

		try
		{
			const offer = await pc.createOffer(
				{
					offerToReceiveAudio : true,
					offerToReceiveVideo : true
				});

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Chrome67;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/planBUtils":63,"sdp-transform":89}],52:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpUnifiedPlanUtils = require('./sdp/unifiedPlanUtils');
const RemoteSdp = require('./sdp/RemoteSdp');
const parseScalabilityMode = require('../scalabilityModes').parse;

const logger = new Logger('Chrome70');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'unified-plan'
			},
			proprietaryConstraints);

		// Map of RTCTransceivers indexed by MID.
		// @type {Map<String, RTCTransceiver>}
		this._mapMidTransceiver = new Map();

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		const transceiver = this._pc.addTransceiver(
			track, { direction: 'sendonly', streams: [ this._stream ] });
		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling legacy simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

			sdpUnifiedPlanUtils.addLegacySimulcast(
				{
					offerMediaObject,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		// Special case for VP9 with SVC.
		let hackVp9Svc = false;

		const layers =
			parseScalabilityMode((encodings || [ {} ])[0].scalabilityMode);

		if (
			encodings &&
			encodings.length === 1 &&
			layers.spatialLayers > 1 &&
			sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9'
		)
		{
			logger.debug('send() | enabling legacy simulcast for VP9 SVC');

			hackVp9Svc = true;
			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

			sdpUnifiedPlanUtils.addLegacySimulcast(
				{
					offerMediaObject,
					numStreams : layers.spatialLayers
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		// We can now get the transceiver.mid.
		const localId = transceiver.mid;

		// Set MID.
		sendingRtpParameters.mid = localId;

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// Hack for VP9 SVC.
		if (hackVp9Svc)
			sendingRtpParameters.encodings = [ sendingRtpParameters.encodings[0] ];

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				reuseMid            : mediaSectionIdx.reuseMid,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		return { localId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		transceiver.sender.replaceTrack(null);
		this._pc.removeTrack(transceiver.sender);
		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		await transceiver.sender.replaceTrack(track);
	}

	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		logger.debug(
			'setMaxSpatialLayer() [localId:%s, spatialLayer:%s]',
			localId, spatialLayer);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		const parameters = transceiver.sender.getParameters();

		parameters.encodings.forEach((encoding, idx) =>
		{
			if (idx <= spatialLayer)
				encoding.active = true;
			else
				encoding.active = false;
		});

		await transceiver.sender.setParameters(parameters);
	}

	async getSenderStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.sender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated        : true,
			id                : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// MID value counter. It must be converted to string and incremented for
		// each new m= section.
		// @type {Number}
		this._nextMid = 0;
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = String(this._nextMid);

		this._remoteSdp.receive(
			{
				mid                : localId,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : id
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === localId);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const transceiver = this._pc.getTransceivers()
			.find((t) => t.mid === localId);

		if (!transceiver)
			throw new Error('new RTCRtpTransceiver not found');

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		// Increase next MID.
		this._nextMid++;

		return { localId, track: transceiver.receiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.receiver.getStats();
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated        : true,
			id                : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation();

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Chrome70
{
	static get name()
	{
		return 'Chrome70';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'unified-plan'
			});

		try
		{
			pc.addTransceiver('audio');
			pc.addTransceiver('video');

			const offer = await pc.createOffer();

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Chrome70;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../ortc":66,"../scalabilityModes":67,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/unifiedPlanUtils":64,"sdp-transform":89}],53:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpUnifiedPlanUtils = require('./sdp/unifiedPlanUtils');
const RemoteSdp = require('./sdp/RemoteSdp');
const parseScalabilityMode = require('../scalabilityModes').parse;

const logger = new Logger('Chrome74');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'unified-plan'
			},
			proprietaryConstraints);

		// Map of RTCTransceivers indexed by MID.
		// @type {Map<String, RTCTransceiver>}
		this._mapMidTransceiver = new Map();

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		if (encodings && encodings.length > 1)
		{
			encodings.forEach((encoding, idx) =>
			{
				encoding.rid = `r${idx}`;
			});
		}

		const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		const transceiver = this._pc.addTransceiver(
			track,
			{
				direction     : 'sendonly',
				streams       : [ this._stream ],
				sendEncodings : encodings
			});
		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		// Special case for VP9 with SVC.
		let hackVp9Svc = false;

		const layers =
			parseScalabilityMode((encodings || [ {} ])[0].scalabilityMode);

		if (
			encodings &&
			encodings.length === 1 &&
			layers.spatialLayers > 1 &&
			sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9'
		)
		{
			logger.debug('send() | enabling legacy simulcast for VP9 SVC');

			hackVp9Svc = true;
			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

			sdpUnifiedPlanUtils.addLegacySimulcast(
				{
					offerMediaObject,
					numStreams : layers.spatialLayers
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		await this._pc.setLocalDescription(offer);

		// We can now get the transceiver.mid.
		const localId = transceiver.mid;

		// Set MID.
		sendingRtpParameters.mid = localId;

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings by parsing the SDP offer if no encodings are given.
		if (!encodings)
		{
			sendingRtpParameters.encodings =
				sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });
		}
		// Set RTP encodings by parsing the SDP offer and complete them with given
		// one if just a single encoding has been given.
		else if (encodings.length === 1)
		{
			let newEncodings =
				sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });

			Object.assign(newEncodings[0], encodings[0]);

			// Hack for VP9 SVC.
			if (hackVp9Svc)
				newEncodings = [ newEncodings[0] ];

			sendingRtpParameters.encodings = newEncodings;
		}
		// Otherwise if more than 1 encoding are given use them verbatim.
		else
		{
			sendingRtpParameters.encodings = encodings;
		}

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				reuseMid            : mediaSectionIdx.reuseMid,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		return { localId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		transceiver.sender.replaceTrack(null);
		this._pc.removeTrack(transceiver.sender);
		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		await transceiver.sender.replaceTrack(track);
	}

	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		logger.debug(
			'setMaxSpatialLayer() [localId:%s, spatialLayer:%s]',
			localId, spatialLayer);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		const parameters = transceiver.sender.getParameters();

		parameters.encodings.forEach((encoding, idx) =>
		{
			if (idx <= spatialLayer)
				encoding.active = true;
			else
				encoding.active = false;
		});

		await transceiver.sender.setParameters(parameters);
	}

	async getSenderStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.sender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated : true,
			id         : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// MID value counter. It must be converted to string and incremented for
		// each new m= section.
		// @type {Number}
		this._nextMid = 0;
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = String(this._nextMid);

		this._remoteSdp.receive(
			{
				mid                : localId,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : id
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === localId);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const transceiver = this._pc.getTransceivers()
			.find((t) => t.mid === localId);

		if (!transceiver)
			throw new Error('new RTCRtpTransceiver not found');

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		// Increase next MID.
		this._nextMid++;

		return { localId, track: transceiver.receiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.receiver.getStats();
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated : true,
			id         : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation();

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Chrome74
{
	static get name()
	{
		return 'Chrome74';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'unified-plan'
			});

		try
		{
			pc.addTransceiver('audio');
			pc.addTransceiver('video');

			const offer = await pc.createOffer();

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Chrome74;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../ortc":66,"../scalabilityModes":67,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/unifiedPlanUtils":64,"sdp-transform":89}],54:[function(require,module,exports){
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const edgeUtils = require('./ortc/edgeUtils');

const logger = new Logger('Edge11');

class Edge11 extends EnhancedEventEmitter
{
	static get name()
	{
		return 'Edge11';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		return edgeUtils.getCapabilities();
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : 0
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints, // eslint-disable-line no-unused-vars
			extendedRtpCapabilities
		}
	)
	{
		super(logger);

		logger.debug('constructor() [direction:%s]', direction);

		// Generic sending RTP parameters for audio and video.
		// @type {Object}
		this._sendingRtpParametersByKind =
		{
			audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
			video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
		};

		// Transport remote ICE parameters.
		// @type {RTCIceParameters}
		this._remoteIceParameters = iceParameters;

		// Transport remote ICE candidates.
		// @type {Array<RTCIceCandidate>}
		this._remoteIceCandidates = iceCandidates;

		// Transport remote DTLS parameters.
		// @type {RTCDtlsParameters}
		this._remoteDtlsParameters = dtlsParameters;

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// ICE gatherer.
		this._iceGatherer = null;

		// ICE transport.
		this._iceTransport = null;

		// DTLS transport.
		// @type {RTCDtlsTransport}
		this._dtlsTransport = null;

		// Map of RTCRtpSenders indexed by id.
		// @type {Map<String, RTCRtpSender}
		this._rtpSenders = new Map();

		// Map of RTCRtpReceivers indexed by id.
		// @type {Map<String, RTCRtpReceiver}
		this._rtpReceivers = new Map();

		// Latest localId for sending tracks.
		// @type {Number}
		this._lastSendId = 0;

		// Local RTCP CNAME.
		// @type {String}
		this._cname = `CNAME-${utils.generateRandomNumber()}`;

		this._setIceGatherer({ iceServers, iceTransportPolicy });
		this._setIceTransport();
		this._setDtlsTransport();
	}

	close()
	{
		logger.debug('close()');

		// Close the ICE gatherer.
		// NOTE: Not yet implemented by Edge.
		try { this._iceGatherer.close(); }
		catch (error) {}

		// Close the ICE transport.
		try { this._iceTransport.stop(); }
		catch (error) {}

		// Close the DTLS transport.
		try { this._dtlsTransport.stop(); }
		catch (error) {}

		// Close RTCRtpSenders.
		for (const rtpSender of this._rtpSenders.values())
		{
			try { rtpSender.stop(); }
			catch (error) {}
		}

		// Close RTCRtpReceivers.
		for (const rtpReceiver of this._rtpReceivers.values())
		{
			try { rtpReceiver.stop(); }
			catch (error) {}
		}
	}

	async getTransportStats()
	{
		return this._iceTransport.getStats();
	}

	async send({ track, encodings })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server' });

		logger.debug('send() | calling new RTCRtpSender()');

		const rtpSender = new RTCRtpSender(track, this._dtlsTransport);
		const rtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);
		const useRtx = rtpParameters.codecs
			.some((codec) => /.+\/rtx$/i.test(codec.mimeType));

		if (!encodings)
			encodings = [ {} ];

		for (const encoding of encodings)
		{
			encoding.ssrc = utils.generateRandomNumber();

			if (useRtx)
				encoding.rtx = { ssrc: utils.generateRandomNumber() };
		}

		rtpParameters.encodings = encodings;

		// Fill RTCRtpParameters.rtcp.
		rtpParameters.rtcp =
		{
			cname       : this._cname,
			reducedSize : true,
			mux         : true
		};

		// NOTE: Convert our standard RTCRtpParameters into those that Edge
		// expects.
		const edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);

		logger.debug(
			'send() | calling rtpSender.send() [params:%o]',
			edgeRtpParameters);

		await rtpSender.send(edgeRtpParameters);

		this._lastSendId++;

		// Store it.
		this._rtpSenders.set(this._lastSendId, rtpSender);

		return { localId: this._lastSendId, rtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const rtpSender = this._rtpSenders.get(localId);

		if (!rtpSender)
			throw new Error('RTCRtpSender not found');

		this._rtpSenders.delete(localId);

		try
		{
			logger.debug('stopSending() | calling rtpSender.stop()');

			rtpSender.stop();
		}
		catch (error)
		{
			logger.warn('stopSending() | rtpSender.stop() failed:%o', error);

			throw error;
		}
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const rtpSender = this._rtpSenders.get(localId);

		if (!rtpSender)
			throw new Error('RTCRtpSender not found');

		const oldTrack = rtpSender.track;

		rtpSender.setTrack(track);

		// Replace key.
		this._rtpSenders.delete(oldTrack.id);
		this._rtpSenders.set(track.id, rtpSender);
	}

	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		logger.debug(
			'setMaxSpatialLayer() [localId:%s, spatialLayer:%s]',
			localId, spatialLayer);

		const rtpSender = this._rtpSenders.get(localId);

		if (!rtpSender)
			throw new Error('RTCRtpSender not found');

		const parameters = rtpSender.getParameters();

		parameters.encodings
			.forEach((encoding, idx) =>
			{
				if (idx <= spatialLayer)
					encoding.active = true;
				else
					encoding.active = false;
			});

		await rtpSender.setParameters(parameters);
	}

	async getSenderStats({ localId })
	{
		const rtpSender = this._rtpSenders.get(localId);

		if (!rtpSender)
			throw new Error('RTCRtpSender not found');

		return rtpSender.getStats();
	}

	async sendDataChannel()
	{
		throw new UnsupportedError('not implemented');
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server' });

		logger.debug('receive() | calling new RTCRtpReceiver()');

		const rtpReceiver = new RTCRtpReceiver(this._dtlsTransport, kind);

		rtpReceiver.addEventListener('error', (event) =>
		{
			logger.error('iceGatherer "error" event [event:%o]', event);
		});

		// NOTE: Convert our standard RTCRtpParameters into those that Edge
		// expects.
		const edgeRtpParameters =
			edgeUtils.mangleRtpParameters(rtpParameters);

		logger.debug(
			'receive() | calling rtpReceiver.receive() [params:%o]',
			edgeRtpParameters);

		await rtpReceiver.receive(edgeRtpParameters);

		const localId = id;

		// Store it.
		this._rtpReceivers.set(localId, rtpReceiver);

		return { localId, track: rtpReceiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const rtpReceiver = this._rtpReceivers.get(localId);

		if (!rtpReceiver)
			throw new Error('RTCRtpReceiver not found');

		this._rtpReceivers.delete(localId);

		try
		{
			logger.debug('stopReceiving() | calling rtpReceiver.stop()');

			rtpReceiver.stop();
		}
		catch (error)
		{
			logger.warn('stopReceiving() | rtpReceiver.stop() failed:%o', error);
		}
	}

	async getReceiverStats({ localId })
	{
		const rtpReceiver = this._rtpReceivers.get(localId);

		if (!rtpReceiver)
			throw new Error('RTCRtpReceiver not found');

		return rtpReceiver.getStats();
	}

	async receiveDataChannel()
	{
		throw new UnsupportedError('not implemented');
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		this._remoteIceParameters = iceParameters;

		if (!this._transportReady)
			return;

		logger.debug('restartIce() | calling iceTransport.start()');

		this._iceTransport.start(
			this._iceGatherer, iceParameters, 'controlling');

		for (const candidate of this._remoteIceCandidates)
		{
			this._iceTransport.addRemoteCandidate(candidate);
		}

		this._iceTransport.addRemoteCandidate({});
	}

	// eslint-disable-next-line no-unused-vars
	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		// NOTE: Edge 11 does not implement iceGatherer.gater().
		throw new UnsupportedError('not supported');
	}

	_setIceGatherer({ iceServers, iceTransportPolicy })
	{
		const iceGatherer = new RTCIceGatherer(
			{
				iceServers   : iceServers || [],
				gatherPolicy : iceTransportPolicy || 'all'
			});

		iceGatherer.addEventListener('error', (event) =>
		{
			logger.error('iceGatherer "error" event [event:%o]', event);
		});

		// NOTE: Not yet implemented by Edge, which starts gathering automatically.
		try
		{
			iceGatherer.gather();
		}
		catch (error)
		{
			logger.debug(
				'_setIceGatherer() | iceGatherer.gather() failed: %s', error.toString());
		}

		this._iceGatherer = iceGatherer;
	}

	_setIceTransport()
	{
		const iceTransport = new RTCIceTransport(this._iceGatherer);

		// NOTE: Not yet implemented by Edge.
		iceTransport.addEventListener('statechange', () =>
		{
			switch (iceTransport.state)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});

		// NOTE: Not standard, but implemented by Edge.
		iceTransport.addEventListener('icestatechange', () =>
		{
			switch (iceTransport.state)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});

		iceTransport.addEventListener('candidatepairchange', (event) =>
		{
			logger.debug(
				'iceTransport "candidatepairchange" event [pair:%o]', event.pair);
		});

		this._iceTransport = iceTransport;
	}

	_setDtlsTransport()
	{
		const dtlsTransport = new RTCDtlsTransport(this._iceTransport);

		// NOTE: Not yet implemented by Edge.
		dtlsTransport.addEventListener('statechange', () =>
		{
			logger.debug(
				'dtlsTransport "statechange" event [state:%s]', dtlsTransport.state);
		});

		// NOTE: Not standard, but implemented by Edge.
		dtlsTransport.addEventListener('dtlsstatechange', () =>
		{
			logger.debug(
				'dtlsTransport "dtlsstatechange" event [state:%s]', dtlsTransport.state);

			if (dtlsTransport.state === 'closed')
				this.emit('@connectionstatechange', 'closed');
		});

		dtlsTransport.addEventListener('error', (event) =>
		{
			logger.error('dtlsTransport "error" event [event:%o]', event);
		});

		this._dtlsTransport = dtlsTransport;
	}

	async _setupTransport({ localDtlsRole })
	{
		logger.debug('_setupTransport()');

		// Get our local DTLS parameters.
		const dtlsParameters = this._dtlsTransport.getLocalParameters();

		dtlsParameters.role = localDtlsRole;

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		// Start the RTCIceTransport.
		this._iceTransport.start(
			this._iceGatherer, this._remoteIceParameters, 'controlling');

		// Add remote ICE candidates.
		for (const candidate of this._remoteIceCandidates)
		{
			this._iceTransport.addRemoteCandidate(candidate);
		}

		// Also signal a 'complete' candidate as per spec.
		// NOTE: It should be {complete: true} but Edge prefers {}.
		// NOTE: If we don't signal end of candidates, the Edge RTCIceTransport
		// won't enter the 'completed' state.
		this._iceTransport.addRemoteCandidate({});

		// NOTE: Edge does not like SHA less than 256.
		this._remoteDtlsParameters.fingerprints = this._remoteDtlsParameters.fingerprints
			.filter((fingerprint) =>
			{
				return (
					fingerprint.algorithm === 'sha-256' ||
					fingerprint.algorithm === 'sha-384' ||
					fingerprint.algorithm === 'sha-512'
				);
			});

		// Start the RTCDtlsTransport.
		this._dtlsTransport.start(this._remoteDtlsParameters);

		this._transportReady = true;
	}
}

module.exports = Edge11;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./ortc/edgeUtils":59}],55:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpUnifiedPlanUtils = require('./sdp/unifiedPlanUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('Firefox60');

const SCTP_NUM_STREAMS = { OS: 16, MIS: 2048 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			},
			proprietaryConstraints);

		// Map of RTCTransceivers indexed by MID.
		// @type {Map<String, RTCTransceiver>}
		this._mapMidTransceiver = new Map();

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers }) // eslint-disable-line no-unused-vars
	{
		logger.debug('updateIceServers()');

		// NOTE: Firefox does not implement pc.setConfiguration().
		throw new UnsupportedError('not supported');
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		let reverseEncodings;

		if (encodings && encodings.length > 1)
		{
			encodings.forEach((encoding, idx) =>
			{
				encoding.rid = `r${idx}`;
			});

			// Clone the encodings and reverse them because Firefox likes them
			// from high to low.
			reverseEncodings = utils.clone(encodings).reverse();
		}

		const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		const transceiver = this._pc.addTransceiver(
			track, { direction: 'sendonly', streams: [ this._stream ] });

		// NOTE: This is not spec compliants. Encodings should be given in addTransceiver
		// second argument, but Firefox does not support it.
		if (reverseEncodings)
		{
			const parameters = transceiver.sender.getParameters();

			parameters.encodings = reverseEncodings;
			await transceiver.sender.setParameters(parameters);
		}

		const offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		// In Firefox use DTLS role client even if we are the "offerer" since
		// Firefox does not respect ICE-Lite.
		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		// We can now get the transceiver.mid.
		const localId = transceiver.mid;

		// Set MID.
		sendingRtpParameters.mid = localId;

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		const offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings by parsing the SDP offer if no encodings are given.
		if (!encodings)
		{
			sendingRtpParameters.encodings =
				sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });
		}
		// Set RTP encodings by parsing the SDP offer and complete them with given
		// one if just a single encoding has been given.
		else if (encodings.length === 1)
		{
			const newEncodings =
				sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });

			Object.assign(newEncodings[0], encodings[0]);

			sendingRtpParameters.encodings = newEncodings;
		}
		// Otherwise if more than 1 encoding are given use them verbatim.
		else
		{
			sendingRtpParameters.encodings = encodings;
		}

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				reuseMid            : mediaSectionIdx.reuseMid,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		return { localId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		transceiver.sender.replaceTrack(null);
		this._pc.removeTrack(transceiver.sender);
		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		await transceiver.sender.replaceTrack(track);
	}

	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		logger.debug(
			'setMaxSpatialLayer() [localId:%s, spatialLayer:%s]',
			localId, spatialLayer);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		const parameters = transceiver.sender.getParameters();

		// NOTE: We require encodings given from low to high, however Firefox
		// requires them in reverse order, so do magic here.
		spatialLayer = parameters.encodings.length - 1 - spatialLayer;

		parameters.encodings.forEach((encoding, idx) =>
		{
			if (idx >= spatialLayer)
				encoding.active = true;
			else
				encoding.active = false;
		});

		await transceiver.sender.setParameters(parameters);
	}

	async getSenderStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		return transceiver.sender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated : true,
			id         : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// MID value counter. It must be converted to string and incremented for
		// each new m= section.
		// @type {Number}
		this._nextMid = 0;
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = String(this._nextMid);

		this._remoteSdp.receive(
			{
				mid                : localId,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : id
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === localId);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const transceiver = this._pc.getTransceivers()
			.find((t) => t.mid === localId);

		if (!transceiver)
			throw new Error('new transceiver not found');

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		// Increase next MID.
		this._nextMid++;

		return { localId, track: transceiver.receiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated transceiver not found');

		return transceiver.receiver.getStats();
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated : true,
			id         : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation();

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Firefox60
{
	static get name()
	{
		return 'Firefox60';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		// NOTE: We need to add a real video track to get the RID extension mapping.
		const canvas = document.createElement('canvas');

		// NOTE: Otherwise Firefox fails in next line.
		canvas.getContext('2d');

		const fakeStream = canvas.captureStream();
		const fakeVideoTrack = fakeStream.getVideoTracks()[0];

		try
		{
			pc.addTransceiver('audio', { direction: 'sendrecv' });

			const videoTransceiver =
				pc.addTransceiver(fakeVideoTrack, { direction: 'sendrecv' });
			const parameters = videoTransceiver.sender.getParameters();
			const encodings =
			[
				{ rid: 'r0', maxBitrate: 100000 },
				{ rid: 'r1', maxBitrate: 500000 }
			];

			parameters.encodings = encodings;
			await videoTransceiver.sender.setParameters(parameters);

			const offer = await pc.createOffer();

			try { canvas.remove(); }
			catch (error) {}

			try { fakeVideoTrack.stop(); }
			catch (error) {}

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { canvas.remove(); }
			catch (error2) {}

			try { fakeVideoTrack.stop(); }
			catch (error2) {}

			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Firefox60;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/unifiedPlanUtils":64,"sdp-transform":89}],56:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpPlanBUtils = require('./sdp/planBUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('ReactNative');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				planB : true
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			},
			proprietaryConstraints);

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();

		// Map of MediaStreamTracks indexed by localId.
		// @type {Map<Number, MediaStreamTracks>}
		this._mapIdTrack = new Map();

		// Latest localId.
		// @type {Number}
		this._lastId = 0;
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		this._stream.addTrack(track);
		this._pc.addStream(this._stream);

		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (track.kind === 'video' && encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'video');

			sdpPlanBUtils.addLegacySimulcast(
				{
					offerMediaObject,
					track,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		const offerDesc = new RTCSessionDescription(offer);

		await this._pc.setLocalDescription(offerDesc);

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media
			.find((m) => m.type === track.kind);

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpPlanBUtils.getRtpEncodings({ offerMediaObject, track });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		const answerDesc = new RTCSessionDescription(answer);

		await this._pc.setRemoteDescription(answerDesc);

		this._lastId++;

		// Insert into the map.
		this._mapIdTrack.set(this._lastId, track);

		return { localId: this._lastId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const track = this._mapIdTrack.get(localId);

		if (!track)
			throw new Error('track not found');

		this._mapIdTrack.delete(localId);
		this._stream.removeTrack(track);
		this._pc.addStream(this._stream);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		try
		{
			await this._pc.setLocalDescription(offer);
		}
		catch (error)
		{
			// NOTE: If there are no sending tracks, setLocalDescription() will fail with
			// "Failed to create channels". If so, ignore it.
			if (this._stream.getTracks().length === 0)
			{
				logger.warn(
					'stopSending() | ignoring expected error due no sending tracks: %s',
					error.toString());

				return;
			}

			throw error;
		}

		if (this._pc.signalingState === 'stable')
			return;

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		const answerDesc = new RTCSessionDescription(answer);

		await this._pc.setRemoteDescription(answerDesc);
	}

	async replaceTrack({ localId, track }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	// eslint-disable-next-line no-unused-vars
	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		throw new UnsupportedError('not supported');
	}

	async getSenderStats({ localId }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated        : true,
			id                : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		const answerDesc = new RTCSessionDescription(answer);

		await this._pc.setRemoteDescription(answerDesc);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		// Value is an Object with mid and rtpParameters.
		// @type {Map<String, Object>}
		this._mapIdRtpParameters = new Map();
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = id;
		const mid = kind;
		const streamId = rtpParameters.rtcp.cname;

		this._remoteSdp.receive(
			{
				mid,
				kind,
				offerRtpParameters : rtpParameters,
				streamId,
				trackId            : localId
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		const offerDesc = new RTCSessionDescription(offer);

		await this._pc.setRemoteDescription(offerDesc);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === mid);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		const answerDesc = new RTCSessionDescription(answer);

		await this._pc.setLocalDescription(answerDesc);

		const stream = this._pc.getRemoteStreams()
			.find((s) => s.id === streamId);
		const track = stream.getTrackById(localId);

		if (!track)
			throw new Error('remote track not found');

		// Insert into the map.
		this._mapIdRtpParameters.set(localId, { mid, rtpParameters });

		return { localId, track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const { mid, rtpParameters } = this._mapIdRtpParameters.get(localId);

		// Remove from the map.
		this._mapIdRtpParameters.delete(localId);

		this._remoteSdp.planBStopReceiving(
			{ mid, offerRtpParameters: rtpParameters });

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		const offerDesc = new RTCSessionDescription(offer);

		await this._pc.setRemoteDescription(offerDesc);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId }) // eslint-disable-line no-unused-vars
	{
		throw new UnsupportedError('not implemented');
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated        : true,
			id                : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmitTime : maxPacketLifeTime, // NOTE: Old spec.
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		const offerDesc = new RTCSessionDescription(offer);

		await this._pc.setRemoteDescription(offerDesc);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class ReactNative
{
	static get name()
	{
		return 'ReactNative';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require',
				sdpSemantics       : 'plan-b'
			});

		try
		{
			const offer = await pc.createOffer(
				{
					offerToReceiveAudio : true,
					offerToReceiveVideo : true
				});

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = ReactNative;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/planBUtils":63,"sdp-transform":89}],57:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const { UnsupportedError } = require('../errors');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpPlanBUtils = require('./sdp/planBUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('Safari11');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters,
				planB : true
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			},
			proprietaryConstraints);

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();

		// Map of MediaStreamTracks indexed by localId.
		// @type {Map<Number, MediaStreamTracks>}
		this._mapIdTrack = new Map();

		// Latest localId.
		// @type {Number}
		this._lastId = 0;
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		this._stream.addTrack(track);
		this._pc.addTrack(track, this._stream);

		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (track.kind === 'video' && encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'video');

			sdpPlanBUtils.addLegacySimulcast(
				{
					offerMediaObject,
					track,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media
			.find((m) => m.type === track.kind);

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpPlanBUtils.getRtpEncodings({ offerMediaObject, track });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		this._lastId++;

		// Insert into the map.
		this._mapIdTrack.set(this._lastId, track);

		return { localId: this._lastId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const track = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === track);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		this._pc.removeTrack(rtpSender);
		this._stream.removeTrack(track);
		this._mapIdTrack.delete(localId);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		try
		{
			await this._pc.setLocalDescription(offer);
		}
		catch (error)
		{
			// NOTE: If there are no sending tracks, setLocalDescription() will fail with
			// "Failed to create channels". If so, ignore it.
			if (this._stream.getTracks().length === 0)
			{
				logger.warn(
					'stopSending() | ignoring expected error due no sending tracks: %s',
					error.toString());

				return;
			}

			throw error;
		}

		if (this._pc.signalingState === 'stable')
			return;

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const oldTrack = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === oldTrack);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		await rtpSender.replaceTrack(track);

		// Remove the old track from the local stream.
		this._stream.removeTrack(oldTrack);

		// Add the new track to the local stream.
		this._stream.addTrack(track);

		// Replace entry in the map.
		this._mapIdTrack.set(localId, track);
	}

	// eslint-disable-next-line no-unused-vars
	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		throw new UnsupportedError('not supported');
	}

	async getSenderStats({ localId })
	{
		const track = this._mapIdTrack.get(localId);
		const rtpSender = this._pc.getSenders()
			.find((s) => s.track === track);

		if (!rtpSender)
			throw new Error('associated RTCRtpSender not found');

		return rtpSender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated : true,
			id         : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		// Value is an Object with mid, rtpParameters and rtpReceiver.
		// @type {Map<String, Object>}
		this._mapIdRtpParameters = new Map();
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = id;
		const mid = kind;

		this._remoteSdp.receive(
			{
				mid,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : localId
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === mid);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const rtpReceiver = this._pc.getReceivers()
			.find((r) => r.track && r.track.id === localId);

		if (!rtpReceiver)
			throw new Error('new RTCRtpReceiver not');

		// Insert into the map.
		this._mapIdRtpParameters.set(localId, { mid, rtpParameters, rtpReceiver });

		return { localId, track: rtpReceiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const { mid, rtpParameters } = this._mapIdRtpParameters.get(localId);

		// Remove from the map.
		this._mapIdRtpParameters.delete(localId);

		this._remoteSdp.planBStopReceiving(
			{ mid, offerRtpParameters: rtpParameters });

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async getReceiverStats({ localId })
	{
		const { rtpReceiver } = this._mapIdRtpParameters.get(localId);

		if (!rtpReceiver)
			throw new Error('associated RTCRtpReceiver not found');

		return rtpReceiver.getStats();
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated : true,
			id         : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Safari11
{
	static get name()
	{
		return 'Safari11';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		try
		{
			pc.addTransceiver('audio');
			pc.addTransceiver('video');

			const offer = await pc.createOffer();

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Safari11;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../errors":49,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/planBUtils":63,"sdp-transform":89}],58:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const utils = require('../utils');
const ortc = require('../ortc');
const sdpCommonUtils = require('./sdp/commonUtils');
const sdpUnifiedPlanUtils = require('./sdp/unifiedPlanUtils');
const RemoteSdp = require('./sdp/RemoteSdp');

const logger = new Logger('Safari12');

const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };

class Handler extends EnhancedEventEmitter
{
	constructor(
		{
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints
		}
	)
	{
		super(logger);

		// Got transport local and remote parameters.
		// @type {Boolean}
		this._transportReady = false;

		// Remote SDP handler.
		// @type {RemoteSdp}
		this._remoteSdp = new RemoteSdp(
			{
				iceParameters,
				iceCandidates,
				dtlsParameters,
				sctpParameters
			});

		// RTCPeerConnection instance.
		// @type {RTCPeerConnection}
		this._pc = new RTCPeerConnection(
			{
				iceServers         : iceServers || [],
				iceTransportPolicy : iceTransportPolicy || 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			},
			proprietaryConstraints);

		// Map of RTCTransceivers indexed by MID.
		// @type {Map<String, RTCTransceiver>}
		this._mapMidTransceiver = new Map();

		// Whether a DataChannel m=application section has been created.
		// @type {Boolean}
		this._hasDataChannelMediaSection = false;

		// DataChannel id value counter. It must be incremented for each new DataChannel.
		// @type {Number}
		this._nextSctpStreamId = 0;

		// Handle RTCPeerConnection connection status.
		this._pc.addEventListener('iceconnectionstatechange', () =>
		{
			switch (this._pc.iceConnectionState)
			{
				case 'checking':
					this.emit('@connectionstatechange', 'connecting');
					break;
				case 'connected':
				case 'completed':
					this.emit('@connectionstatechange', 'connected');
					break;
				case 'failed':
					this.emit('@connectionstatechange', 'failed');
					break;
				case 'disconnected':
					this.emit('@connectionstatechange', 'disconnected');
					break;
				case 'closed':
					this.emit('@connectionstatechange', 'closed');
					break;
			}
		});
	}

	close()
	{
		logger.debug('close()');

		// Close RTCPeerConnection.
		try { this._pc.close(); }
		catch (error) {}
	}

	async getTransportStats()
	{
		return this._pc.getStats();
	}

	async updateIceServers({ iceServers })
	{
		logger.debug('updateIceServers()');

		const configuration = this._pc.getConfiguration();

		configuration.iceServers = iceServers;

		this._pc.setConfiguration(configuration);
	}

	async _setupTransport({ localDtlsRole, localSdpObject = null })
	{
		if (!localSdpObject)
			localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);

		// Get our local DTLS parameters.
		const dtlsParameters =
			sdpCommonUtils.extractDtlsParameters({ sdpObject: localSdpObject });

		// Set our DTLS role.
		dtlsParameters.role = localDtlsRole;

		// Update the remote DTLS role in the SDP.
		this._remoteSdp.updateDtlsRole(
			localDtlsRole === 'client' ? 'server' : 'client');

		// Need to tell the remote transport about our parameters.
		await this.safeEmitAsPromise('@connect', { dtlsParameters });

		this._transportReady = true;
	}
}

class SendHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// Generic sending RTP parameters for audio and video.
		// @type {RTCRtpParameters}
		this._sendingRtpParametersByKind = data.sendingRtpParametersByKind;

		// Generic sending RTP parameters for audio and video suitable for the SDP
		// remote answer.
		// @type {RTCRtpParameters}
		this._sendingRemoteRtpParametersByKind = data.sendingRemoteRtpParametersByKind;

		// Local stream.
		// @type {MediaStream}
		this._stream = new MediaStream();
	}

	async send({ track, encodings, codecOptions })
	{
		logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

		const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		const transceiver = this._pc.addTransceiver(
			track, { direction: 'sendonly', streams: [ this._stream ] });
		let offer = await this._pc.createOffer();
		let localSdpObject = sdpTransform.parse(offer.sdp);
		let offerMediaObject;
		const sendingRtpParameters =
			utils.clone(this._sendingRtpParametersByKind[track.kind]);

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

		if (encodings && encodings.length > 1)
		{
			logger.debug('send() | enabling legacy simulcast');

			localSdpObject = sdpTransform.parse(offer.sdp);
			offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

			sdpUnifiedPlanUtils.addLegacySimulcast(
				{
					offerMediaObject,
					numStreams : encodings.length
				});

			offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		}

		logger.debug(
			'send() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		// We can now get the transceiver.mid.
		const localId = transceiver.mid;

		// Set MID.
		sendingRtpParameters.mid = localId;

		localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];

		// Set RTCP CNAME.
		sendingRtpParameters.rtcp.cname =
			sdpCommonUtils.getCname({ offerMediaObject });

		// Set RTP encodings.
		sendingRtpParameters.encodings =
			sdpUnifiedPlanUtils.getRtpEncodings({ offerMediaObject });

		// Complete encodings with given values.
		if (encodings)
		{
			for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx)
			{
				if (encodings[idx])
					Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
			}
		}

		// If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		// each encoding.
		if (
			sendingRtpParameters.encodings.length > 1 &&
			(
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
				sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264'
			)
		)
		{
			for (const encoding of sendingRtpParameters.encodings)
			{
				encoding.scalabilityMode = 'S1T3';
			}
		}

		this._remoteSdp.send(
			{
				offerMediaObject,
				reuseMid            : mediaSectionIdx.reuseMid,
				offerRtpParameters  : sendingRtpParameters,
				answerRtpParameters : this._sendingRemoteRtpParametersByKind[track.kind],
				codecOptions
			});

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'send() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		return { localId, rtpParameters: sendingRtpParameters };
	}

	async stopSending({ localId })
	{
		logger.debug('stopSending() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		transceiver.sender.replaceTrack(null);
		this._pc.removeTrack(transceiver.sender);
		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = await this._pc.createOffer();

		logger.debug(
			'stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}

	async replaceTrack({ localId, track })
	{
		logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		await transceiver.sender.replaceTrack(track);
	}

	async setMaxSpatialLayer({ localId, spatialLayer })
	{
		logger.debug(
			'setMaxSpatialLayer() [localId:%s, spatialLayer:%s]',
			localId, spatialLayer);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		const parameters = transceiver.sender.getParameters();

		parameters.encodings.forEach((encoding, idx) =>
		{
			if (idx <= spatialLayer)
				encoding.active = true;
			else
				encoding.active = false;
		});

		await transceiver.sender.setParameters(parameters);
	}

	async getSenderStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.sender.getStats();
	}

	async sendDataChannel(
		{
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			label,
			protocol,
			priority
		})
	{
		logger.debug('sendDataChannel()');

		const options =
		{
			negotiated : true,
			id         : this._nextSctpStreamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol,
			priority
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// Increase next id.
		this._nextSctpStreamId = ++this._nextSctpStreamId % SCTP_NUM_STREAMS.MIS;

		// If this is the first DataChannel we need to create the SDP answer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			const offer = await this._pc.createOffer();
			const localSdpObject = sdpTransform.parse(offer.sdp);
			const offerMediaObject = localSdpObject.media
				.find((m) => m.type === 'application');

			if (!this._transportReady)
				await this._setupTransport({ localDtlsRole: 'server', localSdpObject });

			logger.debug(
				'sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);

			await this._pc.setLocalDescription(offer);

			this._remoteSdp.sendSctpAssociation({ offerMediaObject });

			const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setRemoteDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		const sctpStreamParameters =
		{
			streamId          : options.id,
			ordered           : options.ordered,
			maxPacketLifeTime : options.maxPacketLifeTime,
			maxRetransmits    : options.maxRetransmits
		};

		return { dataChannel, sctpStreamParameters };
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = await this._pc.createOffer({ iceRestart: true });

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);

		await this._pc.setLocalDescription(offer);

		const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);

		await this._pc.setRemoteDescription(answer);
	}
}

class RecvHandler extends Handler
{
	constructor(data)
	{
		super(data);

		// MID value counter. It must be converted to string and incremented for
		// each new m= section.
		// @type {Number}
		this._nextMid = 0;
	}

	async receive({ id, kind, rtpParameters })
	{
		logger.debug('receive() [id:%s, kind:%s]', id, kind);

		const localId = String(this._nextMid);

		this._remoteSdp.receive(
			{
				mid                : localId,
				kind,
				offerRtpParameters : rtpParameters,
				streamId           : rtpParameters.rtcp.cname,
				trackId            : id
			});

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'receive() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		let answer = await this._pc.createAnswer();
		const localSdpObject = sdpTransform.parse(answer.sdp);
		const answerMediaObject = localSdpObject.media
			.find((m) => String(m.mid) === localId);

		// May need to modify codec parameters in the answer based on codec
		// parameters in the offer.
		sdpCommonUtils.applyCodecParameters(
			{
				offerRtpParameters : rtpParameters,
				answerMediaObject
			});

		answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };

		if (!this._transportReady)
			await this._setupTransport({ localDtlsRole: 'client', localSdpObject });

		logger.debug(
			'receive() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);

		const transceiver = this._pc.getTransceivers()
			.find((t) => t.mid === localId);

		if (!transceiver)
			throw new Error('new RTCRtpTransceiver not found');

		// Store in the map.
		this._mapMidTransceiver.set(localId, transceiver);

		// Increase next MID.
		this._nextMid++;

		return { localId, track: transceiver.receiver.track };
	}

	async stopReceiving({ localId })
	{
		logger.debug('stopReceiving() [localId:%s]', localId);

		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		this._remoteSdp.closeMediaSection(transceiver.mid);

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}

	async receiveDataChannel({ sctpStreamParameters, label, protocol })
	{
		logger.debug('receiveDataChannel()');

		const {
			streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits
		} = sctpStreamParameters;

		const options =
		{
			negotiated : true,
			id         : streamId,
			ordered,
			maxPacketLifeTime,
			maxRetransmits,
			protocol
		};

		logger.debug('DataChannel options:%o', options);

		const dataChannel = this._pc.createDataChannel(label, options);

		// If this is the first DataChannel we need to create the SDP offer with
		// m=application section.
		if (!this._hasDataChannelMediaSection)
		{
			this._remoteSdp.receiveSctpAssociation();

			const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);

			await this._pc.setRemoteDescription(offer);

			const answer = await this._pc.createAnswer();

			if (!this._transportReady)
			{
				const localSdpObject = sdpTransform.parse(answer.sdp);

				await this._setupTransport({ localDtlsRole: 'client', localSdpObject });
			}

			logger.debug(
				'receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);

			await this._pc.setLocalDescription(answer);

			this._hasDataChannelMediaSection = true;
		}

		return { dataChannel };
	}

	async getReceiverStats({ localId })
	{
		const transceiver = this._mapMidTransceiver.get(localId);

		if (!transceiver)
			throw new Error('associated RTCRtpTransceiver not found');

		return transceiver.receiver.getStats();
	}

	async restartIce({ iceParameters })
	{
		logger.debug('restartIce()');

		// Provide the remote SDP handler with new remote ICE parameters.
		this._remoteSdp.updateIceParameters(iceParameters);

		if (!this._transportReady)
			return;

		const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };

		logger.debug(
			'restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);

		await this._pc.setRemoteDescription(offer);

		const answer = await this._pc.createAnswer();

		logger.debug(
			'restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);

		await this._pc.setLocalDescription(answer);
	}
}

class Safari12
{
	static get name()
	{
		return 'Safari12';
	}

	static async getNativeRtpCapabilities()
	{
		logger.debug('getNativeRtpCapabilities()');

		const pc = new RTCPeerConnection(
			{
				iceServers         : [],
				iceTransportPolicy : 'all',
				bundlePolicy       : 'max-bundle',
				rtcpMuxPolicy      : 'require'
			});

		try
		{
			pc.addTransceiver('audio');
			pc.addTransceiver('video');

			const offer = await pc.createOffer();

			try { pc.close(); }
			catch (error) {}

			const sdpObject = sdpTransform.parse(offer.sdp);
			const nativeRtpCapabilities =
				sdpCommonUtils.extractRtpCapabilities({ sdpObject });

			return nativeRtpCapabilities;
		}
		catch (error)
		{
			try { pc.close(); }
			catch (error2) {}

			throw error;
		}
	}

	static async getNativeSctpCapabilities()
	{
		logger.debug('getNativeSctpCapabilities()');

		return {
			numStreams : SCTP_NUM_STREAMS
		};
	}

	constructor(
		{
			direction,
			iceParameters,
			iceCandidates,
			dtlsParameters,
			sctpParameters,
			iceServers,
			iceTransportPolicy,
			proprietaryConstraints,
			extendedRtpCapabilities
		}
	)
	{
		logger.debug('constructor() [direction:%s]', direction);

		switch (direction)
		{
			case 'send':
			{
				const sendingRtpParametersByKind =
				{
					audio : ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
				};

				const sendingRemoteRtpParametersByKind =
				{
					audio : ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
					video : ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
				};

				return new SendHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints,
						sendingRtpParametersByKind,
						sendingRemoteRtpParametersByKind
					});
			}

			case 'recv':
			{
				return new RecvHandler(
					{
						iceParameters,
						iceCandidates,
						dtlsParameters,
						sctpParameters,
						iceServers,
						iceTransportPolicy,
						proprietaryConstraints
					});
			}
		}
	}
}

module.exports = Safari12;

},{"../EnhancedEventEmitter":44,"../Logger":45,"../ortc":66,"../utils":68,"./sdp/RemoteSdp":61,"./sdp/commonUtils":62,"./sdp/unifiedPlanUtils":64,"sdp-transform":89}],59:[function(require,module,exports){
const utils = require('../../utils');

/**
 * Normalize Edge's RTCRtpReceiver.getCapabilities() to produce a full
 * compliant ORTC RTCRtpCapabilities.
 *
 * @returns {RTCRtpCapabilities}
 */
exports.getCapabilities = function()
{
	const nativeCaps = RTCRtpReceiver.getCapabilities();
	const caps = utils.clone(nativeCaps);

	for (const codec of caps.codecs)
	{
		// Rename numChannels to channels.
		codec.channels = codec.numChannels;
		delete codec.numChannels;

		// Normalize channels.
		if (codec.kind !== 'audio')
			delete codec.channels;
		else if (!codec.channels)
			codec.channels = 1;

		// Add mimeType.
		codec.mimeType = codec.mimeType || `${codec.kind}/${codec.name}`;

		// NOTE: Edge sets some numeric parameters as String rather than Number. Fix them.
		if (codec.parameters)
		{
			const parameters = codec.parameters;

			if (parameters.apt)
				parameters.apt = Number(parameters.apt);

			if (parameters['packetization-mode'])
				parameters['packetization-mode'] = Number(parameters['packetization-mode']);
		}

		// Delete emty parameter String in rtcpFeedback.
		for (const feedback of codec.rtcpFeedback || [])
		{
			if (!feedback.parameter)
				delete feedback.parameter;
		}
	}

	return caps;
};

/**
 * Generate RTCRtpParameters as Edge like them.
 *
 * @param  {RTCRtpParameters} rtpParameters
 * @returns {RTCRtpParameters}
 */
exports.mangleRtpParameters = function(rtpParameters)
{
	const params = utils.clone(rtpParameters);

	// Rename mid to muxId.
	if (params.mid)
	{
		params.muxId = params.mid;
		delete params.mid;
	}

	for (const codec of params.codecs)
	{
		// Rename channels to numChannels.
		if (codec.channels)
		{
			codec.numChannels = codec.channels;
			delete codec.channels;
		}

		// Add codec.name (requried by Edge).
		if (codec.mimeType && !codec.name)
			codec.name = codec.mimeType.split('/')[1];

		// Remove mimeType.
		delete codec.mimeType;
	}

	return params;
};

},{"../../utils":68}],60:[function(require,module,exports){
const utils = require('../../utils');

class MediaSection
{
	constructor(
		{
			iceParameters = undefined,
			iceCandidates = undefined,
			dtlsParameters = undefined,
			planB = false
		} = {}
	)
	{
		// SDP media object.
		// @type {Object}
		this._mediaObject = {};

		// Whether this is Plan-B SDP.
		// @type {Boolean}
		this._planB = planB;

		if (iceParameters)
		{
			this.setIceParameters(iceParameters);
		}

		if (iceCandidates)
		{
			this._mediaObject.candidates = [];

			for (const candidate of iceCandidates)
			{
				const candidateObject = {};

				// mediasoup does mandates rtcp-mux so candidates component is always
				// RTP (1).
				candidateObject.component = 1;
				candidateObject.foundation = candidate.foundation;
				candidateObject.ip = candidate.ip;
				candidateObject.port = candidate.port;
				candidateObject.priority = candidate.priority;
				candidateObject.transport = candidate.protocol;
				candidateObject.type = candidate.type;
				if (candidate.tcpType)
					candidateObject.tcptype = candidate.tcpType;

				this._mediaObject.candidates.push(candidateObject);
			}

			this._mediaObject.endOfCandidates = 'end-of-candidates';
			this._mediaObject.iceOptions = 'renomination';
		}

		if (dtlsParameters)
		{
			this.setDtlsRole(dtlsParameters.role);
		}
	}

	/**
	 * @returns {String}
	 */
	get mid()
	{
		return String(this._mediaObject.mid);
	}

	/**
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._mediaObject.port === 0;
	}

	/**
	 * @returns {Object}
	 */
	getObject()
	{
		return this._mediaObject;
	}

	/**
	 * @param {RTCIceParameters} iceParameters
	 */
	setIceParameters(iceParameters)
	{
		this._mediaObject.iceUfrag = iceParameters.usernameFragment;
		this._mediaObject.icePwd = iceParameters.password;
	}

	disable()
	{
		this._mediaObject.direction = 'inactive';

		delete this._mediaObject.ext;
		delete this._mediaObject.ssrcs;
		delete this._mediaObject.ssrcGroups;
		delete this._mediaObject.simulcast;
		delete this._mediaObject.simulcast_03;
		delete this._mediaObject.rids;
	}

	close()
	{
		this._mediaObject.direction = 'inactive';

		this._mediaObject.port = 0;

		delete this._mediaObject.ext;
		delete this._mediaObject.ssrcs;
		delete this._mediaObject.ssrcGroups;
		delete this._mediaObject.simulcast;
		delete this._mediaObject.simulcast_03;
		delete this._mediaObject.rids;
		delete this._mediaObject.ext;
		delete this._mediaObject.extmapAllowMixed;
	}
}

class AnswerMediaSection extends MediaSection
{
	constructor(data)
	{
		super(data);

		const {
			sctpParameters,
			offerMediaObject,
			offerRtpParameters,
			answerRtpParameters,
			plainRtpParameters,
			codecOptions
		} = data;

		this._mediaObject.mid = String(offerMediaObject.mid);
		this._mediaObject.type = offerMediaObject.type;
		this._mediaObject.protocol = offerMediaObject.protocol;

		if (!plainRtpParameters)
		{
			this._mediaObject.connection = { ip: '127.0.0.1', version: 4 };
			this._mediaObject.port = 7;
		}
		else
		{
			this._mediaObject.connection =
			{
				ip      : plainRtpParameters.ip,
				version : plainRtpParameters.ipVersion
			};
			this._mediaObject.port = plainRtpParameters.port;
		}

		switch (offerMediaObject.type)
		{
			case 'audio':
			case 'video':
			{
				this._mediaObject.direction = 'recvonly';
				this._mediaObject.rtp = [];
				this._mediaObject.rtcpFb = [];
				this._mediaObject.fmtp = [];

				for (const codec of answerRtpParameters.codecs)
				{
					const rtp =
					{
						payload : codec.payloadType,
						codec   : codec.mimeType.replace(/^.*\//, ''),
						rate    : codec.clockRate
					};

					if (codec.channels > 1)
						rtp.encoding = codec.channels;

					this._mediaObject.rtp.push(rtp);

					const codecParameters = utils.clone(codec.parameters || {});

					if (codecOptions)
					{
						const {
							opusStereo,
							opusFec,
							opusDtx,
							opusMaxPlaybackRate,
							videoGoogleStartBitrate,
							videoGoogleMaxBitrate,
							videoGoogleMinBitrate
						} = codecOptions;

						const offerCodec = offerRtpParameters.codecs
							.find((c) => c.payloadType === codec.payloadType);

						switch (codec.mimeType.toLowerCase())
						{
							case 'audio/opus':
							{
								if (opusStereo !== undefined)
								{
									offerCodec.parameters['sprop-stereo'] = opusStereo ? 1 : 0;
									codecParameters.stereo = opusStereo ? 1 : 0;
								}

								if (opusFec !== undefined)
								{
									offerCodec.parameters.useinbandfec = opusFec ? 1 : 0;
									codecParameters.useinbandfec = opusFec ? 1 : 0;
								}

								if (opusDtx !== undefined)
								{
									offerCodec.parameters.usedtx = opusDtx ? 1 : 0;
									codecParameters.usedtx = opusDtx ? 1 : 0;
								}

								if (opusMaxPlaybackRate !== undefined)
									codecParameters.maxplaybackrate = opusMaxPlaybackRate;

								break;
							}

							case 'video/vp8':
							case 'video/vp9':
							case 'video/h264':
							case 'video/h265':
							{
								if (videoGoogleStartBitrate !== undefined)
									codecParameters['x-google-start-bitrate'] = videoGoogleStartBitrate;

								if (videoGoogleMaxBitrate !== undefined)
									codecParameters['x-google-max-bitrate'] = videoGoogleMaxBitrate;

								if (videoGoogleMinBitrate !== undefined)
									codecParameters['x-google-min-bitrate'] = videoGoogleMinBitrate;

								break;
							}
						}
					}

					const fmtp =
					{
						payload : codec.payloadType,
						config  : ''
					};

					for (const key of Object.keys(codecParameters))
					{
						if (fmtp.config)
							fmtp.config += ';';

						fmtp.config += `${key}=${codecParameters[key]}`;
					}

					if (fmtp.config)
						this._mediaObject.fmtp.push(fmtp);

					if (codec.rtcpFeedback)
					{
						for (const fb of codec.rtcpFeedback)
						{
							this._mediaObject.rtcpFb.push(
								{
									payload : codec.payloadType,
									type    : fb.type,
									subtype : fb.parameter || ''
								});
						}
					}
				}

				this._mediaObject.payloads = answerRtpParameters.codecs
					.map((codec) => codec.payloadType)
					.join(' ');

				this._mediaObject.ext = [];

				for (const ext of answerRtpParameters.headerExtensions)
				{
					// Don't add a header extension if not present in the offer.
					const found = (offerMediaObject.ext || [])
						.some((localExt) => localExt.uri === ext.uri);

					if (!found)
						continue;

					this._mediaObject.ext.push(
						{
							uri   : ext.uri,
							value : ext.id
						});
				}

				// Allow both 1 byte and 2 bytes length header extensions.
				if (offerMediaObject.extmapAllowMixed === 'extmap-allow-mixed')
					this._mediaObject.extmapAllowMixed = 'extmap-allow-mixed';

				// Simulcast.
				if (offerMediaObject.simulcast)
				{
					this._mediaObject.simulcast =
					{
						dir1  : 'recv',
						list1 : offerMediaObject.simulcast.list1
					};

					this._mediaObject.rids = [];

					for (const rid of offerMediaObject.rids || [])
					{
						if (rid.direction !== 'send')
							continue;

						this._mediaObject.rids.push(
							{
								id        : rid.id,
								direction : 'recv'
							});
					}
				}
				// Simulcast (draft version 03).
				else if (offerMediaObject.simulcast_03)
				{
					// eslint-disable-next-line camelcase
					this._mediaObject.simulcast_03 =
					{
						value : offerMediaObject.simulcast_03.value.replace(/send/g, 'recv')
					};

					this._mediaObject.rids = [];

					for (const rid of offerMediaObject.rids || [])
					{
						if (rid.direction !== 'send')
							continue;

						this._mediaObject.rids.push(
							{
								id        : rid.id,
								direction : 'recv'
							});
					}
				}

				this._mediaObject.rtcpMux = 'rtcp-mux';
				this._mediaObject.rtcpRsize = 'rtcp-rsize';

				if (this._planB && this._mediaObject.type === 'video')
					this._mediaObject.xGoogleFlag = 'conference';

				break;
			}

			case 'application':
			{
				// New spec.
				if (typeof offerMediaObject.sctpPort === 'number')
				{
					this._mediaObject.payloads = 'webrtc-datachannel';
					this._mediaObject.sctpPort = sctpParameters.port;
					this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
				}
				// Old spec.
				else if (offerMediaObject.sctpmap)
				{
					this._mediaObject.payloads = sctpParameters.port;
					this._mediaObject.sctpmap =
					{
						app            : 'webrtc-datachannel',
						sctpmapNumber  : sctpParameters.port,
						maxMessageSize : sctpParameters.maxMessageSize
					};
				}

				break;
			}
		}
	}

	/**
	 * @param {String} role
	 */
	setDtlsRole(role)
	{
		switch (role)
		{
			case 'client':
				this._mediaObject.setup = 'active';
				break;
			case 'server':
				this._mediaObject.setup = 'passive';
				break;
			case 'auto':
				this._mediaObject.setup = 'actpass';
				break;
		}
	}
}

class OfferMediaSection extends MediaSection
{
	constructor(data)
	{
		super(data);

		const {
			sctpParameters,
			plainRtpParameters,
			mid,
			kind,
			offerRtpParameters,
			streamId,
			trackId,
			oldDataChannelSpec
		} = data;

		this._mediaObject.mid = String(mid);
		this._mediaObject.type = kind;

		if (!plainRtpParameters)
		{
			this._mediaObject.connection = { ip: '127.0.0.1', version: 4 };

			if (!sctpParameters)
				this._mediaObject.protocol = 'UDP/TLS/RTP/SAVPF';
			else
				this._mediaObject.protocol = 'UDP/DTLS/SCTP';

			this._mediaObject.port = 7;
		}
		else
		{
			this._mediaObject.connection =
			{
				ip      : plainRtpParameters.ip,
				version : plainRtpParameters.ipVersion
			};
			this._mediaObject.protocol = 'RTP/AVP';
			this._mediaObject.port = plainRtpParameters.port;
		}

		switch (kind)
		{
			case 'audio':
			case 'video':
			{
				this._mediaObject.direction = 'sendonly';
				this._mediaObject.rtp = [];
				this._mediaObject.rtcpFb = [];
				this._mediaObject.fmtp = [];

				if (!this._planB)
					this._mediaObject.msid = `${streamId || '-'} ${trackId}`;

				for (const codec of offerRtpParameters.codecs)
				{
					const rtp =
					{
						payload : codec.payloadType,
						codec   : codec.mimeType.replace(/^.*\//, ''),
						rate    : codec.clockRate
					};

					if (codec.channels > 1)
						rtp.encoding = codec.channels;

					this._mediaObject.rtp.push(rtp);

					if (codec.parameters)
					{
						const fmtp =
						{
							payload : codec.payloadType,
							config  : ''
						};

						for (const key of Object.keys(codec.parameters))
						{
							if (fmtp.config)
								fmtp.config += ';';

							fmtp.config += `${key}=${codec.parameters[key]}`;
						}

						if (fmtp.config)
							this._mediaObject.fmtp.push(fmtp);
					}

					if (codec.rtcpFeedback)
					{
						for (const fb of codec.rtcpFeedback)
						{
							this._mediaObject.rtcpFb.push(
								{
									payload : codec.payloadType,
									type    : fb.type,
									subtype : fb.parameter || ''
								});
						}
					}
				}

				this._mediaObject.payloads = offerRtpParameters.codecs
					.map((codec) => codec.payloadType)
					.join(' ');

				this._mediaObject.ext = [];

				for (const ext of offerRtpParameters.headerExtensions)
				{
					this._mediaObject.ext.push(
						{
							uri   : ext.uri,
							value : ext.id
						});
				}

				this._mediaObject.rtcpMux = 'rtcp-mux';
				this._mediaObject.rtcpRsize = 'rtcp-rsize';

				const encoding = offerRtpParameters.encodings[0];
				const ssrc = encoding.ssrc;
				const rtxSsrc = (encoding.rtx && encoding.rtx.ssrc)
					? encoding.rtx.ssrc
					: undefined;

				this._mediaObject.ssrcs = [];
				this._mediaObject.ssrcGroups = [];

				if (offerRtpParameters.rtcp.cname)
				{
					this._mediaObject.ssrcs.push(
						{
							id        : ssrc,
							attribute : 'cname',
							value     : offerRtpParameters.rtcp.cname
						});
				}

				if (this._planB)
				{
					this._mediaObject.ssrcs.push(
						{
							id        : ssrc,
							attribute : 'msid',
							value     : `${streamId || '-'} ${trackId}`
						});
				}

				if (rtxSsrc)
				{
					if (offerRtpParameters.rtcp.cname)
					{
						this._mediaObject.ssrcs.push(
							{
								id        : rtxSsrc,
								attribute : 'cname',
								value     : offerRtpParameters.rtcp.cname
							});
					}

					if (this._planB)
					{
						this._mediaObject.ssrcs.push(
							{
								id        : rtxSsrc,
								attribute : 'msid',
								value     : `${streamId || '-'} ${trackId}`
							});
					}

					// Associate original and retransmission SSRCs.
					this._mediaObject.ssrcGroups.push(
						{
							semantics : 'FID',
							ssrcs     : `${ssrc} ${rtxSsrc}`
						});
				}

				break;
			}

			case 'application':
			{
				// New spec.
				if (!oldDataChannelSpec)
				{
					this._mediaObject.payloads = 'webrtc-datachannel';
					this._mediaObject.sctpPort = sctpParameters.port;
					this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
				}
				// Old spec.
				else
				{
					this._mediaObject.payloads = sctpParameters.port;
					this._mediaObject.sctpmap =
					{
						app            : 'webrtc-datachannel',
						sctpmapNumber  : sctpParameters.port,
						maxMessageSize : sctpParameters.maxMessageSize
					};
				}

				break;
			}
		}
	}

	/**
	 * @param {String} role
	 */
	setDtlsRole(role) // eslint-disable-line no-unused-vars
	{
		// Always 'actpass'.
		this._mediaObject.setup = 'actpass';
	}

	planBReceive({ offerRtpParameters, streamId, trackId })
	{
		const encoding = offerRtpParameters.encodings[0];
		const ssrc = encoding.ssrc;
		const rtxSsrc = (encoding.rtx && encoding.rtx.ssrc)
			? encoding.rtx.ssrc
			: undefined;

		if (offerRtpParameters.rtcp.cname)
		{
			this._mediaObject.ssrcs.push(
				{
					id        : ssrc,
					attribute : 'cname',
					value     : offerRtpParameters.rtcp.cname
				});
		}

		this._mediaObject.ssrcs.push(
			{
				id        : ssrc,
				attribute : 'msid',
				value     : `${streamId || '-'} ${trackId}`
			});

		if (rtxSsrc)
		{
			if (offerRtpParameters.rtcp.cname)
			{
				this._mediaObject.ssrcs.push(
					{
						id        : rtxSsrc,
						attribute : 'cname',
						value     : offerRtpParameters.rtcp.cname
					});
			}

			this._mediaObject.ssrcs.push(
				{
					id        : rtxSsrc,
					attribute : 'msid',
					value     : `${streamId || '-'} ${trackId}`
				});

			// Associate original and retransmission SSRCs.
			this._mediaObject.ssrcGroups.push(
				{
					semantics : 'FID',
					ssrcs     : `${ssrc} ${rtxSsrc}`
				});
		}
	}

	planBStopReceiving({ offerRtpParameters })
	{
		const encoding = offerRtpParameters.encodings[0];
		const ssrc = encoding.ssrc;
		const rtxSsrc = (encoding.rtx && encoding.rtx.ssrc)
			? encoding.rtx.ssrc
			: undefined;

		this._mediaObject.ssrcs = this._mediaObject.ssrcs
			.filter((s) => s.id !== ssrc && s.id !== rtxSsrc);

		if (rtxSsrc)
		{
			this._mediaObject.ssrcGroups = this._mediaObject.ssrcGroups
				.filter((group) => group.ssrcs !== `${ssrc} ${rtxSsrc}`);
		}
	}
}

module.exports =
{
	AnswerMediaSection,
	OfferMediaSection
};

},{"../../utils":68}],61:[function(require,module,exports){
const sdpTransform = require('sdp-transform');
const Logger = require('../../Logger');
const { AnswerMediaSection, OfferMediaSection } = require('./MediaSection');

const logger = new Logger('RemoteSdp');

class RemoteSdp
{
	constructor(
		{
			iceParameters = undefined,
			iceCandidates = undefined,
			dtlsParameters = undefined,
			sctpParameters = undefined,
			plainRtpParameters = undefined,
			planB = false
		})
	{
		// Remote ICE parameters.
		// @type {RTCIceParameters}
		this._iceParameters = iceParameters;

		// Remote ICE candidates.
		// @type {Array<RTCIceCandidate>}
		this._iceCandidates = iceCandidates;

		// Remote DTLS parameters.
		// @type {RTCDtlsParameters}
		this._dtlsParameters = dtlsParameters;

		// Remote SCTP parameters.
		// @type {RTCSctpParameters}
		this._sctpParameters = sctpParameters;

		// Parameters for plain RTP (no SRTP nor DTLS no BUNDLE). Fields:
		// @type {Object}
		//
		// Fields:
		// @param {String} ip
		// @param {Number} ipVersion - 4 or 6.
		// @param {Number} port
		this._plainRtpParameters = plainRtpParameters;

		// Whether this is Plan-B SDP.
		// @type {Boolean}
		this._planB = planB;

		// MediaSection instances indexed by MID.
		// @type {Map<String, MediaSection>}
		this._mediaSections = new Map();

		// First MID.
		// @type {String}
		this._firstMid = null;

		// SDP object.
		// @type {Object}
		this._sdpObject =
		{
			version : 0,
			origin  :
			{
				address        : '0.0.0.0',
				ipVer          : 4,
				netType        : 'IN',
				sessionId      : 10000,
				sessionVersion : 0,
				username       : 'mediasoup-client'
			},
			name   : '-',
			timing : { start: 0, stop: 0 },
			media  : []
		};

		// If ICE parameters are given, add ICE-Lite indicator.
		if (iceParameters && iceParameters.iceLite)
		{
			this._sdpObject.icelite = 'ice-lite';
		}

		// If DTLS parameters are given assume WebRTC and BUNDLE.
		if (dtlsParameters)
		{
			this._sdpObject.msidSemantic = { semantic: 'WMS', token: '*' };

			// NOTE: We take the latest fingerprint.
			const numFingerprints = this._dtlsParameters.fingerprints.length;

			this._sdpObject.fingerprint =
			{
				type : dtlsParameters.fingerprints[numFingerprints - 1].algorithm,
				hash : dtlsParameters.fingerprints[numFingerprints - 1].value
			};

			this._sdpObject.groups = [ { type: 'BUNDLE', mids: '' } ];
		}

		// If there are plain parameters override SDP origin.
		if (plainRtpParameters)
		{
			this._sdpObject.origin.address = plainRtpParameters.ip;
			this._sdpObject.origin.ipVer = plainRtpParameters.ipVersion;
		}
	}

	updateIceParameters(iceParameters)
	{
		logger.debug(
			'updateIceParameters() [iceParameters:%o]',
			iceParameters);

		this._iceParameters = iceParameters;
		this._sdpObject.icelite = iceParameters.iceLite ? 'ice-lite' : undefined;

		for (const mediaSection of this._mediaSections.values())
		{
			mediaSection.setIceParameters(iceParameters);
		}
	}

	updateDtlsRole(role)
	{
		logger.debug('updateDtlsRole() [role:%s]', role);

		this._dtlsParameters.role = role;

		for (const mediaSection of this._mediaSections.values())
		{
			mediaSection.setDtlsRole(role);
		}
	}

	getNextMediaSectionIdx()
	{
		let idx = -1;

		// If a closed media section is found, return its index.
		for (const mediaSection of this._mediaSections.values())
		{
			idx++;

			if (mediaSection.closed)
				return { idx, reuseMid: mediaSection.mid };
		}

		// If no closed media section is found, return next one.
		return { idx: this._mediaSections.size, reuseMid: null };
	}

	send(
		{
			offerMediaObject,
			reuseMid,
			offerRtpParameters,
			answerRtpParameters,
			codecOptions
		}
	)
	{
		const mediaSection = new AnswerMediaSection(
			{
				iceParameters      : this._iceParameters,
				iceCandidates      : this._iceCandidates,
				dtlsParameters     : this._dtlsParameters,
				plainRtpParameters : this._plainRtpParameters,
				planB              : this._planB,
				offerMediaObject,
				offerRtpParameters,
				answerRtpParameters,
				codecOptions
			});

		// Unified-Plan with closed media section replacement.
		if (reuseMid)
		{
			this._replaceMediaSection(mediaSection, reuseMid);
		}
		// Unified-Plan or Plan-B with different media kind.
		else if (!this._mediaSections.has(mediaSection.mid))
		{
			this._addMediaSection(mediaSection);
		}
		// Plan-B with same media kind.
		else
		{
			this._replaceMediaSection(mediaSection);
		}
	}

	receive(
		{
			mid,
			kind,
			offerRtpParameters,
			streamId,
			trackId
		}
	)
	{
		// Unified-Plan or different media kind.
		if (!this._mediaSections.has(mid))
		{
			const mediaSection = new OfferMediaSection(
				{
					iceParameters      : this._iceParameters,
					iceCandidates      : this._iceCandidates,
					dtlsParameters     : this._dtlsParameters,
					plainRtpParameters : this._plainRtpParameters,
					planB              : this._planB,
					mid,
					kind,
					offerRtpParameters,
					streamId,
					trackId
				});

			this._addMediaSection(mediaSection);
		}
		// Plan-B.
		else
		{
			const mediaSection = this._mediaSections.get(mid);

			mediaSection.planBReceive({ offerRtpParameters, streamId, trackId });
			this._replaceMediaSection(mediaSection);
		}
	}

	disableMediaSection(mid)
	{
		const mediaSection = this._mediaSections.get(mid);

		mediaSection.disable();
	}

	closeMediaSection(mid)
	{
		const mediaSection = this._mediaSections.get(mid);

		// NOTE: Closing the first m section is a pain since it invalidates the
		// bundled transport, so let's avoid it.
		if (String(mid) === this._firstMid)
		{
			logger.debug(
				'closeMediaSection() | cannot close first media section, disabling it instead [mid:%s]',
				mid);

			this.disableMediaSection(mid);

			return;
		}

		mediaSection.close();

		// Regenerate BUNDLE mids.
		this._regenerateBundleMids();
	}

	planBStopReceiving({ mid, offerRtpParameters })
	{
		const mediaSection = this._mediaSections.get(mid);

		mediaSection.planBStopReceiving({ offerRtpParameters });
		this._replaceMediaSection(mediaSection);
	}

	sendSctpAssociation({ offerMediaObject })
	{
		const mediaSection = new AnswerMediaSection(
			{
				iceParameters      : this._iceParameters,
				iceCandidates      : this._iceCandidates,
				dtlsParameters     : this._dtlsParameters,
				sctpParameters     : this._sctpParameters,
				plainRtpParameters : this._plainRtpParameters,
				offerMediaObject
			});

		this._addMediaSection(mediaSection);
	}

	receiveSctpAssociation({ oldDataChannelSpec = false } = {})
	{
		const mediaSection = new OfferMediaSection(
			{
				iceParameters      : this._iceParameters,
				iceCandidates      : this._iceCandidates,
				dtlsParameters     : this._dtlsParameters,
				sctpParameters     : this._sctpParameters,
				plainRtpParameters : this._plainRtpParameters,
				mid                : 'datachannel',
				kind               : 'application',
				oldDataChannelSpec
			});

		this._addMediaSection(mediaSection);
	}

	getSdp()
	{
		// Increase SDP version.
		this._sdpObject.origin.sessionVersion++;

		return sdpTransform.write(this._sdpObject);
	}

	_addMediaSection(newMediaSection)
	{
		if (!this._firstMid)
			this._firstMid = newMediaSection.mid;

		// Store it in the map.
		this._mediaSections.set(newMediaSection.mid, newMediaSection);

		// Update SDP object.
		this._sdpObject.media.push(newMediaSection.getObject());

		// Regenerate BUNDLE mids.
		this._regenerateBundleMids();
	}

	_replaceMediaSection(newMediaSection, reuseMid)
	{
		// Store it in the map.
		if (reuseMid)
		{
			const newMediaSections = new Map();

			for (const mediaSection of this._mediaSections.values())
			{
				if (mediaSection.mid === reuseMid)
					newMediaSections.set(newMediaSection.mid, newMediaSection);
				else
					newMediaSections.set(mediaSection.mid, mediaSection);
			}

			// Regenerate media sections.
			this._mediaSections = newMediaSections;

			// Regenerate BUNDLE mids.
			this._regenerateBundleMids();
		}
		else
		{
			this._mediaSections.set(newMediaSection.mid, newMediaSection);
		}

		// Update SDP object.
		this._sdpObject.media = Array.from(this._mediaSections.values())
			.map((mediaSection) => mediaSection.getObject());
	}

	_regenerateBundleMids()
	{
		if (!this._dtlsParameters)
			return;

		this._sdpObject.groups[0].mids = Array.from(this._mediaSections.values())
			.filter((mediaSection) => !mediaSection.closed)
			.map((mediaSection) => mediaSection.mid)
			.join(' ');
	}
}

module.exports = RemoteSdp;

},{"../../Logger":45,"./MediaSection":60,"sdp-transform":89}],62:[function(require,module,exports){
const sdpTransform = require('sdp-transform');

/**
 * Extract RTP capabilities.
 *
 * @param {Object} sdpObject - SDP Object generated by sdp-transform.
 *
 * @returns {RTCRtpCapabilities}
 */
exports.extractRtpCapabilities = function({ sdpObject })
{
	// Map of RtpCodecParameters indexed by payload type.
	const codecsMap = new Map();
	// Array of RtpHeaderExtensions.
	const headerExtensions = [];
	// Whether a m=audio/video section has been already found.
	let gotAudio = false;
	let gotVideo = false;

	for (const m of sdpObject.media)
	{
		const kind = m.type;

		switch (kind)
		{
			case 'audio':
			{
				if (gotAudio)
					continue;

				gotAudio = true;

				break;
			}
			case 'video':
			{
				if (gotVideo)
					continue;

				gotVideo = true;

				break;
			}
			default:
			{
				continue;
			}
		}

		// Get codecs.
		for (const rtp of m.rtp)
		{
			const codec =
			{
				mimeType             : `${kind}/${rtp.codec}`,
				kind                 : kind,
				clockRate            : rtp.rate,
				preferredPayloadType : rtp.payload,
				channels             : rtp.encoding,
				rtcpFeedback         : [],
				parameters           : {}
			};

			if (codec.kind !== 'audio')
				delete codec.channels;
			else if (!codec.channels)
				codec.channels = 1;

			codecsMap.set(codec.preferredPayloadType, codec);
		}

		// Get codec parameters.
		for (const fmtp of m.fmtp || [])
		{
			const parameters = sdpTransform.parseFmtpConfig(fmtp.config);
			const codec = codecsMap.get(fmtp.payload);

			if (!codec)
				continue;

			// Special case to convert parameter value to string.
			if (parameters && parameters['profile-level-id'])
				parameters['profile-level-id'] = String(parameters['profile-level-id']);

			codec.parameters = parameters;
		}

		// Get RTCP feedback for each codec.
		for (const fb of m.rtcpFb || [])
		{
			const codec = codecsMap.get(fb.payload);

			if (!codec)
				continue;

			const feedback =
			{
				type      : fb.type,
				parameter : fb.subtype
			};

			if (!feedback.parameter)
				delete feedback.parameter;

			codec.rtcpFeedback.push(feedback);
		}

		// Get RTP header extensions.
		for (const ext of m.ext || [])
		{
			const headerExtension =
			{
				kind        : kind,
				uri         : ext.uri,
				preferredId : ext.value
			};

			headerExtensions.push(headerExtension);
		}
	}

	const rtpCapabilities =
	{
		codecs           : Array.from(codecsMap.values()),
		headerExtensions : headerExtensions,
		fecMechanisms    : []
	};

	return rtpCapabilities;
};

/**
 * Extract DTLS parameters.
 *
 * @param {Object} sdpObject - SDP Object generated by sdp-transform.
 *
 * @returns {RTCDtlsParameters}
 */
exports.extractDtlsParameters = function({ sdpObject })
{
	const mediaObject = (sdpObject.media || [])
		.find((m) => m.iceUfrag && m.port !== 0);

	if (!mediaObject)
		throw new Error('no active media section found');

	const fingerprint = mediaObject.fingerprint || sdpObject.fingerprint;
	let role;

	switch (mediaObject.setup)
	{
		case 'active':
			role = 'client';
			break;
		case 'passive':
			role = 'server';
			break;
		case 'actpass':
			role = 'auto';
			break;
	}

	const dtlsParameters =
	{
		role,
		fingerprints :
		[
			{
				algorithm : fingerprint.type,
				value     : fingerprint.hash
			}
		]
	};

	return dtlsParameters;
};

/**
 * Get RTCP CNAME.
 *
 * @param {Object} offerMediaObject - Local SDP media Object generated by sdp-transform.
 *
 * @returns {String}
 */
exports.getCname = function({ offerMediaObject })
{
	const ssrcCnameLine = (offerMediaObject.ssrcs || [])
		.find((line) => line.attribute === 'cname');

	if (!ssrcCnameLine)
		return '';

	return ssrcCnameLine.value;
};

/**
 * Apply codec parameters in the given SDP m= section answer based on the
 * given RTP parameters of an offer.
 *
 * @param {RTCRtpParameters} offerRtpParameters
 * @param {Object} answerMediaObject
 */
exports.applyCodecParameters = function(
	{
		offerRtpParameters,
		answerMediaObject
	}
)
{
	for (const codec of offerRtpParameters.codecs)
	{
		const mimeType = codec.mimeType.toLowerCase();

		// Avoid parsing codec parameters for unhandled codecs.
		if (mimeType !== 'audio/opus')
			continue;

		const rtp = (answerMediaObject.rtp || [])
			.find((r) => r.payload === codec.payloadType);

		if (!rtp)
			continue;

		// Just in case.
		answerMediaObject.fmtp = answerMediaObject.fmtp || [];

		let fmtp = answerMediaObject.fmtp
			.find((f) => f.payload === codec.payloadType);

		if (!fmtp)
		{
			fmtp = { payload: codec.payloadType, config: '' };
			answerMediaObject.fmtp.push(fmtp);
		}

		const parameters = sdpTransform.parseParams(fmtp.config);

		switch (mimeType)
		{
			case 'audio/opus':
			{
				const spropStereo = codec.parameters['sprop-stereo'];

				if (spropStereo !== undefined)
					parameters.stereo = spropStereo ? 1 : 0;

				break;
			}
		}

		// Write the codec fmtp.config back.
		fmtp.config = '';

		for (const key of Object.keys(parameters))
		{
			if (fmtp.config)
				fmtp.config += ';';

			fmtp.config += `${key}=${parameters[key]}`;
		}
	}
};

},{"sdp-transform":89}],63:[function(require,module,exports){
/**
 * Get RTP encodings.
 *
 * @param {Object} offerMediaObject - Local SDP media Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 *
 * @returns {Array<RTCRtpEncodingParameters>}
 */
exports.getRtpEncodings = function({ offerMediaObject, track })
{
	// First media SSRC (or the only one).
	let firstSsrc;
	const ssrcs = new Set();

	for (const line of offerMediaObject.ssrcs || [])
	{
		if (line.attribute !== 'msid')
			continue;

		const trackId = line.value.split(' ')[1];

		if (trackId === track.id)
		{
			const ssrc = line.id;

			ssrcs.add(ssrc);

			if (!firstSsrc)
				firstSsrc = ssrc;
		}
	}

	if (ssrcs.size === 0)
		throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`);

	const ssrcToRtxSsrc = new Map();

	// First assume RTX is used.
	for (const line of offerMediaObject.ssrcGroups || [])
	{
		if (line.semantics !== 'FID')
			continue;

		let [ ssrc, rtxSsrc ] = line.ssrcs.split(/\s+/);

		ssrc = Number(ssrc);
		rtxSsrc = Number(rtxSsrc);

		if (ssrcs.has(ssrc))
		{
			// Remove both the SSRC and RTX SSRC from the set so later we know that they
			// are already handled.
			ssrcs.delete(ssrc);
			ssrcs.delete(rtxSsrc);

			// Add to the map.
			ssrcToRtxSsrc.set(ssrc, rtxSsrc);
		}
	}

	// If the set of SSRCs is not empty it means that RTX is not being used, so take
	// media SSRCs from there.
	for (const ssrc of ssrcs)
	{
		// Add to the map.
		ssrcToRtxSsrc.set(ssrc, null);
	}

	const encodings = [];

	for (const [ ssrc, rtxSsrc ] of ssrcToRtxSsrc)
	{
		const encoding = { ssrc };

		if (rtxSsrc)
			encoding.rtx = { ssrc: rtxSsrc };

		encodings.push(encoding);
	}

	return encodings;
};

/**
 * Adds multi-ssrc based simulcast into the given SDP media section offer.
 *
 * @param {Object} offerMediaObject - Local SDP media Object generated by sdp-transform.
 * @param {MediaStreamTrack} track
 * @param {Number} numStreams - Number of simulcast streams.
 */
exports.addLegacySimulcast = function({ offerMediaObject, track, numStreams })
{
	if (numStreams <= 1)
		throw new TypeError('numStreams must be greater than 1');

	let firstSsrc;
	let firstRtxSsrc;
	let streamId;

	// Get the SSRC.
	const ssrcMsidLine = (offerMediaObject.ssrcs || [])
		.find((line) =>
		{
			if (line.attribute !== 'msid')
				return false;

			const trackId = line.value.split(' ')[1];

			if (trackId === track.id)
			{
				firstSsrc = line.id;
				streamId = line.value.split(' ')[0];

				return true;
			}
		});

	if (!ssrcMsidLine)
		throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`);

	// Get the SSRC for RTX.
	(offerMediaObject.ssrcGroups || [])
		.some((line) =>
		{
			if (line.semantics !== 'FID')
				return;

			const ssrcs = line.ssrcs.split(/\s+/);

			if (Number(ssrcs[0]) === firstSsrc)
			{
				firstRtxSsrc = Number(ssrcs[1]);

				return true;
			}
		});

	const ssrcCnameLine = offerMediaObject.ssrcs
		.find((line) => (line.attribute === 'cname' && line.id === firstSsrc));

	if (!ssrcCnameLine)
		throw new Error(`a=ssrc line with cname information not found [track.id:${track.id}]`);

	const cname = ssrcCnameLine.value;
	const ssrcs = [];
	const rtxSsrcs = [];

	for (let i = 0; i < numStreams; ++i)
	{
		ssrcs.push(firstSsrc + i);

		if (firstRtxSsrc)
			rtxSsrcs.push(firstRtxSsrc + i);
	}

	offerMediaObject.ssrcGroups = offerMediaObject.ssrcGroups || [];
	offerMediaObject.ssrcs = offerMediaObject.ssrcs || [];

	offerMediaObject.ssrcGroups.push(
		{
			semantics : 'SIM',
			ssrcs     : ssrcs.join(' ')
		});

	for (let i = 0; i < ssrcs.length; ++i)
	{
		const ssrc = ssrcs[i];

		offerMediaObject.ssrcs.push(
			{
				id        : ssrc,
				attribute : 'cname',
				value     : cname
			});

		offerMediaObject.ssrcs.push(
			{
				id        : ssrc,
				attribute : 'msid',
				value     : `${streamId} ${track.id}`
			});
	}

	for (let i = 0; i < rtxSsrcs.length; ++i)
	{
		const ssrc = ssrcs[i];
		const rtxSsrc = rtxSsrcs[i];

		offerMediaObject.ssrcs.push(
			{
				id        : rtxSsrc,
				attribute : 'cname',
				value     : cname
			});

		offerMediaObject.ssrcs.push(
			{
				id        : rtxSsrc,
				attribute : 'msid',
				value     : `${streamId} ${track.id}`
			});

		offerMediaObject.ssrcGroups.push(
			{
				semantics : 'FID',
				ssrcs     : `${ssrc} ${rtxSsrc}`
			});
	}
};

},{}],64:[function(require,module,exports){
/**
 * Get RTP encodings.
 *
 * @param {Object} offerMediaObject - Local SDP media Object generated by sdp-transform.
 *
 * @returns {Array<RTCRtpEncodingParameters>}
 */
exports.getRtpEncodings = function({ offerMediaObject })
{
	const ssrcs = new Set();

	for (const line of offerMediaObject.ssrcs || [])
	{
		const ssrc = line.id;

		ssrcs.add(ssrc);
	}

	if (ssrcs.size === 0)
		throw new Error('no a=ssrc lines found');

	const ssrcToRtxSsrc = new Map();

	// First assume RTX is used.
	for (const line of offerMediaObject.ssrcGroups || [])
	{
		if (line.semantics !== 'FID')
			continue;

		let [ ssrc, rtxSsrc ] = line.ssrcs.split(/\s+/);

		ssrc = Number(ssrc);
		rtxSsrc = Number(rtxSsrc);

		if (ssrcs.has(ssrc))
		{
			// Remove both the SSRC and RTX SSRC from the set so later we know that they
			// are already handled.
			ssrcs.delete(ssrc);
			ssrcs.delete(rtxSsrc);

			// Add to the map.
			ssrcToRtxSsrc.set(ssrc, rtxSsrc);
		}
	}

	// If the set of SSRCs is not empty it means that RTX is not being used, so take
	// media SSRCs from there.
	for (const ssrc of ssrcs)
	{
		// Add to the map.
		ssrcToRtxSsrc.set(ssrc, null);
	}

	const encodings = [];

	for (const [ ssrc, rtxSsrc ] of ssrcToRtxSsrc)
	{
		const encoding = { ssrc };

		if (rtxSsrc)
			encoding.rtx = { ssrc: rtxSsrc };

		encodings.push(encoding);
	}

	return encodings;
};

/**
 * Adds multi-ssrc based simulcast into the given SDP media section offer.
 *
 * @param {Object} offerMediaObject - Local SDP media Object generated by sdp-transform.
 * @param {Number} numStreams - Number of simulcast streams.
 */
exports.addLegacySimulcast = function({ offerMediaObject, numStreams })
{
	if (numStreams <= 1)
		throw new TypeError('numStreams must be greater than 1');

	// Get the SSRC.
	const ssrcMsidLine = (offerMediaObject.ssrcs || [])
		.find((line) => line.attribute === 'msid');

	if (!ssrcMsidLine)
		throw new Error('a=ssrc line with msid information not found');

	const [ streamId, trackId ] = ssrcMsidLine.value.split(' ')[0];
	const firstSsrc = ssrcMsidLine.id;
	let firstRtxSsrc;

	// Get the SSRC for RTX.
	(offerMediaObject.ssrcGroups || [])
		.some((line) =>
		{
			if (line.semantics !== 'FID')
				return;

			const ssrcs = line.ssrcs.split(/\s+/);

			if (Number(ssrcs[0]) === firstSsrc)
			{
				firstRtxSsrc = Number(ssrcs[1]);

				return true;
			}
		});

	const ssrcCnameLine = offerMediaObject.ssrcs
		.find((line) => line.attribute === 'cname');

	if (!ssrcCnameLine)
		throw new Error('a=ssrc line with cname information not found');

	const cname = ssrcCnameLine.value;
	const ssrcs = [];
	const rtxSsrcs = [];

	for (let i = 0; i < numStreams; ++i)
	{
		ssrcs.push(firstSsrc + i);

		if (firstRtxSsrc)
			rtxSsrcs.push(firstRtxSsrc + i);
	}

	offerMediaObject.ssrcGroups = [];
	offerMediaObject.ssrcs = [];

	offerMediaObject.ssrcGroups.push(
		{
			semantics : 'SIM',
			ssrcs     : ssrcs.join(' ')
		});

	for (let i = 0; i < ssrcs.length; ++i)
	{
		const ssrc = ssrcs[i];

		offerMediaObject.ssrcs.push(
			{
				id        : ssrc,
				attribute : 'cname',
				value     : cname
			});

		offerMediaObject.ssrcs.push(
			{
				id        : ssrc,
				attribute : 'msid',
				value     : `${streamId} ${trackId}`
			});
	}

	for (let i = 0; i < rtxSsrcs.length; ++i)
	{
		const ssrc = ssrcs[i];
		const rtxSsrc = rtxSsrcs[i];

		offerMediaObject.ssrcs.push(
			{
				id        : rtxSsrc,
				attribute : 'cname',
				value     : cname
			});

		offerMediaObject.ssrcs.push(
			{
				id        : rtxSsrc,
				attribute : 'msid',
				value     : `${streamId} ${trackId}`
			});

		offerMediaObject.ssrcGroups.push(
			{
				semantics : 'FID',
				ssrcs     : `${ssrc} ${rtxSsrc}`
			});
	}
};

},{}],65:[function(require,module,exports){
const { version } = require('../package.json');
const Device = require('./Device');
const parseScalabilityMode = require('./scalabilityModes').parse;

/**
 * Expose mediasoup-client version.
 *
 * @type {String}
 */
exports.version = version;

/**
 * Expose Device class.
 *
 * @type {Class}
 */
exports.Device = Device;

/**
 * Expose parseScalabilityMode function.
 *
 * @type {Function}
 */
exports.parseScalabilityMode = parseScalabilityMode;

},{"../package.json":69,"./Device":43,"./scalabilityModes":67}],66:[function(require,module,exports){
const h264 = require('h264-profile-level-id');

const PROBATOR_SSRC = 1234;

/**
 * Generate extended RTP capabilities for sending and receiving.
 *
 * @param {RTCRtpCapabilities} localCaps - Local capabilities.
 * @param {RTCRtpCapabilities} remoteCaps - Remote capabilities.
 *
 * @returns {RTCExtendedRtpCapabilities}
 */
exports.getExtendedRtpCapabilities = function(localCaps, remoteCaps)
{
	const extendedRtpCapabilities =
	{
		codecs           : [],
		headerExtensions : [],
		fecMechanisms    : []
	};

	// Match media codecs and keep the order preferred by remoteCaps.
	for (const remoteCodec of remoteCaps.codecs || [])
	{
		if (
			typeof remoteCodec !== 'object' ||
			Array.isArray(remoteCodec) ||
			typeof remoteCodec.mimeType !== 'string' ||
			!/^(audio|video)\/(.+)/.test(remoteCodec.mimeType)
		)
		{
			throw new TypeError('invalid remote capabilitiy codec');
		}

		if (/.+\/rtx$/i.test(remoteCodec.mimeType))
			continue;

		const matchingLocalCodec = (localCaps.codecs || [])
			.find((localCodec) => (
				matchCodecs(localCodec, remoteCodec, { strict: true, modify: true }))
			);

		if (matchingLocalCodec)
		{
			const extendedCodec =
			{
				mimeType             : matchingLocalCodec.mimeType,
				kind                 : matchingLocalCodec.kind,
				clockRate            : matchingLocalCodec.clockRate,
				localPayloadType     : matchingLocalCodec.preferredPayloadType,
				localRtxPayloadType  : null,
				remotePayloadType    : remoteCodec.preferredPayloadType,
				remoteRtxPayloadType : null,
				channels             : matchingLocalCodec.channels,
				rtcpFeedback         : reduceRtcpFeedback(matchingLocalCodec, remoteCodec),
				localParameters      : matchingLocalCodec.parameters || {},
				remoteParameters     : remoteCodec.parameters || {}
			};

			if (!extendedCodec.channels)
				delete extendedCodec.channels;

			extendedRtpCapabilities.codecs.push(extendedCodec);
		}
	}

	// Match RTX codecs.
	for (const extendedCodec of extendedRtpCapabilities.codecs || [])
	{
		const matchingLocalRtxCodec = (localCaps.codecs || [])
			.find((localCodec) => (
				/.+\/rtx$/i.test(localCodec.mimeType) &&
				localCodec.parameters.apt === extendedCodec.localPayloadType
			));

		const matchingRemoteRtxCodec = (remoteCaps.codecs || [])
			.find((remoteCodec) => (
				/.+\/rtx$/i.test(remoteCodec.mimeType) &&
				remoteCodec.parameters.apt === extendedCodec.remotePayloadType
			));

		if (matchingLocalRtxCodec && matchingRemoteRtxCodec)
		{
			extendedCodec.localRtxPayloadType = matchingLocalRtxCodec.preferredPayloadType;
			extendedCodec.remoteRtxPayloadType = matchingRemoteRtxCodec.preferredPayloadType;
		}
	}

	// Match header extensions.
	for (const remoteExt of remoteCaps.headerExtensions || [])
	{
		const matchingLocalExt = (localCaps.headerExtensions || [])
			.find((localExt) => matchHeaderExtensions(localExt, remoteExt));

		if (matchingLocalExt)
		{
			const extendedExt =
			{
				kind      : remoteExt.kind,
				uri       : remoteExt.uri,
				sendId    : matchingLocalExt.preferredId,
				recvId    : remoteExt.preferredId,
				direction : 'sendrecv'
			};

			switch (remoteExt.direction)
			{
				case 'recvonly':
					extendedExt.direction = 'sendonly';
					break;
				case 'sendonly':
					extendedExt.direction = 'recvonly';
					break;
				case 'inactive':
					extendedExt.direction = 'inactive';
					break;
				default:
					extendedExt.direction = 'sendrecv';
			}

			extendedRtpCapabilities.headerExtensions.push(extendedExt);
		}
	}

	return extendedRtpCapabilities;
};

/**
 * Generate RTP capabilities for receiving media based on the given extended
 * RTP capabilities.
 *
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @returns {RTCRtpCapabilities}
 */
exports.getRecvRtpCapabilities = function(extendedRtpCapabilities)
{
	const rtpCapabilities =
	{
		codecs           : [],
		headerExtensions : [],
		fecMechanisms    : []
	};

	for (const extendedCodec of extendedRtpCapabilities.codecs)
	{
		const codec =
		{
			mimeType             : extendedCodec.mimeType,
			kind                 : extendedCodec.kind,
			clockRate            : extendedCodec.clockRate,
			preferredPayloadType : extendedCodec.remotePayloadType,
			channels             : extendedCodec.channels,
			rtcpFeedback         : extendedCodec.rtcpFeedback,
			parameters           : extendedCodec.localParameters
		};

		if (!codec.channels)
			delete codec.channels;

		rtpCapabilities.codecs.push(codec);

		// Add RTX codec.
		if (extendedCodec.remoteRtxPayloadType)
		{
			const extendedRtxCodec =
			{
				mimeType             : `${extendedCodec.kind}/rtx`,
				kind                 : extendedCodec.kind,
				clockRate            : extendedCodec.clockRate,
				preferredPayloadType : extendedCodec.remoteRtxPayloadType,
				rtcpFeedback         : [],
				parameters           :
				{
					apt : extendedCodec.remotePayloadType
				}
			};

			rtpCapabilities.codecs.push(extendedRtxCodec);
		}
	}

	for (const extendedExtension of extendedRtpCapabilities.headerExtensions)
	{
		// Ignore RTP extensions not valid for receiving.
		if (
			extendedExtension.direction !== 'sendrecv' &&
			extendedExtension.direction !== 'recvonly'
		)
		{
			continue;
		}

		const ext =
		{
			kind        : extendedExtension.kind,
			uri         : extendedExtension.uri,
			preferredId : extendedExtension.recvId
		};

		rtpCapabilities.headerExtensions.push(ext);
	}

	rtpCapabilities.fecMechanisms = extendedRtpCapabilities.fecMechanisms;

	return rtpCapabilities;
};

/**
 * Generate RTP parameters of the given kind for sending media.
 * Just the first media codec per kind is considered.
 * NOTE: mid, encodings and rtcp fields are left empty.
 *
 * @param {kind} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @returns {RTCRtpParameters}
 */
exports.getSendingRtpParameters = function(kind, extendedRtpCapabilities)
{
	const rtpParameters =
	{
		mid              : null,
		codecs           : [],
		headerExtensions : [],
		encodings        : [],
		rtcp             : {}
	};

	for (const extendedCodec of extendedRtpCapabilities.codecs)
	{
		if (extendedCodec.kind !== kind)
			continue;

		const codec =
		{
			mimeType     : extendedCodec.mimeType,
			clockRate    : extendedCodec.clockRate,
			payloadType  : extendedCodec.localPayloadType,
			channels     : extendedCodec.channels,
			rtcpFeedback : extendedCodec.rtcpFeedback,
			parameters   : extendedCodec.localParameters
		};

		if (!codec.channels)
			delete codec.channels;

		rtpParameters.codecs.push(codec);

		// Add RTX codec.
		if (extendedCodec.localRtxPayloadType)
		{
			const rtxCodec =
			{
				mimeType     : `${extendedCodec.kind}/rtx`,
				clockRate    : extendedCodec.clockRate,
				payloadType  : extendedCodec.localRtxPayloadType,
				rtcpFeedback : [],
				parameters   :
				{
					apt : extendedCodec.localPayloadType
				}
			};

			rtpParameters.codecs.push(rtxCodec);
		}

		// NOTE: We assume a single media codec plus an optional RTX codec.
		break;
	}

	for (const extendedExtension of extendedRtpCapabilities.headerExtensions)
	{
		// Ignore RTP extensions of a different kind and those not valid for sending.
		if (
			(extendedExtension.kind && extendedExtension.kind !== kind) ||
			(
				extendedExtension.direction !== 'sendrecv' &&
				extendedExtension.direction !== 'sendonly'
			)
		)
		{
			continue;
		}

		const ext =
		{
			uri : extendedExtension.uri,
			id  : extendedExtension.sendId
		};

		rtpParameters.headerExtensions.push(ext);
	}

	return rtpParameters;
};

/**
 * Generate RTP parameters of the given kind suitable for the remote SDP answer.
 *
 * @param {kind} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @returns {RTCRtpParameters}
 */
exports.getSendingRemoteRtpParameters = function(kind, extendedRtpCapabilities)
{
	const rtpParameters =
	{
		mid              : null,
		codecs           : [],
		headerExtensions : [],
		encodings        : [],
		rtcp             : {}
	};

	for (const extendedCodec of extendedRtpCapabilities.codecs)
	{
		if (extendedCodec.kind !== kind)
			continue;

		const codec =
		{
			mimeType     : extendedCodec.mimeType,
			clockRate    : extendedCodec.clockRate,
			payloadType  : extendedCodec.localPayloadType,
			channels     : extendedCodec.channels,
			rtcpFeedback : extendedCodec.rtcpFeedback,
			parameters   : extendedCodec.remoteParameters
		};

		if (!codec.channels)
			delete codec.channels;

		rtpParameters.codecs.push(codec);

		// Add RTX codec.
		if (extendedCodec.localRtxPayloadType)
		{
			const rtxCodec =
			{
				mimeType     : `${extendedCodec.kind}/rtx`,
				clockRate    : extendedCodec.clockRate,
				payloadType  : extendedCodec.localRtxPayloadType,
				rtcpFeedback : [],
				parameters   :
				{
					apt : extendedCodec.localPayloadType
				}
			};

			rtpParameters.codecs.push(rtxCodec);
		}

		// NOTE: We assume a single media codec plus an optional RTX codec.
		break;
	}

	for (const extendedExtension of extendedRtpCapabilities.headerExtensions)
	{
		// Ignore RTP extensions of a different kind and those not valid for sending.
		if (
			(extendedExtension.kind && extendedExtension.kind !== kind) ||
			(
				extendedExtension.direction !== 'sendrecv' &&
				extendedExtension.direction !== 'sendonly'
			)
		)
		{
			continue;
		}

		const ext =
		{
			uri : extendedExtension.uri,
			id  : extendedExtension.sendId
		};

		rtpParameters.headerExtensions.push(ext);
	}

	// Reduce codecs' RTCP feedback. Use Transport-CC if available, REMB otherwise.
	if (
		rtpParameters.headerExtensions.some((ext) => (
			ext.uri === 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01'
		))
	)
	{
		for (const codec of rtpParameters.codecs)
		{
			codec.rtcpFeedback = (codec.rtcpFeedback || [])
				.filter((fb) => fb.type !== 'goog-remb');
		}
	}
	else if (
		rtpParameters.headerExtensions.some((ext) => (
			ext.uri === 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time'
		))
	)
	{
		for (const codec of rtpParameters.codecs)
		{
			codec.rtcpFeedback = (codec.rtcpFeedback || [])
				.filter((fb) => fb.type !== 'transport-cc');
		}
	}
	else
	{
		for (const codec of rtpParameters.codecs)
		{
			codec.rtcpFeedback = (codec.rtcpFeedback || [])
				.filter((fb) => (
					fb.type !== 'transport-cc' &&
					fb.type !== 'goog-remb'
				));
		}
	}

	return rtpParameters;
};

/**
 * Whether media can be sent based on the given RTP capabilities.
 *
 * @param {String} kind
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @returns {Boolean}
 */
exports.canSend = function(kind, extendedRtpCapabilities)
{
	return extendedRtpCapabilities.codecs.
		some((codec) => codec.kind === kind);
};

/**
 * Whether the given RTP parameters can be received with the given RTP
 * capabilities.
 *
 * @param {RTCRtpParameters} rtpParameters
 * @param {RTCExtendedRtpCapabilities} extendedRtpCapabilities
 *
 * @returns {Boolean}
 */
exports.canReceive = function(rtpParameters, extendedRtpCapabilities)
{
	if (rtpParameters.codecs.length === 0)
		return false;

	const firstMediaCodec = rtpParameters.codecs[0];

	return extendedRtpCapabilities.codecs
		.some((codec) => codec.remotePayloadType === firstMediaCodec.payloadType);
};

/**
 * Create RTP parameters for a Consumer for the RTP probator.
 *
 * @param {RTCRtpParameters} videoRtpParameters - RTP parameters of any regular video
 *   Consumer.
 *
 * @return {RTCRtpParameters}
 */
exports.generateProbatorRtpParameters = function(videoRtpParameters)
{
	const rtpParameters =
	{
		mid              : null,
		codecs           : [],
		headerExtensions : [],
		encodings        : [],
		rtcp             :
		{
			cname : 'probator'
		}
	};

	rtpParameters.codecs.push(videoRtpParameters.codecs[0]);

	rtpParameters.headerExtensions = videoRtpParameters.headerExtensions
		.filter((ext) => (
			ext.uri === 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time' ||
			ext.uri === 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01'
		));

	rtpParameters.encodings.push({ ssrc: PROBATOR_SSRC });

	return rtpParameters;
};

function matchCodecs(aCodec, bCodec, { strict = false, modify = false } = {})
{
	const aMimeType = aCodec.mimeType.toLowerCase();
	const bMimeType = bCodec.mimeType.toLowerCase();

	if (aMimeType !== bMimeType)
		return false;

	if (aCodec.clockRate !== bCodec.clockRate)
		return false;

	if (
		/^audio\/.+$/i.test(aMimeType) &&
		(
			(aCodec.channels !== undefined && aCodec.channels !== 1) ||
			(bCodec.channels !== undefined && bCodec.channels !== 1)
		) &&
		aCodec.channels !== bCodec.channels
	)
	{
		return false;
	}

	// Per codec special checks.
	switch (aMimeType)
	{
		case 'video/h264':
		{
			const aPacketizationMode = (aCodec.parameters || {})['packetization-mode'] || 0;
			const bPacketizationMode = (bCodec.parameters || {})['packetization-mode'] || 0;

			if (aPacketizationMode !== bPacketizationMode)
				return false;

			// If strict matching check profile-level-id.
			if (strict)
			{
				if (!h264.isSameProfile(aCodec.parameters, bCodec.parameters))
					return false;

				let selectedProfileLevelId;

				try
				{
					selectedProfileLevelId =
						h264.generateProfileLevelIdForAnswer(aCodec.parameters, bCodec.parameters);
				}
				catch (error)
				{
					return false;
				}

				if (modify)
				{
					aCodec.parameters = aCodec.parameters || {};

					if (selectedProfileLevelId)
						aCodec.parameters['profile-level-id'] = selectedProfileLevelId;
					else
						delete aCodec.parameters['profile-level-id'];
				}
			}

			break;
		}

		case 'video/vp9':
		{
			// If strict matching check profile-id.
			if (strict)
			{
				const aProfileId = (aCodec.parameters || {})['profile-id'] || 0;
				const bProfileId = (bCodec.parameters || {})['profile-id'] || 0;

				if (aProfileId !== bProfileId)
					return false;
			}

			break;
		}
	}

	return true;
}

function matchHeaderExtensions(aExt, bExt)
{
	if (aExt.kind && bExt.kind && aExt.kind !== bExt.kind)
		return false;

	if (aExt.uri !== bExt.uri)
		return false;

	return true;
}

function reduceRtcpFeedback(codecA, codecB)
{
	const reducedRtcpFeedback = [];

	for (const aFb of codecA.rtcpFeedback || [])
	{
		const matchingBFb = (codecB.rtcpFeedback || [])
			.find((bFb) => (
				bFb.type === aFb.type &&
				(bFb.parameter === aFb.parameter || (!bFb.parameter && !aFb.parameter))
			));

		if (matchingBFb)
			reducedRtcpFeedback.push(matchingBFb);
	}

	return reducedRtcpFeedback;
}

},{"h264-profile-level-id":38}],67:[function(require,module,exports){
const ScalabilityModeRegex = new RegExp('^[LS]([1-9]\\d{0,1})T([1-9]\\d{0,1})');

exports.parse = function(scalabilityMode)
{
	const match = ScalabilityModeRegex.exec(scalabilityMode);

	if (!match)
		return { spatialLayers: 1, temporalLayers: 1 };

	return {
		spatialLayers  : Number(match[1]),
		temporalLayers : Number(match[2])
	};
};

},{}],68:[function(require,module,exports){
/**
 * Clones the given object/array.
 *
 * @param {Object|Array} obj
 *
 * @returns {Object|Array}
 */
exports.clone = function(obj)
{
	if (typeof obj !== 'object')
		return {};

	return JSON.parse(JSON.stringify(obj));
};

/**
 * Generates a random positive integer.
 *
 * @returns {Number}
 */
exports.generateRandomNumber = function()
{
	return Math.round(Math.random() * 10000000);
};

},{}],69:[function(require,module,exports){
module.exports={
  "_from": "github:versatica/mediasoup-client#v3",
  "_id": "mediasoup-client@3.2.6",
  "_inBundle": false,
  "_integrity": "",
  "_location": "/mediasoup-client",
  "_phantomChildren": {},
  "_requested": {
    "type": "git",
    "raw": "mediasoup-client@github:versatica/mediasoup-client#v3",
    "name": "mediasoup-client",
    "escapedName": "mediasoup-client",
    "rawSpec": "github:versatica/mediasoup-client#v3",
    "saveSpec": "github:versatica/mediasoup-client#v3",
    "fetchSpec": null,
    "gitCommittish": "v3"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "github:versatica/mediasoup-client#47193233bf0b98bb6296ba59780cdacf499c9aaa",
  "_spec": "mediasoup-client@github:versatica/mediasoup-client#v3",
  "_where": "/home/alexey/Desktop/Projects/JS/easy-mediasoup-v3-client/app",
  "author": {
    "name": "Iñaki Baz Castillo",
    "email": "ibc@aliax.net",
    "url": "https://inakibaz.me"
  },
  "bugs": {
    "url": "https://github.com/versatica/mediasoup-client/issues"
  },
  "bundleDependencies": false,
  "contributors": [
    {
      "name": "José Luis Millán",
      "email": "jmillan@aliax.net",
      "url": "https://github.com/jmillan"
    }
  ],
  "dependencies": {
    "awaitqueue": "^1.0.0",
    "bowser": "^2.6.1",
    "debug": "^4.1.1",
    "events": "^3.0.0",
    "h264-profile-level-id": "^1.0.0",
    "open-cli": "^5.0.0",
    "sdp-transform": "^2.12.0"
  },
  "deprecated": false,
  "description": "mediasoup client side JavaScript library",
  "devDependencies": {
    "eslint": "^6.4.0",
    "eslint-plugin-jest": "^22.17.0",
    "jest": "^24.9.0",
    "jest-tobetype": "^1.2.3",
    "node-mediastreamtrack": "0.1.0",
    "uuid": "^3.3.3"
  },
  "engines": {
    "node": ">=8.6.0"
  },
  "homepage": "https://mediasoup.org",
  "jest": {
    "verbose": true,
    "testEnvironment": "node",
    "testRegex": "test/test.*\\.js"
  },
  "license": "ISC",
  "main": "lib/index.js",
  "name": "mediasoup-client",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/versatica/mediasoup-client.git"
  },
  "scripts": {
    "coverage": "jest --coverage && open-cli coverage/lcov-report/index.html",
    "lint": "eslint -c .eslintrc.js lib test",
    "test": "jest"
  },
  "version": "3.2.6"
}

},{}],70:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],71:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],72:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./Logger":73,"dup":44,"events":35}],73:[function(require,module,exports){
const debug = require('debug');

const APP_NAME = 'protoo-client';

class Logger
{
	constructor(prefix)
	{
		if (prefix)
		{
			this._debug = debug(`${APP_NAME}:${prefix}`);
			this._warn = debug(`${APP_NAME}:WARN:${prefix}`);
			this._error = debug(`${APP_NAME}:ERROR:${prefix}`);
		}
		else
		{
			this._debug = debug(APP_NAME);
			this._warn = debug(`${APP_NAME}:WARN`);
			this._error = debug(`${APP_NAME}:ERROR`);
		}

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}

	get debug()
	{
		return this._debug;
	}

	get warn()
	{
		return this._warn;
	}

	get error()
	{
		return this._error;
	}
}

module.exports = Logger;

},{"debug":36}],74:[function(require,module,exports){
const Logger = require('./Logger');
const { generateRandomNumber } = require('./utils');

const logger = new Logger('Message');

class Message
{
	static parse(raw)
	{
		let object;
		const message = {};

		try
		{
			object = JSON.parse(raw);
		}
		catch (error)
		{
			logger.error('parse() | invalid JSON: %s', error);

			return;
		}

		if (typeof object !== 'object' || Array.isArray(object))
		{
			logger.error('parse() | not an object');

			return;
		}

		// Request.
		if (object.request)
		{
			message.request = true;

			if (typeof object.method !== 'string')
			{
				logger.error('parse() | missing/invalid method field');

				return;
			}

			if (typeof object.id !== 'number')
			{
				logger.error('parse() | missing/invalid id field');

				return;
			}

			message.id = object.id;
			message.method = object.method;
			message.data = object.data || {};
		}
		// Response.
		else if (object.response)
		{
			message.response = true;

			if (typeof object.id !== 'number')
			{
				logger.error('parse() | missing/invalid id field');

				return;
			}

			message.id = object.id;

			// Success.
			if (object.ok)
			{
				message.ok = true;
				message.data = object.data || {};
			}
			// Error.
			else
			{
				message.ok = false;
				message.errorCode = object.errorCode;
				message.errorReason = object.errorReason;
			}
		}
		// Notification.
		else if (object.notification)
		{
			message.notification = true;

			if (typeof object.method !== 'string')
			{
				logger.error('parse() | missing/invalid method field');

				return;
			}

			message.method = object.method;
			message.data = object.data || {};
		}
		// Invalid.
		else
		{
			logger.error('parse() | missing request/response field');

			return;
		}

		return message;
	}

	static createRequest(method, data)
	{
		const request =
		{
			request : true,
			id      : generateRandomNumber(),
			method  : method,
			data    : data || {}
		};

		return request;
	}

	static createSuccessResponse(request, data)
	{
		const response =
		{
			response : true,
			id       : request.id,
			ok       : true,
			data     : data || {}
		};

		return response;
	}

	static createErrorResponse(request, errorCode, errorReason)
	{
		const response =
		{
			response    : true,
			id          : request.id,
			ok          : false,
			errorCode   : errorCode,
			errorReason : errorReason
		};

		return response;
	}

	static createNotification(method, data)
	{
		const notification =
		{
			notification : true,
			method       : method,
			data         : data || {}
		};

		return notification;
	}
}

module.exports = Message;

},{"./Logger":73,"./utils":78}],75:[function(require,module,exports){
const Logger = require('./Logger');
const EnhancedEventEmitter = require('./EnhancedEventEmitter');
const Message = require('./Message');

const logger = new Logger('Peer');

class Peer extends EnhancedEventEmitter
{
	/**
	 * @param {protoo.Transport} transport
	 *
	 * @emits open
	 * @emits {currentAttempt: Number} failed
	 * @emits disconnected
	 * @emits close
	 * @emits {request: protoo.Request, accept: Function, reject: Function} request
	 * @emits {notification: protoo.Notification} notification
	 */
	constructor(transport)
	{
		super(logger);

		logger.debug('constructor()');

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// Transport.
		// @type {protoo.Transport}
		this._transport = transport;

		// Connected flag.
		// @type {Boolean}
		this._connected = false;

		// Custom data object.
		// @type {Object}
		this._data = {};

		// Map of pending sent request objects indexed by request id.
		// @type {Map<Number, Object>}
		this._sents = new Map();

		// Handle transport.
		this._handleTransport();
	}

	/**
	 * Whether the Peer is closed.
	 *
	 * @returns {Boolean}
	 */
	get closed()
	{
		return this._closed;
	}

	/**
	 * Whether the Peer is connected.
	 *
	 * @returns {Boolean}
	 */
	get connected()
	{
		return this._connected;
	}

	/**
	 * App custom data.
	 *
	 * @returns {Object}
	 */
	get data()
	{
		return this._data;
	}

	/**
	 * Invalid setter.
	 */
	set data(data) // eslint-disable-line no-unused-vars
	{
		throw new Error('cannot override data object');
	}

	/**
	 * Close this Peer and its Transport.
	 */
	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		this._closed = true;
		this._connected = false;

		// Close Transport.
		this._transport.close();

		// Close every pending sent.
		for (const sent of this._sents.values())
		{
			sent.close();
		}

		// Emit 'close' event.
		this.safeEmit('close');
	}

	/**
	 * Send a protoo request to the server-side Room.
	 *
	 * @param {String} method
	 * @param {Object} [data]
	 *
	 * @async
	 * @returns {Object} The response data Object if a success response is received.
	 */
	async request(method, data = undefined)
	{
		const request = Message.createRequest(method, data);

		this._logger.debug('request() [method:%s, id:%s]', method, request.id);

		// This may throw.
		await this._transport.send(request);

		return new Promise((pResolve, pReject) =>
		{
			const timeout = 1500 * (15 + (0.1 * this._sents.size));
			const sent =
			{
				id      : request.id,
				method  : request.method,
				resolve : (data2) =>
				{
					if (!this._sents.delete(request.id))
						return;

					clearTimeout(sent.timer);
					pResolve(data2);
				},
				reject : (error) =>
				{
					if (!this._sents.delete(request.id))
						return;

					clearTimeout(sent.timer);
					pReject(error);
				},
				timer : setTimeout(() =>
				{
					if (!this._sents.delete(request.id))
						return;

					pReject(new Error('request timeout'));
				}, timeout),
				close : () =>
				{
					clearTimeout(sent.timer);
					pReject(new Error('peer closed'));
				}
			};

			// Add sent stuff to the map.
			this._sents.set(request.id, sent);
		});
	}

	/**
	 * Send a protoo notification to the server-side Room.
	 *
	 * @param {String} method
	 * @param {Object} [data]
	 *
	 * @async
	 */
	async notify(method, data = undefined)
	{
		const notification = Message.createNotification(method, data);

		this._logger.debug('notify() [method:%s]', method);

		// This may throw.
		await this._transport.send(notification);
	}

	_handleTransport()
	{
		if (this._transport.closed)
		{
			this._closed = true;

			setTimeout(() =>
			{
				if (this._closed)
					return;

				this._connected = false;

				this.safeEmit('close');
			});

			return;
		}

		this._transport.on('open', () =>
		{
			if (this._closed)
				return;

			logger.debug('emit "open"');

			this._connected = true;

			this.safeEmit('open');
		});

		this._transport.on('disconnected', () =>
		{
			if (this._closed)
				return;

			logger.debug('emit "disconnected"');

			this._connected = false;

			this.safeEmit('disconnected');
		});

		this._transport.on('failed', (currentAttempt) =>
		{
			if (this._closed)
				return;

			logger.debug('emit "failed" [currentAttempt:%s]', currentAttempt);

			this._connected = false;

			this.safeEmit('failed', currentAttempt);
		});

		this._transport.on('close', () =>
		{
			if (this._closed)
				return;

			this._closed = true;

			logger.debug('emit "close"');

			this._connected = false;

			this.safeEmit('close');
		});

		this._transport.on('message', (message) =>
		{
			if (message.request)
				this._handleRequest(message);
			else if (message.response)
				this._handleResponse(message);
			else if (message.notification)
				this._handleNotification(message);
		});
	}

	_handleRequest(request)
	{
		try
		{
			this.emit('request',
				// Request.
				request,
				// accept() function.
				(data) =>
				{
					const response = Message.createSuccessResponse(request, data);

					this._transport.send(response)
						.catch(() => {});
				},
				// reject() function.
				(errorCode, errorReason) =>
				{
					if (errorCode instanceof Error)
					{
						errorCode = 500;
						errorReason = String(errorCode);
					}
					else if (typeof errorCode === 'number' && errorReason instanceof Error)
					{
						errorReason = String(errorReason);
					}

					const response =
						Message.createErrorResponse(request, errorCode, errorReason);

					this._transport.send(response)
						.catch(() => {});
				});
		}
		catch (error)
		{
			const response = Message.createErrorResponse(request, 500, String(error));

			this._transport.send(response)
				.catch(() => {});
		}
	}

	_handleResponse(response)
	{
		const sent = this._sents.get(response.id);

		if (!sent)
		{
			logger.error(
				'received response does not match any sent request [id:%s]', response.id);

			return;
		}

		if (response.ok)
		{
			sent.resolve(response.data);
		}
		else
		{
			const error = new Error(response.errorReason);

			error.code = response.errorCode;
			sent.reject(error);
		}
	}

	_handleNotification(notification)
	{
		this.safeEmit('notification', notification);
	}
}

module.exports = Peer;

},{"./EnhancedEventEmitter":72,"./Logger":73,"./Message":74}],76:[function(require,module,exports){
const { version } = require('../package.json');
const Peer = require('./Peer');
const WebSocketTransport = require('./transports/WebSocketTransport');

/**
 * Expose mediasoup-client version.
 *
 * @type {String}
 */
exports.version = version;

/**
 * Expose Peer class.
 *
 * @type {Class}
 */
exports.Peer = Peer;

/**
 * Expose WebSocketTransport class.
 *
 * @type {Class}
 */
exports.WebSocketTransport = WebSocketTransport;

},{"../package.json":79,"./Peer":75,"./transports/WebSocketTransport":77}],77:[function(require,module,exports){
const W3CWebSocket = require('websocket').w3cwebsocket;
const retry = require('retry');
const Logger = require('../Logger');
const EnhancedEventEmitter = require('../EnhancedEventEmitter');
const Message = require('../Message');

const WS_SUBPROTOCOL = 'protoo';
const DEFAULT_RETRY_OPTIONS =
{
	retries    : 10,
	factor     : 2,
	minTimeout : 1 * 1000,
	maxTimeout : 8 * 1000
};

const logger = new Logger('WebSocketTransport');

class WebSocketTransport extends EnhancedEventEmitter
{
	/**
	 * @param {String} url - WebSocket URL.
	 * @param {Object} [options] - Options for WebSocket-Node.W3CWebSocket and retry.
	 */
	constructor(url, options)
	{
		super(logger);

		logger.debug('constructor() [url:%s, options:%o]', url, options);

		// Closed flag.
		// @type {Boolean}
		this._closed = false;

		// WebSocket URL.
		// @type {String}
		this._url = url;

		// Options.
		// @type {Object}
		this._options = options || {};

		// WebSocket instance.
		// @type {WebSocket}
		this._ws = null;

		// Run the WebSocket.
		this._runWebSocket();
	}

	get closed()
	{
		return this._closed;
	}

	close()
	{
		if (this._closed)
			return;

		logger.debug('close()');

		// Don't wait for the WebSocket 'close' event, do it now.
		this._closed = true;
		this.safeEmit('close');

		try
		{
			this._ws.onopen = null;
			this._ws.onclose = null;
			this._ws.onerror = null;
			this._ws.onmessage = null;
			this._ws.close();
		}
		catch (error)
		{
			logger.error('close() | error closing the WebSocket: %o', error);
		}
	}

	async send(message)
	{
		if (this._closed)
			throw new Error('transport closed');

		try
		{
			this._ws.send(JSON.stringify(message));
		}
		catch (error)
		{
			logger.warn('send() failed:%o', error);

			throw error;
		}
	}

	_runWebSocket()
	{
		const operation =
			retry.operation(this._options.retry || DEFAULT_RETRY_OPTIONS);

		let wasConnected = false;

		operation.attempt((currentAttempt) =>
		{
			if (this._closed)
			{
				operation.stop();

				return;
			}

			logger.debug('_runWebSocket() [currentAttempt:%s]', currentAttempt);

			this._ws = new W3CWebSocket(
				this._url,
				WS_SUBPROTOCOL,
				this._options.origin,
				this._options.headers,
				this._options.requestOptions,
				this._options.clientConfig);

			this._ws.onopen = () =>
			{
				if (this._closed)
					return;

				wasConnected = true;

				// Emit 'open' event.
				this.safeEmit('open');
			};

			this._ws.onclose = (event) =>
			{
				if (this._closed)
					return;

				logger.warn(
					'WebSocket "close" event [wasClean:%s, code:%s, reason:"%s"]',
					event.wasClean, event.code, event.reason);

				// Don't retry if code is 4000 (closed by the server).
				if (event.code !== 4000)
				{
					// If it was not connected, try again.
					if (!wasConnected)
					{
						this.safeEmit('failed', currentAttempt);

						if (this._closed)
							return;

						if (operation.retry(true))
							return;
					}
					// If it was connected, start from scratch.
					else
					{
						operation.stop();

						this.safeEmit('disconnected');

						if (this._closed)
							return;

						this._runWebSocket();

						return;
					}
				}

				this._closed = true;

				// Emit 'close' event.
				this.safeEmit('close');
			};

			this._ws.onerror = () =>
			{
				if (this._closed)
					return;

				logger.error('WebSocket "error" event');
			};

			this._ws.onmessage = (event) =>
			{
				if (this._closed)
					return;

				const message = Message.parse(event.data);

				if (!message)
					return;

				if (this.listenerCount('message') === 0)
				{
					logger.error(
						'no listeners for WebSocket "message" event, ignoring received message');

					return;
				}

				// Emit 'message' event.
				this.safeEmit('message', message);
			};
		});
	}
}

module.exports = WebSocketTransport;

},{"../EnhancedEventEmitter":72,"../Logger":73,"../Message":74,"retry":85,"websocket":95}],78:[function(require,module,exports){
/**
 * Generates a random positive integer.
 *
 * @returns {Number}
 */
exports.generateRandomNumber = function()
{
	return Math.round(Math.random() * 10000000);
};

},{}],79:[function(require,module,exports){
module.exports={
  "_from": "protoo-client@^4.0.3",
  "_id": "protoo-client@4.0.3",
  "_inBundle": false,
  "_integrity": "sha512-+HnxpBOOZ8WovllUUvfcbJa3gLuzhyYdR4A+ytldLmwq6vl5AzFGsenyLJMX6pVuNEJUZ5D7M92zvPesUG+wyQ==",
  "_location": "/protoo-client",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "protoo-client@^4.0.3",
    "name": "protoo-client",
    "escapedName": "protoo-client",
    "rawSpec": "^4.0.3",
    "saveSpec": null,
    "fetchSpec": "^4.0.3"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/protoo-client/-/protoo-client-4.0.3.tgz",
  "_shasum": "3cc1943ce160785777fbda4dcceab196328d0bfd",
  "_spec": "protoo-client@^4.0.3",
  "_where": "/home/alexey/Desktop/Projects/JS/easy-mediasoup-v3-client/app",
  "author": {
    "name": "Iñaki Baz Castillo",
    "email": "ibc@aliax.net"
  },
  "bugs": {
    "url": "https://github.com/ibc/protoo/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "debug": "^4.1.1",
    "events": "^3.0.0",
    "retry": "^0.12.0",
    "websocket": "^1.0.28"
  },
  "deprecated": false,
  "description": "protoo JavaScript client module",
  "devDependencies": {
    "eslint": "^5.16.0"
  },
  "engines": {
    "node": ">=8.0.0"
  },
  "homepage": "https://protoojs.org",
  "keywords": [
    "nodejs",
    "browser",
    "websocket"
  ],
  "license": "MIT",
  "main": "lib/index.js",
  "name": "protoo-client",
  "optionalDependencies": {
    "websocket": "^1.0.28"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ibc/protoo.git"
  },
  "scripts": {
    "lint": "eslint -c .eslintrc.js lib"
  },
  "version": "4.0.3"
}

},{}],80:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encodeURIComponent(key);
      value = encodeURIComponent(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],81:[function(require,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $$observable = _interopDefault(require('symbol-observable'));

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if ("production" !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if ("production" !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if ("production" !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if ("production" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

exports.__DO_NOT_USE__ActionTypes = ActionTypes;
exports.applyMiddleware = applyMiddleware;
exports.bindActionCreators = bindActionCreators;
exports.combineReducers = combineReducers;
exports.compose = compose;
exports.createStore = createStore;

},{"symbol-observable":92}],83:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],84:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],85:[function(require,module,exports){
module.exports = require('./lib/retry');
},{"./lib/retry":86}],86:[function(require,module,exports){
var RetryOperation = require('./retry_operation');

exports.operation = function(options) {
  var timeouts = exports.timeouts(options);
  return new RetryOperation(timeouts, {
      forever: options && options.forever,
      unref: options && options.unref,
      maxRetryTime: options && options.maxRetryTime
  });
};

exports.timeouts = function(options) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];
  for (var i = 0; i < opts.retries; i++) {
    timeouts.push(this.createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(this.createTimeout(i, opts));
  }

  // sort the array numerically ascending
  timeouts.sort(function(a,b) {
    return a - b;
  });

  return timeouts;
};

exports.createTimeout = function(attempt, opts) {
  var random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
};

exports.wrap = function(obj, options, methods) {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];
    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (var i = 0; i < methods.length; i++) {
    var method   = methods[i];
    var original = obj[method];

    obj[method] = function retryWrapper(original) {
      var op       = exports.operation(options);
      var args     = Array.prototype.slice.call(arguments, 1);
      var callback = args.pop();

      args.push(function(err) {
        if (op.retry(err)) {
          return;
        }
        if (err) {
          arguments[0] = op.mainError();
        }
        callback.apply(this, arguments);
      });

      op.attempt(function() {
        original.apply(obj, args);
      });
    }.bind(obj, original);
    obj[method].options = options;
  }
};

},{"./retry_operation":87}],87:[function(require,module,exports){
function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = { forever: options };
  }

  this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
  this._timeouts = timeouts;
  this._options = options || {};
  this._maxRetryTime = options && options.maxRetryTime || Infinity;
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;
  this._operationStart = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}
module.exports = RetryOperation;

RetryOperation.prototype.reset = function() {
  this._attempts = 1;
  this._timeouts = this._originalTimeouts;
}

RetryOperation.prototype.stop = function() {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  this._timeouts       = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function(err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }
  var currentTime = new Date().getTime();
  if (err && currentTime - this._operationStart >= this._maxRetryTime) {
    this._errors.unshift(new Error('RetryOperation timeout occurred'));
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(this._errors.length - 1, this._errors.length);
      this._timeouts = this._cachedTimeouts.slice(0);
      timeout = this._timeouts.shift();
    } else {
      return false;
    }
  }

  var self = this;
  var timer = setTimeout(function() {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function() {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (self._options.unref) {
          self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
      timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function(fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }
    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;
  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function() {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._operationStart = new Date().getTime();

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function(fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function(fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.attempts = function() {
  return this._attempts;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};

},{}],88:[function(require,module,exports){
var grammar = module.exports = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{
    // o=- 20518 0 IN IP4 203.0.113.1
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{ name: 'name' }],
  i: [{ name: 'description' }],
  u: [{ name: 'uri' }],
  e: [{ name: 'email' }],
  p: [{ name: 'phone' }],
  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly...
  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
  // k: [{}], // outdated thing ignored
  t: [{
    // t=0 0
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{
    // c=IN IP4 10.47.197.26
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{
    // b=AS:4000
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{
    // m=video 51744 RTP/AVP 126 97 98 34 31
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [
    {
      // a=rtpmap:110 opus/48000/2
      push: 'rtp',
      reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
      names: ['payload', 'codec', 'rate', 'encoding'],
      format: function (o) {
        return (o.encoding)
          ? 'rtpmap:%d %s/%s/%s'
          : o.rate
            ? 'rtpmap:%d %s/%s'
            : 'rtpmap:%d %s';
      }
    },
    {
      // a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
      // a=fmtp:111 minptime=10; useinbandfec=1
      push: 'fmtp',
      reg: /^fmtp:(\d*) ([\S| ]*)/,
      names: ['payload', 'config'],
      format: 'fmtp:%d %s'
    },
    {
      // a=control:streamid=0
      name: 'control',
      reg: /^control:(.*)/,
      format: 'control:%s'
    },
    {
      // a=rtcp:65179 IN IP4 193.84.77.194
      name: 'rtcp',
      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
      names: ['port', 'netType', 'ipVer', 'address'],
      format: function (o) {
        return (o.address != null)
          ? 'rtcp:%d %s IP%d %s'
          : 'rtcp:%d';
      }
    },
    {
      // a=rtcp-fb:98 trr-int 100
      push: 'rtcpFbTrrInt',
      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
      names: ['payload', 'value'],
      format: 'rtcp-fb:%d trr-int %d'
    },
    {
      // a=rtcp-fb:98 nack rpsi
      push: 'rtcpFb',
      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
      names: ['payload', 'type', 'subtype'],
      format: function (o) {
        return (o.subtype != null)
          ? 'rtcp-fb:%s %s %s'
          : 'rtcp-fb:%s %s';
      }
    },
    {
      // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      // a=extmap:1/recvonly URI-gps-string
      // a=extmap:3 urn:ietf:params:rtp-hdrext:encrypt urn:ietf:params:rtp-hdrext:smpte-tc 25@600/24
      push: 'ext',
      reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
      names: ['value', 'direction', 'encrypt-uri', 'uri', 'config'],
      format: function (o) {
        return (
          'extmap:%d' +
          (o.direction ? '/%s' : '%v') +
          (o['encrypt-uri'] ? ' %s' : '%v') +
          ' %s' +
          (o.config ? ' %s' : '')
        );
      }
    },
    {
      // a=extmap-allow-mixed
      name: 'extmapAllowMixed',
      reg: /^(extmap-allow-mixed)/
    },
    {
      // a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
      push: 'crypto',
      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
      names: ['id', 'suite', 'config', 'sessionConfig'],
      format: function (o) {
        return (o.sessionConfig != null)
          ? 'crypto:%d %s %s %s'
          : 'crypto:%d %s %s';
      }
    },
    {
      // a=setup:actpass
      name: 'setup',
      reg: /^setup:(\w*)/,
      format: 'setup:%s'
    },
    {
      // a=connection:new
      name: 'connectionType',
      reg: /^connection:(new|existing)/,
      format: 'connection:%s'
    },
    {
      // a=mid:1
      name: 'mid',
      reg: /^mid:([^\s]*)/,
      format: 'mid:%s'
    },
    {
      // a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
      name: 'msid',
      reg: /^msid:(.*)/,
      format: 'msid:%s'
    },
    {
      // a=ptime:20
      name: 'ptime',
      reg: /^ptime:(\d*)/,
      format: 'ptime:%d'
    },
    {
      // a=maxptime:60
      name: 'maxptime',
      reg: /^maxptime:(\d*)/,
      format: 'maxptime:%d'
    },
    {
      // a=sendrecv
      name: 'direction',
      reg: /^(sendrecv|recvonly|sendonly|inactive)/
    },
    {
      // a=ice-lite
      name: 'icelite',
      reg: /^(ice-lite)/
    },
    {
      // a=ice-ufrag:F7gI
      name: 'iceUfrag',
      reg: /^ice-ufrag:(\S*)/,
      format: 'ice-ufrag:%s'
    },
    {
      // a=ice-pwd:x9cml/YzichV2+XlhiMu8g
      name: 'icePwd',
      reg: /^ice-pwd:(\S*)/,
      format: 'ice-pwd:%s'
    },
    {
      // a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
      name: 'fingerprint',
      reg: /^fingerprint:(\S*) (\S*)/,
      names: ['type', 'hash'],
      format: 'fingerprint:%s %s'
    },
    {
      // a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
      // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
      // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
      // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
      // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
      push:'candidates',
      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
      format: function (o) {
        var str = 'candidate:%s %d %s %d %s %d typ %s';

        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

        // NB: candidate has three optional chunks, so %void middles one if it's missing
        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

        if (o.generation != null) {
          str += ' generation %d';
        }

        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
        return str;
      }
    },
    {
      // a=end-of-candidates (keep after the candidates line for readability)
      name: 'endOfCandidates',
      reg: /^(end-of-candidates)/
    },
    {
      // a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
      name: 'remoteCandidates',
      reg: /^remote-candidates:(.*)/,
      format: 'remote-candidates:%s'
    },
    {
      // a=ice-options:google-ice
      name: 'iceOptions',
      reg: /^ice-options:(\S*)/,
      format: 'ice-options:%s'
    },
    {
      // a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
      push: 'ssrcs',
      reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
      names: ['id', 'attribute', 'value'],
      format: function (o) {
        var str = 'ssrc:%d';
        if (o.attribute != null) {
          str += ' %s';
          if (o.value != null) {
            str += ':%s';
          }
        }
        return str;
      }
    },
    {
      // a=ssrc-group:FEC 1 2
      // a=ssrc-group:FEC-FR 3004364195 1080772241
      push: 'ssrcGroups',
      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
      names: ['semantics', 'ssrcs'],
      format: 'ssrc-group:%s %s'
    },
    {
      // a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
      name: 'msidSemantic',
      reg: /^msid-semantic:\s?(\w*) (\S*)/,
      names: ['semantic', 'token'],
      format: 'msid-semantic: %s %s' // space after ':' is not accidental
    },
    {
      // a=group:BUNDLE audio video
      push: 'groups',
      reg: /^group:(\w*) (.*)/,
      names: ['type', 'mids'],
      format: 'group:%s %s'
    },
    {
      // a=rtcp-mux
      name: 'rtcpMux',
      reg: /^(rtcp-mux)/
    },
    {
      // a=rtcp-rsize
      name: 'rtcpRsize',
      reg: /^(rtcp-rsize)/
    },
    {
      // a=sctpmap:5000 webrtc-datachannel 1024
      name: 'sctpmap',
      reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
      format: function (o) {
        return (o.maxMessageSize != null)
          ? 'sctpmap:%s %s %s'
          : 'sctpmap:%s %s';
      }
    },
    {
      // a=x-google-flag:conference
      name: 'xGoogleFlag',
      reg: /^x-google-flag:([^\s]*)/,
      format: 'x-google-flag:%s'
    },
    {
      // a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
      push: 'rids',
      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
      names: ['id', 'direction', 'params'],
      format: function (o) {
        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
      }
    },
    {
      // a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
      // a=imageattr:* send [x=800,y=640] recv *
      // a=imageattr:100 recv [x=320,y=240]
      push: 'imageattrs',
      reg: new RegExp(
        // a=imageattr:97
        '^imageattr:(\\d+|\\*)' +
        // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
        // recv [x=330,y=250]
        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
      ),
      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
      format: function (o) {
        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    {
      // a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
      // a=simulcast:recv 1;4,5 send 6;7
      name: 'simulcast',
      reg: new RegExp(
        // a=simulcast:
        '^simulcast:' +
        // send 1,2,3;~4,~5
        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
        // space + recv 6;~7,~8
        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
        // end
        '$'
      ),
      names: ['dir1', 'list1', 'dir2', 'list2'],
      format: function (o) {
        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    {
      // old simulcast draft 03 (implemented by Firefox)
      //   https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
      // a=simulcast: recv pt=97;98 send pt=97
      // a=simulcast: send rid=5;6;7 paused=6,7
      name: 'simulcast_03',
      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
      names: ['value'],
      format: 'simulcast: %s'
    },
    {
      // a=framerate:25
      // a=framerate:29.97
      name: 'framerate',
      reg: /^framerate:(\d+(?:$|\.\d+))/,
      format: 'framerate:%s'
    },
    {
      // RFC4570
      // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
      name: 'sourceFilter',
      reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
      names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
      format: 'source-filter: %s %s %s %s %s'
    },
    {
      // a=bundle-only
      name: 'bundleOnly',
      reg: /^(bundle-only)/
    },
    {
      // a=label:1
      name: 'label',
      reg: /^label:(.+)/,
      format: 'label:%s'
    },
    {
      // RFC version 26 for SCTP over DTLS
      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-5
      name: 'sctpPort',
      reg: /^sctp-port:(\d+)$/,
      format: 'sctp-port:%s'
    },
    {
      // RFC version 26 for SCTP over DTLS
      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-6
      name: 'maxMessageSize',
      reg: /^max-message-size:(\d+)$/,
      format: 'max-message-size:%s'
    },
    {
      // a=keywds:keywords
      name: 'keywords',
      reg: /^keywds:(.+)$/,
      format: 'keywds:%s'
    },
    {
      // a=content:main
      name: 'content',
      reg: /^content:(.+)/,
      format: 'content:%s'
    },
    // BFCP https://tools.ietf.org/html/rfc4583
    {
      // a=floorctrl:c-s
      name: 'bfcpFloorCtrl',
      reg: /^floorctrl:(c-only|s-only|c-s)/,
      format: 'floorctrl:%s'
    },
    {
      // a=confid:1
      name: 'bfcpConfId',
      reg: /^confid:(\d+)/,
      format: 'confid:%s'
    },
    {
      // a=userid:1
      name: 'bfcpUserId',
      reg: /^userid:(\d+)/,
      format: 'userid:%s'
    },
    {
      // a=floorid:1
      name: 'bfcpFloorId',
      reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
      names: ['id', 'mStream'],
      format: 'floorid:%s mstrm:%s'
    },
    {
      // any a= that we don't understand is kept verbatim on media.invalid
      push: 'invalid',
      names: ['value']
    }
  ]
};

// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }
    if (!obj.format) {
      obj.format = '%s';
    }
  });
});

},{}],89:[function(require,module,exports){
var parser = require('./parser');
var writer = require('./writer');

exports.write = writer;
exports.parse = parser.parse;
exports.parseFmtpConfig = parser.parseFmtpConfig;
exports.parseParams = parser.parseParams;
exports.parsePayloads = parser.parsePayloads;
exports.parseRemoteCandidates = parser.parseRemoteCandidates;
exports.parseImageAttributes = parser.parseImageAttributes;
exports.parseSimulcastStreamList = parser.parseSimulcastStreamList;

},{"./parser":90,"./writer":91}],90:[function(require,module,exports){
var toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

var attachProperties = function (match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  }
  else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
};

var parseReg = function (obj, location, content) {
  var needsBlank = obj.name && obj.names;
  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  }
  else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }
  var keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
};

var grammar = require('./grammar');
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

exports.parse = function (sdp) {
  var session = {}
    , media = []
    , location = session; // points at where properties go under (one of the above)

  // parse lines we understand
  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);
    if (type === 'm') {
      media.push({rtp: [], fmtp: []});
      location = media[media.length-1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];
      if (obj.reg.test(content)) {
        return parseReg(obj, location, content);
      }
    }
  });

  session.media = media; // link it up
  return session;
};

var paramReducer = function (acc, expr) {
  var s = expr.split(/=(.+)/, 2);
  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  } else if (s.length === 1 && expr.length > 1) {
    acc[s[0]] = undefined;
  }
  return acc;
};

exports.parseParams = function (str) {
  return str.split(/;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
exports.parseFmtpConfig = exports.parseParams;

exports.parsePayloads = function (str) {
  return str.toString().split(' ').map(Number);
};

exports.parseRemoteCandidates = function (str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);
  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }
  return candidates;
};

exports.parseImageAttributes = function (str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
  });
};

exports.parseSimulcastStreamList = function (str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid, paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
};

},{"./grammar":88}],91:[function(require,module,exports){
var grammar = require('./grammar');

// customized util.format - discards excess arguments and can void middle ones
var formatRegExp = /%[sdv%]/g;
var format = function (formatStr) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }
    var arg = args[i];
    i += 1;
    switch (x) {
    case '%%':
      return '%';
    case '%s':
      return String(arg);
    case '%d':
      return Number(arg);
    case '%v':
      return '';
    }
  });
  // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function (type, obj, location) {
  var str = obj.format instanceof Function ?
    (obj.format(obj.push ? location : location[obj.name])) :
    obj.format;

  var args = [type + '=' + str];
  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];
      if (obj.name) {
        args.push(location[obj.name][n]);
      }
      else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  }
  else {
    args.push(location[obj.name]);
  }
  return format.apply(null, args);
};

// RFC specified order
// TODO: extend this with all the rest
var defaultOuterOrder = [
  'v', 'o', 's', 'i',
  'u', 'e', 'p', 'c',
  'b', 't', 'r', 'z', 'a'
];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];


module.exports = function (session, opts) {
  opts = opts || {};
  // ensure certain properties exist
  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }
  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }
  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });

  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = [];

  // loop through outerOrder for matching properties on session
  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      }
      else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  });

  // then for each media line, follow the innerOrder
  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));

    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        }
        else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return sdp.join('\r\n') + '\r\n';
};

},{"./grammar":88}],92:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill.js":93}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],94:[function(require,module,exports){
(function (global){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"querystringify":80,"requires-port":84}],95:[function(require,module,exports){
(function (global){
var _global = (function () {
	if (!this && typeof global !== 'undefined') {
		return global;
	}
	return this;
})();
var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var websocket_version = require('./version');


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function() { return NativeWebSocket[prop]; }
		});
	});
}

/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./version":96}],96:[function(require,module,exports){
module.exports = require('../package.json').version;

},{"../package.json":97}],97:[function(require,module,exports){
module.exports={
  "_from": "websocket@^1.0.28",
  "_id": "websocket@1.0.30",
  "_inBundle": false,
  "_integrity": "sha512-aO6klgaTdSMkhfl5VVJzD5fm+Srhh5jLYbS15+OiI1sN6h/RU/XW6WN9J1uVIpUKNmsTvT3Hs35XAFjn9NMfOw==",
  "_location": "/websocket",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "websocket@^1.0.28",
    "name": "websocket",
    "escapedName": "websocket",
    "rawSpec": "^1.0.28",
    "saveSpec": null,
    "fetchSpec": "^1.0.28"
  },
  "_requiredBy": [
    "/protoo-client"
  ],
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.30.tgz",
  "_shasum": "91d3bd00c3d43e916f0cf962f8f8c451bb0b2373",
  "_spec": "websocket@^1.0.28",
  "_where": "/home/alexey/Desktop/Projects/JS/easy-mediasoup-v3-client/app/node_modules/protoo-client",
  "author": {
    "name": "Brian McKelvey",
    "email": "theturtle32@gmail.com",
    "url": "https://github.com/theturtle32"
  },
  "browser": "lib/browser.js",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "bundleDependencies": false,
  "config": {
    "verbose": false
  },
  "contributors": [
    {
      "name": "Iñaki Baz Castillo",
      "email": "ibc@aliax.net",
      "url": "http://dev.sipdoc.net"
    }
  ],
  "dependencies": {
    "debug": "^2.2.0",
    "nan": "^2.14.0",
    "typedarray-to-buffer": "^3.1.5",
    "yaeti": "^0.0.6"
  },
  "deprecated": false,
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "devDependencies": {
    "buffer-equal": "^1.0.0",
    "faucet": "^0.0.1",
    "gulp": "^4.0.2",
    "gulp-jshint": "^2.0.4",
    "jshint": "^2.0.0",
    "jshint-stylish": "^2.2.1",
    "tape": "^4.9.1"
  },
  "directories": {
    "lib": "./lib"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "keywords": [
    "websocket",
    "websockets",
    "socket",
    "networking",
    "comet",
    "push",
    "RFC-6455",
    "realtime",
    "server",
    "client"
  ],
  "license": "Apache-2.0",
  "main": "index",
  "name": "websocket",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "scripts": {
    "gulp": "gulp",
    "install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
    "test": "faucet test/unit"
  },
  "version": "1.0.30"
}

},{}],98:[function(require,module,exports){
/*
WildEmitter.js is a slim little event emitter by @henrikjoreteg largely based
on @visionmedia's Emitter from UI Kit.

Why? I wanted it standalone.

I also wanted support for wildcard emitters like this:

emitter.on('*', function (eventName, other, event, payloads) {

});

emitter.on('somenamespace*', function (eventName, payloads) {

});

Please note that callbacks triggered by wildcard registered events also get
the event name as the first argument.
*/

module.exports = WildEmitter;

function WildEmitter() { }

WildEmitter.mixin = function (constructor) {
    var prototype = constructor.prototype || constructor;

    prototype.isWildEmitter= true;

    // Listen on the given `event` with `fn`. Store a group name if present.
    prototype.on = function (event, groupName, fn) {
        this.callbacks = this.callbacks || {};
        var hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        func._groupName = group;
        (this.callbacks[event] = this.callbacks[event] || []).push(func);
        return this;
    };

    // Adds an `event` listener that will be invoked a single
    // time then automatically removed.
    prototype.once = function (event, groupName, fn) {
        var self = this,
            hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        function on() {
            self.off(event, on);
            func.apply(this, arguments);
        }
        this.on(event, group, on);
        return this;
    };

    // Unbinds an entire group
    prototype.releaseGroup = function (groupName) {
        this.callbacks = this.callbacks || {};
        var item, i, len, handlers;
        for (item in this.callbacks) {
            handlers = this.callbacks[item];
            for (i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]._groupName === groupName) {
                    //console.log('removing');
                    // remove it and shorten the array we're looping through
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        return this;
    };

    // Remove the given callback for `event` or all
    // registered callbacks.
    prototype.off = function (event, fn) {
        this.callbacks = this.callbacks || {};
        var callbacks = this.callbacks[event],
            i;

        if (!callbacks) return this;

        // remove all handlers
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        // remove specific handler
        i = callbacks.indexOf(fn);
        if (i !== -1) {
            callbacks.splice(i, 1);
            if (callbacks.length === 0) {
                delete this.callbacks[event];
            }
        }
        return this;
    };

    /// Emit `event` with the given args.
    // also calls any `*` handlers
    prototype.emit = function (event) {
        this.callbacks = this.callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this.callbacks[event],
            specialCallbacks = this.getWildcardCallbacks(event),
            i,
            len,
            item,
            listeners;

        if (callbacks) {
            listeners = callbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, args);
            }
        }

        if (specialCallbacks) {
            len = specialCallbacks.length;
            listeners = specialCallbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, [event].concat(args));
            }
        }

        return this;
    };

    // Helper for for finding special wildcard event handlers that match the event
    prototype.getWildcardCallbacks = function (eventName) {
        this.callbacks = this.callbacks || {};
        var item,
            split,
            result = [];

        for (item in this.callbacks) {
            split = item.split('*');
            if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])) {
                result = result.concat(this.callbacks[item]);
            }
        }
        return result;
    };

};

WildEmitter.mixin(WildEmitter);

},{}]},{},[5])(5)
});
