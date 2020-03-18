import { BigNumber } from 'bignumber.js';

export function toFloat(value, places = 2) {
 return parseFloat(value).toFixed(places);
}

export function toBigNumber(value) {
 return new BigNumber(value);
}

export function bnAbs(bigNumber) {
 return bigNumber.absoluteValue();
}

export function bnRemoveTrailingZeros(bigNumber) {
 return bigNumber.toString();
}

export function bnToFixed(bigNumber, places = 2) {
 return bigNumber.toFixed(places);
}

export function bnMultiply(bigNumber, value) {
 return bigNumber.multipliedBy(value);
}

export function bnPlus(bigNumber, value) {
 return bigNumber.plus(value);
}

export function bnMinus(bigNumber, value) {
 return bigNumber.minus(value);
}