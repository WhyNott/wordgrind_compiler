#![allow(dead_code)]

mod parser_c {
    #![allow(non_upper_case_globals)]
    #![allow(non_camel_case_types)]
    #![allow(non_snake_case)]
    
    include!(concat!(env!("OUT_DIR"), "/parser_bindings.rs"));
}


use std::ffi::CString;
use std::ffi::CStr;
use std::slice;




#[derive(Debug, Clone)]
pub struct Context {
    pub leading_whitespace: String,
    pub line_number: i32,
    pub column_number: i32,
    pub file_name: String
}



pub fn rustify_context(context: *const parser_c::Context) -> Context{
    let leading_whitespace;
    let line_number;
    let column_number;
    let file_name;
    unsafe {
        leading_whitespace = CStr::from_ptr((*context).leading_whitespace)
            .to_str()
            .expect("Incorrect utf8 data in leading_whitespace")
            .to_string();
        line_number = (*context).line_number;
        column_number = (*context).column_number;
        file_name = CStr::from_ptr((*context).file_name)
            .to_str()
            .expect("Incorrect utf8 data in file_name")
            .to_string();
        
    }
    
    Context {leading_whitespace, line_number, column_number, file_name}

}

#[derive(Debug, Clone)]
pub enum Sentence {
    Sentence {
        name: String,
        elements: Vec<Sentence>,
        context:  Box::<Context>
    },
    
    Variable {
        variable_name: String,
        variable_id: i32,
        context: Box::<Context>       
    }
}


pub fn rustify_sentence(sentence: *const parser_c::Sentence) -> Sentence{
    unsafe {
        if (*sentence).name.is_null() {
            let variable = sentence as *const parser_c::VariableSentence;
            let variable_name = CStr::from_ptr((*variable).variable_name)
                .to_str()
                .expect("Incorrect utf8 data in variable name")
                .to_string();
            let variable_id = (*variable).variable_id;
            let context = Box::new(rustify_context((*variable).context));
          
            Sentence::Variable {variable_name, variable_id, context: context}

      
        } else {
            let name = CStr::from_ptr((*sentence).name)
                .to_str()
                .expect("Incorrect utf8 data in sentence name")
                .to_string();
            let elements_old : &[parser_c::Sentence] = slice::from_raw_parts((*sentence).elements, (*sentence).elements_length as usize);
            let mut elements_new = Vec::with_capacity((*sentence).elements_length as usize);
            
            for element in elements_old {
                elements_new.push(rustify_sentence(element));
            }
            let context = Box::new(rustify_context((*sentence).context));

            Sentence::Sentence {name, elements: elements_new, context: context}


         
          
        }
        
    }

}

#[derive(Debug, Clone)]
pub enum LogicVerb {
    Sentence(Sentence),
    And(Vec<LogicVerb>),
    Or(Vec<LogicVerb>),
}


pub fn rustify_logic_verb(lverb: *const parser_c::LogicVerb) -> LogicVerb{
    unsafe {
        let process_contents = ||{
            let nested = *(*lverb).contents.nested;
            let contents_old : &[parser_c::LogicVerb] = slice::from_raw_parts(nested.contents, nested.contents_length as usize);
            let mut contents_new = Vec::with_capacity(nested.contents_length as usize);
            for element in contents_old {
                contents_new.push(rustify_logic_verb(element));
            }
            contents_new
        };
        
        match (*lverb).type_ {
            parser_c::VerbType_L_SENTENCE => {
                LogicVerb::Sentence(rustify_sentence((*lverb).contents.basic))
            },
            parser_c::VerbType_L_AND => {
                
                LogicVerb::And(process_contents())
                
                

            },
            parser_c::VerbType_L_OR => {
                LogicVerb::And(process_contents())
            },
            _ => panic!("Incorrect logic_verb type!")
        }

    }
}


#[derive(Debug, Clone)]
pub struct Clause {
    pub head: Sentence,
    pub body: Option<LogicVerb>,
    pub context: Box::<Context>

}

pub fn rustify_clause(cl: *const parser_c::Clause) -> Clause {
    unsafe {
        Clause {
            head: rustify_sentence((*cl).head),
            body: if (*cl).body.is_null() {
                None
            } else {
                Some(rustify_logic_verb((*cl).body))
            },
            context: Box::new(rustify_context((*cl).context))
        }
    }
}




pub fn consult_file(filename: &str) -> i32{
    let x = &mut [0];
    let c_filename = CString::new(filename).expect("CString::new failed");
    unsafe {
        parser_c::consult_file(c_filename.as_ptr() as *mut i8, x.as_mut_ptr());   
    };
    x[0]
        
}

pub fn parse_clause(tokens_counter : &mut i32, tokens_size : i32, oracle_counter : &mut i32, varset : &mut i32) -> Clause{
    let oracle_size = 0; //I have a theory that this actually doesn't matter
   
    unsafe {
        let mut clause : parser_c::Clause = parser_c::NULL_CLAUSE;
        
        parser_c::clause_parse(&mut clause, parser_c::tokens, tokens_size, tokens_counter, parser_c::oracle_base, oracle_size, oracle_counter, varset);
 
        //parser_c::clause_print(&mut clause);
        rustify_clause(&clause)
        
    }
   
}


