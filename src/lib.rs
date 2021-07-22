use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn clean(src: &str) -> String {
    ammonia::clean(src)
}
