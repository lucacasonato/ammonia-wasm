import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { clean, cleanText, init } from "./mod.ts";

await init();

Deno.test("clean xss", () => {
  const actual = clean("XSS<script>attack</script>");
  assertEquals(actual, "XSS");
});

Deno.test("cleanText xss", () => {
  const actual = cleanText("XSS<script>attack</script>");
  assertEquals(actual, "XSS&lt;script&gt;attack&lt;&#47;script&gt;");
});
