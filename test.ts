import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { clean, init } from "./mod.ts";

await init();

Deno.test("xss", () => {
  const actual = clean("XSS<script>attack</script>");
  assertEquals(actual, "XSS");
});
