const HttpRequest = window.XMLHttpRequest;
const originalOpen = HttpRequest.prototype.open;
const originalSend = HttpRequest.prototype.send;

// 定义一个数组，包含你想要阻止发送的请求的URL
const whiteUrls = [""];

// @ts-ignore
HttpRequest.prototype.open = function (method, url, async, user, password) {
  console.log(`准备发起请求到: ${url}`);
  let _url = url;

  if (typeof _url === "string") {
    _url = new URL(_url);
  }

  // 检查URL是否在阻止列表中
  // @ts-ignore
  if (!whiteUrls.includes(_url.origin)) {
    console.log("请求被阻止", _url.origin);
    return;
  }

  // 如果不是阻止的URL，调用原始的open方法
  originalOpen.apply(this, arguments);
};

HttpRequest.prototype.send = function (data) {
  console.log("尝试发送请求");
  const xhr = this;

  // 检查open是否已经被调用
  if (!xhr.readyState) {
    console.error("open方法未被调用，无法发送请求");
    return;
  }

  // 检查URL是否在阻止列表中
  //   if (whiteUrls.includes(xhr.url)) {
  //     console.log("请求被阻止，不会发送");
  //     // 可以在这里执行其他操作，例如调用回调函数等
  //     return;
  //   }

  // 如果不是阻止的URL，调用原始的send方法
  originalSend.apply(this, arguments);
};

// 保存原始的fetch函数
const originalFetch = window.fetch;

// 创建一个包装函数来拦截fetch请求
window.fetch = function (...args) {
  const url = args[0];
  const options = args.length > 1 ? args[1] : {};

  console.log(`fetch请求准备发送到: ${url}`);

  // 检查URL是否在阻止列表中
  // @ts-ignore
  if (!whiteUrls.includes(url)) {
    console.log("fetch请求被阻止");
    // 如果是阻止的URL，返回一个已拒绝的Promise
    return Promise.reject(new Error("fetch请求被阻止"));
  }

  // 如果不是阻止的URL，调用原始的fetch函数
  return originalFetch.apply(this, args);
};

export {};
