"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubKeyToAddress = pubKeyToAddress;
exports.apduForParsignMessage = exports.genEthSigFromSESig = exports.composeSignedTransacton = exports.getScriptAndArguments = exports.getReadType = exports.getRawHex = exports.getTransactionType = void 0;

var _core = require("@coolwallet/core");

var _stringUtil = require("./stringUtil");

var scripts = _interopRequireWildcard(require("../scripts"));

var token = _interopRequireWildcard(require("../token"));

var _lib = require("../lib");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var rlp = require("rlp");

var elliptic = require('elliptic'); // eslint-disable-next-line new-cap


var ec = new elliptic.ec("secp256k1");
var transactionType = {
  TRANSFER: "TRANSFER",
  ERC20: "ERC20",
  SMART_CONTRACT: "SMART_CONTRACT"
};
/**
 * Decide Transaction Type
 * @param {*} transaction
 */

var getTransactionType = function getTransactionType(transaction) {
  var data = (0, _stringUtil.handleHex)(transaction.data.toString("hex"));
  if (data === "" || data === "00") return transactionType.TRANSFER;
  if (token.isSupportedERC20Method(data) && transaction.tokenInfo) return transactionType.ERC20;
  return transactionType.SMART_CONTRACT;
};

exports.getTransactionType = getTransactionType;

var getTransferArgument = function getTransferArgument(transaction) {
  var argument = (0, _stringUtil.handleHex)(transaction.to) + // 81bb32e4A7e4d0500d11A52F3a5F60c9A6Ef126C
  (0, _stringUtil.handleHex)(transaction.value).padStart(20, "0") + // 000000b1a2bc2ec50000
  (0, _stringUtil.handleHex)(transaction.gasPrice).padStart(20, "0") + // 0000000000020c855800
  (0, _stringUtil.handleHex)(transaction.gasLimit).padStart(20, "0") + // 0000000000000000520c
  (0, _stringUtil.handleHex)(transaction.nonce).padStart(16, "0") + // 0000000000000289
  (0, _stringUtil.handleHex)(transaction.chainId.toString(16)).padStart(4, "0"); // 0001

  return argument;
};

var getERC20Argument = function getERC20Argument(transaction) {
  var data = (0, _stringUtil.handleHex)(transaction.data.toString("hex"));

  var _token$parseToAndAmou = token.parseToAndAmount(data),
      to = _token$parseToAndAmou.to,
      amount = _token$parseToAndAmou.amount;

  var _transaction$tokenInf = transaction.tokenInfo,
      symbol = _transaction$tokenInf.symbol,
      decimals = _transaction$tokenInf.decimals;
  var tokenInfo = token.getSetTokenPayload(transaction.to, symbol, decimals);
  var signature = "00".repeat(72);
  var argument = (0, _stringUtil.handleHex)(to) + (0, _stringUtil.handleHex)(amount).padStart(24, "0") + // 000000b1a2bc2ec50000
  (0, _stringUtil.handleHex)(transaction.gasPrice).padStart(20, "0") + // 0000000000020c855800
  (0, _stringUtil.handleHex)(transaction.gasLimit).padStart(20, "0") + // 0000000000000000520c
  (0, _stringUtil.handleHex)(transaction.nonce).padStart(16, "0") + // 0000000000000289
  (0, _stringUtil.handleHex)(transaction.chainId.toString(16)).padStart(4, "0") + // 0001
  tokenInfo + signature;
  return argument;
};
/**
 * Get raw payload
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @return {Array<Buffer>}
 */


var getRawHex = function getRawHex(transaction) {
  var fields = ["nonce", "gasPrice", "gasLimit", "to", "value", "data"];
  var raw = fields.map(function (field) {
    var hex = (0, _stringUtil.handleHex)(transaction[field]);

    if (hex === "00" || hex === "") {
      return Buffer.allocUnsafe(0);
    }

    return Buffer.from(hex, "hex");
  });
  raw[6] = Buffer.from((0, _stringUtil.handleHex)(transaction['networkId']), 'hex');
  raw[7] = Buffer.from((0, _stringUtil.handleHex)(transaction['fromFullShardKey']), 'hex');
  raw[8] = Buffer.from((0, _stringUtil.handleHex)(transaction['toFullShardKey']), 'hex');
  raw[9] = Buffer.from((0, _stringUtil.handleHex)(transaction['gasTokenId']), 'hex');
  raw[10] = Buffer.from((0, _stringUtil.handleHex)(transaction['transferTokenId']), 'hex');
  var t = rlp.encode(raw);
  if (t.length > 870) throw new _core.error.SDKError(getRawHex.name, 'data too long');
  return raw;
};
/**
 *
 * @param {Transport} transport
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string}} transaction
 */


