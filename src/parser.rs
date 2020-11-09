#![allow(dead_code)]
#![allow(clippy::not_unsafe_ptr_arg_deref)]


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
use std::fmt;
#[derive(Debug, Clone)]
pub struct Sentence {
        pub name: String,
        pub elements: Vec<Term>,
        pub context:  Box::<Context>
}

impl fmt::Display for Sentence {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        
        write!(f, "'{}'(", self.name)?;
        for (i, element) in self.elements.iter().enumerate() {
            write!(f, "{}", element)?;
            if i != (self.elements.len()-1){
                write!(f, ", ")?;
            }
        }
        write!(f, ")")
            
    }
}

    
#[derive(Debug,  Clone)]    
pub struct Variable {
    pub variable_name: String,
    pub variable_id: i32,
    pub context: Box::<Context>,
    pub is_head: bool
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "?{}({})", self.variable_name, self.variable_id)
    }
}

impl PartialEq for Variable {
    fn eq(&self, other: &Self) -> bool {
        self.variable_id == other.variable_id
            &&
            self.variable_name == other.variable_name
    }
}

impl Eq for Variable {}
use std::cmp::Ordering;

impl Ord for Variable {    
    fn cmp(&self, other: &Self) -> Ordering {
        let result = self.variable_id.cmp(&other.variable_id);
        if result == Ordering::Equal {
            self.variable_name.cmp(&other.variable_name)
        } else {
            result
        }
    }
}


impl PartialOrd for Variable {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }

}



#[derive(Debug, Clone)]
pub enum Term {
    Sentence(Sentence),
    Variable(Variable)
}



impl fmt::Display for Term {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Term::Sentence(s) => {
                write!(f, "{}", s)
            },
            
            
            Term::Variable(v) => {
                write!(f, "{}", v)
            }
            
        }
    }
}
use std::collections::BTreeMap;

pub fn rustify_sentence(sentence: *const parser_c::Sentence, varset: &mut BTreeMap<String, i32>) -> Term{
    
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
        Term::Variable(Variable {variable_name, variable_id, context, is_head: false})

      
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

            Term::Sentence(Sentence {name, elements: elements_new,  context})
               

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
                writeln!(f, "and(")?;

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
                LogicVerb::Sentence(match rustify_sentence((*lverb).contents.basic, varset){
                    Term::Sentence(s) => s,
                    Term::Variable(v) => panic!("Clause head is variable: {:?}", v)


                })
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
            head: match rustify_sentence((*cl).head, varset){
                Term::Sentence(s) => s,
                Term::Variable(v) => panic!("Clause head is variable: {:?}", v)
            },
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


pub fn consult_file(filename:&str) -> BTreeMap<(String, i32), (Clause, i32)>{
    
    let mut tokens_size = 0;
    tokenize_file(filename, &mut tokens_size);
    let mut tokens_counter = 0;
    let mut oracle_counter = 0;
    
    let mut map  : BTreeMap<(String, i32), Vec<(Clause, i32)>> = BTreeMap::new();

    
    while tokens_counter < tokens_size {
        let mut varset = 0;
        
        let clause = parse_clause(&mut tokens_counter, &tokens_size, &mut  oracle_counter, &mut varset);
        
        tokens_counter += 1;
        let arity = clause.head.elements.len() as i32;
        let cl_name = clause.head.name.clone();
        
       

        let key = (cl_name, arity);
        if map.contains_key(&key){
            map.get_mut(&key).expect("404: not found").push((clause, varset));
            
        } else {
            map.insert(key, vec![(clause, varset)]);
        }

        
        
    }

    
    
    clean_up_memory();
    join_clauses_of_same_predicate(&map)

  
}

fn join_clauses_of_same_predicate(separate_clauses_by_predicate: &BTreeMap<(String, i32), Vec<(Clause, i32)>>) -> BTreeMap<(String, i32), (Clause, i32)> {
    let mut joined_clause_by_predicate : BTreeMap<(String, i32), (Clause, i32)> = BTreeMap::new();
    for (pred_id, separate_clauses) in separate_clauses_by_predicate.iter(){
        if separate_clauses.len() == 1 {
            joined_clause_by_predicate.insert(pred_id.clone(), separate_clauses[0].clone());
        } else {
            let (name, arity) = pred_id;
            let mut highest_varset = 0;
            for (_, varset) in separate_clauses {
                if highest_varset < *varset {
                    highest_varset = *varset;
                }
            }
            let mut joined_clause_head_args = Vec::with_capacity(*arity as usize);

            let joined_clause_context = separate_clauses[0].0.context.clone();
            
            for i in 0..*arity {
                highest_varset += 1;
                joined_clause_head_args.push(
                    Term::Variable(Variable {
                        variable_name: "head_".to_owned() + &i.to_string(),
                        
                        variable_id: highest_varset,
                        context: joined_clause_context.clone(),
                        is_head: true
  
                    }));
                
            }
            let joined_head = Sentence {
                name: name.to_string(),
                elements: joined_clause_head_args.clone(),
                context: joined_clause_context.clone()                           
            };
            let mut disjunction:Vec<LogicVerb> = Vec::with_capacity(separate_clauses.len() as usize);
            
            for (clause, _) in separate_clauses{
                
                let mut clause_as_disjunct = Vec::with_capacity(*arity as usize);
   
                for (head_arg, joined_head_arg) in clause.head.elements.iter().zip(joined_clause_head_args.iter()) {
                    clause_as_disjunct.push(LogicVerb::Sentence(
                        Sentence {
                            name: "{} = {}".to_string(),
                            elements: vec![head_arg.clone(), joined_head_arg.clone()],
                            context: match head_arg {
                                Term::Sentence(Sentence {context, ..}) => context.clone(),
                                Term::Variable(Variable {context, ..}) => context.clone(),
                            }
                        }
                    ));

                    
                        
                }

                
            
                match &clause.body {
                    Some(lv) => {
                        match lv {
                            LogicVerb::Sentence(s) => {
                                clause_as_disjunct.push(LogicVerb::Sentence(s.clone()));
                                disjunction.push(LogicVerb::And(clause_as_disjunct));                     
                            },
                            LogicVerb::And(and) => {
                                clause_as_disjunct.append(&mut and.clone());
                                
                                disjunction.push(LogicVerb::And(clause_as_disjunct));
                                
                            },
                            LogicVerb::Or(or) => {
                                clause_as_disjunct.push(LogicVerb::Or(or.clone()));
                                disjunction.push(LogicVerb::And(clause_as_disjunct));                     
                            },

                           

                        }

                        
                    },
                    None => {
                        if !clause_as_disjunct.is_empty() { //some weird edge case I guess?
                            disjunction.push(if clause_as_disjunct.len() == 1 {
                                clause_as_disjunct.into_iter().next().expect("Disjunct is empty")
                            } else {
                                LogicVerb::And(clause_as_disjunct)
                            });
                            
                        } else {
                            panic!("I think this should be a compiler error but I don't remember why");
                            
                        }
                        
                    }

        
                }

               
            }
            
            joined_clause_by_predicate.insert(pred_id.clone(), (
                Clause {
                    head: joined_head,
                    body: Some(if disjunction.len() == 1 {
                        disjunction.into_iter().next().expect("disjunction is empty")
                            
                    } else {
                        LogicVerb::Or(disjunction)
                    }),
                    context: joined_clause_context
                }, highest_varset));

        }
    }
    joined_clause_by_predicate
}





pub fn clean_up_memory(){
    unsafe {
        parser_c::globals_free();
    }
}

