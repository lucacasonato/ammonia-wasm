// @deno-types="./pkg/ammonia_wasm.d.ts"
import {
  AmmoniaBuilder as AmmoniaBuilderWASM,
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

export class AmmoniaBuilder {
  /**
   * The tags that are allowed.
   *
   * # Defaults
   *
   * ```text
   * a, abbr, acronym, area, article, aside, b, bdi,
   * bdo, blockquote, br, caption, center, cite, code,
   * col, colgroup, data, dd, del, details, dfn, div,
   * dl, dt, em, figcaption, figure, footer, h1, h2,
   * h3, h4, h5, h6, header, hgroup, hr, i, img,
   * ins, kbd, kbd, li, map, mark, nav, ol, p, pre,
   * q, rp, rt, rtc, ruby, s, samp, small, span,
   * strike, strong, sub, summary, sup, table, tbody,
   * td, th, thead, time, tr, tt, u, ul, var, wbr
   * ```
   */
  // deno-fmt-ignore
  tags: Set<string> = new Set([
    "a", "abbr", "acronym", "area", "article", "aside", "b", "bdi",
    "bdo", "blockquote", "br", "caption", "center", "cite", "code",
    "col", "colgroup", "data", "dd", "del", "details", "dfn", "div",
    "dl", "dt", "em", "figcaption", "figure", "footer", "h1", "h2",
    "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "img",
    "ins", "kbd", "kbd", "li", "map", "mark", "nav", "ol", "p", "pre",
    "q", "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span",
    "strike", "strong", "sub", "summary", "sup", "table", "tbody",
    "td", "th", "thead", "time", "tr", "tt", "u", "ul", "var", "wbr"
  ]);

  /**
   * The tags whose contents will be completely removed from the output.
   *
   * Adding tags which are whitelisted in tags or tagAttributes will cause a
   * panic.
   *
   * # Defaults
   *
   * ```text
   * script, style
   * ```
   */
  cleanContentTags: Set<string> = new Set(["script", "style"]);

  /**
   * The HTML attributes that are allowed on specific tags.
   *
   * The value is structured as a map from tag names to a set of attribute names.
   *
   * If a tag is not itself whitelisted, adding entries to this map will do
   * nothing.
   *
   * # Defaults
   *
   * ```text
   * a =>
   *     href, hreflang
   * bdo =>
   *     dir
   * blockquote =>
   *     cite
   * col =>
   *     align, char, charoff, span
   * colgroup =>
   *     align, char, charoff, span
   * del =>
   *     cite, datetime
   * hr =>
   *     align, size, width
   * img =>
   *     align, alt, height, src, width
   * ins =>
   *     cite, datetime
   * ol =>
   *     start
   * q =>
   *     cite
   * table =>
   *     align, char, charoff, summary
   * tbody =>
   *     align, char, charoff
   * td =>
   *     align, char, charoff, colspan, headers, rowspan
   * tfoot =>
   *     align, char, charoff
   * th =>
   *     align, char, charoff, colspan, headers, rowspan, scope
   * thead =>
   *     align, char, charoff
   * tr =>
   *     align, char, charoff
   * ```
   */
  tagAttributes: Map<string, Set<string>> = new Map([
    ["a", new Set(["href", "hreflang"])],
    ["bdo", new Set(["dir"])],
    ["blockquote", new Set(["cite"])],
    ["col", new Set(["align", "char", "charoff", "span"])],
    ["colgroup", new Set(["align", "char", "charoff", "span"])],
    ["del", new Set(["cite", "datetime"])],
    ["hr", new Set(["align", "size", "width"])],
    ["img", new Set(["align", "alt", "height", "src", "width"])],
    ["ins", new Set(["cite", "datetime"])],
    ["ol", new Set(["start"])],
    ["q", new Set(["cite"])],
    ["table", new Set(["align", "char", "charoff", "summary"])],
    ["tbody", new Set(["align", "char", "charoff"])],
    [
      "td",
      new Set(["align", "char", "charoff", "colspan", "headers", "rowspan"]),
    ],
    ["tfoot", new Set(["align", "char", "charoff"])],
    [
      "th",
      new Set(["align", "char", "charoff", "colspan", "headers", "rowspan"]),
    ],
    ["thead", new Set(["align", "char", "charoff"])],
    ["tr", new Set(["align", "char", "charoff"])],
  ]);

  /**
   * Sets the values of HTML attributes that are allowed on specific tags.
   *
   * The value is structured as a map from tag names to a map from attribute
   * names to a set of attribute values.
   *
   * If a tag is not itself whitelisted, adding entries to this map will do nothing.
   *
   * # Defaults
   *
   * None
   */
  tagAttributeValues: Map<string, Map<string, Set<string>>> = new Map([]);

  /**
   * Sets the values of HTML attributes that are to be set on specific tags.
   *
   * The value is structured as a map from tag names to a map from attribute
   * names to an attribute value.
   *
   * If a tag is not itself whitelisted, adding entries to this map will do
   * nothing.
   *
   * # Defaults
   *
   * None
   */
  setTagAttributeValues: Map<string, Map<string, Set<string>>> = new Map([]);

  /**
   * Sets the attributes that are allowed on any tag.
   *
   * # Defaults
   *
   * ```text
   * lang, title
   * ````
   */
  genericAttributes: Set<string> = new Set(["lang", "title"]);

  /**
   * Sets the URL schemes permitted on `href` and `src` attributes.
   *
   * # Defaults
   *
   * ```text
   * bitcoin, ftp, ftps, geo, http, https, im, irc,
   * ircs, magnet, mailto, mms, mx, news, nntp,
   * openpgp4fpr, sip, sms, smsto, ssh, tel, url,
   * webcal, wtai, xmpp
   * ```
   */
  // deno-fmt-ignore
  urlSchemes: Set<string> = new Set([
    "bitcoin", "ftp", "ftps", "geo", "http", "https", "im", "irc", "ircs",
    "magnet", "mailto", "mms", "mx", "news", "nntp", "openpgp4fpr", "sip",
    "sms", "smsto", "ssh", "tel", "url", "webcal", "wtai", "xmpp",
  ]);

  /**
   * Configures a `rel` attribute that will be added on links.
   *
   * If `rel` is in the generic or tag attributes, this must be set to `null`.
   * Common `rel` values to include:
   *
   * * `noopener`: This prevents [a particular type of XSS attack], and should
   *   usually be turned on for untrusted HTML.
   * * `noreferrer`: This prevents the browser from [sending the source URL]
   *   to the website that is linked to.
   * * `nofollow`: This prevents search engines from [using this link for
   *   ranking], which disincentivizes spammers.
   *
   * To turn on rel-insertion, call this function with a space-separated list.
   * Ammonia does not parse rel-attributes; it just puts the given string into
   * the attribute directly.
   *
   * [a particular type of XSS attack]: https://mathiasbynens.github.io/rel-noopener/
   * [sending the source URL]: https://en.wikipedia.org/wiki/HTTP_referer
   * [using this link for ranking]: https://en.wikipedia.org/wiki/Nofollow
   *
   * # Defaults
   *
   * `"noopener noreferrer"`
   */
  linkRel: string | null = "noopener noreferrer";

  /**
   * Sets the CSS classes that are allowed on specific tags.
   *
   * The values is structured as a map from tag names to a set of class names.
   *
   * If the `class` attribute is itself whitelisted for a tag, then adding
   * entries to this map will cause a panic.
   *
   * # Defaults
   *
   * The set of allowed classes is empty by default.
   */
  allowedClasses: Map<string, Set<string>> = new Map([]);

  /**
   * Configures the handling of HTML comments.
   *
   * If this option is false, comments will be preserved.
   *
   * # Defaults
   *
   * `true`
   */
  stripComments = true;

  /**
   * Prefixes all "id" attribute values with a given string.  Note that the tag
   * and attribute themselves must still be whitelisted.
   *
   * # Defaults
   *
   * `null`
   */
  idPrefix: string | null = null;

  /**
   * Sets the prefix of attributes that are allowed on any tag.
   *
   * # Defaults
   *
   * `null`
   */
  genericAttributePrefixes: Set<string> | null = null;

  /**
   * Build an `Ammonia` instance from this builder once all configuration is
   * done.
   *
   * Once an `Ammonia` has been built, changes in the builder won't be reflected
   * on the instance anymore.
   */
  build(): Ammonia {
    return new Ammonia(this);
  }
}

/**
 * A built `Ammonia` instance. To construct this, see the `AmmoniaBuilder` class.
 */
export class Ammonia {
  #builder: AmmoniaBuilderWASM;

  constructor(builder: AmmoniaBuilder) {
    const raw = {
      tags: Array.from(builder.tags.values()),
      cleanContentTags: Array.from(builder.cleanContentTags.values()),
      genericAttributes: Array.from(builder.genericAttributes.values()),
      tagAttributes: Object.fromEntries(
        Array.from(builder.tagAttributes.entries())
          .map(([name, val]) => [name, Array.from(val.values())]),
      ),
      tagAttributeValues: Object.fromEntries(
        Array.from(builder.tagAttributeValues.entries())
          .map((
            [name, val],
          ) => [
            name,
            Array.from(val.entries()).map((
              [name, val],
            ) => [name, Array.from(val.values())]),
          ]),
      ),
      setTagAttributeValues: Object.fromEntries(
        Array.from(builder.setTagAttributeValues.entries())
          .map(([name, val]) => [name, Object.fromEntries(val.entries())]),
      ),
      urlSchemes: Array.from(builder.urlSchemes.values()),
      linkRel: builder.linkRel,
      allowedClasses: Object.fromEntries(
        Array.from(builder.allowedClasses.entries())
          .map(([name, val]) => [name, Array.from(val.values())]),
      ),
      stripComments: builder.stripComments,
      idPrefix: builder.idPrefix,
      genericAttributePrefixes: builder.genericAttributePrefixes === null
        ? null
        : Array.from(builder.genericAttributePrefixes.values()),
    };
    this.#builder = new AmmoniaBuilderWASM(raw);
  }

  /**
   * Clean HTML with the specified options.
   */
  clean(src: string): string {
    return this.#builder.clean(src);
  }
}
