export class Log {
  // deno-lint-ignore no-explicit-any
  static debug(...data: any[]) {
    console.log(data);
  }

  // deno-lint-ignore no-explicit-any
  static error(...data: any[]) {
    console.error(data);
  }
}