exports.getRawHex = getRawHex;

var getReadType = function getReadType(txType) {
  switch (txType) {
    case transactionType.TRANSFER:
      {
        return {
          readType: "3C"
        };
      }
    // Todo: Old transfer Add erc20
    // case transactionType.ERC20: {
    //   return { readType: 'C2' };
    // }

    default:
      {
        return {
          readType: "33"
        };
      }
  }
};
/**
 *
 * @param {number} addressIndex
 * @param {*} transaction
 */


exports.getReadType = getReadType;

var getScriptAndArguments = function getScriptAndArguments(txType, addressIndex, transaction) {
  var addressIdxHex = "00".concat(addressIndex.toString(16).padStart(6, "0"));
  var SEPath = "15328000002C8000003C8000000000000000".concat(addressIdxHex);
  var script;
  var argument;

  switch (txType) {
    case transactionType.TRANSFER:
      {
        script = scripts.TRANSFER.script + scripts.TRANSFER.signature;
        argument = getTransferArgument(transaction);
        break;
      }

    case transactionType.ERC20:
      {
        script = scripts.ERC20.script + scripts.ERC20.signature;
        argument = getERC20Argument(transaction);
        break;
      }

    default:
      {
        throw new _core.error.SDKError(getScriptAndArguments.name, "type ".concat(txType, " no implemented"));
      }
  } // console.debug(`sciprt:\t${script}`);
  // console.debug(`argument:\t${SEPath}+${argument}`);


  return {
    script: script,
    argument: SEPath + argument
  };
};
/**
 * @description Compose Signed Transaction
 * @param {Array<Buffer>} payload
 * @param {Number} v
 * @param {String} r
 * @param {String} s
 * @return {String}
 */


exports.getScriptAndArguments = getScriptAndArguments;

var composeSignedTransacton = function composeSignedTransacton(payload, v, r, s) {
  var transaction = payload;
  transaction.push(Buffer.allocUnsafe(0), Buffer.from(v.toString(16), "hex"), Buffer.from(r, "hex"), Buffer.from(s, "hex"));
  var serializedTx = rlp.encode(transaction);
  return "0x".concat(serializedTx.toString("hex"));
};
/**
 * @description Generate Canonical Signature from Der Signature
 * @param {{r:string, s:string}} canonicalSignature
 * @param {Buffer} payload
 * @param {String} compressedPubkey hex string
 * @return {Promise<{v: Number, r: String, s: String}>}
 */


exports.composeSignedTransacton = composeSignedTransacton;

