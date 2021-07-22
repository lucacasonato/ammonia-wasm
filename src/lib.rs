use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn clean(src: &str) -> String {
    ammonia::clean(src)
}

#[wasm_bindgen]
pub fn clean_text(src: &str) -> String {
    ammonia::clean_text(src)
}
