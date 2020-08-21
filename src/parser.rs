#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]
#![allow(dead_code)]

include!(concat!(env!("OUT_DIR"), "/parser_bindings.rs"));

use std::ffi::CString;

pub fn consult_filename(filename: &str) -> i32{
    let x = &mut [0];
    let c_filename = CString::new(filename).expect("CString::new failed");
    unsafe {
        consult_file(c_filename.as_ptr() as *mut i8, x.as_mut_ptr());   
    };
    x[0]
        
}

pub fn parse_clause(tokens_counter : &mut i32, tokens_size : i32, oracle_counter : &mut i32, varset : &mut i32){
    let oracle_size = 0; //I have a theory that this actually doesn't matter
   
    unsafe {
        let mut clause : Clause = NULL_CLAUSE;
        
        clause_parse(&mut clause, tokens, tokens_size, tokens_counter, oracle_base, oracle_size, oracle_counter, varset);
 
        clause_print(&mut clause);
        
        
    }
   
}



