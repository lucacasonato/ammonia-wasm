/* tslint:disable */
/* eslint-disable */
/**
* @param {string} src
* @returns {string}
*/
export function clean(src: string): string;
/**
* @param {string} src
* @returns {string}
*/
export function clean_text(src: string): string;
/**
*/
export class AmmoniaBuilder {
  free(): void;
/**
* @param {any} raw
*/
  constructor(raw: any);
/**
* @param {string} src
* @returns {string}
*/
  clean(src: string): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly clean: (a: number, b: number, c: number) => void;
  readonly clean_text: (a: number, b: number, c: number) => void;
  readonly __wbg_ammoniabuilder_free: (a: number) => void;
  readonly ammoniabuilder_new: (a: number) => number;
  readonly ammoniabuilder_clean: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
