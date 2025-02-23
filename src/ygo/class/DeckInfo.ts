import cardInfoDic from "@ygo/class/CardInfo";

export default class DeckInfo {
  public cardNames = [] as string[];
  public readonly getDisableCardNames = () => {
    return Array.from(new Set(this.cardNames.filter((name) => !Object.keys(cardInfoDic).includes(name))));
  };
  public readonly creteCardInfos = () => {
    const disableCardNames = this.getDisableCardNames();
    if (disableCardNames.length > 0) {
      throw new Error(`存在しないカード名からデッキを生成しようとした。${disableCardNames}`);
    }
    return this.cardNames.map((name) => cardInfoDic?.[name]).filter((info) => info);
  };
}
