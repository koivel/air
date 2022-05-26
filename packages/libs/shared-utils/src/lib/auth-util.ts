import { Logger } from "./logger";

export class AuthUtil {
  public static assertPermsAllow(
    allowedPerms: string[],
    currentPerms: string[],
    params: Record<string, string> = {}
  ): void {
    const paramEntries = Object.entries(params);
    const currentPermsWithParams: string[] = currentPerms.map((x) => {
      paramEntries.forEach((p) => (x = x.replace(p[0], p[1])));
      return x;
    });
    const allowed: boolean = currentPermsWithParams.some((x) =>
      allowedPerms.includes(x)
    );
    Logger.info(
      'assertPermsAllow : %j : %j : %j : %j',
      allowedPerms,
      currentPerms,
      currentPermsWithParams,
      paramEntries
    );
    if (!allowed) {
      throw new Error('Missing permissions.');
    }
  }
}
