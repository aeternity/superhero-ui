import BigNumber from 'bignumber.js'
import Util from "./util";

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
    data.topics = data.title.match(/(\#[a-zA-Z]+\b)(?!;)/g);
    data.retips = findRetips(id, data.url_id);
    data.claim = findClaimGen(data.claim_gen, data.url_id);

    data.amount_ae = Util.atomsToAe(data.amount).toFixed();

    data.total_amount = Util.atomsToAe(new BigNumber(data.amount).plus(data.retips.reduce((acc, retip) => {
      return acc.plus(retip.amount)
    }, new BigNumber('0'))).toFixed()).toFixed();

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

  const topics = tips.reduce((acc, tip) => {
    if (tip.topics) tip.topics.forEach(topic => {
      if (topic) acc[topic] = acc[topic] ? new BigNumber(acc[topic]).plus(tip.total_amount).toFixed() : tip.total_amount
    });

    return acc;
  }, {});

  return {
    topics: topics,
    urls: urls,
    tips: tips
  };
};

export default {
  getTipsRetips
}
