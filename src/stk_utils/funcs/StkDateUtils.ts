interface IDictionary {
  [key: string]: string;
}
interface IDayDictionary {
  [key: number]: IDictionary;
}
const days: IDayDictionary = {
  0: { aaa: "日", aaaa: "日曜日", ddd: "Sun", dddd: "Sunday" },
  1: { aaa: "月", aaaa: "月曜日", ddd: "Mon", dddd: "Monday" },
  2: { aaa: "火", aaaa: "火曜日", ddd: "Tue", dddd: "Tuesday" },
  3: { aaa: "水", aaaa: "水曜日", ddd: "Wed", dddd: "Wednesday" },
  4: { aaa: "木", aaaa: "木曜日", ddd: "Thu", dddd: "Thursday" },
  5: { aaa: "金", aaaa: "金曜日", ddd: "Fri", dddd: "Friday" },
  6: { aaa: "土", aaaa: "土曜日", ddd: "Sat", dddd: "Saturday" },
};

class StkDateUtils {
  public DefaultSeparator1 = "/";
  public DefaultSeparator2 = " ";
  public DefaultSeparator3 = ":";
  /** 関数定義 **/
  createDate = (date?: Date | string | number) => {
    if (!date) {
      return undefined;
    }
    const result = new Date(date);

    if (isNaN(result.getTime())) {
      return undefined;
    }

    return result;
  };
  createDateOr = (date?: Date | string | number, ifNan?: Date) => {
    return this.createDate(date) || ifNan || new Date();
  };
  /**
   * 時刻切り捨て
   * @param {Date | string} date
   */
  truncateDate = (date?: Date) => {
    const d = date || new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  addDate = (date: Date, diffD: number) => {
    const d = this.createDateOr(date);
    d.setDate(d.getDate() + diffD);
    return d;
  };
  addMonth = (date: Date, diffM: number) => {
    const d = this.createDateOr(date);
    d.setMonth(d.getMonth() + diffM);
    return d;
  };
  addYear = (date: Date, diffY: number) => {
    const d = this.createDateOr(date);
    d.setFullYear(d.getFullYear() + diffY);
    return d;
  };

  /**
   * Excel準拠で曜日フォーマット
   * @param {Date | string} date
   * @param {string} format フォーマット
   */
  getDayOfWeek = (date: Date | string | undefined, format = "dddd") => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }
    return days[tmpDate.getDay()][format];
  };

  /**
   * YYYYMMDD形式にフォーマット
   * @param {Date | string} date
   * @param {string} Separator セパレータ
   */
  formatToYYYYMMDD = (date: Date | string | undefined, Separator1 = this.DefaultSeparator1) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }

    const y = tmpDate.getFullYear().toString();
    const m = ("0" + (tmpDate.getMonth() + 1)).slice(-2);
    const d = ("0" + tmpDate.getDate()).slice(-2);

    return y + Separator1 + m + Separator1 + d;
  };

  /**
   * YYYYMM形式にフォーマット
   * @param {Date | string} date
   * @param {string} Separator セパレータ
   */
  formatToYYYYMM = (date: Date | string | undefined, Separator1 = this.DefaultSeparator1) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }
    if (!Separator1) {
      Separator1 = "";
    }
    const y = tmpDate.getFullYear().toString();
    const m = ("0" + (tmpDate.getMonth() + 1)).slice(-2);
    return y + Separator1 + m;
  };

  /**
   * HHMMSS形式にフォーマット
   * @param {Date | string} date
   * @param {string} Separator3 セパレータ
   */
  formatToHHMMSS = (date: Date | string | undefined, Separator3 = this.DefaultSeparator3) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }
    if (!Separator3) {
      Separator3 = "";
    }
    const h = tmpDate.getHours();
    const m = tmpDate.getMinutes();
    const s = tmpDate.getSeconds();

    return ("0" + h).slice(-2) + Separator3 + ("0" + m).slice(-2) + Separator3 + ("0" + s).slice(-2);
  };

  /**
   * HHMM形式にフォーマット
   * @param {Date | string} date
   * @param {string} Separator3 セパレータ
   */
  formatToHHMM = (date: Date | string | undefined, Separator3 = this.DefaultSeparator3) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }
    if (!Separator3) {
      Separator3 = "";
    }
    const h = ("0" + tmpDate.getHours()).slice(-2);
    const m = ("0" + tmpDate.getMinutes()).slice(-2);

    return h + Separator3 + m;
  };

  /**
   * YYYYMMDD_HHMM形式にフォーマット
   * @param {Date | string} date
   * @param {string} Separator1 日付のセパレータ
   * @param {string} Separator2 日付時刻間のセパレータ
   * @param {string} Separator3 時刻のセパレータ
   */
  formatToYYYYMMDD_HHMM = (
    date: Date | string | undefined,
    Separator1 = this.DefaultSeparator1,
    Separator2 = this.DefaultSeparator2,
    Separator3 = this.DefaultSeparator3
  ) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }

    return this.formatToYYYYMMDD(tmpDate, Separator1) + Separator2 + this.formatToHHMM(tmpDate, Separator3);
  };

  /**
   * YYYYMMDD_HHMM形式にフォーマット
   * @param {Date | string | undefined} date
   * @param {string} Separator1 日付のセパレータ
   * @param {string} Separator2 日付時刻間のセパレータ
   * @param {string} Separator3 時刻のセパレータ
   */
  formatToYYYYMMDD_HHMMSS = (
    date: Date | string | undefined,
    Separator1 = this.DefaultSeparator1,
    Separator2 = this.DefaultSeparator2,
    Separator3 = this.DefaultSeparator3
  ) => {
    const tmpDate = this.createDate(date);
    if (!tmpDate) {
      return "";
    }
    return this.formatToYYYYMMDD(tmpDate, Separator1) + Separator2 + this.formatToHHMMSS(tmpDate, Separator3);
  };
}
// 拡張メソッドの定義
// Note: コンパイル時にinterfaceは消えるので、コンパイラに指示するためだけの記述
declare global {
  interface Date {
    truncateDate(): Date;
    getCloneOr(): Date;
    addDate(diffD: number): Date;
    addMonth(diffM: number): Date;
    addYear(diffY: number): Date;
    getDayOfWeek(format?: string): string;
    formatToYYYYMM(Separator1?: string): string;
    formatToYYYYMMDD(Separator1?: string): string;
    formatToYYYYMMDD_HHMM(Separator1?: string, Separator2?: string, Separator3?: string): string;
    formatToYYYYMMDD_HHMMSS(Separator1?: string, Separator2?: string, Separator3?: string): string;
    formatToHHMM(Separator3?: string): string;
    formatToHHMMSS(Separator3?: string): string;
  }
}

