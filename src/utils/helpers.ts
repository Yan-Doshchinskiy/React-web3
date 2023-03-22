import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 60 });

export const shiftedBy = (value: string, decimals: string, mode: number | 0 = 0): string => {
    const decimalsInt = mode === 0 ? parseInt(decimals, 10) : -parseInt(decimals, 10);
    return new BigNumber(value).shiftedBy(decimalsInt).toString();
};
