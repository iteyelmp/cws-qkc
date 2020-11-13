"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@coolwallet/core");

var sign = _interopRequireWildcard(require("./sign"));

var _ethUtils = require("./utils/ethUtils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var QKC = /*#__PURE__*/function (_COIN$ECDSACoin) {
  _inherits(QKC, _COIN$ECDSACoin);

  var _super = _createSuper(QKC);

  function QKC() {
    _classCallCheck(this, QKC);

    return _super.call(this, 'FF');
  }
  /**
   * Get Ethereum address by index
   * @param {number} addressIndex
   * @return {string}
   */


  _createClass(QKC, [{
    key: "getAddress",
    value: function () {
      var _getAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(transport, appPrivateKey, appId, addressIndex) {
        var publicKey;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getPublicKey(transport, appPrivateKey, appId, addressIndex);

              case 2:
                publicKey = _context.sent;
                return _context.abrupt("return", (0, _ethUtils.pubKeyToAddress)(publicKey));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAddress(_x, _x2, _x3, _x4) {
        return _getAddress.apply(this, arguments);
      }

      return getAddress;
    }()
    /**
     * Sign Ethereum Transaction.
     * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
     * value:string, data:string}} transaction
     * @param {Number} addressIndex
     * @param {String} publicKey
     * @param {Function} confirmCB
     * @param {Function} authorizedCB
     */

  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(transport, appPrivateKey, appId, transaction, addressIndex) {
        var publicKey,
            confirmCB,
            authorizedCB,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                publicKey = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : undefined;
                confirmCB = _args2.length > 6 && _args2[6] !== undefined ? _args2[6] : undefined;
                authorizedCB = _args2.length > 7 && _args2[7] !== undefined ? _args2[7] : undefined;

                if (publicKey) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return this.getPublicKey(transport, appPrivateKey, appId, addressIndex);

              case 6:
                publicKey = _context2.sent;

              case 7:
                return _context2.abrupt("return", sign.signTransaction(transport, appId, appPrivateKey, this.coinType, transaction, addressIndex, publicKey, confirmCB, authorizedCB));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function signTransaction(_x5, _x6, _x7, _x8, _x9) {
        return _signTransaction.apply(this, arguments);
      }

      return signTransaction;
    }()
    /**
     * Sign Arbitrary Message.
     * @param {String} message hex or utf-8
     * @param {Number} addressIndex
     * @param {String} publicKey
     * @param {Boolean} isHashRequired
     * @param {Function} confirmCB
     * @param {Function} authorizedCB
     * @return {Promise<String>}
     */

  }, {
    key: "signMessage",
    value: function () {
      var _signMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transport, appPrivateKey, appId, message, addressIndex) {
        var publicKey,
            isHashRequired,
            confirmCB,
            authorizedCB,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                publicKey = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : undefined;
                isHashRequired = _args3.length > 6 && _args3[6] !== undefined ? _args3[6] : false;
                confirmCB = _args3.length > 7 && _args3[7] !== undefined ? _args3[7] : undefined;
                authorizedCB = _args3.length > 8 && _args3[8] !== undefined ? _args3[8] : undefined;
                _context3.next = 6;
                return _core.setting.auth.versionCheck(transport, 81);

              case 6:
                if (publicKey) {
                  _context3.next = 10;
                  break;
                }

                _context3.next = 9;
                return this.getPublicKey(transport, appPrivateKey, appId, addressIndex);

              case 9:
                publicKey = _context3.sent;

              case 10:
                return _context3.abrupt("return", sign.signMessage(transport, appId, appPrivateKey, this.coinType, message, addressIndex, publicKey, isHashRequired, confirmCB, authorizedCB));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function signMessage(_x10, _x11, _x12, _x13, _x14) {
        return _signMessage.apply(this, arguments);
      }

      return signMessage;
    }()
    /**
     * Sign EIP712 typed data
     * @param {Object} typedData
     * @param {Number} addressIndex
     * @param {String} publicKey
     * @param {Function} confirmCB
     * @param {Function} authorizedCB
     */

  }, {
    key: "signTypedData",
    value: function () {
      var _signTypedData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(transport, appPrivateKey, appId, typedData, addressIndex) {
        var publicKey,
            confirmCB,
            authorizedCB,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                publicKey = _args4.length > 5 && _args4[5] !== undefined ? _args4[5] : undefined;
                confirmCB = _args4.length > 6 && _args4[6] !== undefined ? _args4[6] : undefined;
                authorizedCB = _args4.length > 7 && _args4[7] !== undefined ? _args4[7] : undefined;
                _context4.next = 5;
                return _core.setting.auth.versionCheck(transport, 84);

              case 5:
                if (publicKey) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 8;
                return this.getPublicKey(transport, appPrivateKey, appId, addressIndex);

              case 8:
                publicKey = _context4.sent;

              case 9:
                return _context4.abrupt("return", sign.signTypedData(transport, appId, appPrivateKey, this.coinType, typedData, addressIndex, publicKey, confirmCB, authorizedCB));

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function signTypedData(_x15, _x16, _x17, _x18, _x19) {
        return _signTypedData.apply(this, arguments);
      }

      return signTypedData;
    }()
  }]);

  return QKC;
}(_core.coin.ECDSACoin);

exports["default"] = QKC;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJRS0MiLCJ0cmFuc3BvcnQiLCJhcHBQcml2YXRlS2V5IiwiYXBwSWQiLCJhZGRyZXNzSW5kZXgiLCJnZXRQdWJsaWNLZXkiLCJwdWJsaWNLZXkiLCJ0cmFuc2FjdGlvbiIsInVuZGVmaW5lZCIsImNvbmZpcm1DQiIsImF1dGhvcml6ZWRDQiIsInNpZ24iLCJzaWduVHJhbnNhY3Rpb24iLCJjb2luVHlwZSIsIm1lc3NhZ2UiLCJpc0hhc2hSZXF1aXJlZCIsInNldHRpbmciLCJhdXRoIiwidmVyc2lvbkNoZWNrIiwic2lnbk1lc3NhZ2UiLCJ0eXBlZERhdGEiLCJzaWduVHlwZWREYXRhIiwiQ09JTiIsIkVDRFNBQ29pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlxQkEsRzs7Ozs7QUFDbkIsaUJBQWM7QUFBQTs7QUFBQSw2QkFDTixJQURNO0FBRWI7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7aUdBQ21CQyxTLEVBQXNCQyxhLEVBQXVCQyxLLEVBQWVDLFk7Ozs7Ozs7dUJBQ25ELEtBQUtDLFlBQUwsQ0FBa0JKLFNBQWxCLEVBQTZCQyxhQUE3QixFQUE0Q0MsS0FBNUMsRUFBbURDLFlBQW5ELEM7OztBQUFsQkUsZ0JBQUFBLFM7aURBQ0MsK0JBQWdCQSxTQUFoQixDOzs7Ozs7Ozs7Ozs7Ozs7O0FBR1Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozt1R0FFSUwsUyxFQUNBQyxhLEVBQ0FDLEssRUFDRkksVyxFQVNFSCxZOzs7Ozs7Ozs7QUFDQUUsZ0JBQUFBLFMsOERBQWdDRSxTO0FBQ2hDQyxnQkFBQUEsUyw4REFBa0NELFM7QUFDbENFLGdCQUFBQSxZLDhEQUFxQ0YsUzs7b0JBRWhDRixTOzs7Ozs7dUJBQTZCLEtBQUtELFlBQUwsQ0FBa0JKLFNBQWxCLEVBQTZCQyxhQUE3QixFQUE0Q0MsS0FBNUMsRUFBbURDLFlBQW5ELEM7OztBQUFsQkUsZ0JBQUFBLFM7OztrREFDVEssSUFBSSxDQUFDQyxlQUFMLENBQ0xYLFNBREssRUFFTEUsS0FGSyxFQUdMRCxhQUhLLEVBSUwsS0FBS1csUUFKQSxFQUtMTixXQUxLLEVBTUxILFlBTkssRUFPTEUsU0FQSyxFQVFMRyxTQVJLLEVBU0xDLFlBVEssQzs7Ozs7Ozs7Ozs7Ozs7OztBQWFUO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OzttR0FFSVQsUyxFQUNBQyxhLEVBQ0FDLEssRUFDQVcsTyxFQUNBVixZOzs7Ozs7Ozs7O0FBQ0FFLGdCQUFBQSxTLDhEQUFnQ0UsUztBQUNoQ08sZ0JBQUFBLGMsOERBQTBCLEs7QUFDMUJOLGdCQUFBQSxTLDhEQUFrQ0QsUztBQUNsQ0UsZ0JBQUFBLFksOERBQXFDRixTOzt1QkFFL0JRLGNBQVFDLElBQVIsQ0FBYUMsWUFBYixDQUEwQmpCLFNBQTFCLEVBQXFDLEVBQXJDLEM7OztvQkFDREssUzs7Ozs7O3VCQUNlLEtBQUtELFlBQUwsQ0FBa0JKLFNBQWxCLEVBQTZCQyxhQUE3QixFQUE0Q0MsS0FBNUMsRUFBbURDLFlBQW5ELEM7OztBQUFsQkUsZ0JBQUFBLFM7OztrREFFS0ssSUFBSSxDQUFDUSxXQUFMLENBQ0xsQixTQURLLEVBRUxFLEtBRkssRUFHTEQsYUFISyxFQUlMLEtBQUtXLFFBSkEsRUFLTEMsT0FMSyxFQU1MVixZQU5LLEVBT0xFLFNBUEssRUFRTFMsY0FSSyxFQVNMTixTQVRLLEVBVUxDLFlBVkssQzs7Ozs7Ozs7Ozs7Ozs7OztBQWNUO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O3FHQUVJVCxTLEVBQ0FDLGEsRUFDQUMsSyxFQUNBaUIsUyxFQUNBaEIsWTs7Ozs7Ozs7O0FBQ0FFLGdCQUFBQSxTLDhEQUFnQ0UsUztBQUNoQ0MsZ0JBQUFBLFMsOERBQWtDRCxTO0FBQ2xDRSxnQkFBQUEsWSw4REFBcUNGLFM7O3VCQUUvQlEsY0FBUUMsSUFBUixDQUFhQyxZQUFiLENBQTBCakIsU0FBMUIsRUFBcUMsRUFBckMsQzs7O29CQUNESyxTOzs7Ozs7dUJBQTZCLEtBQUtELFlBQUwsQ0FBa0JKLFNBQWxCLEVBQTZCQyxhQUE3QixFQUE0Q0MsS0FBNUMsRUFBbURDLFlBQW5ELEM7OztBQUFsQkUsZ0JBQUFBLFM7OztrREFDVEssSUFBSSxDQUFDVSxhQUFMLENBQ0xwQixTQURLLEVBRUxFLEtBRkssRUFHTEQsYUFISyxFQUlMLEtBQUtXLFFBSkEsRUFLTE8sU0FMSyxFQU1MaEIsWUFOSyxFQU9MRSxTQVBLLEVBUUxHLFNBUkssRUFTTEMsWUFUSyxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbkhzQlksV0FBS0MsUyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyBjb2luIGFzIENPSU4sIHRyYW5zcG9ydCwgc2V0dGluZyB9IGZyb20gJ0Bjb29sd2FsbGV0L2NvcmUnO1xuaW1wb3J0ICogYXMgc2lnbiBmcm9tICcuL3NpZ24nO1xuaW1wb3J0IHsgcHViS2V5VG9BZGRyZXNzIH0gZnJvbSAnLi91dGlscy9ldGhVdGlscyc7XG5pbXBvcnQgeyBUeXBlZERhdGEgfSBmcm9tICdldGgtc2lnLXV0aWwnO1xuXG50eXBlIFRyYW5zcG9ydCA9IHRyYW5zcG9ydC5kZWZhdWx0O1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUUtDIGV4dGVuZHMgQ09JTi5FQ0RTQUNvaW4gaW1wbGVtZW50cyBDT0lOLkNvaW4ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignRkYnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgRXRoZXJldW0gYWRkcmVzcyBieSBpbmRleFxuICAgKiBAcGFyYW0ge251bWJlcn0gYWRkcmVzc0luZGV4XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGFzeW5jIGdldEFkZHJlc3ModHJhbnNwb3J0OiBUcmFuc3BvcnQsIGFwcFByaXZhdGVLZXk6IHN0cmluZywgYXBwSWQ6IHN0cmluZywgYWRkcmVzc0luZGV4OiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IGF3YWl0IHRoaXMuZ2V0UHVibGljS2V5KHRyYW5zcG9ydCwgYXBwUHJpdmF0ZUtleSwgYXBwSWQsIGFkZHJlc3NJbmRleCk7XG4gICAgcmV0dXJuIHB1YktleVRvQWRkcmVzcyhwdWJsaWNLZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpZ24gRXRoZXJldW0gVHJhbnNhY3Rpb24uXG4gICAqIEBwYXJhbSB7e25vbmNlOnN0cmluZywgZ2FzUHJpY2U6c3RyaW5nLCBnYXNMaW1pdDpzdHJpbmcsIHRvOnN0cmluZyxcbiAgICogdmFsdWU6c3RyaW5nLCBkYXRhOnN0cmluZ319IHRyYW5zYWN0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhZGRyZXNzSW5kZXhcbiAgICogQHBhcmFtIHtTdHJpbmd9IHB1YmxpY0tleVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maXJtQ0JcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gYXV0aG9yaXplZENCXG4gICAqL1xuICBhc3luYyBzaWduVHJhbnNhY3Rpb24oXG4gICAgdHJhbnNwb3J0OiBUcmFuc3BvcnQsIFxuICAgIGFwcFByaXZhdGVLZXk6IHN0cmluZywgXG4gICAgYXBwSWQ6IHN0cmluZywgXG5cdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdG5vbmNlOiBzdHJpbmcsXG5cdFx0XHRnYXNQcmljZTogc3RyaW5nLFxuXHRcdFx0Z2FzTGltaXQ6IHN0cmluZyxcblx0XHRcdHRvOiBzdHJpbmcsXG5cdFx0XHR2YWx1ZTogc3RyaW5nLFxuXHRcdFx0ZGF0YTogc3RyaW5nLFxuXHRcdFx0ZnJvbUZ1bGxTaGFyZEtleTogc3RyaW5nLFxuXHRcdFx0dG9GdWxsU2hhcmRLZXk6IHN0cmluZyB9LFxuICAgIGFkZHJlc3NJbmRleDogbnVtYmVyLFxuICAgIHB1YmxpY0tleTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICAgIGNvbmZpcm1DQjogRnVuY3Rpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gICAgYXV0aG9yaXplZENCOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICApIHtcbiAgICBpZiAoIXB1YmxpY0tleSkgcHVibGljS2V5ID0gYXdhaXQgdGhpcy5nZXRQdWJsaWNLZXkodHJhbnNwb3J0LCBhcHBQcml2YXRlS2V5LCBhcHBJZCwgYWRkcmVzc0luZGV4KTtcbiAgICByZXR1cm4gc2lnbi5zaWduVHJhbnNhY3Rpb24oXG4gICAgICB0cmFuc3BvcnQsXG4gICAgICBhcHBJZCxcbiAgICAgIGFwcFByaXZhdGVLZXksXG4gICAgICB0aGlzLmNvaW5UeXBlLFxuICAgICAgdHJhbnNhY3Rpb24sXG4gICAgICBhZGRyZXNzSW5kZXgsXG4gICAgICBwdWJsaWNLZXksXG4gICAgICBjb25maXJtQ0IsXG4gICAgICBhdXRob3JpemVkQ0JcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpZ24gQXJiaXRyYXJ5IE1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIGhleCBvciB1dGYtOFxuICAgKiBAcGFyYW0ge051bWJlcn0gYWRkcmVzc0luZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwdWJsaWNLZXlcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc0hhc2hSZXF1aXJlZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maXJtQ0JcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gYXV0aG9yaXplZENCXG4gICAqIEByZXR1cm4ge1Byb21pc2U8U3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHNpZ25NZXNzYWdlKFxuICAgIHRyYW5zcG9ydDogVHJhbnNwb3J0LFxuICAgIGFwcFByaXZhdGVLZXk6IHN0cmluZyxcbiAgICBhcHBJZDogc3RyaW5nLCBcbiAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgYWRkcmVzc0luZGV4OiBudW1iZXIsXG4gICAgcHVibGljS2V5OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gICAgaXNIYXNoUmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBjb25maXJtQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICAgIGF1dGhvcml6ZWRDQjogRnVuY3Rpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCBzZXR0aW5nLmF1dGgudmVyc2lvbkNoZWNrKHRyYW5zcG9ydCwgODEpO1xuICAgIGlmICghcHVibGljS2V5KSB7XG4gICAgICBwdWJsaWNLZXkgPSBhd2FpdCB0aGlzLmdldFB1YmxpY0tleSh0cmFuc3BvcnQsIGFwcFByaXZhdGVLZXksIGFwcElkLCBhZGRyZXNzSW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gc2lnbi5zaWduTWVzc2FnZShcbiAgICAgIHRyYW5zcG9ydCxcbiAgICAgIGFwcElkLFxuICAgICAgYXBwUHJpdmF0ZUtleSxcbiAgICAgIHRoaXMuY29pblR5cGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgYWRkcmVzc0luZGV4LFxuICAgICAgcHVibGljS2V5LFxuICAgICAgaXNIYXNoUmVxdWlyZWQsXG4gICAgICBjb25maXJtQ0IsXG4gICAgICBhdXRob3JpemVkQ0JcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpZ24gRUlQNzEyIHR5cGVkIGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IHR5cGVkRGF0YVxuICAgKiBAcGFyYW0ge051bWJlcn0gYWRkcmVzc0luZGV4XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwdWJsaWNLZXlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZmlybUNCXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGF1dGhvcml6ZWRDQlxuICAgKi9cbiAgYXN5bmMgc2lnblR5cGVkRGF0YShcbiAgICB0cmFuc3BvcnQ6IFRyYW5zcG9ydCxcbiAgICBhcHBQcml2YXRlS2V5OiBzdHJpbmcsXG4gICAgYXBwSWQ6IHN0cmluZywgXG4gICAgdHlwZWREYXRhOiBvYmplY3QsXG4gICAgYWRkcmVzc0luZGV4OiBudW1iZXIsXG4gICAgcHVibGljS2V5OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gICAgY29uZmlybUNCOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgICBhdXRob3JpemVkQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICkge1xuICAgIGF3YWl0IHNldHRpbmcuYXV0aC52ZXJzaW9uQ2hlY2sodHJhbnNwb3J0LCA4NCk7XG4gICAgaWYgKCFwdWJsaWNLZXkpIHB1YmxpY0tleSA9IGF3YWl0IHRoaXMuZ2V0UHVibGljS2V5KHRyYW5zcG9ydCwgYXBwUHJpdmF0ZUtleSwgYXBwSWQsIGFkZHJlc3NJbmRleCk7XG4gICAgcmV0dXJuIHNpZ24uc2lnblR5cGVkRGF0YShcbiAgICAgIHRyYW5zcG9ydCxcbiAgICAgIGFwcElkLFxuICAgICAgYXBwUHJpdmF0ZUtleSxcbiAgICAgIHRoaXMuY29pblR5cGUsXG4gICAgICB0eXBlZERhdGEsXG4gICAgICBhZGRyZXNzSW5kZXgsXG4gICAgICBwdWJsaWNLZXksXG4gICAgICBjb25maXJtQ0IsXG4gICAgICBhdXRob3JpemVkQ0JcbiAgICApO1xuICB9XG59XG4iXX0=