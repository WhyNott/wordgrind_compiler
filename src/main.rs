
pub mod parser;


mod rewrite_passes;
mod js_emission;

use std::{
    fs::File,
    io::{BufWriter, Write},
};

fn main() {
    println!("Hello, world!");
    let filename = "test_4.wg";
    let file_results = parser::consult_file(filename);

    let write_file = File::create("compiled.js").unwrap();
    let mut writer = BufWriter::new(&write_file);

    writeln!(&mut writer, "const predicates = {{");
    for (key, value) in file_results.into_iter(){
        let (name, arity) = key;
        println!("{}/{}:", name, arity);
        let (clause, num) = value;
        
        println!("{} [{}]", clause, num);
        let (explicit, _) = rewrite_passes::explicit_uni::process((clause, num));
        println!("Explicit unification:\n {}", explicit);
        
        let (extracted, _) = rewrite_passes::variable_inits::process((explicit, num));

        match &extracted.variables{
            None => {},
            Some(vars) => {
                print!("Extracted variables:\n [");
                for ex in vars {
                    print!("{},", ex);
                }
            }

        }
        println!("]");
        let emission = rewrite_passes::emission::process(extracted);
        println!("{}",  emission);
        js_emission::write_procedure(&mut writer, emission);
       
    }

    writeln!(&mut writer, "}}");
    writer.flush().unwrap();
    
}





