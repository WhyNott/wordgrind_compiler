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
use crate::yaml_parser::term_parse;
use crate::tl_database::Variable;

fn main() {
    
    let filename = "decks.wg";
    let file_results = parser::consult_file(filename);
    let data = fs::read_to_string("main.yaml").expect("Unable to read file");

    let mains = YamlLoader::load_from_str(&data).unwrap();
    let main = &mains[0];
    println!("{:?}", main);

    let mut v_map : HashMap<String, Variable> = HashMap::new();
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
    //todo: figure out why this doesn't work
    println!("{}", term_parse(&mut "?test", &mut v_map, context));
    println!("{}", term_parse(&mut "<civilisation ?_>", &mut v_map, context));
    println!("{}", term_parse(&mut "civilisation ?CivNext", &mut v_map, context));
    println!("{}", term_parse(&mut "<?Civ is shifted to <+> as ?CivNext>",
                                &mut v_map,
                                context));
        
    
    //let write_file = File::create("compiled.js").unwrap();
    //let mut writer = BufWriter::new(&write_file);
    // 
    //writeln!(&mut writer, "const predicates = {{");
    //for (key, value) in file_results.into_iter() {
    //    let (name, arity) = key;
    //    println!("{}/{}:", name, arity);
    //    let clause = value;
    // 
    //    println!("{}", clause);
    //    let explicit = rewrite_passes::explicit_uni::process(clause);
    //    println!("Explicit unification:\n {}", explicit);
    // 
    //    let extracted = rewrite_passes::variable_inits::process(explicit);
    // 
    //    println!("Variable init:\n {}", extracted);
    // 
    //    match &extracted.variables {
    //        None => {}
    //        Some(vars) => {
    //            print!("Extracted variables:\n [");
    //            for ex in vars {
    //                print!("{},", ex);
    //            }
    //        }
    //    }
    //    println!("]");
    //    let emission = rewrite_passes::emission::process(extracted);
    //    println!("{}", emission);
    //    js_emission::write_procedure(&mut writer, emission);
    //}
    // 
    //writeln!(&mut writer, "}}");
    //writer.flush().unwrap();
}
