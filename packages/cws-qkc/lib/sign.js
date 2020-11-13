"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signTypedData = exports.signMessage = exports.signTransaction = void 0;

var _core = require("@coolwallet/core");

var _lib = require("./lib");

var ethUtil = _interopRequireWildcard(require("./utils/ethUtils"));

var _stringUtil = require("./utils/stringUtil");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ethSigUtil = require('eth-sig-util');

var typedDataUtils = ethSigUtil.TypedDataUtils;

var rlp = require('rlp');

/**
 * sign ETH Transaction
 * @param {Transport} transport
 * @param {string} appId
 * @param {String} appPrivateKey
 * @param {coinType} coinType
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string}} transaction
 * @param {Number} addressIndex
 * @param {String} publicKey
 * @param {Function} confirmCB
 * @param {Function} authorizedCB
 * @return {Promise<string>}
 */
var signTransaction = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(transport, appId, appPrivateKey, coinType, transaction, addressIndex) {
    var publicKey,
        confirmCB,
        authorizedCB,
        rawPayload,
        useScript,
        txType,
        canonicalSignature,
        _ethUtil$getScriptAnd,
        script,
        argument,
        preActions,
        sendScript,
        sendArgument,
        keyId,
        _ethUtil$getReadType,
        readType,
        dataForSE,
        _preActions,
        sayHi,
        prepareTx,
        _yield$ethUtil$genEth,
        v,
        r,
        s,
        serializedTx,
        _args5 = arguments;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            publicKey = _args5.length > 6 && _args5[6] !== undefined ? _args5[6] : undefined;
            confirmCB = _args5.length > 7 && _args5[7] !== undefined ? _args5[7] : undefined;
            authorizedCB = _args5.length > 8 && _args5[8] !== undefined ? _args5[8] : undefined;
            rawPayload = ethUtil.getRawHex(transaction);
            _context5.next = 6;
            return _core.util.checkSupportScripts(transport);

          case 6:
            useScript = _context5.sent;
            txType = ethUtil.getTransactionType(transaction);

            if (!useScript) {
              _context5.next = 19;
              break;
            }

            _ethUtil$getScriptAnd = ethUtil.getScriptAndArguments(txType, addressIndex, transaction), script = _ethUtil$getScriptAnd.script, argument = _ethUtil$getScriptAnd.argument;
            preActions = [];

            sendScript = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _core.apdu.tx.sendScript(transport, script);

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function sendScript() {
                return _ref2.apply(this, arguments);
              };
            }();

            preActions.push(sendScript);

            sendArgument = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", _core.apdu.tx.executeScript(transport, appId, appPrivateKey, argument));

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function sendArgument() {
                return _ref3.apply(this, arguments);
              };
            }();

            _context5.next = 16;
            return _core.tx.flow.getSingleSignatureFromCoolWallet(transport, preActions, sendArgument, false, confirmCB, authorizedCB, true);

          case 16:
            canonicalSignature = _context5.sent;
            _context5.next = 29;
            break;

          case 19:
            keyId = _core.tx.util.addressIndexToKeyId(coinType, addressIndex);
            _ethUtil$getReadType = ethUtil.getReadType(txType), readType = _ethUtil$getReadType.readType;
            dataForSE = _core.tx.flow.prepareSEData(keyId, rawPayload, readType);
            _preActions = [];

            sayHi = /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _core.apdu.general.hi(transport, appId);

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function sayHi() {
                return _ref4.apply(this, arguments);
              };
            }();

            _preActions.push(sayHi);

            prepareTx = /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", _core.apdu.tx.txPrep(transport, dataForSE, "00", appPrivateKey));

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function prepareTx() {
                return _ref5.apply(this, arguments);
              };
            }();

            _context5.next = 28;
            return _core.tx.flow.getSingleSignatureFromCoolWallet(transport, _preActions, prepareTx, false, confirmCB, authorizedCB, true);

          case 28:
            canonicalSignature = _context5.sent;

          case 29:
            if (Buffer.isBuffer(canonicalSignature)) {
              _context5.next = 40;
              break;
            }

            _context5.next = 32;
            return ethUtil.genEthSigFromSESig(canonicalSignature, rlp.encode(rawPayload), publicKey);

          case 32:
            _yield$ethUtil$genEth = _context5.sent;
            v = _yield$ethUtil$genEth.v;
            r = _yield$ethUtil$genEth.r;
            s = _yield$ethUtil$genEth.s;
            serializedTx = ethUtil.composeSignedTransacton(rawPayload, v, r, s);
            return _context5.abrupt("return", serializedTx);

          case 40:
            throw new _core.error.SDKError(signTransaction.name, 'canonicalSignature type error');

          case 41:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function signTransaction(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Sign Message.
 * @param {Transport} transport
 * @param {String} appId
 * @param {String} appPrivateKey
 * @param {String} message hex or utf-8
 * @param {Number} addressIndex
 * @param {String} publicKey
 * @param {Boolean} isHashRequired used by joyso
 * @param {Function} confirmCB
 * @param {Function} authorizedCB
 * @return {Promise<String>}
 */


exports.signTransaction = signTransaction;

var signMessage = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(transport, appId, appPrivateKey, coinType, message, addressIndex) {
    var publicKey,
        isHashRequired,
        confirmCB,
        authorizedCB,
        keyId,
        preActions,
        sayHi,
        msgBuf,
        apduForParsignMessage,
        len,
        prefix,
        payload,
        dataForSE,
        prepareTx,
        canonicalSignature,
        _yield$ethUtil$genEth2,
        v,
        r,
        s,
        signature,
        _args10 = arguments;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            publicKey = _args10.length > 6 && _args10[6] !== undefined ? _args10[6] : undefined;
            isHashRequired = _args10.length > 7 && _args10[7] !== undefined ? _args10[7] : false;
            confirmCB = _args10.length > 8 && _args10[8] !== undefined ? _args10[8] : undefined;
            authorizedCB = _args10.length > 9 && _args10[9] !== undefined ? _args10[9] : undefined;
            keyId = _core.tx.util.addressIndexToKeyId(coinType, addressIndex);
            preActions = [];

            sayHi = /*#__PURE__*/function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _core.apdu.general.hi(transport, appId);

                      case 2:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function sayHi() {
                return _ref7.apply(this, arguments);
              };
            }();

            preActions.push(sayHi);

            if ((0, _lib.isHex)(message)) {
              msgBuf = Buffer.from((0, _stringUtil.removeHex0x)(message), 'hex');
            } else {
              msgBuf = Buffer.from(message, 'utf8');
            }

            if (isHashRequired) {
              apduForParsignMessage = /*#__PURE__*/function () {
                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(msgBuf) {
                  var rawData;
                  return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          rawData = msgBuf.toString("hex");
                          rawData = (0, _stringUtil.handleHex)(rawData);
                          return _context8.abrupt("return", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                              while (1) {
                                switch (_context7.prev = _context7.next) {
                                  case 0:
                                    _core.apdu.tx.txPrep(transport, rawData, '07', appPrivateKey);

                                  case 1:
                                  case "end":
                                    return _context7.stop();
                                }
                              }
                            }, _callee7);
                          })));

                        case 3:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));

                return function apduForParsignMessage(_x13) {
                  return _ref8.apply(this, arguments);
                };
              }();

              preActions.push(apduForParsignMessage);
              msgBuf = Buffer.from((0, _lib.keccak256)(msgBuf), 'hex');
            }

            len = msgBuf.length.toString();
            prefix = Buffer.from("\x19Ethereum Signed Message:\n".concat(len));
            payload = Buffer.concat([prefix, msgBuf]);
            dataForSE = _core.tx.flow.prepareSEData(keyId, payload, 'F5');

            prepareTx = /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        return _context9.abrupt("return", _core.apdu.tx.txPrep(transport, dataForSE, "00", appPrivateKey));

                      case 1:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function prepareTx() {
                return _ref10.apply(this, arguments);
              };
            }();

            _context10.next = 17;
            return _core.tx.flow.getSingleSignatureFromCoolWallet(transport, preActions, prepareTx, false, confirmCB, authorizedCB, true);

          case 17:
            canonicalSignature = _context10.sent;

            if (Buffer.isBuffer(canonicalSignature)) {
              _context10.next = 29;
              break;
            }

            _context10.next = 21;
            return ethUtil.genEthSigFromSESig(canonicalSignature, payload, publicKey);

          case 21:
            _yield$ethUtil$genEth2 = _context10.sent;
            v = _yield$ethUtil$genEth2.v;
            r = _yield$ethUtil$genEth2.r;
            s = _yield$ethUtil$genEth2.s;
            signature = "0x".concat(r).concat(s).concat(v.toString(16));
            return _context10.abrupt("return", signature);

          case 29:
            throw new _core.error.SDKError(signMessage.name, 'canonicalSignature type error');

          case 30:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function signMessage(_x7, _x8, _x9, _x10, _x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @description Sign Typed Data
 * @param {Transport} transport
 * @param {String} appId
 * @param {String} appPrivateKey
 * @param {String} coinType
 * @param {Object} typedData
 * @param {number} addressIndex
 * @param {Stirng} publicKey
 * @param {Function?} confirmCB
 * @param {Function?} authorizedCB
 * @return {Promise<String>}
 */


exports.signMessage = signMessage;

var signTypedData = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(transport, appId, appPrivateKey, coinType, typedData, addressIndex) {
    var publicKey,
        confirmCB,
        authorizedCB,
        keyId,
        sanitizedData,
        encodedData,
        prefix,
        domainSeparate,
        dataHash,
        payload,
        dataForSE,
        preActions,
        sayHi,
        prepareTx,
        canonicalSignature,
        _yield$ethUtil$genEth3,
        v,
        r,
        s,
        signature,
        _args13 = arguments;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            publicKey = _args13.length > 6 && _args13[6] !== undefined ? _args13[6] : undefined;
            confirmCB = _args13.length > 7 && _args13[7] !== undefined ? _args13[7] : undefined;
            authorizedCB = _args13.length > 8 && _args13[8] !== undefined ? _args13[8] : undefined;
            keyId = _core.tx.util.addressIndexToKeyId(coinType, addressIndex);
            sanitizedData = typedDataUtils.sanitizeData(typedData);
            encodedData = typedDataUtils.encodeData(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types);
            prefix = Buffer.from('1901', 'hex');
            domainSeparate = typedDataUtils.hashStruct('EIP712Domain', sanitizedData.domain, sanitizedData.types);
            dataHash = Buffer.from((0, _lib.keccak256)(encodedData).substr(2), 'hex');
            payload = Buffer.concat([prefix, domainSeparate, dataHash]);
            dataForSE = _core.tx.flow.prepareSEData(keyId, payload, 'F3');
            preActions = [];

            sayHi = /*#__PURE__*/function () {
              var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _core.apdu.general.hi(transport, appId);

                      case 2:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function sayHi() {
                return _ref12.apply(this, arguments);
              };
            }();

            preActions.push(sayHi);

            prepareTx = /*#__PURE__*/function () {
              var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        return _context12.abrupt("return", _core.apdu.tx.txPrep(transport, dataForSE, "00", appPrivateKey));

                      case 1:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function prepareTx() {
                return _ref13.apply(this, arguments);
              };
            }();

            _context13.next = 17;
            return _core.tx.flow.getSingleSignatureFromCoolWallet(transport, preActions, prepareTx, false, confirmCB, authorizedCB, true);

          case 17:
            canonicalSignature = _context13.sent;

            if (Buffer.isBuffer(canonicalSignature)) {
              _context13.next = 29;
              break;
            }

            _context13.next = 21;
            return ethUtil.genEthSigFromSESig(canonicalSignature, payload, publicKey);

          case 21:
            _yield$ethUtil$genEth3 = _context13.sent;
            v = _yield$ethUtil$genEth3.v;
            r = _yield$ethUtil$genEth3.r;
            s = _yield$ethUtil$genEth3.s;
            signature = "0x".concat(r).concat(s).concat(v.toString(16));
            return _context13.abrupt("return", signature);

          case 29:
            throw new _core.error.SDKError(signTypedData.name, 'canonicalSignature type error');

          case 30:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function signTypedData(_x14, _x15, _x16, _x17, _x18, _x19) {
    return _ref11.apply(this, arguments);
  };
}();

exports.signTypedData = signTypedData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduLnRzIl0sIm5hbWVzIjpbImV0aFNpZ1V0aWwiLCJyZXF1aXJlIiwidHlwZWREYXRhVXRpbHMiLCJUeXBlZERhdGFVdGlscyIsInJscCIsInNpZ25UcmFuc2FjdGlvbiIsInRyYW5zcG9ydCIsImFwcElkIiwiYXBwUHJpdmF0ZUtleSIsImNvaW5UeXBlIiwidHJhbnNhY3Rpb24iLCJhZGRyZXNzSW5kZXgiLCJwdWJsaWNLZXkiLCJ1bmRlZmluZWQiLCJjb25maXJtQ0IiLCJhdXRob3JpemVkQ0IiLCJyYXdQYXlsb2FkIiwiZXRoVXRpbCIsImdldFJhd0hleCIsInV0aWwiLCJjaGVja1N1cHBvcnRTY3JpcHRzIiwidXNlU2NyaXB0IiwidHhUeXBlIiwiZ2V0VHJhbnNhY3Rpb25UeXBlIiwiZ2V0U2NyaXB0QW5kQXJndW1lbnRzIiwic2NyaXB0IiwiYXJndW1lbnQiLCJwcmVBY3Rpb25zIiwic2VuZFNjcmlwdCIsImFwZHUiLCJ0eCIsInB1c2giLCJzZW5kQXJndW1lbnQiLCJleGVjdXRlU2NyaXB0IiwiZmxvdyIsImdldFNpbmdsZVNpZ25hdHVyZUZyb21Db29sV2FsbGV0IiwiY2Fub25pY2FsU2lnbmF0dXJlIiwia2V5SWQiLCJhZGRyZXNzSW5kZXhUb0tleUlkIiwiZ2V0UmVhZFR5cGUiLCJyZWFkVHlwZSIsImRhdGFGb3JTRSIsInByZXBhcmVTRURhdGEiLCJzYXlIaSIsImdlbmVyYWwiLCJoaSIsInByZXBhcmVUeCIsInR4UHJlcCIsIkJ1ZmZlciIsImlzQnVmZmVyIiwiZ2VuRXRoU2lnRnJvbVNFU2lnIiwiZW5jb2RlIiwidiIsInIiLCJzIiwic2VyaWFsaXplZFR4IiwiY29tcG9zZVNpZ25lZFRyYW5zYWN0b24iLCJlcnJvciIsIlNES0Vycm9yIiwibmFtZSIsInNpZ25NZXNzYWdlIiwibWVzc2FnZSIsImlzSGFzaFJlcXVpcmVkIiwibXNnQnVmIiwiZnJvbSIsImFwZHVGb3JQYXJzaWduTWVzc2FnZSIsInJhd0RhdGEiLCJ0b1N0cmluZyIsImxlbiIsImxlbmd0aCIsInByZWZpeCIsInBheWxvYWQiLCJjb25jYXQiLCJzaWduYXR1cmUiLCJzaWduVHlwZWREYXRhIiwidHlwZWREYXRhIiwic2FuaXRpemVkRGF0YSIsInNhbml0aXplRGF0YSIsImVuY29kZWREYXRhIiwiZW5jb2RlRGF0YSIsInByaW1hcnlUeXBlIiwidHlwZXMiLCJkb21haW5TZXBhcmF0ZSIsImhhc2hTdHJ1Y3QiLCJkb21haW4iLCJkYXRhSGFzaCIsInN1YnN0ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQTFCOztBQUNBLElBQU1DLGNBQWMsR0FBR0YsVUFBVSxDQUFDRyxjQUFsQzs7QUFDQSxJQUFNQyxHQUFHLEdBQUdILE9BQU8sQ0FBQyxLQUFELENBQW5COztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxJQUFNSSxlQUFlO0FBQUEscUVBQUcsa0JBQzdCQyxTQUQ2QixFQUU3QkMsS0FGNkIsRUFHN0JDLGFBSDZCLEVBSTdCQyxRQUo2QixFQUs5QkMsV0FMOEIsRUFjN0JDLFlBZDZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWU3QkMsWUFBQUEsU0FmNkIsOERBZUdDLFNBZkg7QUFnQjdCQyxZQUFBQSxTQWhCNkIsOERBZ0JLRCxTQWhCTDtBQWlCN0JFLFlBQUFBLFlBakI2Qiw4REFpQlFGLFNBakJSO0FBbUJ2QkcsWUFBQUEsVUFuQnVCLEdBbUJWQyxPQUFPLENBQUNDLFNBQVIsQ0FBa0JSLFdBQWxCLENBbkJV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c0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFtRENuQixPQUFPLENBQUNpQyxrQkFBUixDQUEyQmQsa0JBQTNCLEVBQStDbUMsT0FBL0MsRUFBd0QzRCxTQUF4RCxDQW5ERDs7QUFBQTtBQUFBO0FBbURqQndDLFlBQUFBLENBbkRpQiwwQkFtRGpCQSxDQW5EaUI7QUFtRGRDLFlBQUFBLENBbkRjLDBCQW1EZEEsQ0FuRGM7QUFtRFhDLFlBQUFBLENBbkRXLDBCQW1EWEEsQ0FuRFc7QUFvRG5CbUIsWUFBQUEsU0FwRG1CLGVBb0RGcEIsQ0FwREUsU0FvREVDLENBcERGLFNBb0RNRixDQUFDLENBQUNlLFFBQUYsQ0FBVyxFQUFYLENBcEROO0FBQUEsK0NBc0RsQk0sU0F0RGtCOztBQUFBO0FBQUEsa0JBd0RuQixJQUFJaEIsWUFBTUMsUUFBVixDQUFtQmdCLGFBQWEsQ0FBQ2YsSUFBakMsRUFBdUMsK0JBQXZDLENBeERtQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFIOztBQUFBLGtCQUFiZSxhQUFhO0FBQUE7QUFBQTtBQUFBLEdBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXBkdSwgdHJhbnNwb3J0LCBlcnJvciwgdHgsIHV0aWwgfSBmcm9tICdAY29vbHdhbGxldC9jb3JlJztcbi8vIGltcG9ydCB7IFR5cGVkRGF0YVV0aWxzIGFzIHR5cGVkRGF0YVV0aWxzIH0gZnJvbSAnZXRoLXNpZy11dGlsJztcbmltcG9ydCB7IGlzSGV4LCBrZWNjYWsyNTYgfSBmcm9tICcuL2xpYic7XG5pbXBvcnQgKiBhcyBldGhVdGlsIGZyb20gJy4vdXRpbHMvZXRoVXRpbHMnO1xuaW1wb3J0IHsgcmVtb3ZlSGV4MHgsIGhhbmRsZUhleCB9IGZyb20gJy4vdXRpbHMvc3RyaW5nVXRpbCc7XG5cbmNvbnN0IGV0aFNpZ1V0aWwgPSByZXF1aXJlKCdldGgtc2lnLXV0aWwnKTtcbmNvbnN0IHR5cGVkRGF0YVV0aWxzID0gZXRoU2lnVXRpbC5UeXBlZERhdGFVdGlsc1xuY29uc3QgcmxwID0gcmVxdWlyZSgncmxwJyk7XG50eXBlIFRyYW5zcG9ydCA9IHRyYW5zcG9ydC5kZWZhdWx0O1xuXG4vKipcbiAqIHNpZ24gRVRIIFRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge1RyYW5zcG9ydH0gdHJhbnNwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcHBQcml2YXRlS2V5XG4gKiBAcGFyYW0ge2NvaW5UeXBlfSBjb2luVHlwZVxuICogQHBhcmFtIHt7bm9uY2U6c3RyaW5nLCBnYXNQcmljZTpzdHJpbmcsIGdhc0xpbWl0OnN0cmluZywgdG86c3RyaW5nLFxuICogdmFsdWU6c3RyaW5nLCBkYXRhOnN0cmluZ319IHRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gYWRkcmVzc0luZGV4XG4gKiBAcGFyYW0ge1N0cmluZ30gcHVibGljS2V5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maXJtQ0JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGF1dGhvcml6ZWRDQlxuICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fVxuICovXG5leHBvcnQgY29uc3Qgc2lnblRyYW5zYWN0aW9uID0gYXN5bmMgKFxuICB0cmFuc3BvcnQ6IFRyYW5zcG9ydCxcbiAgYXBwSWQ6IHN0cmluZyxcbiAgYXBwUHJpdmF0ZUtleTogc3RyaW5nLFxuICBjb2luVHlwZTogc3RyaW5nLFxuXHR0cmFuc2FjdGlvbjoge1xuXHRcdG5vbmNlOiBzdHJpbmcsXG5cdFx0Z2FzUHJpY2U6IHN0cmluZyxcblx0XHRnYXNMaW1pdDogc3RyaW5nLFxuXHRcdHRvOiBzdHJpbmcsXG5cdFx0dmFsdWU6IHN0cmluZyxcblx0XHRkYXRhOiBzdHJpbmcsXG5cdFx0ZnJvbUZ1bGxTaGFyZEtleTogc3RyaW5nLFxuXHRcdHRvRnVsbFNoYXJkS2V5OiBzdHJpbmcgfSxcbiAgYWRkcmVzc0luZGV4OiBudW1iZXIsXG4gIHB1YmxpY0tleTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBjb25maXJtQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBhdXRob3JpemVkQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgY29uc3QgcmF3UGF5bG9hZCA9IGV0aFV0aWwuZ2V0UmF3SGV4KHRyYW5zYWN0aW9uKTtcbiAgY29uc3QgdXNlU2NyaXB0ID0gYXdhaXQgdXRpbC5jaGVja1N1cHBvcnRTY3JpcHRzKHRyYW5zcG9ydCk7XG4gIGNvbnN0IHR4VHlwZSA9IGV0aFV0aWwuZ2V0VHJhbnNhY3Rpb25UeXBlKHRyYW5zYWN0aW9uKTtcbiAgbGV0IGNhbm9uaWNhbFNpZ25hdHVyZTtcbiAgaWYgKHVzZVNjcmlwdCkge1xuICAgIGNvbnN0IHsgc2NyaXB0LCBhcmd1bWVudCB9ID0gZXRoVXRpbC5nZXRTY3JpcHRBbmRBcmd1bWVudHModHhUeXBlLCBhZGRyZXNzSW5kZXgsIHRyYW5zYWN0aW9uKTtcbiAgICBjb25zdCBwcmVBY3Rpb25zID0gW107XG4gICAgY29uc3Qgc2VuZFNjcmlwdCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGFwZHUudHguc2VuZFNjcmlwdCh0cmFuc3BvcnQsIHNjcmlwdCk7XG4gICAgfVxuICAgIHByZUFjdGlvbnMucHVzaChzZW5kU2NyaXB0KTtcblxuICAgIGNvbnN0IHNlbmRBcmd1bWVudCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBhcGR1LnR4LmV4ZWN1dGVTY3JpcHQoXG4gICAgICAgIHRyYW5zcG9ydCxcbiAgICAgICAgYXBwSWQsXG4gICAgICAgIGFwcFByaXZhdGVLZXksXG4gICAgICAgIGFyZ3VtZW50XG4gICAgICApO1xuICAgIH1cblxuICAgIGNhbm9uaWNhbFNpZ25hdHVyZSA9IGF3YWl0IHR4LmZsb3cuZ2V0U2luZ2xlU2lnbmF0dXJlRnJvbUNvb2xXYWxsZXQoXG4gICAgICB0cmFuc3BvcnQsXG4gICAgICBwcmVBY3Rpb25zLFxuICAgICAgc2VuZEFyZ3VtZW50LFxuICAgICAgZmFsc2UsXG4gICAgICBjb25maXJtQ0IsXG4gICAgICBhdXRob3JpemVkQ0IsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBrZXlJZCA9IHR4LnV0aWwuYWRkcmVzc0luZGV4VG9LZXlJZChjb2luVHlwZSwgYWRkcmVzc0luZGV4KTtcbiAgICBjb25zdCB7IHJlYWRUeXBlIH0gPSBldGhVdGlsLmdldFJlYWRUeXBlKHR4VHlwZSk7XG4gICAgY29uc3QgZGF0YUZvclNFID0gdHguZmxvdy5wcmVwYXJlU0VEYXRhKGtleUlkLCByYXdQYXlsb2FkLCByZWFkVHlwZSk7XG5cbiAgICBjb25zdCBwcmVBY3Rpb25zID0gW107XG4gICAgY29uc3Qgc2F5SGkgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBhcGR1LmdlbmVyYWwuaGkodHJhbnNwb3J0LCBhcHBJZCk7XG4gICAgfVxuICAgIHByZUFjdGlvbnMucHVzaChzYXlIaSlcblxuICAgIGNvbnN0IHByZXBhcmVUeCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBhcGR1LnR4LnR4UHJlcCh0cmFuc3BvcnQsIGRhdGFGb3JTRSwgXCIwMFwiLCBhcHBQcml2YXRlS2V5KTtcbiAgICB9XG5cbiAgICBjYW5vbmljYWxTaWduYXR1cmUgPSBhd2FpdCB0eC5mbG93LmdldFNpbmdsZVNpZ25hdHVyZUZyb21Db29sV2FsbGV0KFxuICAgICAgdHJhbnNwb3J0LFxuICAgICAgcHJlQWN0aW9ucyxcbiAgICAgIHByZXBhcmVUeCxcbiAgICAgIGZhbHNlLFxuICAgICAgY29uZmlybUNCLFxuICAgICAgYXV0aG9yaXplZENCLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjYW5vbmljYWxTaWduYXR1cmUpKSB7XG4gICAgY29uc3QgeyB2LCByLCBzIH0gPSBhd2FpdCBldGhVdGlsLmdlbkV0aFNpZ0Zyb21TRVNpZyhcbiAgICAgIGNhbm9uaWNhbFNpZ25hdHVyZSxcbiAgICAgIHJscC5lbmNvZGUocmF3UGF5bG9hZCksXG4gICAgICBwdWJsaWNLZXlcbiAgICApO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRUeCA9IGV0aFV0aWwuY29tcG9zZVNpZ25lZFRyYW5zYWN0b24ocmF3UGF5bG9hZCwgdiwgciwgcyk7XG4gICAgcmV0dXJuIHNlcmlhbGl6ZWRUeDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgZXJyb3IuU0RLRXJyb3Ioc2lnblRyYW5zYWN0aW9uLm5hbWUsICdjYW5vbmljYWxTaWduYXR1cmUgdHlwZSBlcnJvcicpO1xuICB9XG59O1xuXG4vKipcbiAqIFNpZ24gTWVzc2FnZS5cbiAqIEBwYXJhbSB7VHJhbnNwb3J0fSB0cmFuc3BvcnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcHBJZFxuICogQHBhcmFtIHtTdHJpbmd9IGFwcFByaXZhdGVLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIGhleCBvciB1dGYtOFxuICogQHBhcmFtIHtOdW1iZXJ9IGFkZHJlc3NJbmRleFxuICogQHBhcmFtIHtTdHJpbmd9IHB1YmxpY0tleVxuICogQHBhcmFtIHtCb29sZWFufSBpc0hhc2hSZXF1aXJlZCB1c2VkIGJ5IGpveXNvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maXJtQ0JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGF1dGhvcml6ZWRDQlxuICogQHJldHVybiB7UHJvbWlzZTxTdHJpbmc+fVxuICovXG5leHBvcnQgY29uc3Qgc2lnbk1lc3NhZ2UgPSBhc3luYyAoXG4gIHRyYW5zcG9ydDogVHJhbnNwb3J0LFxuICBhcHBJZDogc3RyaW5nLFxuICBhcHBQcml2YXRlS2V5OiBzdHJpbmcsXG4gIGNvaW5UeXBlOiBzdHJpbmcsXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgYWRkcmVzc0luZGV4OiBudW1iZXIsXG4gIHB1YmxpY0tleTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBpc0hhc2hSZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlLFxuICBjb25maXJtQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBhdXRob3JpemVkQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4pID0+IHtcbiAgY29uc3Qga2V5SWQgPSB0eC51dGlsLmFkZHJlc3NJbmRleFRvS2V5SWQoY29pblR5cGUsIGFkZHJlc3NJbmRleCk7XG5cbiAgY29uc3QgcHJlQWN0aW9ucyA9IFtdO1xuICBjb25zdCBzYXlIaSA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhcGR1LmdlbmVyYWwuaGkodHJhbnNwb3J0LCBhcHBJZCk7XG4gIH1cbiAgcHJlQWN0aW9ucy5wdXNoKHNheUhpKTtcblxuICBsZXQgbXNnQnVmO1xuICBpZiAoaXNIZXgobWVzc2FnZSkpIHtcbiAgICBtc2dCdWYgPSBCdWZmZXIuZnJvbShyZW1vdmVIZXgweChtZXNzYWdlKSwgJ2hleCcpO1xuICB9IGVsc2Uge1xuICAgIG1zZ0J1ZiA9IEJ1ZmZlci5mcm9tKG1lc3NhZ2UsICd1dGY4Jyk7XG4gIH1cblxuICBpZiAoaXNIYXNoUmVxdWlyZWQpIHtcbiAgICBjb25zdCBhcGR1Rm9yUGFyc2lnbk1lc3NhZ2UgPSBhc3luYyAobXNnQnVmOiBCdWZmZXIpID0+IHtcbiAgICAgIGxldCByYXdEYXRhID0gbXNnQnVmLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgcmF3RGF0YSA9IGhhbmRsZUhleChyYXdEYXRhKTtcbiAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGFwZHUudHgudHhQcmVwKHRyYW5zcG9ydCwgcmF3RGF0YSwgJzA3JywgYXBwUHJpdmF0ZUtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHByZUFjdGlvbnMucHVzaChhcGR1Rm9yUGFyc2lnbk1lc3NhZ2UpXG4gICAgbXNnQnVmID0gQnVmZmVyLmZyb20oa2VjY2FrMjU2KG1zZ0J1ZiksICdoZXgnKTtcbiAgfVxuXG4gIGNvbnN0IGxlbiA9IG1zZ0J1Zi5sZW5ndGgudG9TdHJpbmcoKTtcbiAgY29uc3QgcHJlZml4ID0gQnVmZmVyLmZyb20oYFxcdTAwMTlFdGhlcmV1bSBTaWduZWQgTWVzc2FnZTpcXG4ke2xlbn1gKTtcbiAgY29uc3QgcGF5bG9hZCA9IEJ1ZmZlci5jb25jYXQoW3ByZWZpeCwgbXNnQnVmXSk7XG4gIGNvbnN0IGRhdGFGb3JTRSA9IHR4LmZsb3cucHJlcGFyZVNFRGF0YShrZXlJZCwgcGF5bG9hZCwgJ0Y1Jyk7XG4gIGNvbnN0IHByZXBhcmVUeCA9IGFzeW5jICgpID0+IHtcbiAgICByZXR1cm4gYXBkdS50eC50eFByZXAodHJhbnNwb3J0LCBkYXRhRm9yU0UsIFwiMDBcIiwgYXBwUHJpdmF0ZUtleSk7XG4gIH1cblxuICBjb25zdCBjYW5vbmljYWxTaWduYXR1cmUgPSBhd2FpdCB0eC5mbG93LmdldFNpbmdsZVNpZ25hdHVyZUZyb21Db29sV2FsbGV0KFxuICAgIHRyYW5zcG9ydCxcbiAgICBwcmVBY3Rpb25zLFxuICAgIHByZXBhcmVUeCxcbiAgICBmYWxzZSxcbiAgICBjb25maXJtQ0IsXG4gICAgYXV0aG9yaXplZENCLFxuICAgIHRydWVcbiAgKTtcblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjYW5vbmljYWxTaWduYXR1cmUpKSB7XG4gICAgY29uc3QgeyB2LCByLCBzIH0gPSBhd2FpdCBldGhVdGlsLmdlbkV0aFNpZ0Zyb21TRVNpZyhjYW5vbmljYWxTaWduYXR1cmUsIHBheWxvYWQsIHB1YmxpY0tleSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gYDB4JHtyfSR7c30ke3YudG9TdHJpbmcoMTYpfWA7XG4gICAgcmV0dXJuIHNpZ25hdHVyZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgZXJyb3IuU0RLRXJyb3Ioc2lnbk1lc3NhZ2UubmFtZSwgJ2Nhbm9uaWNhbFNpZ25hdHVyZSB0eXBlIGVycm9yJyk7XG4gIH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFNpZ24gVHlwZWQgRGF0YVxuICogQHBhcmFtIHtUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICogQHBhcmFtIHtTdHJpbmd9IGFwcElkXG4gKiBAcGFyYW0ge1N0cmluZ30gYXBwUHJpdmF0ZUtleVxuICogQHBhcmFtIHtTdHJpbmd9IGNvaW5UeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWREYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gYWRkcmVzc0luZGV4XG4gKiBAcGFyYW0ge1N0aXJuZ30gcHVibGljS2V5XG4gKiBAcGFyYW0ge0Z1bmN0aW9uP30gY29uZmlybUNCXG4gKiBAcGFyYW0ge0Z1bmN0aW9uP30gYXV0aG9yaXplZENCXG4gKiBAcmV0dXJuIHtQcm9taXNlPFN0cmluZz59XG4gKi9cbmV4cG9ydCBjb25zdCBzaWduVHlwZWREYXRhID0gYXN5bmMgKFxuICB0cmFuc3BvcnQ6IFRyYW5zcG9ydCxcbiAgYXBwSWQ6IHN0cmluZyxcbiAgYXBwUHJpdmF0ZUtleTogc3RyaW5nLFxuICBjb2luVHlwZTogc3RyaW5nLFxuICB0eXBlZERhdGE6IG9iamVjdCxcbiAgYWRkcmVzc0luZGV4OiBudW1iZXIsXG4gIHB1YmxpY0tleTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBjb25maXJtQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBhdXRob3JpemVkQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4pOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICBjb25zdCBrZXlJZCA9IHR4LnV0aWwuYWRkcmVzc0luZGV4VG9LZXlJZChjb2luVHlwZSwgYWRkcmVzc0luZGV4KTtcblxuICBjb25zdCBzYW5pdGl6ZWREYXRhID0gdHlwZWREYXRhVXRpbHMuc2FuaXRpemVEYXRhKHR5cGVkRGF0YSk7XG4gIGNvbnN0IGVuY29kZWREYXRhID0gdHlwZWREYXRhVXRpbHMuZW5jb2RlRGF0YShcbiAgICBzYW5pdGl6ZWREYXRhLnByaW1hcnlUeXBlLFxuICAgIHNhbml0aXplZERhdGEubWVzc2FnZSxcbiAgICBzYW5pdGl6ZWREYXRhLnR5cGVzXG4gICk7XG5cbiAgY29uc3QgcHJlZml4ID0gQnVmZmVyLmZyb20oJzE5MDEnLCAnaGV4Jyk7XG4gIGNvbnN0IGRvbWFpblNlcGFyYXRlID0gdHlwZWREYXRhVXRpbHMuaGFzaFN0cnVjdChcbiAgICAnRUlQNzEyRG9tYWluJyxcbiAgICBzYW5pdGl6ZWREYXRhLmRvbWFpbixcbiAgICBzYW5pdGl6ZWREYXRhLnR5cGVzXG4gICk7XG4gIGNvbnN0IGRhdGFIYXNoID0gQnVmZmVyLmZyb20oa2VjY2FrMjU2KGVuY29kZWREYXRhKS5zdWJzdHIoMiksICdoZXgnKTtcbiAgY29uc3QgcGF5bG9hZCA9IEJ1ZmZlci5jb25jYXQoW3ByZWZpeCwgZG9tYWluU2VwYXJhdGUsIGRhdGFIYXNoXSk7XG4gIGNvbnN0IGRhdGFGb3JTRSA9IHR4LmZsb3cucHJlcGFyZVNFRGF0YShrZXlJZCwgcGF5bG9hZCwgJ0YzJyk7XG5cbiAgY29uc3QgcHJlQWN0aW9ucyA9IFtdO1xuICBjb25zdCBzYXlIaSA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhcGR1LmdlbmVyYWwuaGkodHJhbnNwb3J0LCBhcHBJZCk7XG4gIH1cbiAgcHJlQWN0aW9ucy5wdXNoKHNheUhpKVxuXG4gIGNvbnN0IHByZXBhcmVUeCA9IGFzeW5jICgpID0+IHtcbiAgICByZXR1cm4gYXBkdS50eC50eFByZXAodHJhbnNwb3J0LCBkYXRhRm9yU0UsIFwiMDBcIiwgYXBwUHJpdmF0ZUtleSk7XG4gIH1cblxuICBjb25zdCBjYW5vbmljYWxTaWduYXR1cmUgPSBhd2FpdCB0eC5mbG93LmdldFNpbmdsZVNpZ25hdHVyZUZyb21Db29sV2FsbGV0KFxuICAgIHRyYW5zcG9ydCxcbiAgICBwcmVBY3Rpb25zLFxuICAgIHByZXBhcmVUeCxcbiAgICBmYWxzZSxcbiAgICBjb25maXJtQ0IsXG4gICAgYXV0aG9yaXplZENCLFxuICAgIHRydWVcbiAgKTtcblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjYW5vbmljYWxTaWduYXR1cmUpKSB7XG4gICAgY29uc3QgeyB2LCByLCBzIH0gPSBhd2FpdCBldGhVdGlsLmdlbkV0aFNpZ0Zyb21TRVNpZyhjYW5vbmljYWxTaWduYXR1cmUsIHBheWxvYWQsIHB1YmxpY0tleSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gYDB4JHtyfSR7c30ke3YudG9TdHJpbmcoMTYpfWA7XG5cbiAgICByZXR1cm4gc2lnbmF0dXJlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBlcnJvci5TREtFcnJvcihzaWduVHlwZWREYXRhLm5hbWUsICdjYW5vbmljYWxTaWduYXR1cmUgdHlwZSBlcnJvcicpO1xuICB9XG5cblxufTtcbiJdfQ==