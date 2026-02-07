export class UrlParams {
  public readonly openMode: "Normal" | "CardSearch";
  constructor() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "search") {
      this.openMode = "CardSearch";
    } else {
      this.openMode = "Normal";
    }
  }
}
