import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { AmmoniaBuilder, clean, cleanText, init } from "./mod.ts";

await init();

Deno.test("clean xss", () => {
  const actual = clean("XSS<script>attack</script>");
  assertEquals(actual, "XSS");
});

Deno.test("cleanText xss", () => {
  const actual = cleanText("XSS<script>attack</script>");
  assertEquals(actual, "XSS&lt;script&gt;attack&lt;&#47;script&gt;");
});

Deno.test("builder defaults", () => {
  const builder = new AmmoniaBuilder();
  const ammonia = builder.build();
  const actual = ammonia.clean("XSS<script>attack</script><p>foo</p>");
  assertEquals(actual, "XSS<p>foo</p>");
});

Deno.test("builder modified", () => {
  const builder = new AmmoniaBuilder();
  builder.tags.delete("p");
  const ammonia = builder.build();
  const actual = ammonia.clean("XSS<script>attack</script><p>foo</p>");
  assertEquals(actual, "XSSfoo");
});
