declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface ExtractRawTextOptions {
    buffer?: Buffer;
    path?: string;
    arrayBuffer?: ArrayBuffer;
  }

  export function extractRawText(options: ExtractRawTextOptions): Promise<MammothResult>;
  export function convertToHtml(options: ExtractRawTextOptions): Promise<MammothResult>;
}
