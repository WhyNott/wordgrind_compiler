mod parser;

fn main() {
    println!("Hello, world!");
    let tokens_size = parser::consult_file("test_4.wg");
    let mut tokens_counter = 0;
    let mut oracle_counter = 0;
    let mut varset = 0;
    while tokens_counter < tokens_size {
        let clause = parser::parse_clause(&mut tokens_counter, tokens_size, &mut  oracle_counter, &mut varset);
        tokens_counter += 1;
        
        println!("{}\n", clause);
    
    }
    parser::clean_up_memory();
    
}

