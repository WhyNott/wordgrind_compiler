mod parser;



fn main() {
    println!("Hello, world!");
    let filename = "test_4.wg";
    let file_results = parser::consult_file(filename);
    for (key, value) in file_results.iter(){
        let (name, arity) = key;
        println!("{}/{}:", name, arity);
        let  (clause, num) = value; 
        println!("{} [{}]", clause, num);
        


    }
    
}




