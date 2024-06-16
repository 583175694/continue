import { ChatMessage, LLMFullCompletionOptions, PromptLog } from "core";
import { Message } from "core/util/messenger";
import {
  ReverseWebviewProtocol,
  WebviewProtocol,
} from "core/web/webviewProtocol";
import { v4 as uuidv4 } from "uuid";
import "vscode-webview";
import { getLocalStorage } from "./localStorage";
interface vscode {
  postMessage(message: any): vscode;
}

declare const vscode: any;

function _postToIde(messageType: string, data: any, messageId?: string) {
  // 检查是否存在vscode对象，如果不存在则尝试使用IntelliJ IDEA的API发送消息
  if (typeof vscode === "undefined") {
    if (localStorage.getItem("ide") === "jetbrains") {
      if (window.postIntellijMessage === undefined) {
        console.log(
          "Unable to send message: postIntellijMessage is undefined. ",
          messageType,
          data,
        );
        throw new Error("postIntellijMessage is undefined");
      }
      messageId = messageId ?? uuidv4();
      window.postIntellijMessage?.(messageType, data, messageId);
      return;
    } else {
      console.log(
        "Unable to send message: vscode is undefined. ",
        messageType,
        data,
      );
      return;
    }
  }
  // 创建一个消息对象
  const msg: Message = {
    messageId: messageId ?? uuidv4(),
    messageType,
    data,
  };
  // 使用vscode的API发送消息
  vscode.postMessage(msg);
}

export function postToIde<T extends keyof WebviewProtocol>(
  messageType: T,
  data: WebviewProtocol[T][0],
  messageId?: string,
  attempt: number = 0,
) {
  // 尝试发送消息到IDE
  try {
    _postToIde(messageType, data, messageId);
  } catch (error) {
    if (attempt < 5) {
      // 如果发送失败，则重试，每次尝试间隔时间加倍
      console.log(`Attempt ${attempt} failed. Retrying...`);
      setTimeout(
        () => postToIde(messageType, data, messageId, attempt + 1),
        Math.pow(2, attempt) * 1000,
      );
    } else {
      // 如果达到最大尝试次数，则输出错误信息
      console.error("Max attempts reached. Message could not be sent.", error);
    }
  }
}

export function respondToIde<T extends keyof ReverseWebviewProtocol>(
  messageType: T,
  data: ReverseWebviewProtocol[T][1],
  messageId: string,
) {
  _postToIde(messageType, data, messageId);
}

function safeParseResponse(data: any) {
  let responseData = data ?? null;
  try {
    responseData = JSON.parse(responseData);
  } catch {}
  return responseData;
}

export async function ideRequest<T extends keyof WebviewProtocol>(
  messageType: T,
  data: WebviewProtocol[T][0],
): Promise<WebviewProtocol[T][1]> {
  const messageId = uuidv4();

  return new Promise((resolve) => {
    const handler = (event: any) => {
      if (event.data.messageId === messageId) {
        window.removeEventListener("message", handler);
        resolve(safeParseResponse(event.data.data));
      }
    };
    window.addEventListener("message", handler);

    postToIde(messageType, data, messageId);
  }) as any;
}

export async function* ideStreamRequest<T extends keyof WebviewProtocol>(
  messageType: T,
  data: WebviewProtocol[T][0],
  cancelToken?: AbortSignal,
): WebviewProtocol[T][1] {
  // 生成一个唯一的消息ID
  const messageId = uuidv4();

  // 发送请求到IDE
  postToIde(messageType, data, messageId);

  // 初始化缓冲区和索引
  let buffer = "";
  let index = 0;
  let done = false;
  let returnVal = undefined;

  // 创建一个处理器来处理从IDE返回的消息
  const handler = (event: { data: Message }) => {
    if (event.data.messageId === messageId) {
      const responseData = safeParseResponse(event.data.data);
      if (responseData.done) {
        // 如果响应表示已完成，则删除处理器并设置done为true
        window.removeEventListener("message", handler);
        done = true;
        returnVal = responseData;
      } else {
        // 否则将响应内容添加到缓冲区中
        buffer += responseData.content;
      }
    }
  };
  window.addEventListener("message", handler);

  // 如果提供了取消令牌，则在取消时通知IDE
  cancelToken?.addEventListener("abort", () => {
    postToIde("abort", undefined, messageId);
  });

  while (!done) {
    if (buffer.length > index) {
      const chunk = buffer.slice(index);
      index = buffer.length;
      yield chunk;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (buffer.length > index) {
    const chunk = buffer.slice(index);
    index = buffer.length;
    yield chunk;
  }

  return returnVal;
}

export async function* llmStreamChat(
  modelTitle: string,
  cancelToken: AbortSignal | undefined,
  messages: ChatMessage[],
  options: LLMFullCompletionOptions = {},
): AsyncGenerator<ChatMessage, PromptLog> {
  const gen = ideStreamRequest(
    "llm/streamChat",
    {
      messages,
      title: modelTitle,
      completionOptions: options,
    },
    cancelToken,
  );

  let next = await gen.next();
  while (!next.done) {
    yield { role: "user", content: next.value };
    next = await gen.next();
  }

  if (next.value.error) {
    throw new Error(next.value.error);
  }

  return {
    prompt: next.value.content?.prompt,
    completion: next.value.content?.completion,
    completionOptions: next.value.content?.completionOptions,
  };
}

export function appendText(text: string) {
  const div = document.createElement("div");
  div.innerText = text;
  document.body.appendChild(div);
}

export function isJetBrains() {
  return localStorage.getItem("ide") === "jetbrains";
}

export function isPrerelease() {
  const extensionVersion = getLocalStorage("extensionVersion");
  if (!extensionVersion) {
    console.warn(
      `Could not find extension version in local storage, assuming it's a prerelease`,
    );
    return true;
  }
  const minor = parseInt(extensionVersion.split(".")[1], 10);
  if (minor % 2 !== 0) {
    return true;
  }
  return false;
}
