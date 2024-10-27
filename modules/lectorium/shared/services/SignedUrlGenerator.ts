
export class SignedUrlGenerator {
  constructor(
    private _baseUrl: string
  ) { }

  /**
   * Generates a signed URL for a media item.
   */
  public async signUrl(
    object_key: string
  ): Promise<string> {
    // Make a POST request to the server to sign the URL.
    const payload = {
      object_key: object_key,
      expiration: 60 * 60 * 8 // 8 hours
    }
    const data = await fetch(
      this._baseUrl + "/signed-url-generator/sign-url",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
    return (await data.json()).signed_url
  }
}
