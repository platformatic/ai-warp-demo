import { type FastifyReply, type FastifyPluginAsync } from 'fastify'
import { type GetHeadersOptions } from '@platformatic/client'

declare namespace ai {
  export type Ai = {
    prompt(req?: PromptRequest): Promise<PromptResponses>;
    stream(req?: StreamRequest): Promise<StreamResponses>;
  }
  export interface AiOptions {
    url: string
  }
  export const ai: AiPlugin;
  export { ai as default };
  export interface FullResponse<T, U extends number> {
    'statusCode': U;
    'headers': Record<string, string>;
    'body': T;
  }

  export type PromptRequest = {
    'prompt': string;
    'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
  }

  export type PromptResponseOK = {
    'response': string;
  }
  export type PromptdefaultResponse = {
    'code'?: string;
    'message': string;
  }
  export type PromptResponses =
    PromptResponseOK
    | PromptdefaultResponse

  export type StreamRequest = {
    'prompt': string;
    'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
  }

  export type StreamResponseOK = unknown
  export type StreamResponses =
    FullResponse<StreamResponseOK, 200>

}

type AiPlugin = FastifyPluginAsync<NonNullable<ai.AiOptions>>

declare module 'fastify' {
  interface ConfigureAi {
    getHeaders(req: FastifyRequest, reply: FastifyReply, options: GetHeadersOptions): Promise<Record<string,string>>;
  }
  interface FastifyInstance {
    configureAi(opts: ConfigureAi): unknown
  }

  interface FastifyRequest {
    'ai': ai.Ai;
  }
}

declare function ai(...params: Parameters<AiPlugin>): ReturnType<AiPlugin>;
export = ai;
