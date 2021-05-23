pub mod parser;

mod js_emission;
mod rewrite_passes;
mod tl_database;
mod yaml_parser;

use std::{
    fs::File,
    io::{BufWriter, Write},
};

use std::fs;

extern crate yaml_rust;
use yaml_rust::{YamlLoader, YamlEmitter};
use unicode_segmentation::UnicodeSegmentation;
use std::collections::HashMap;
use crate::tl_database::new_context;
use crate::yaml_parser::{term_parse,document_parse};
use crate::tl_database::Variable;

use crate::rewrite_passes::emission::{process_document};
use crate::js_emission::{print_procedure, write_document};

fn main() {
    
    let filename = "decks.wg";
    let data = fs::read_to_string("walk_around.yaml").expect("Unable to read file");

    let mains = YamlLoader::load_from_str(&data).unwrap();
    let main = &mains[0];
    println!("{:?}", main);

    let parsed = document_parse(main);
    //println!("{}", parsed.initial_conditions.expect("error"));

    let processed = process_document(parsed);
    
    let write_file = File::create("compiled.js").unwrap();
    let mut writer = BufWriter::new(&write_file);

    write_document(&mut writer, &processed);
    writer.flush().unwrap();
}

