class SlackPostQuestionService {
  private _token: string;
  private _triggerId: string;
  private _postUrl: string;

  constructor({
    token,
    triggerId,
    postUrl,
  }: {
    token: string;
    triggerId: string;
    postUrl: string;
  }) {
    this._token = token;
    this._triggerId = triggerId;
    this._postUrl = postUrl;
  }

  public post(questionBlocks: any): Record<string, any> {
    const payload = {
      token: this._token,
      trigger_id: this._triggerId,
      view: JSON.stringify(questionBlocks),
    };

    UrlFetchApp.fetch(this._postUrl, {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: `Bearer ${this._token}` },
      payload: JSON.stringify(payload),
    });

    return ContentService.createTextOutput();
  }
}

export default SlackPostQuestionService;
