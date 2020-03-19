import BigNumber from 'bignumber.js';
import Util from './util';

const topicsRegex = /(\#[a-zA-Z]+\b)(?!;)/g;

const getTipsRetips = (state) => {
  const findUrl = (urlId) => state.urls.find(([, id]) => urlId === id)[0];

  const findClaimGen = (tipClaimGen, urlId) => {
    const [, data] = state.claims.find(([id]) => id === urlId);

    return {
      unclaimed: tipClaimGen > data[0],
      claim_gen: data[0],
      unclaimed_amount: data[1],
    };
  };

  const findRetips = (tipId, urlId) => state.retips
    .filter(([, data]) => data.tip_id === tipId).map(([id, data]) => ({
      ...data,
      id,
      claim: findClaimGen(data.claim_gen, urlId),
      amount_ae: Util.atomsToAe(data.amount).toFixed(),
    }));


  const tips = state.tips.map(([id, data]) => {
    const tipsData = data;
    tipsData.id = id;
    tipsData.url = findUrl(tipsData.url_id);
    tipsData.topics = [...new Set(tipsData.title.match(topicsRegex))].map((x) => x.toLowerCase());
    tipsData.retips = findRetips(id, tipsData.url_id);
    tipsData.claim = findClaimGen(tipsData.claim_gen, tipsData.url_id);

    tipsData.amount_ae = Util.atomsToAe(tipsData.amount).toFixed();

    const retip_amount = tipsData.retips.reduce((acc, retip) => acc.plus(retip.amount), new BigNumber('0')).toFixed();

    tipsData.retip_amount_ae = Util.atomsToAe(retip_amount).toFixed();

    tipsData.total_amount = Util
      .atomsToAe(new BigNumber(tipsData.amount).plus(retip_amount)).toFixed();

    tipsData.total_unclaimed_amount = Util.atomsToAe(new BigNumber(tipsData.claim.unclaimed ? tipsData.amount : 0).plus(tipsData.retips.reduce((acc, retip) => acc.plus(retip.claim.unclaimed ? retip.amount : 0), new BigNumber('0'))).toFixed()).toFixed();

    return tipsData;
  });


  const urls = state.urls.map(([url, id]) => {
    const urlTips = tips.filter((tip) => tip.url_id === id);
    const claim = state.claims.find(([urlId]) => urlId === id)[1];

    return {
      url,
      tip_ids: urlTips.map((tip) => tip.id),
      retip_ids: urlTips.flatMap((tip) => tip.retips.map((retip) => retip.id)),
      unclaimed_amount: claim[1],
    };
  });

  const senders = [...new Set(tips
    .reduce((acc, tip) => acc
      .concat([tip.sender, ...tip.retips.map((retip) => retip.sender)]), []))];

  const stats = {
    tips_length: state.tips.length,
    retips_length: state.retips.length,
    total_tips_length: state.tips.length + state.retips.length,
    total_amount: tips.reduce((acc, tip) => acc.plus(tip.total_amount), new BigNumber('0')).toFixed(),
    total_unclaimed_amount: tips.reduce((acc, tip) => acc.plus(tip.total_unclaimed_amount), new BigNumber('0')).toFixed(),
    senders_length: senders.length,
  };

  return {
    stats,
    urls,
    tips,
  };
};

export default {
  getTipsRetips,
  topicsRegex,
};
