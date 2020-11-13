import { apdu, transport, error, tx, util } from '@coolwallet/core';
// import { TypedDataUtils as typedDataUtils } from 'eth-sig-util';
import { isHex, keccak256, sha3 } from './lib';
import * as ethUtil from './utils/ethUtils';
import * as ethUtil100 from './utils/ethUtils100';
import { removeHex0x, handleHex } from './utils/stringUtil';
import * as scripts from "./scripts";
import { Transaction, signMsg, signTyped, EIP712Schema, signTx } from './type'

const Ajv = require('ajv');
const ajv = new Ajv();
const typedDataUtils = require('eth-sig-util').TypedDataUtils;
const rlp = require('rlp');
type Transport = transport.default;

/**
 * sign ETH Transaction
 * @param {Transport} transport
 * @param {string} appId
 * @param {String} appPrivateKey
 * @param {coinType} coinType
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @param {Number} addressIndex
 * @param {String} publicKey
 * @param {Function} confirmCB
 * @param {Function} authorizedCB
 * @return {Promise<string>}
 */
export const signTransaction100 = async (
  transport: Transport,
  appId: string,
  appPrivateKey: string,
  coinType: string,
  transaction: Transaction,
  addressIndex: number,
  publicKey: string | undefined = undefined,
  confirmCB: Function | undefined = undefined,
  authorizedCB: Function | undefined = undefined,
): Promise<string> => {
  const rawPayload = ethUtil.getRawHex(transaction);
  const txType = ethUtil100.getTransactionType(transaction);
  const preActions = [];
  let action;
  const keyId = tx.util.addressIndexToKeyId(coinType, addressIndex);
  const { readType } = ethUtil100.getReadType(txType);
  const dataForSE = tx.flow.prepareSEData(keyId, rawPayload, readType);
  const sayHi = async () => {
    await apdu.general.hi(transport, appId);
  }
  preActions.push(sayHi)

  action = async () => {
    return apdu.tx.txPrep(transport, dataForSE, "00", appPrivateKey);
  }
  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport,
    preActions,
    action,
    false,
    confirmCB,
    authorizedCB,
    true
  );
  if (!Buffer.isBuffer(canonicalSignature)) {
    const { v, r, s } = await ethUtil.genEthSigFromSESig(
      canonicalSignature,
      rlp.encode(rawPayload),
      publicKey
    );
    const serializedTx = ethUtil.composeSignedTransacton(rawPayload, v, r, s, transaction.chainId);
    return serializedTx;
  } else {
    throw new error.SDKError(signTransaction100.name, 'canonicalSignature type error');
  }
};

/**
 * sign ETH Transaction
 * @param {Transport} transport
 * @param {string} appId
 * @param {String} appPrivateKey
 * @param {coinType} coinType
 * @param {{nonce:string, gasPrice:string, gasLimit:string, to:string,
 * value:string, data:string, chainId: number}} transaction
 * @param {Number} addressIndex
 * @param {String} publicKey
 * @param {Function} confirmCB
 * @param {Function} authorizedCB
 * @return {Promise<string>}
 */
