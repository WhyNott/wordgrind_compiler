pub mod parser;

mod js_emission;
mod rewrite_passes;
mod tl_database;

use std::{
    fs::File,
    io::{BufWriter, Write},
};

fn main() {
    let test_context = tl_database::new_context("Sup".to_string(), 0, 0, "world.wg".to_string());
    let test_variable = tl_database::new_variable("Hi".to_string(), test_context, false);

    test_variable.set_is_head(true);

    println!("Hello, {}!", test_variable.get_is_head());
    let filename = "testytest.wg";
    let file_results = parser::consult_file(filename);

    let write_file = File::create("compiled.js").unwrap();
    let mut writer = BufWriter::new(&write_file);

    writeln!(&mut writer, "const predicates = {{");
    for (key, value) in file_results.into_iter() {
        let (name, arity) = key;
        println!("{}/{}:", name, arity);
        let clause = value;

        println!("{}", clause);
        let explicit = rewrite_passes::explicit_uni::process(clause);
        println!("Explicit unification:\n {}", explicit);

        let extracted = rewrite_passes::variable_inits::process(explicit);

        println!("Variable init:\n {}", extracted);

        match &extracted.variables {
            None => {}
            Some(vars) => {
                print!("Extracted variables:\n [");
                for ex in vars {
                    print!("{},", ex);
                }
            }
        }
        println!("]");
        let emission = rewrite_passes::emission::process(extracted);
        println!("{}", emission);
        js_emission::write_procedure(&mut writer, emission);
    }

    writeln!(&mut writer, "}}");
    writer.flush().unwrap();
}
