"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetTokenPayload = exports.parseToAndAmount = exports.isSupportedERC20Method = void 0;

var _lib = require("./lib");

var _stringUtil = require("./utils/stringUtil");

/**
 * @param {string} data
 * @return {Boolean}
 */
var isSupportedERC20Method = function isSupportedERC20Method(data) {
  var functionHash = data.slice(0, 8);
  if (functionHash === 'a9059cbb' || functionHash === '095ea7b3') return true;
  return false;
};
/**
 * Parse erc transfer amount and to address from data
 * @param {string} data
 */


exports.isSupportedERC20Method = isSupportedERC20Method;

var parseToAndAmount = function parseToAndAmount(data) {
  var params = data.slice(8);
  var to = params.slice(0, 64).slice(24); // last 20 bytes

  var amount = params.slice(64).slice(40); // last 12 bytes

  return {
    to: to,
    amount: amount
  };
};
/**
 *
 * @param {String} contractAddress contract Address (0x prefixed)
 * @param {Number} decimals
 * @param {String} symbol
 * @return {String}
 */


exports.parseToAndAmount = parseToAndAmount;

var getSetTokenPayload = function getSetTokenPayload(contractAddress, symbol, decimals) {
  var unit = (0, _stringUtil.handleHex)(decimals.toString(16));
  var len = (0, _stringUtil.handleHex)(symbol.length.toString(16));
  var symb = (0, _stringUtil.handleHex)((0, _lib.asciiToHex)(symbol));
  var setTokenPayload = unit + len + (0, _lib.padRight)(symb, 14, '0') + (0, _stringUtil.removeHex0x)(contractAddress);
  return setTokenPayload;
};
/**
 * get Preaction
 * @param {Transport} transport
 * @param {boolean} isBuiltIn
 * @param {string} setTokenPayload
 * @return {Function}
 */
// export const getSetTokenPreAction = (isBuiltIn, setTokenPayload) => {
// if (isBuiltIn) {
//   return async () => {
//     await apdu.tx.setToken(transport, setTokenPayload);
//   };
// }
// return async () => {
//   await apdu.tx.setCustomToken(transport, setTokenPayload);
// };
// };