export const signTransaction = async (
  signTxData: signTx,
  script: string,
  argument: string,
  publicKey: string | undefined = undefined,
): Promise<string> => {

  const { transport, transaction } = signTxData

  const rawPayload = ethUtil.getRawHex(transaction);

  const preActions = [];
  let action;
  const sendScript = async () => {
    await apdu.tx.sendScript(transport, script);
  }
  preActions.push(sendScript);

  action = async () => {
    return apdu.tx.executeScript(
      transport,
      signTxData.appId,
      signTxData.appPrivateKey,
      argument
    );
  }
  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport,
    preActions,
    action,
    false,
    signTxData.confirmCB,
    signTxData.authorizedCB,
    true
  );

  const { signedTx } = await apdu.tx.getSignedHex(transport);

  if (!Buffer.isBuffer(canonicalSignature)) {
    const { v, r, s } = await ethUtil.genEthSigFromSESig(
      canonicalSignature,
      rlp.encode(rawPayload),
      publicKey
    );
    const serializedTx = ethUtil.composeSignedTransacton(rawPayload, v, r, s, transaction.chainId);
    return serializedTx;
  } else {
    throw new error.SDKError(signTransaction.name, 'canonicalSignature type error');
  }
};

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
export const signMessage100 = async (
  transport: Transport,
  appId: string,
  appPrivateKey: string,
  coinType: string,
  message: string,
  addressIndex: number,
  publicKey: string | undefined = undefined,
  isHashRequired: boolean = false,
  confirmCB: Function | undefined = undefined,
  authorizedCB: Function | undefined = undefined
) => {
  const keyId = tx.util.addressIndexToKeyId(coinType, addressIndex);

  const preActions = [];
  const sayHi = async () => {
    await apdu.general.hi(transport, appId);
  }
  preActions.push(sayHi);

  let msgBuf;
  if (isHex(message)) {
    msgBuf = Buffer.from(removeHex0x(message), 'hex');
  } else {
    msgBuf = Buffer.from(message, 'utf8');
  }

  if (isHashRequired) {
    const apduForParsignMessage = async (msgBuf: Buffer) => {
      let rawData = msgBuf.toString("hex");
      rawData = handleHex(rawData);
      return async () => {
        apdu.tx.txPrep(transport, rawData, '07', appPrivateKey);
      }
    }
    preActions.push(apduForParsignMessage)
    msgBuf = Buffer.from(keccak256(msgBuf), 'hex');
  }

  const len = msgBuf.length.toString();
  const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${len}`);
  const payload = Buffer.concat([prefix, msgBuf]);
  const dataForSE = tx.flow.prepareSEData(keyId, payload, 'F5');
  const prepareTx = async () => {
    return apdu.tx.txPrep(transport, dataForSE, "00", appPrivateKey);
  }

  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport,
    preActions,
    prepareTx,
    false,
    confirmCB,
    authorizedCB,
    true
  );

  if (!Buffer.isBuffer(canonicalSignature)) {
    const { v, r, s } = await ethUtil.genEthSigFromSESig(canonicalSignature, payload, publicKey);
    const signature = `0x${r}${s}${v.toString(16)}`;
    return signature;
  } else {
    throw new error.SDKError(signMessage.name, 'canonicalSignature type error');
  }
};


/**
 * Sign Message.
 * @return {Promise<String>}
 */
export const signMessage = async (
  signMsgData: signMsg,
  publicKey: string | undefined = undefined
) => {

  const { transport, message } = signMsgData

  const getArg = async () => {
    return ethUtil.getSignMessageArgument(message);
  }

  const script = scripts.SIGN_MESSAGE.script + scripts.SIGN_MESSAGE.signature;

  const argument = await ethUtil.getArgument(signMsgData.addressIndex, getArg);

  const preActions = [];

  const sendScript = async () => {
    await apdu.tx.sendScript(transport, script);
  }
  preActions.push(sendScript);

  const action = async () => {
    return apdu.tx.executeScript(
      transport,
      signMsgData.appId,
      signMsgData.appPrivateKey,
      argument
    );
  }

  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport,
    preActions,
    action,
    false,
    signMsgData.confirmCB,
    signMsgData.authorizedCB,
    true
  );

  const keccak256Msg = keccak256(message)

  let msgBuf;
  if (isHex(keccak256Msg)) {
    msgBuf = Buffer.from(removeHex0x(keccak256Msg), 'hex');
  } else {
    msgBuf = Buffer.from(keccak256Msg, 'utf8');
  }


  const _19Buf = Buffer.from("19", 'hex');
  const prefix = "Ethereum Signed Message:";
  const lfBuf = Buffer.from("0A", 'hex')
  const len = msgBuf.length.toString();

  const prefixBuf = Buffer.from(prefix, 'ascii');
  const lenBuf = Buffer.from(len, 'ascii');
  const payload = Buffer.concat([_19Buf, prefixBuf, lfBuf, lenBuf, msgBuf]);

  if (!Buffer.isBuffer(canonicalSignature)) {
    const { v, r, s } = await ethUtil.genEthSigFromSESig(canonicalSignature, payload, publicKey);
    const signature = `0x${r}${s}${v.toString(16)}`;
    return signature;
  } else {
    throw new error.SDKError(signMessage.name, 'canonicalSignature type error');
  }
};

/**
 * @description Sign Typed Data
 * @return {Promise<String>}
 */
export const signTypedData = async (
  typedData: signTyped,
  publicKey: string | undefined = undefined,
): Promise<string> => {

  if (!ajv.validate(EIP712Schema, typedData.typedData))
    throw new error.SDKError(signTypedData.name, ajv.errorsText());

  const { transport } = typedData;

  const preActions = [];

  const sanitizedData = typedDataUtils.sanitizeData(typedData.typedData);

  const encodedData = typedDataUtils.encodeData(
    sanitizedData.primaryType,
    sanitizedData.message,
    sanitizedData.types
  );

  const domainSeparate = typedDataUtils.hashStruct(
    'EIP712Domain',
    sanitizedData.domain,
    sanitizedData.types
  );
  
  const getArg = async () => {
    return ethUtil.getSignTypedDataArgument(domainSeparate.toString('hex'), encodedData.toString('hex')); // TODO
  }

  const script = scripts.SIGN_TYPED_DATA.script + scripts.SIGN_TYPED_DATA.signature;

  const argument = await ethUtil.getArgument(typedData.addressIndex, getArg);

  const sendScript = async () => {
    await apdu.tx.sendScript(transport, script);
  }
  preActions.push(sendScript);

  const action = async () => {
    return apdu.tx.executeScript(
      transport,
      typedData.appId,
      typedData.appPrivateKey,
      argument
    );
  }

  const canonicalSignature = await tx.flow.getSingleSignatureFromCoolWallet(
    transport,
    preActions,
    action,
    false,
    typedData.confirmCB,
    typedData.authorizedCB,
    true
  );
  const prefix = Buffer.from('1901', 'hex');

  const dataBuf = Buffer.from(sha3(encodedData).substr(2), 'hex');

  const payload = Buffer.concat([prefix, domainSeparate, dataBuf]);

  if (!Buffer.isBuffer(canonicalSignature)) {
    const { v, r, s } = await ethUtil.genEthSigFromSESig(canonicalSignature, payload, publicKey);
    const signature = `0x${r}${s}${v.toString(16)}`;

    return signature;
  } else {
    throw new error.SDKError(signTypedData.name, 'canonicalSignature type error');
  }
};
