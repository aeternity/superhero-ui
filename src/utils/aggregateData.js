import Backend from './backend';
import aeternity from './aeternity';

const fetchingTips = async () => {
  const backendInstance = new Backend();
  const fetchTips = aeternity.getTips().catch(console.error);
  const fetchOrdering = backendInstance.tipOrder().catch(console.error);
  const fetchTipsPreview = backendInstance.tipPreview().catch(console.error);
  const fetchLangTips = backendInstance.getLangTips().catch(console.error);
  const fetchChainNames = backendInstance.getChainNameFromAddress().catch(console.error);
  const fetchCommentCounts = backendInstance.getCommentCounts().catch(console.error);
  const [
    fetchTipsResponse, tipOrdering, tipsPreview,
    langTips, fetchedChainNames, commentCounts,
  ] = await Promise.all([
    fetchTips, fetchOrdering, fetchTipsPreview, fetchLangTips, fetchChainNames, fetchCommentCounts,
  ]);

  let { tips } = fetchTipsResponse;
  let chainNames = fetchedChainNames;
  // add score from backend to tips
  if (tipOrdering) {
    const blacklistedTipIds = tipOrdering.map((order) => order.id);
    const filteredTips = tips.filter((tip) => blacklistedTipIds.includes(tip.id));
    tips = filteredTips.map((tip) => {
      const orderItem = tipOrdering.find((order) => order.id === tip.id);
      return {
        ...tip,
        score: orderItem ? orderItem.score : 0,
      };
    });
  }

  // filter tips by language from backend
  if (langTips) tips = tips.filter((tip) => langTips.some((url) => tip.url === url));

  // add preview to tips from backend
  if (tipsPreview) {
    tips = tips.map((tip) => ({
      ...tip,
      preview: tipsPreview.find((preview) => preview.requestUrl === tip.url),
    }));
  }

  if (chainNames) {
    chainNames = chainNames.reduce((acc, chainName) => {
      if (!chainName.pointers) return acc;

      const accountPubkeyPointer = chainName.pointers.find((pointer) => pointer.key === 'account_pubkey');
      const pubkey = accountPubkeyPointer ? accountPubkeyPointer.id : null;
      if (!pubkey) return acc;

      if (acc[pubkey]) {
        // shorter always replaces
        if (chainName.name.length < acc[pubkey].length) acc[pubkey] = chainName.name;
        // equal length replaces if alphabetically earlier
        if (chainName.name.length === acc[pubkey].length && chainName.name < acc[pubkey]) {
          acc[pubkey] = chainName.name;
        }
      } else {
        acc[pubkey] = chainName.name;
      }
      return acc;
    }, {});

    tips = tips.map((tip) => ({
      ...tip,
      chainName: chainNames[tip.sender],
    }));
  }

  if (commentCounts) {
    tips = tips.map((tip) => {
      const commentCount = commentCounts.find((comment) => comment.tipId === tip.id);
      return {
        ...tip,
        commentCount: commentCount ? commentCount.count : 0,
      };
    });
  }

  return {
    stats: fetchTipsResponse.stats, tips, hasOrdering: !!tipOrdering, chainNames,
  };
};

export default {
  fetchingTips,
};
