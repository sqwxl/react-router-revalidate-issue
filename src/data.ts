import {merge} from "lodash";

export type PostObj = { some: string };

const baseHeaders = {
  "x-custom-header": "anything"
}

export class BackendClient {
  baseOptions: RequestInit = {
    headers: baseHeaders,
  }

  async fetch(path: string, options?: RequestInit) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return await fetch(path, merge(this.baseOptions, options))
  }

  async getCatFact() {
    const res = await this.fetch('https://catfact.ninja/fact');
    const { fact } = (await res.json()) as { fact: string };

    return fact;
  }

  async failPOST(data: PostObj) {
    return await this.fetch('non-existent', {
      method: 'post',
      body: JSON.stringify(data),
    });
    // return new Response(null, {
    //   status: 500,
    //   headers: {
    //     'content-type': 'application/json',
    //     'access-control-allow-origin': '*',
    //   },
    // });
  }
}

export const client = new BackendClient();
