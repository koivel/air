export class AuthApiService {
  public static async getToken(auth0): Promise<string> {
    let token: string;
    try {
      token = await auth0.getAccessTokenSilently({
        audience: 'https://api.koivel.com',
      });
    } catch (e) {
      token = await auth0.getAccessTokenWithPopup({
        audience: 'https://api.koivel.com',
      });
    }
    return token;
  }
}