const hoge = new StkDateUtils();

// 拡張メソッドの実装側
// Note: ただのJavaScriptのprototype
Date.prototype.truncateDate = function () {
  return hoge.truncateDate(this);
};
Date.prototype.getCloneOr = function (ifNan?: Date) {
  return hoge.createDateOr(this, ifNan);
};
Date.prototype.addDate = function (diffD: number) {
  return hoge.addDate(this, diffD);
};
Date.prototype.addMonth = function (diffM: number) {
  return hoge.addDate(this, diffM);
};
Date.prototype.addYear = function (diffY: number) {
  return hoge.addDate(this, diffY);
};

Date.prototype.getDayOfWeek = function (format = "dddd") {
  return hoge.getDayOfWeek(this, format);
};
Date.prototype.formatToYYYYMM = function (Separator1?: string) {
  return hoge.formatToYYYYMM(this, Separator1);
};
Date.prototype.formatToYYYYMMDD = function (Separator1?: string) {
  return hoge.formatToYYYYMMDD(this, Separator1);
};
Date.prototype.formatToYYYYMMDD_HHMM = function (Separator1?: string, Separator2?: string, Separator3?: string) {
  return hoge.formatToYYYYMMDD_HHMM(this, Separator1, Separator2, Separator3);
};
Date.prototype.formatToYYYYMMDD_HHMMSS = function (Separator1?: string, Separator2?: string, Separator3?: string) {
  return hoge.formatToYYYYMMDD_HHMMSS(this, Separator1, Separator2, Separator3);
};
Date.prototype.formatToHHMM = function (Separator3?: string) {
  return hoge.formatToHHMM(this, Separator3);
};
Date.prototype.formatToHHMMSS = function (Separator3?: string) {
  return hoge.formatToHHMMSS(this, Separator3);
};
export default hoge;
