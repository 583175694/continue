import os from "os";

export class Telemetry {
  // Set to undefined whenever telemetry is disabled
  static client: any = undefined;
  static uniqueId: string = "NOT_UNIQUE";
  static os: string | undefined = undefined;
  static extensionVersion: string | undefined = undefined;

  static async capture(event: string, properties: { [key: string]: any }) {
    // TODO 埋点
    console.log("埋点事件", event, properties);
  }

  static shutdownPosthogClient() {
    // TODO 埋点停止
  }

  static async setup(
    allow: boolean,
    uniqueId: string,
    extensionVersion: string,
  ) {
    // TODO 埋点参数
    console.log("埋点参数", allow, uniqueId, extensionVersion);
  }
}
