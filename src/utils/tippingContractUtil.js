import BigNumber from 'bignumber.js';
import Util from "./util";

const topicsRegex = /(\#[a-zA-Z]+\b)(?!;)/g;

const getTipsRetips = (state) => {
  const findUrl = (urlId) => state.urls.find(([_, id]) => urlId === id)[0];

  const findClaimGen = (tipClaimGen, urlId) => {
    const [_, data] = state.claims.find(([id, _]) => id === urlId);

    return {
      unclaimed: tipClaimGen > data[0],
      claim_gen: data[0],
      unclaimed_amount: data[1]
    };
  };

  const findRetips = (tipId, urlId) => state.retips.filter(([_, data]) => data.tip_id === tipId).map(([id, data]) => {
    data.id = id;
    data.claim = findClaimGen(data.claim_gen, urlId);
    data.amount_ae = Util.atomsToAe(data.amount).toFixed();
    return data;
  });


  const tips = state.tips.map(([id, data]) => {
    data.id = id;
    data.url = findUrl(data.url_id);
    data.topics = [...new Set(data.title.match(topicsRegex))].map(x => x.toLowerCase());
    data.retips = findRetips(id, data.url_id);
    data.claim = findClaimGen(data.claim_gen, data.url_id);

    data.amount_ae = Util.atomsToAe(data.amount).toFixed();

    const retip_amount = data.retips.reduce((acc, retip) => {
      return acc.plus(retip.amount)
    }, new BigNumber('0')).toFixed();

    data.retip_amount_ae = Util.atomsToAe(retip_amount).toFixed();

    data.total_amount = Util.atomsToAe(new BigNumber(data.amount).plus(retip_amount)).toFixed();

    data.total_unclaimed_amount = Util.atomsToAe(new BigNumber(data.claim.unclaimed ? data.amount : 0).plus(data.retips.reduce((acc, retip) => {
      return acc.plus(retip.claim.unclaimed ? retip.amount : 0)
    }, new BigNumber('0'))).toFixed()).toFixed();

    return data;
  });


  const urls = state.urls.map(([url, id]) => {
    const urlTips = tips.filter(tip => tip.url_id === id);
    const claim = state.claims.find(([urlId, _]) => urlId === id)[1];

    return {
      url: url,
      tip_ids: urlTips.map(tip => tip.id),
      retip_ids: urlTips.flatMap(tip => tip.retips.map(retip => retip.id)),
      unclaimed_amount: claim[1]
    };
  });

  const senders = [...new Set(tips.reduce((acc, tip) =>  {
    return acc.concat([tip.sender, ...tip.retips.map(retip => retip.sender)]);
  }, []))];

  const stats = {
    tips_length: state.tips.length,
    retips_length: state.retips.length,
    total_tips_length: state.tips.length + state.retips.length,
    total_amount: tips.reduce((acc, tip) => acc.plus(tip.total_amount), new BigNumber('0')).toFixed(3),
    total_unclaimed_amount: tips.reduce((acc, tip) => acc.plus(tip.total_unclaimed_amount), new BigNumber('0')).toFixed(3),
    senders_length: senders.length
  };

  return {
    stats: stats,
    urls: urls,
    tips: tips
  };
};

export default {
  getTipsRetips,
  topicsRegex
}
