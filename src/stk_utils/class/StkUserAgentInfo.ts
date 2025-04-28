// eslint-disable-next-line @typescript-eslint/no-unused-vars
const browserNames = ["Internet Explorer", "Edge", "Google Chrome", "Safari", "Mozilla Firefox", "Opera", "Unknown Browser"] as const;
type TBrowserName = (typeof browserNames)[number];
type BrowserInfo = { name: TBrowserName; key: string; seq: number };

const browserInfos: BrowserInfo[] = [
  { seq: 10, name: "Internet Explorer", key: "msie" },
  { seq: 20, name: "Internet Explorer", key: "trident" },
  { seq: 30, name: "Edge", key: "edge" },
  { seq: 40, name: "Google Chrome", key: "chrome" },
  { seq: 50, name: "Safari", key: "safari" },
  { seq: 60, name: "Mozilla Firefox", key: "firefox" },
  { seq: 70, name: "Opera", key: "opera" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const osNames = ["Microsoft Windows", "iOS", "Android", "macOS", "Unknown OS"] as const;
type TOsName = (typeof osNames)[number];

const osInfos: { name: TOsName; key: string; seq: number }[] = [
  { seq: 10, name: "Microsoft Windows", key: "windows nt" },
  { seq: 20, name: "Android", key: "android" },
  { seq: 30, name: "iOS", key: "iphone" },
  { seq: 40, name: "iOS", key: "ipad" },
  { seq: 50, name: "macOS", key: "mac os x" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mobileTerminalTypeNames = ["Smart Phone", "Tablet Device"] as const;
type TMobileTerminalTypeName = (typeof mobileTerminalTypeNames)[number];

const userAgent = window.navigator.userAgent.toLowerCase();
const browserName: TBrowserName = browserInfos.find((info) => userAgent.indexOf(info.key) !== -1)?.name ?? "Unknown Browser";
const osName: TOsName = osInfos.find((info) => userAgent.indexOf(info.key) !== -1)?.name ?? "Unknown OS";

const isSmartPhone = userAgent.indexOf("iphone") !== -1 || (osName === "Android" && userAgent.indexOf("mobile") !== -1);
const isTabletDevice = userAgent.indexOf("ipad") !== -1 || (osName === "Android" && !isSmartPhone);

const terminalTypeName: TMobileTerminalTypeName | "PC" = isSmartPhone ? "Smart Phone" : isTabletDevice ? "Tablet Device" : "PC";
export const userAgentInfo = {
  userAgent,
  osName,
  browserName,
  mobileTerminalTypeName: terminalTypeName,
  text: `${terminalTypeName} ${osName} ${browserName}`,
};
