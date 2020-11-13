/// <reference types="node" />
import { transport } from "@coolwallet/core";
declare type Transport = transport.default;
/**
 * Decide Transaction Type
 * @param {*} transaction
 */
export declare const getTransactionType: (transaction: any) => string;
/**
 * Get raw payload
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @return {Array<Buffer>}
 */
export declare const getRawHex: (transaction: any) => Array<Buffer>;
/**
 *
 * @param {Transport} transport
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string}} transaction
 */
export declare const getReadType: (txType: string) => {
    readType: string;
};
/**
 *
 * @param {number} addressIndex
 * @param {*} transaction
 */
export declare const getScriptAndArguments: (txType: any, addressIndex: number, transaction: any) => {
    script: string;
    argument: string;
};
/**
 * @description Compose Signed Transaction
 * @param {Array<Buffer>} payload
 * @param {Number} v
 * @param {String} r
 * @param {String} s
 * @return {String}
 */
export declare const composeSignedTransacton: (payload: Array<Buffer>, v: number, r: string, s: string) => string;
/**
 * @description Generate Canonical Signature from Der Signature
 * @param {{r:string, s:string}} canonicalSignature
 * @param {Buffer} payload
 * @param {String} compressedPubkey hex string
 * @return {Promise<{v: Number, r: String, s: String}>}
 */
export declare const genEthSigFromSESig: (canonicalSignature: {
    r: string;
    s: string;
}, payload: Buffer, compressedPubkey?: string | undefined) => Promise<{
    v: number;
    r: string;
    s: string;
}>;
/**
 * @description APDU Send Raw Data for Segregated Signature
 * @param {Transport} transport
 * @param {Buffer} msgBuf
 * @param {String} p1
 * @return {Function}
 */
export declare const apduForParsignMessage: (transport: Transport, appPrivateKey: string, msgBuf: Buffer, p1: string) => Function;
/**
 * Convert public key to address
 * @param {string} compressedPubkey
 * @return {string}
 */
export declare function pubKeyToAddress(compressedPubkey: string): string;
export {};
