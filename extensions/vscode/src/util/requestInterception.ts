import http from "node:http";
import https from "node:https";

// 保存原始的http.request方法
const originalHttpRequest = http.request;
const originalHttpsRequest = https.request;

// 定义一个数组，包含你想要允许发送的请求的URL
const whiteUrls = ["10.107.127.19"];

// 封装 http.request
// @ts-ignore
http.request = (url, options, callback) => {
  if (typeof url === "string") {
    url = new URL(url);
  }
  console.log("Intercepted request https:", url.host || url.hostname);

  // 检查URL是否在白名单中
  const isAllowed = whiteUrls.some((allowedUrl) =>
    (url.host || url.hostname).startsWith(allowedUrl),
  );

  if (!isAllowed) {
    console.log(`URL not allowed: ${url.host || url.hostname}`);
    return new Error(`URL not allowed: ${url.host || url.hostname}`);
  }

  // 调用原始的 http.request
  // @ts-ignore
  return originalHttpRequest.call(http, url, options, callback);
};

// 封装 http.request
// @ts-ignore
https.request = (url, options, callback) => {
  if (typeof url === "string") {
    url = new URL(url);
  }
  console.log(`URL not allowed: ${url.host || url.hostname}`);
  console.log("Intercepted request https:", url.host || url.hostname);

  // 检查URL是否在白名单中
  const isAllowed = whiteUrls.some((allowedUrl) =>
    (url.host || url.hostname).startsWith(allowedUrl),
  );

  if (!isAllowed) {
    return new Error(`URL not allowed: ${url.host || url.hostname}`);
  }

  // 调用原始的 http.request
  // @ts-ignore
  return originalHttpsRequest.call(https, url, options, callback);
};