exports.getSetTokenPayload = getSetTokenPayload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90b2tlbi50cyJdLCJuYW1lcyI6WyJpc1N1cHBvcnRlZEVSQzIwTWV0aG9kIiwiZGF0YSIsImZ1bmN0aW9uSGFzaCIsInNsaWNlIiwicGFyc2VUb0FuZEFtb3VudCIsInBhcmFtcyIsInRvIiwiYW1vdW50IiwiZ2V0U2V0VG9rZW5QYXlsb2FkIiwiY29udHJhY3RBZGRyZXNzIiwic3ltYm9sIiwiZGVjaW1hbHMiLCJ1bml0IiwidG9TdHJpbmciLCJsZW4iLCJsZW5ndGgiLCJzeW1iIiwic2V0VG9rZW5QYXlsb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTyxJQUFNQSxzQkFBc0IsR0FBRyxTQUF6QkEsc0JBQXlCLENBQUNDLElBQUQsRUFBMkI7QUFDL0QsTUFBTUMsWUFBWSxHQUFHRCxJQUFJLENBQUNFLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFyQjtBQUNBLE1BQUlELFlBQVksS0FBSyxVQUFqQixJQUErQkEsWUFBWSxLQUFLLFVBQXBELEVBQWdFLE9BQU8sSUFBUDtBQUNoRSxTQUFPLEtBQVA7QUFDRCxDQUpNO0FBTVA7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sSUFBTUUsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFDSCxJQUFELEVBQWtCO0FBQ2hELE1BQU1JLE1BQU0sR0FBR0osSUFBSSxDQUFDRSxLQUFMLENBQVcsQ0FBWCxDQUFmO0FBQ0EsTUFBTUcsRUFBRSxHQUFHRCxNQUFNLENBQUNGLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLEVBQWhCLEVBQW9CQSxLQUFwQixDQUEwQixFQUExQixDQUFYLENBRmdELENBRU47O0FBQzFDLE1BQU1JLE1BQU0sR0FBR0YsTUFBTSxDQUFDRixLQUFQLENBQWEsRUFBYixFQUFpQkEsS0FBakIsQ0FBdUIsRUFBdkIsQ0FBZixDQUhnRCxDQUdMOztBQUMzQyxTQUFPO0FBQUVHLElBQUFBLEVBQUUsRUFBRkEsRUFBRjtBQUFNQyxJQUFBQSxNQUFNLEVBQU5BO0FBQU4sR0FBUDtBQUNELENBTE07QUFPUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxJQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLENBQUNDLGVBQUQsRUFBMEJDLE1BQTFCLEVBQTBDQyxRQUExQyxFQUF1RTtBQUN2RyxNQUFNQyxJQUFJLEdBQUcsMkJBQVVELFFBQVEsQ0FBQ0UsUUFBVCxDQUFrQixFQUFsQixDQUFWLENBQWI7QUFDQSxNQUFNQyxHQUFHLEdBQUcsMkJBQVVKLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjRixRQUFkLENBQXVCLEVBQXZCLENBQVYsQ0FBWjtBQUNBLE1BQU1HLElBQUksR0FBRywyQkFBVSxxQkFBV04sTUFBWCxDQUFWLENBQWI7QUFDQSxNQUFNTyxlQUFlLEdBQUdMLElBQUksR0FBR0UsR0FBUCxHQUFhLG1CQUFTRSxJQUFULEVBQWUsRUFBZixFQUFtQixHQUFuQixDQUFiLEdBQXVDLDZCQUFZUCxlQUFaLENBQS9EO0FBQ0EsU0FBT1EsZUFBUDtBQUNELENBTk07QUFRUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNjaWlUb0hleCwgcGFkUmlnaHQgfSBmcm9tICcuL2xpYic7XG5pbXBvcnQgeyBoYW5kbGVIZXgsIHJlbW92ZUhleDB4IH0gZnJvbSAnLi91dGlscy9zdHJpbmdVdGlsJztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzU3VwcG9ydGVkRVJDMjBNZXRob2QgPSAoZGF0YTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IGZ1bmN0aW9uSGFzaCA9IGRhdGEuc2xpY2UoMCwgOCk7XG4gIGlmIChmdW5jdGlvbkhhc2ggPT09ICdhOTA1OWNiYicgfHwgZnVuY3Rpb25IYXNoID09PSAnMDk1ZWE3YjMnKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBQYXJzZSBlcmMgdHJhbnNmZXIgYW1vdW50IGFuZCB0byBhZGRyZXNzIGZyb20gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnNlVG9BbmRBbW91bnQgPSAoZGF0YTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHBhcmFtcyA9IGRhdGEuc2xpY2UoOCk7XG4gIGNvbnN0IHRvID0gcGFyYW1zLnNsaWNlKDAsIDY0KS5zbGljZSgyNCk7IC8vIGxhc3QgMjAgYnl0ZXNcbiAgY29uc3QgYW1vdW50ID0gcGFyYW1zLnNsaWNlKDY0KS5zbGljZSg0MCk7IC8vIGxhc3QgMTIgYnl0ZXNcbiAgcmV0dXJuIHsgdG8sIGFtb3VudCB9O1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbnRyYWN0QWRkcmVzcyBjb250cmFjdCBBZGRyZXNzICgweCBwcmVmaXhlZClcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWNpbWFsc1xuICogQHBhcmFtIHtTdHJpbmd9IHN5bWJvbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgZ2V0U2V0VG9rZW5QYXlsb2FkID0gKGNvbnRyYWN0QWRkcmVzczogc3RyaW5nLCBzeW1ib2w6IHN0cmluZywgZGVjaW1hbHM6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHVuaXQgPSBoYW5kbGVIZXgoZGVjaW1hbHMudG9TdHJpbmcoMTYpKTtcbiAgY29uc3QgbGVuID0gaGFuZGxlSGV4KHN5bWJvbC5sZW5ndGgudG9TdHJpbmcoMTYpKTtcbiAgY29uc3Qgc3ltYiA9IGhhbmRsZUhleChhc2NpaVRvSGV4KHN5bWJvbCkpO1xuICBjb25zdCBzZXRUb2tlblBheWxvYWQgPSB1bml0ICsgbGVuICsgcGFkUmlnaHQoc3ltYiwgMTQsICcwJykgKyByZW1vdmVIZXgweChjb250cmFjdEFkZHJlc3MpO1xuICByZXR1cm4gc2V0VG9rZW5QYXlsb2FkO1xufTtcblxuLyoqXG4gKiBnZXQgUHJlYWN0aW9uXG4gKiBAcGFyYW0ge1RyYW5zcG9ydH0gdHJhbnNwb3J0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzQnVpbHRJblxuICogQHBhcmFtIHtzdHJpbmd9IHNldFRva2VuUGF5bG9hZFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbi8vIGV4cG9ydCBjb25zdCBnZXRTZXRUb2tlblByZUFjdGlvbiA9IChpc0J1aWx0SW4sIHNldFRva2VuUGF5bG9hZCkgPT4ge1xuICAvLyBpZiAoaXNCdWlsdEluKSB7XG4gIC8vICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgLy8gICAgIGF3YWl0IGFwZHUudHguc2V0VG9rZW4odHJhbnNwb3J0LCBzZXRUb2tlblBheWxvYWQpO1xuICAvLyAgIH07XG4gIC8vIH1cbiAgLy8gcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgLy8gICBhd2FpdCBhcGR1LnR4LnNldEN1c3RvbVRva2VuKHRyYW5zcG9ydCwgc2V0VG9rZW5QYXlsb2FkKTtcbiAgLy8gfTtcbi8vIH07XG4iXX0=