/* eslint-disable @typescript-eslint/no-empty-function */
export default class AppsMock {
  public async getAppSettings() {
    return {
      slugifyLinks: true,
    }
  }
}
