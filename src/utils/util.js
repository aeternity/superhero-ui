import BigNumber from 'bignumber.js'

const atomsToAe = (atoms) => (new BigNumber(atoms)).dividedBy(new BigNumber(1000000000000000000));
const aeToAtoms = (ae) => (new BigNumber(ae)).times(new BigNumber(1000000000000000000));

export default {
  atomsToAe, aeToAtoms
}
