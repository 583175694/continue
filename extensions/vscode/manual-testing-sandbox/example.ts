import { factorial, repeat } from "./factorial";

const fib = (n) => (n <= 1 ? n : fib(n - 2) + fib(n - 1));
console.log(repeat(5, "a"));
console.log(factorial(3));

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Throttle function
const throttle = (func, wait) => {
  let previous = 0;
  return function (...args) {
    const now = new Date();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

// 节流函数
const throttle = (func, wait) => {
  let previous = 0;
  return function (...args) {
    const now = new Date();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

// 生成一个防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// 节流函数
const throttle = (func, wait) => {
  let previous = 0;
  return function (...args) {
    const now = new Date();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

// 节流函数单元测试
const testThrottle;
