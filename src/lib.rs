use std::collections::HashMap;
use std::collections::HashSet;

use js_sys::TypeError;
use serde::Deserialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn clean(src: &str) -> String {
    ammonia::clean(src)
}

#[wasm_bindgen]
pub fn clean_text(src: &str) -> String {
    ammonia::clean_text(src)
}

#[wasm_bindgen]
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AmmoniaBuilder {
    tags: HashSet<String>,
    clean_content_tags: HashSet<String>,
    tag_attributes: HashMap<String, HashSet<String>>,
    tag_attribute_values: HashMap<String, HashMap<String, HashSet<String>>>,
    set_tag_attribute_values: HashMap<String, HashMap<String, String>>,
    generic_attributes: HashSet<String>,
    url_schemes: HashSet<String>,
    // TODO(lucacasonato): implement later
    // url_relative: UrlRelative,
    // TODO(lucacasonato): implement later
    // attribute_filter: Option<Box<dyn AttributeFilter>>,
    link_rel: Option<String>,
    allowed_classes: HashMap<String, HashSet<String>>,
    strip_comments: bool,
    id_prefix: Option<String>,
    generic_attribute_prefixes: Option<HashSet<String>>,
}

impl AmmoniaBuilder {
    fn builder(&self) -> ammonia::Builder {
        let mut builder = ammonia::Builder::new();
        builder.tags(self.tags.iter().map(|s| &**s).collect());
        builder.clean_content_tags(self.clean_content_tags.iter().map(|s| &**s).collect());
        builder.tag_attributes(
            self.tag_attributes
                .iter()
                .map(|(s, hs)| (&**s, hs.iter().map(|s| &**s).collect()))
                .collect(),
        );
        builder.tag_attribute_values(
            self.tag_attribute_values
                .iter()
                .map(|(s, hm)| {
                    (
                        &**s,
                        hm.iter()
                            .map(|(a, b)| (&**a, b.iter().map(|s| &**s).collect()))
                            .collect(),
                    )
                })
                .collect(),
        );
        builder.set_tag_attribute_values(
            self.set_tag_attribute_values
                .iter()
                .map(|(s, hm)| (&**s, hm.iter().map(|(a, b)| (&**a, &**b)).collect()))
                .collect(),
        );
        builder.generic_attributes(self.generic_attributes.iter().map(|s| &**s).collect());
        builder.url_schemes(self.url_schemes.iter().map(|s| &**s).collect());
        builder.link_rel(if let Some(ref link_rel) = self.link_rel {
            Some(&**link_rel)
        } else {
            None
        });
        builder.allowed_classes(
            self.allowed_classes
                .iter()
                .map(|(s, hs)| (&**s, hs.iter().map(|s| &**s).collect()))
                .collect(),
        );
        builder.strip_comments(self.strip_comments);
        builder.id_prefix(if let Some(ref id_prefix) = self.id_prefix {
            Some(&**id_prefix)
        } else {
            None
        });
        if let Some(ref generic_attribute_prefixes) = self.generic_attribute_prefixes {
            builder.generic_attribute_prefixes(
                generic_attribute_prefixes.iter().map(|s| &**s).collect(),
            );
        }

        builder
    }
}

#[wasm_bindgen]
impl AmmoniaBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(raw: JsValue) -> Result<AmmoniaBuilder, JsValue> {
        let builder = JsValue::into_serde(&raw).map_err(|err| TypeError::new(&err.to_string()))?;
        Ok(builder)
    }

    pub fn clean(&self, src: &str) -> String {
        self.builder().clean(src).to_string()
    }
}