var genEthSigFromSESig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(canonicalSignature, payload) {
    var compressedPubkey,
        hash,
        data,
        keyPair,
        recoveryParam,
        v,
        r,
        s,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            compressedPubkey = _args.length > 2 && _args[2] !== undefined ? _args[2] : undefined;
            hash = (0, _lib.keccak256)(payload);
            data = Buffer.from((0, _stringUtil.handleHex)(hash), "hex");
            keyPair = ec.keyFromPublic(compressedPubkey, "hex"); // get v

            recoveryParam = ec.getKeyRecoveryParam(data, canonicalSignature, keyPair.pub);
            v = recoveryParam + 27;
            r = canonicalSignature.r;
            s = canonicalSignature.s;
            return _context.abrupt("return", {
              v: v,
              r: r,
              s: s
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function genEthSigFromSESig(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description APDU Send Raw Data for Segregated Signature
 * @param {Transport} transport
 * @param {Buffer} msgBuf
 * @param {String} p1
 * @return {Function}
 */
// todo : No test case for this function yet, should test later


exports.genEthSigFromSESig = genEthSigFromSESig;

var apduForParsignMessage = function apduForParsignMessage(transport, appPrivateKey, msgBuf, p1) {
  var rawData = msgBuf.toString("hex");
  rawData = (0, _stringUtil.handleHex)(rawData);
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _core.apdu.tx.txPrep(transport, rawData, p1, appPrivateKey);

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
};
/**
 * @description get APDU set token function
 * @param {String} address
 * @return {Function}
 */
// export const apduSetToken = (contractAddress, symbol, decimals, sn = 1) => async () => {
//   const setTokenPayload = token.getSetTokenPayload(contractAddress, symbol, decimals);
//   await apdu.tx.setCustomToken(setTokenPayload, sn);
// };

/**
 * @description Trim Hex for Address
 * @param {string} hexString expect 32 bytes address in topics
 * @return {string} 20 bytes address + "0x" prefixed
 */


exports.apduForParsignMessage = apduForParsignMessage;

function trimFirst12Bytes(hexString) {
  return "0x".concat(hexString.substr(hexString.length - 40));
}
/**
 * Convert public key to address
 * @param {string} compressedPubkey
 * @return {string}
 */


function pubKeyToAddress(compressedPubkey) {
  var keyPair = ec.keyFromPublic(compressedPubkey, "hex");
  var pubkey = "0x".concat(keyPair.getPublic(false, "hex").substr(2));
  var address = trimFirst12Bytes((0, _lib.keccak256)(pubkey));
  return (0, _lib.toChecksumAddress)(address);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9ldGhVdGlscy50cyJdLCJuYW1lcyI6WyJybHAiLCJyZXF1aXJlIiwiZWxsaXB0aWMiLCJlYyIsInRyYW5zYWN0aW9uVHlwZSIsIlRSQU5TRkVSIiwiRVJDMjAiLCJTTUFSVF9DT05UUkFDVCIsImdldFRyYW5zYWN0aW9uVHlwZSIsInRyYW5zYWN0aW9uIiwiZGF0YSIsInRvU3RyaW5nIiwidG9rZW4iLCJpc1N1cHBvcnRlZEVSQzIwTWV0aG9kIiwidG9rZW5JbmZvIiwiZ2V0VHJhbnNmZXJBcmd1bWVudCIsImFyZ3VtZW50IiwidG8iLCJ2YWx1ZSIsInBhZFN0YXJ0IiwiZ2FzUHJpY2UiLCJnYXNMaW1pdCIsIm5vbmNlIiwiY2hhaW5JZCIsImdldEVSQzIwQXJndW1lbnQiLCJwYXJzZVRvQW5kQW1vdW50IiwiYW1vdW50Iiwic3ltYm9sIiwiZGVjaW1hbHMiLCJnZXRTZXRUb2tlblBheWxvYWQiLCJzaWduYXR1cmUiLCJyZXBlYXQiLCJnZXRSYXdIZXgiLCJmaWVsZHMiLCJyYXciLCJtYXAiLCJmaWVsZCIsImhleCIsIkJ1ZmZlciIsImFsbG9jVW5zYWZlIiwiZnJvbSIsInQiLCJlbmNvZGUiLCJsZW5ndGgiLCJlcnJvciIsIlNES0Vycm9yIiwibmFtZSIsImdldFJlYWRUeXBlIiwidHhUeXBlIiwicmVhZFR5cGUiLCJnZXRTY3JpcHRBbmRBcmd1bWVudHMiLCJhZGRyZXNzSW5kZXgiLCJhZGRyZXNzSWR4SGV4IiwiY29uY2F0IiwiU0VQYXRoIiwic2NyaXB0Iiwic2NyaXB0cyIsImNvbXBvc2VTaWduZWRUcmFuc2FjdG9uIiwicGF5bG9hZCIsInYiLCJyIiwicyIsInB1c2giLCJzZXJpYWxpemVkVHgiLCJnZW5FdGhTaWdGcm9tU0VTaWciLCJjYW5vbmljYWxTaWduYXR1cmUiLCJjb21wcmVzc2VkUHVia2V5IiwidW5kZWZpbmVkIiwiaGFzaCIsImtleVBhaXIiLCJrZXlGcm9tUHVibGljIiwicmVjb3ZlcnlQYXJhbSIsImdldEtleVJlY292ZXJ5UGFyYW0iLCJwdWIiLCJhcGR1Rm9yUGFyc2lnbk1lc3NhZ2UiLCJ0cmFuc3BvcnQiLCJhcHBQcml2YXRlS2V5IiwibXNnQnVmIiwicDEiLCJyYXdEYXRhIiwiYXBkdSIsInR4IiwidHhQcmVwIiwidHJpbUZpcnN0MTJCeXRlcyIsImhleFN0cmluZyIsInN1YnN0ciIsInB1YktleVRvQWRkcmVzcyIsInB1YmtleSIsImdldFB1YmxpYyIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQUVBLElBQU1BLEdBQUcsR0FBR0MsT0FBTyxDQUFDLEtBQUQsQ0FBbkI7O0FBSUEsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUF4QixDLENBQ0E7OztBQUNBLElBQU1FLEVBQUUsR0FBRyxJQUFJRCxRQUFRLENBQUNDLEVBQWIsQ0FBZ0IsV0FBaEIsQ0FBWDtBQUVBLElBQU1DLGVBQWUsR0FBRztBQUN0QkMsRUFBQUEsUUFBUSxFQUFFLFVBRFk7QUFFdEJDLEVBQUFBLEtBQUssRUFBRSxPQUZlO0FBR3RCQyxFQUFBQSxjQUFjLEVBQUU7QUFITSxDQUF4QjtBQU1BO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU1DLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsV0FBRCxFQUFzQjtBQUN0RCxNQUFNQyxJQUFJLEdBQUcsMkJBQVVELFdBQVcsQ0FBQ0MsSUFBWixDQUFpQkMsUUFBakIsQ0FBMEIsS0FBMUIsQ0FBVixDQUFiO0FBQ0EsTUFBSUQsSUFBSSxLQUFLLEVBQVQsSUFBZUEsSUFBSSxLQUFLLElBQTVCLEVBQWtDLE9BQU9OLGVBQWUsQ0FBQ0MsUUFBdkI7QUFDbEMsTUFBSU8sS0FBSyxDQUFDQyxzQkFBTixDQUE2QkgsSUFBN0IsS0FBc0NELFdBQVcsQ0FBQ0ssU0FBdEQsRUFDRSxPQUFPVixlQUFlLENBQUNFLEtBQXZCO0FBQ0YsU0FBT0YsZUFBZSxDQUFDRyxjQUF2QjtBQUNELENB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fSBmcm9tIFwiQGNvb2x3YWxsZXQvY29yZVwiO1xuXG5pbXBvcnQgeyBoYW5kbGVIZXggfSBmcm9tIFwiLi9zdHJpbmdVdGlsXCI7XG5pbXBvcnQgKiBhcyBzY3JpcHRzIGZyb20gXCIuLi9zY3JpcHRzXCI7XG5pbXBvcnQgKiBhcyB0b2tlbiBmcm9tIFwiLi4vdG9rZW5cIjtcblxuaW1wb3J0IHsga2VjY2FrMjU2LCB0b0NoZWNrc3VtQWRkcmVzcyB9IGZyb20gXCIuLi9saWJcIjtcblxuY29uc3QgcmxwID0gcmVxdWlyZShcInJscFwiKTtcblxudHlwZSBUcmFuc3BvcnQgPSB0cmFuc3BvcnQuZGVmYXVsdDtcblxuY29uc3QgZWxsaXB0aWMgPSByZXF1aXJlKCdlbGxpcHRpYycpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbmNvbnN0IGVjID0gbmV3IGVsbGlwdGljLmVjKFwic2VjcDI1NmsxXCIpO1xuXG5jb25zdCB0cmFuc2FjdGlvblR5cGUgPSB7XG4gIFRSQU5TRkVSOiBcIlRSQU5TRkVSXCIsXG4gIEVSQzIwOiBcIkVSQzIwXCIsXG4gIFNNQVJUX0NPTlRSQUNUOiBcIlNNQVJUX0NPTlRSQUNUXCIsXG59O1xuXG4vKipcbiAqIERlY2lkZSBUcmFuc2FjdGlvbiBUeXBlXG4gKiBAcGFyYW0geyp9IHRyYW5zYWN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUcmFuc2FjdGlvblR5cGUgPSAodHJhbnNhY3Rpb246IGFueSkgPT4ge1xuICBjb25zdCBkYXRhID0gaGFuZGxlSGV4KHRyYW5zYWN0aW9uLmRhdGEudG9TdHJpbmcoXCJoZXhcIikpO1xuICBpZiAoZGF0YSA9PT0gXCJcIiB8fCBkYXRhID09PSBcIjAwXCIpIHJldHVybiB0cmFuc2FjdGlvblR5cGUuVFJBTlNGRVI7XG4gIGlmICh0b2tlbi5pc1N1cHBvcnRlZEVSQzIwTWV0aG9kKGRhdGEpICYmIHRyYW5zYWN0aW9uLnRva2VuSW5mbylcbiAgICByZXR1cm4gdHJhbnNhY3Rpb25UeXBlLkVSQzIwO1xuICByZXR1cm4gdHJhbnNhY3Rpb25UeXBlLlNNQVJUX0NPTlRSQUNUO1xufTtcblxuY29uc3QgZ2V0VHJhbnNmZXJBcmd1bWVudCA9ICh0cmFuc2FjdGlvbjogYW55KSA9PiB7XG4gIGNvbnN0IGFyZ3VtZW50ID1cbiAgICBoYW5kbGVIZXgodHJhbnNhY3Rpb24udG8pICsgLy8gODFiYjMyZTRBN2U0ZDA1MDBkMTFBNTJGM2E1RjYwYzlBNkVmMTI2Q1xuICAgIGhhbmRsZUhleCh0cmFuc2FjdGlvbi52YWx1ZSkucGFkU3RhcnQoMjAsIFwiMFwiKSArIC8vIDAwMDAwMGIxYTJiYzJlYzUwMDAwXG4gICAgaGFuZGxlSGV4KHRyYW5zYWN0aW9uLmdhc1ByaWNlKS5wYWRTdGFydCgyMCwgXCIwXCIpICsgLy8gMDAwMDAwMDAwMDAyMGM4NTU4MDBcbiAgICBoYW5kbGVIZXgodHJhbnNhY3Rpb24uZ2FzTGltaXQpLnBhZFN0YXJ0KDIwLCBcIjBcIikgKyAvLyAwMDAwMDAwMDAwMDAwMDAwNTIwY1xuICAgIGhhbmRsZUhleCh0cmFuc2FjdGlvbi5ub25jZSkucGFkU3RhcnQoMTYsIFwiMFwiKSArIC8vIDAwMDAwMDAwMDAwMDAyODlcbiAgICBoYW5kbGVIZXgodHJhbnNhY3Rpb24uY2hhaW5JZC50b1N0cmluZygxNikpLnBhZFN0YXJ0KDQsIFwiMFwiKTsgLy8gMDAwMVxuICByZXR1cm4gYXJndW1lbnQ7XG59O1xuXG5jb25zdCBnZXRFUkMyMEFyZ3VtZW50ID0gKHRyYW5zYWN0aW9uOiBhbnkpID0+IHtcbiAgY29uc3QgZGF0YSA9IGhhbmRsZUhleCh0cmFuc2FjdGlvbi5kYXRhLnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgY29uc3QgeyB0bywgYW1vdW50IH0gPSB0b2tlbi5wYXJzZVRvQW5kQW1vdW50KGRhdGEpO1xuICBjb25zdCB7IHN5bWJvbCwgZGVjaW1hbHMgfSA9IHRyYW5zYWN0aW9uLnRva2VuSW5mbztcbiAgY29uc3QgdG9rZW5JbmZvID0gdG9rZW4uZ2V0U2V0VG9rZW5QYXlsb2FkKHRyYW5zYWN0aW9uLnRvLCBzeW1ib2wsIGRlY2ltYWxzKTtcbiAgY29uc3Qgc2lnbmF0dXJlID0gXCIwMFwiLnJlcGVhdCg3Mik7XG4gIGNvbnN0IGFyZ3VtZW50ID1cbiAgICBoYW5kbGVIZXgodG8pICtcbiAgICBoYW5kbGVIZXgoYW1vdW50KS5wYWRTdGFydCgyNCwgXCIwXCIpICsgLy8gMDAwMDAwYjFhMmJjMmVjNTAwMDBcbiAgICBoYW5kbGVIZXgodHJhbnNhY3Rpb24uZ2FzUHJpY2UpLnBhZFN0YXJ0KDIwLCBcIjBcIikgKyAvLyAwMDAwMDAwMDAwMDIwYzg1NTgwMFxuICAgIGhhbmRsZUhleCh0cmFuc2FjdGlvbi5nYXNMaW1pdCkucGFkU3RhcnQoMjAsIFwiMFwiKSArIC8vIDAwMDAwMDAwMDAwMDAwMDA1MjBjXG4gICAgaGFuZGxlSGV4KHRyYW5zYWN0aW9uLm5vbmNlKS5wYWRTdGFydCgxNiwgXCIwXCIpICsgLy8gMDAwMDAwMDAwMDAwMDI4OVxuICAgIGhhbmRsZUhleCh0cmFuc2FjdGlvbi5jaGFpbklkLnRvU3RyaW5nKDE2KSkucGFkU3RhcnQoNCwgXCIwXCIpICsgLy8gMDAwMVxuICAgIHRva2VuSW5mbyArXG4gICAgc2lnbmF0dXJlO1xuICByZXR1cm4gYXJndW1lbnQ7XG59O1xuXG4vKipcbiAqIEdldCByYXcgcGF5bG9hZFxuICogQHBhcmFtIHt7bm9uY2U6c3RyaW5nLCBnYXNQcmljZTpzdHJpbmcsIGdhc0xpbWl0OnN0cmluZywgdG86c3RyaW5nLFxuICogdmFsdWU6c3RyaW5nLCBkYXRhOnN0cmluZywgY2hhaW5JZDogbnVtYmVyfX0gdHJhbnNhY3Rpb25cbiAqIEByZXR1cm4ge0FycmF5PEJ1ZmZlcj59XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRSYXdIZXggPSAodHJhbnNhY3Rpb246IGFueSk6IEFycmF5PEJ1ZmZlcj4gPT4ge1xuICBjb25zdCBmaWVsZHMgPSBbXCJub25jZVwiLCBcImdhc1ByaWNlXCIsIFwiZ2FzTGltaXRcIiwgXCJ0b1wiLCBcInZhbHVlXCIsIFwiZGF0YVwiXTtcbiAgY29uc3QgcmF3ID0gZmllbGRzLm1hcCgoZmllbGQpID0+IHtcbiAgICBjb25zdCBoZXggPSBoYW5kbGVIZXgodHJhbnNhY3Rpb25bZmllbGRdKTtcbiAgICBpZiAoaGV4ID09PSBcIjAwXCIgfHwgaGV4ID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gQnVmZmVyLmFsbG9jVW5zYWZlKDApO1xuICAgIH1cbiAgICByZXR1cm4gQnVmZmVyLmZyb20oaGV4LCBcImhleFwiKTtcbiAgfSk7XG4gIHJhd1s2XSA9IEJ1ZmZlci5mcm9tKGhhbmRsZUhleCh0cmFuc2FjdGlvblsnbmV0d29ya0lkJ10pLCAnaGV4Jyk7XG4gIHJhd1s3XSA9IEJ1ZmZlci5mcm9tKGhhbmRsZUhleCh0cmFuc2FjdGlvblsnZnJvbUZ1bGxTaGFyZEtleSddKSwgJ2hleCcpO1xuICByYXdbOF0gPSBCdWZmZXIuZnJvbShoYW5kbGVIZXgodHJhbnNhY3Rpb25bJ3RvRnVsbFNoYXJkS2V5J10pLCAnaGV4Jyk7XG4gIHJhd1s5XSA9IEJ1ZmZlci5mcm9tKGhhbmRsZUhleCh0cmFuc2FjdGlvblsnZ2FzVG9rZW5JZCddKSwgJ2hleCcpO1xuICByYXdbMTBdID0gQnVmZmVyLmZyb20oaGFuZGxlSGV4KHRyYW5zYWN0aW9uWyd0cmFuc2ZlclRva2VuSWQnXSksICdoZXgnKTtcblxuICBjb25zdCB0ID0gcmxwLmVuY29kZShyYXcpO1xuICBpZiAodC5sZW5ndGggPiA4NzApIHRocm93IG5ldyBlcnJvci5TREtFcnJvcihnZXRSYXdIZXgubmFtZSwgJ2RhdGEgdG9vIGxvbmcnKTtcbiAgcmV0dXJuIHJhdztcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7VHJhbnNwb3J0fSB0cmFuc3BvcnRcbiAqIEBwYXJhbSB7e25vbmNlOnN0cmluZywgZ2FzUHJpY2U6c3RyaW5nLCBnYXNMaW1pdDpzdHJpbmcsIHRvOnN0cmluZyxcbiAqIHZhbHVlOnN0cmluZywgZGF0YTpzdHJpbmd9fSB0cmFuc2FjdGlvblxuICovXG5leHBvcnQgY29uc3QgZ2V0UmVhZFR5cGUgPSAodHhUeXBlOiBzdHJpbmcpID0+IHtcbiAgc3dpdGNoICh0eFR5cGUpIHtcbiAgICBjYXNlIHRyYW5zYWN0aW9uVHlwZS5UUkFOU0ZFUjoge1xuICAgICAgcmV0dXJuIHsgcmVhZFR5cGU6IFwiM0NcIiB9O1xuICAgIH1cbiAgICAvLyBUb2RvOiBPbGQgdHJhbnNmZXIgQWRkIGVyYzIwXG4gICAgLy8gY2FzZSB0cmFuc2FjdGlvblR5cGUuRVJDMjA6IHtcbiAgICAvLyAgIHJldHVybiB7IHJlYWRUeXBlOiAnQzInIH07XG4gICAgLy8gfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiB7IHJlYWRUeXBlOiBcIjMzXCIgfTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBhZGRyZXNzSW5kZXhcbiAqIEBwYXJhbSB7Kn0gdHJhbnNhY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNjcmlwdEFuZEFyZ3VtZW50cyA9ICh0eFR5cGU6IGFueSwgYWRkcmVzc0luZGV4OiBudW1iZXIsIHRyYW5zYWN0aW9uOiBhbnkpID0+IHtcbiAgY29uc3QgYWRkcmVzc0lkeEhleCA9IFwiMDBcIi5jb25jYXQoYWRkcmVzc0luZGV4LnRvU3RyaW5nKDE2KS5wYWRTdGFydCg2LCBcIjBcIikpO1xuICBjb25zdCBTRVBhdGggPSBgMTUzMjgwMDAwMDJDODAwMDAwM0M4MDAwMDAwMDAwMDAwMDAwJHthZGRyZXNzSWR4SGV4fWA7XG4gIGxldCBzY3JpcHQ7XG4gIGxldCBhcmd1bWVudDtcbiAgc3dpdGNoICh0eFR5cGUpIHtcbiAgICBjYXNlIHRyYW5zYWN0aW9uVHlwZS5UUkFOU0ZFUjoge1xuICAgICAgc2NyaXB0ID0gc2NyaXB0cy5UUkFOU0ZFUi5zY3JpcHQgKyBzY3JpcHRzLlRSQU5TRkVSLnNpZ25hdHVyZTtcbiAgICAgIGFyZ3VtZW50ID0gZ2V0VHJhbnNmZXJBcmd1bWVudCh0cmFuc2FjdGlvbik7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSB0cmFuc2FjdGlvblR5cGUuRVJDMjA6IHtcbiAgICAgIHNjcmlwdCA9IHNjcmlwdHMuRVJDMjAuc2NyaXB0ICsgc2NyaXB0cy5FUkMyMC5zaWduYXR1cmU7XG4gICAgICBhcmd1bWVudCA9IGdldEVSQzIwQXJndW1lbnQodHJhbnNhY3Rpb24pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBlcnJvci5TREtFcnJvcihnZXRTY3JpcHRBbmRBcmd1bWVudHMubmFtZSwgYHR5cGUgJHt0eFR5cGV9IG5vIGltcGxlbWVudGVkYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5kZWJ1Zyhgc2NpcHJ0OlxcdCR7c2NyaXB0fWApO1xuICAvLyBjb25zb2xlLmRlYnVnKGBhcmd1bWVudDpcXHQke1NFUGF0aH0rJHthcmd1bWVudH1gKTtcbiAgcmV0dXJuIHtcbiAgICBzY3JpcHQsXG4gICAgYXJndW1lbnQ6IFNFUGF0aCArIGFyZ3VtZW50LFxuICB9O1xufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbXBvc2UgU2lnbmVkIFRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5PEJ1ZmZlcj59IHBheWxvYWRcbiAqIEBwYXJhbSB7TnVtYmVyfSB2XG4gKiBAcGFyYW0ge1N0cmluZ30gclxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBvc2VTaWduZWRUcmFuc2FjdG9uID0gKHBheWxvYWQ6IEFycmF5PEJ1ZmZlcj4sIHY6IG51bWJlciwgcjogc3RyaW5nLCBzOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXG5cdGNvbnN0IHRyYW5zYWN0aW9uID0gcGF5bG9hZDtcblxuICB0cmFuc2FjdGlvbi5wdXNoKFxuXHRcdEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKSxcbiAgICBCdWZmZXIuZnJvbSh2LnRvU3RyaW5nKDE2KSwgXCJoZXhcIiksXG4gICAgQnVmZmVyLmZyb20ociwgXCJoZXhcIiksXG4gICAgQnVmZmVyLmZyb20ocywgXCJoZXhcIilcbiAgKTtcblxuICBjb25zdCBzZXJpYWxpemVkVHggPSBybHAuZW5jb2RlKHRyYW5zYWN0aW9uKTtcbiAgcmV0dXJuIGAweCR7c2VyaWFsaXplZFR4LnRvU3RyaW5nKFwiaGV4XCIpfWA7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSBDYW5vbmljYWwgU2lnbmF0dXJlIGZyb20gRGVyIFNpZ25hdHVyZVxuICogQHBhcmFtIHt7cjpzdHJpbmcsIHM6c3RyaW5nfX0gY2Fub25pY2FsU2lnbmF0dXJlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gcGF5bG9hZFxuICogQHBhcmFtIHtTdHJpbmd9IGNvbXByZXNzZWRQdWJrZXkgaGV4IHN0cmluZ1xuICogQHJldHVybiB7UHJvbWlzZTx7djogTnVtYmVyLCByOiBTdHJpbmcsIHM6IFN0cmluZ30+fVxuICovXG5leHBvcnQgY29uc3QgZ2VuRXRoU2lnRnJvbVNFU2lnID0gYXN5bmMgKFxuICBjYW5vbmljYWxTaWduYXR1cmU6IHsgcjogc3RyaW5nOyBzOiBzdHJpbmcgfSxcbiAgcGF5bG9hZDogQnVmZmVyLFxuICBjb21wcmVzc2VkUHVia2V5OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbik6IFByb21pc2U8eyB2OiBudW1iZXI7IHI6IHN0cmluZzsgczogc3RyaW5nOyB9PiA9PiB7XG4gIGNvbnN0IGhhc2ggPSBrZWNjYWsyNTYocGF5bG9hZCk7XG4gIGNvbnN0IGRhdGEgPSBCdWZmZXIuZnJvbShoYW5kbGVIZXgoaGFzaCksIFwiaGV4XCIpO1xuICBjb25zdCBrZXlQYWlyID0gZWMua2V5RnJvbVB1YmxpYyhjb21wcmVzc2VkUHVia2V5LCBcImhleFwiKTtcblxuICAvLyBnZXQgdlxuICBjb25zdCByZWNvdmVyeVBhcmFtID0gZWMuZ2V0S2V5UmVjb3ZlcnlQYXJhbShcbiAgICBkYXRhLFxuICAgIGNhbm9uaWNhbFNpZ25hdHVyZSxcbiAgICBrZXlQYWlyLnB1YlxuICApO1xuICBjb25zdCB2ID0gcmVjb3ZlcnlQYXJhbSArIDI3O1xuICBjb25zdCB7IHIgfSA9IGNhbm9uaWNhbFNpZ25hdHVyZTtcbiAgY29uc3QgeyBzIH0gPSBjYW5vbmljYWxTaWduYXR1cmU7XG5cbiAgcmV0dXJuIHsgdiwgciwgcyB9O1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQVBEVSBTZW5kIFJhdyBEYXRhIGZvciBTZWdyZWdhdGVkIFNpZ25hdHVyZVxuICogQHBhcmFtIHtUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICogQHBhcmFtIHtCdWZmZXJ9IG1zZ0J1ZlxuICogQHBhcmFtIHtTdHJpbmd9IHAxXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuLy8gdG9kbyA6IE5vIHRlc3QgY2FzZSBmb3IgdGhpcyBmdW5jdGlvbiB5ZXQsIHNob3VsZCB0ZXN0IGxhdGVyXG5leHBvcnQgY29uc3QgYXBkdUZvclBhcnNpZ25NZXNzYWdlID0gKFxuICB0cmFuc3BvcnQ6IFRyYW5zcG9ydCxcbiAgYXBwUHJpdmF0ZUtleTogc3RyaW5nLFxuICBtc2dCdWY6IEJ1ZmZlcixcbiAgcDE6IHN0cmluZ1xuKTogRnVuY3Rpb24gPT4ge1xuICBsZXQgcmF3RGF0YSA9IG1zZ0J1Zi50b1N0cmluZyhcImhleFwiKTtcbiAgcmF3RGF0YSA9IGhhbmRsZUhleChyYXdEYXRhKTtcbiAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICBhcGR1LnR4LnR4UHJlcCh0cmFuc3BvcnQsIHJhd0RhdGEsIHAxLCBhcHBQcml2YXRlS2V5KTtcbiAgfVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gZ2V0IEFQRFUgc2V0IHRva2VuIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbi8vIGV4cG9ydCBjb25zdCBhcGR1U2V0VG9rZW4gPSAoY29udHJhY3RBZGRyZXNzLCBzeW1ib2wsIGRlY2ltYWxzLCBzbiA9IDEpID0+IGFzeW5jICgpID0+IHtcbi8vICAgY29uc3Qgc2V0VG9rZW5QYXlsb2FkID0gdG9rZW4uZ2V0U2V0VG9rZW5QYXlsb2FkKGNvbnRyYWN0QWRkcmVzcywgc3ltYm9sLCBkZWNpbWFscyk7XG4vLyAgIGF3YWl0IGFwZHUudHguc2V0Q3VzdG9tVG9rZW4oc2V0VG9rZW5QYXlsb2FkLCBzbik7XG4vLyB9O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBUcmltIEhleCBmb3IgQWRkcmVzc1xuICogQHBhcmFtIHtzdHJpbmd9IGhleFN0cmluZyBleHBlY3QgMzIgYnl0ZXMgYWRkcmVzcyBpbiB0b3BpY3NcbiAqIEByZXR1cm4ge3N0cmluZ30gMjAgYnl0ZXMgYWRkcmVzcyArIFwiMHhcIiBwcmVmaXhlZFxuICovXG5mdW5jdGlvbiB0cmltRmlyc3QxMkJ5dGVzKGhleFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFwiMHhcIi5jb25jYXQoaGV4U3RyaW5nLnN1YnN0cihoZXhTdHJpbmcubGVuZ3RoIC0gNDApKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHB1YmxpYyBrZXkgdG8gYWRkcmVzc1xuICogQHBhcmFtIHtzdHJpbmd9IGNvbXByZXNzZWRQdWJrZXlcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1YktleVRvQWRkcmVzcyhjb21wcmVzc2VkUHVia2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBrZXlQYWlyID0gZWMua2V5RnJvbVB1YmxpYyhjb21wcmVzc2VkUHVia2V5LCBcImhleFwiKTtcbiAgY29uc3QgcHVia2V5ID0gYDB4JHtrZXlQYWlyLmdldFB1YmxpYyhmYWxzZSwgXCJoZXhcIikuc3Vic3RyKDIpfWA7XG4gIGNvbnN0IGFkZHJlc3MgPSB0cmltRmlyc3QxMkJ5dGVzKGtlY2NhazI1NihwdWJrZXkpKTtcbiAgcmV0dXJuIHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3MpO1xufVxuIl19