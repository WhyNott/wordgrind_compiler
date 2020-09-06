
pub mod parser;



mod rewrite_passes;


fn main() {
    println!("Hello, world!");
    let filename = "test_4.wg";
    let file_results = parser::consult_file(filename);
    for (key, value) in file_results.into_iter(){
        let (name, arity) = key;
        println!("{}/{}:", name, arity);
        let (clause, num) = value;
        
        println!("{} [{}]", clause, num);
        let (explicit, _) = rewrite_passes::explicit_uni::process((clause, num));
        println!("Explicit unification:\n {}", explicit);
        
        let (extracted, _) = rewrite_passes::variable_inits::process((explicit, num));

        match extracted.variables{
            None => {},
            Some(vars) => {
                print!("Extracted variables:\n [");
                for ex in vars {
                    print!("{},", ex);
                }
            }

        }
        println!("]");
    }
    
}







