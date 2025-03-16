export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * お客さんが注文してレジ精算したあと、呼び出しベルの一式を吐き出すための関数
 * なにかのアンチパターンにひっかかっていたり、すでに公式であったりするかもしれない
 * @returns 呼び出しベルの一式
 */
export const createPromiseSweet = <T>() => {
  // ご飯ができたら店員さんがtにご飯を詰め込んで実行するための関数
  let resolve: (t: T) => void = () => {};
  // トラブルが起きたら店員さんが詫び状を入れて実行するための関数
  let reject: (reason?: unknown) => void = () => {};

  // お客さんに渡される呼び出しベル。awaitするもしくはメソッドチェーンによって、ご飯か詫び状が手に入る
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  // 一式吐き出されるので呼び出しベルのみお客さんに渡す。
  // 店員さんはどちらかの関数を必ず実行しなければならない。
  return { promise, resolve, reject };
};

const example = async () => {
  //カレーを注文
  const curryPromiseSweet = createPromiseSweet<string>();

  // 料理開始
  setTimeout(() => {
    const score = Math.random();
    if (score > 0.8) {
      curryPromiseSweet.resolve("サーロインステーキカレー");
    }
    if (score > 0.6) {
      curryPromiseSweet.resolve("エビクリームカレー");
    }
    if (score > 0.4) {
      curryPromiseSweet.resolve("シンプル野菜カレー");
    }
    if (score > 0.2) {
      curryPromiseSweet.resolve("フィッシュヘッドカレー");
    }

    curryPromiseSweet.reject("怪しい色のカレー");
  }, 1234);

  try {
    // 料理完了を待機
    const curry = await curryPromiseSweet.promise;
    //カレーを入手
    console.log("おいしいカレー。", curry);
  } catch (error) {
    //失敗しちゃった……
    console.log("これは食べられない。", error);
  }
};
example();
