import { transport } from '@coolwallet/core';
declare type Transport = transport.default;
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
export declare const signTransaction: (transport: Transport, appId: string, appPrivateKey: string, coinType: string, transaction: {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string;
    fromFullShardKey: string;
    toFullShardKey: string;
}, addressIndex: number, publicKey?: string | undefined, confirmCB?: Function | undefined, authorizedCB?: Function | undefined) => Promise<string>;
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
export declare const signMessage: (transport: Transport, appId: string, appPrivateKey: string, coinType: string, message: string, addressIndex: number, publicKey?: string | undefined, isHashRequired?: boolean, confirmCB?: Function | undefined, authorizedCB?: Function | undefined) => Promise<string>;
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
export declare const signTypedData: (transport: Transport, appId: string, appPrivateKey: string, coinType: string, typedData: object, addressIndex: number, publicKey?: string | undefined, confirmCB?: Function | undefined, authorizedCB?: Function | undefined) => Promise<string>;
export {};
