# ammonia-wasm

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/ammonia@0.3.1/mod.ts)

WASM bindings for the
[Ammonia HTML sanitizer](https://github.com/rust-ammonia/ammonia).

> Ammonia is a whitelist-based HTML sanitization library written in Rust. It is
> designed to prevent cross-site scripting, layout breaking, and clickjacking
> caused by untrusted user-provided HTML being mixed into a larger web page.

> Ammonia uses [html5ever](https://github.com/servo/html5ever) to parse and
> serialize document fragments the same way browsers do, so it is extremely
> resilient to syntactic obfuscation.

> Ammonia parses its input exactly according to the HTML5 specification; it will
> not linkify bare URLs, insert line or paragraph breaks, or convert (C) into ©.
> If you want that, use a markup processor before running the sanitizer.

## How to use

```ts
import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";
await ammonia.init();

// Simple cleaning with conservative defaults.
ammonia.clean("XSS<script>attack</script>"); // XSS

// Custom options
const builder = new ammonia.AmmoniaBuilder();
builder.tags.delete("p"); // strip the <p> tag
const cleaner = builder.build();
ammonia.clean("foo<p>bar</p>"); // foobar
```

For exact details on the options on `AmmoniaBuilder` or any other API, view
[deno doc](https://doc.deno.land/https/deno.land/x/ammonia@0.3.1/mod.ts).

## Thanks

Thanks to the authors of Ammonia (@notriddle, and @lnicola), the countless of
contributors to html5ever, and the HTML spec authors.

Additional thanks to the @denosaurs folks for the build.ts script this repo
uses.
