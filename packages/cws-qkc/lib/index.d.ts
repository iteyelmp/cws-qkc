import { coin as COIN, transport } from '@coolwallet/core';
declare type Transport = transport.default;
export default class QKC extends COIN.ECDSACoin implements COIN.Coin {
    constructor();
    /**
     * Get Ethereum address by index
     * @param {number} addressIndex
     * @return {string}
     */
    getAddress(transport: Transport, appPrivateKey: string, appId: string, addressIndex: number): Promise<string>;
    /**
     * Sign Ethereum Transaction.
     * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
     * value:string, data:string}} transaction
     * @param {Number} addressIndex
     * @param {String} publicKey
     * @param {Function} confirmCB
     * @param {Function} authorizedCB
     */
    signTransaction(transport: Transport, appPrivateKey: string, appId: string, transaction: {
        nonce: string;
        gasPrice: string;
        gasLimit: string;
        to: string;
        value: string;
        data: string;
        fromFullShardKey: string;
        toFullShardKey: string;
    }, addressIndex: number, publicKey?: string | undefined, confirmCB?: Function | undefined, authorizedCB?: Function | undefined): Promise<string>;
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
    signMessage(transport: Transport, appPrivateKey: string, appId: string, message: string, addressIndex: number, publicKey?: string | undefined, isHashRequired?: boolean, confirmCB?: Function | undefined, authorizedCB?: Function | undefined): Promise<string>;
    /**
     * Sign EIP712 typed data
     * @param {Object} typedData
     * @param {Number} addressIndex
     * @param {String} publicKey
     * @param {Function} confirmCB
     * @param {Function} authorizedCB
     */
    signTypedData(transport: Transport, appPrivateKey: string, appId: string, typedData: object, addressIndex: number, publicKey?: string | undefined, confirmCB?: Function | undefined, authorizedCB?: Function | undefined): Promise<string>;
}
export {};
