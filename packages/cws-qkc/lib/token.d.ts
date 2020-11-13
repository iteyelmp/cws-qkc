/**
 * @param {string} data
 * @return {Boolean}
 */
export declare const isSupportedERC20Method: (data: string) => boolean;
/**
 * Parse erc transfer amount and to address from data
 * @param {string} data
 */
export declare const parseToAndAmount: (data: string) => {
    to: string;
    amount: string;
};
/**
 *
 * @param {String} contractAddress contract Address (0x prefixed)
 * @param {Number} decimals
 * @param {String} symbol
 * @return {String}
 */
export declare const getSetTokenPayload: (contractAddress: string, symbol: string, decimals: number) => string;
/**
 * get Preaction
 * @param {Transport} transport
 * @param {boolean} isBuiltIn
 * @param {string} setTokenPayload
 * @return {Function}
 */
