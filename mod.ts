// @deno-types="./pkg/ammonia_wasm.d.ts"
import {
  clean as cleanWASM,
  clean_text as cleanTextWASM,
  default as initWASM,
} from "./pkg/ammonia_wasm.js";
import { source } from "./wasm.js";

let inited: true | Promise<true> | undefined;

export async function init(): Promise<void> {
  if (inited !== undefined) {
    await inited;
  }
  inited = initWASM(source)
    .then(() => true);
  await inited;
  inited = true;
}

/**
 * Clean HTML with a conservative set of defaults.
 *
 *  * [tags](https://docs.rs/ammonia/3.1.2/ammonia/https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults)
 *  * [attributes on specific tags](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-1)
 *  * [attributes on all tags](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-2)
 *  * [url schemes](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-3)
 *  * [relative URLs are passed through, unchanged, by default](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-4)
 *  * [links are marked `noopener noreferrer` by default](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-5)
 *  * [all `class=""` settings are blocked by default](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-6)
 *  * [comments are stripped by default](https://docs.rs/ammonia/3.1.2/ammonia/struct.Builder.html#defaults-7)
 *
 *  [opener]: https://mathiasbynens.github.io/rel-noopener/
 *  [referrer]: https://en.wikipedia.org/wiki/HTTP_referer
 */
export function clean(src: string): string {
  return cleanWASM(src);
}

/**
 * Turn an arbitrary string into unformatted HTML.
 *
 * This function is roughly equivalent to PHP's `htmlspecialchars` and
 * `htmlentities`. It is as strict as possible, encoding every character that
 * has special meaning to the HTML parser.
 *
 * # Warnings
 *
 * This function cannot be used to package strings into a `<script>` or
 * `<style>` tag; you need a JavaScript or CSS escaper to do that.
 *
 * `<textarea>` tags will strip the first newline, if present, even if that
 * newline is encoded. If you want to build an editor that works the way most
 * folks expect them to, you should put a newline at the beginning of the tag.
 *
 * It also does not make user text safe for HTML attribute microsyntaxes such
 * as `class` or `id`. Only use this function for places where HTML accepts
 * unrestricted text such as `title` attributes and paragraph contents.
 */
export function cleanText(src: string): string {
  return cleanTextWASM(src);
}
