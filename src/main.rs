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
use yaml_rust::{YamlLoader};
use crate::yaml_parser::{document_parse};

use crate::rewrite_passes::emission::{process_document};
use crate::js_emission::{write_document};

use std::env;

fn main() {

    let args: Vec<String> = env::args().collect();

    let input_file = if args.len() > 1 { &args[1] } else {"main.yaml"};
    let output_file = if args.len() > 2 { &args[2] } else {"compiled.js"};
    
    let data = fs::read_to_string(input_file).expect("Unable to read file");

    let mains = YamlLoader::load_from_str(&data).unwrap();
    let main = &mains[0];

    let parsed = document_parse(main);

    let processed = process_document(parsed);
    
    let write_file = File::create(output_file).unwrap();
    let mut writer = BufWriter::new(&write_file);

    write_document(&mut writer, &processed);
    writer.flush().unwrap();
}

