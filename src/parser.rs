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

use std::fmt;
impl fmt::Display for Sentence {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Sentence::Sentence {name, elements, context:_} => {

                write!(f, "'{}'(", name)?;
                for (i, element) in elements.iter().enumerate() {
                    write!(f, "{}", element)?;
                    if i != (elements.len()-1){
                        write!(f, ", ")?;
                    }
                }
                write!(f, ")")
                    
            },
            
            Sentence::Variable {variable_name, variable_id, context:_} => {

                write!(f, "?{}<{}>", variable_name, variable_id)

            }
            

        }
        
    }


}
use std::collections::BTreeMap;

pub fn rustify_sentence(sentence: *const parser_c::Sentence, varset: &mut BTreeMap<String, i32>) -> Sentence{
    
    if unsafe { (*sentence).name.is_null() } {
        let variable;
        let variable_name;
        let mut variable_id : i32;
        let context;
        unsafe {
            variable  = sentence as *const parser_c::VariableSentence;
            variable_name = CStr::from_ptr((*variable).variable_name)
                .to_str()
                .expect("Incorrect utf8 data in variable name")
                .to_string();
            variable_id = (*variable).variable_id;
            context = Box::new(rustify_context((*variable).context));
            
        }
        if varset.contains_key(&variable_name) {
            variable_id = *varset.get(&variable_name).expect("Item missing");
        }else {
            varset.insert(variable_name.clone(), variable_id);
                    
        }
   

   


       
        //println!("{}", variable_id);
        Sentence::Variable {variable_name, variable_id, context}

      
    } else {
        unsafe {
            let name = CStr::from_ptr((*sentence).name)
                .to_str()
                .expect("Incorrect utf8 data in sentence name")
                .to_string();
            let elements_old : &[parser_c::Sentence] = slice::from_raw_parts((*sentence).elements, (*sentence).elements_length as usize);
            let mut elements_new = Vec::with_capacity((*sentence).elements_length as usize);
            
            for element in elements_old {
                elements_new.push(rustify_sentence(element, varset));
            }
            let context = Box::new(rustify_context((*sentence).context));

            Sentence::Sentence {name, elements: elements_new,  context}

        }
         
          
        }
        
    

}

#[derive(Debug, Clone)]
pub enum LogicVerb {
    Sentence(Sentence),
    And(Vec<LogicVerb>),
    Or(Vec<LogicVerb>),
}

impl fmt::Display for LogicVerb {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {       
        match self {
            LogicVerb::Sentence(s) => write!(f, "{}", s),
            LogicVerb::And(verbs) => {
                write!(f, "and(\n")?;

                for (i, sentence) in verbs.iter().enumerate() {
                    write!(f, "          {}", sentence)?;
                    if i != (verbs.len()-1){
                        write!(f, ",")?;
                    }
                    write!(f, "\n")?;
              
            }
                write!(f, "     )")
            },
            LogicVerb::Or(verbs) => {
                write!(f, "or(")?;
                for (i, sentence) in verbs.iter().enumerate() {
                write!(f, "{}", sentence)?;
                if i != (verbs.len()-1){
                        write!(f, ",")?;
                }
              
            }
                write!(f, ")")
            }
           
           
           
               
        }
    }
}

pub fn rustify_logic_verb(lverb: *const parser_c::LogicVerb, varset: &mut BTreeMap<String, i32>) -> LogicVerb{
    unsafe {
        let mut process_contents = ||{
            let nested = *(*lverb).contents.nested;
            let contents_old : &[parser_c::LogicVerb] = slice::from_raw_parts(nested.contents, nested.contents_length as usize);
            let mut contents_new = Vec::with_capacity(nested.contents_length as usize);
            for element in contents_old {
                contents_new.push(rustify_logic_verb(element, varset));
            
            }
            contents_new
        };
        
        match (*lverb).type_ {
            parser_c::VerbType_L_SENTENCE => {
                LogicVerb::Sentence(rustify_sentence((*lverb).contents.basic, varset))
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

impl fmt::Display for Clause {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.head)?;
        match &self.body {
            Some(body) => {
                write!(f, ":- \n     {}", body)
            }
            None => {
                Ok(())
                    
            }           

        }
    }
}

pub fn rustify_clause(cl: *const parser_c::Clause, varset: &mut BTreeMap<String, i32>) -> Clause {
    
    unsafe {
        Clause {
            head: rustify_sentence((*cl).head, varset),
            body: if (*cl).body.is_null() {
                None
            } else {
                Some(rustify_logic_verb((*cl).body, varset))
            },
            context: Box::new(rustify_context((*cl).context))
        }
    }
}




pub fn tokenize_file<'a>(filename: &'a str, x:&'a mut i32){
    let c_filename = CString::new(filename).expect("CString::new failed");
    unsafe {
        parser_c::consult_file(c_filename.as_ptr() as *mut i8, x);   
    };
   
}

pub fn parse_clause(tokens_counter : &mut i32, tokens_size : &i32, oracle_counter : &mut i32, varset : &mut i32) -> Clause{
    let oracle_size = 0; //I have a theory that this actually doesn't matter
    let mut clause : parser_c::Clause;
    
    unsafe {
        clause = parser_c::NULL_CLAUSE;
        
        parser_c::clause_parse(&mut clause, parser_c::tokens, *tokens_size, tokens_counter, parser_c::oracle_base, oracle_size, oracle_counter, varset);
    }
        rustify_clause(&clause, &mut BTreeMap::new())
        
}


pub fn clean_up_memory(){
    unsafe {
        parser_c::globals_free();
    }
}

