import BigNumber from "bignumber.js";

const getTipTopics = (tips) => {

  const topics = tips.reduce((acc, tip) => {
    if (tip.topics) tip.topics.forEach(topic => {
      if (topic) acc[topic] = acc[topic] ? new BigNumber(acc[topic]).plus(tip.total_amount).toFixed() : tip.total_amount
    });

    return acc;
  }, {});

  return Object.entries(topics).sort((a, b) => new BigNumber(b[1]).minus(a[1]).toNumber());
};

export default {
  getTipTopics
}
