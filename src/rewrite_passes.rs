



pub mod explicit_uni {
    use crate::parser as parser;
    
    
    //the first one is extract_variables!
    //it adds new clause types: unify and structure
    //it needs a varset
    #[derive(Debug, Clone)]
    pub struct Sentence {
        name: String,
        elements: Vec<parser::Variable>,
        context:  Box::<parser::Context>
    }

    use std::fmt;
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


    #[derive(Debug, Clone)]
    pub enum LogicVerb {
        Sentence(Sentence),
        And(Vec<LogicVerb>),
        Or(Vec<LogicVerb>),
        Unify(parser::Variable, parser::Variable),
        Structure(parser::Variable, parser::Sentence)
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
                },

                LogicVerb::Unify(a, b) => {
                    write!(f, "unify({},{})", a, b)
                },
                LogicVerb::Structure(a, b) => {
                    write!(f, "structure({},{})", a, b)
                }
                
            }
        }
    }


    #[derive(Debug, Clone)]
    pub struct Clause {
        pub head: parser::Sentence,
        pub body: Option<LogicVerb>,
        pub context: Box::<parser::Context>
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

    pub fn process(input: (parser::Clause, i32)) -> (Clause, i32) {
        let clause = input.0;
        let mut varset = input.1;
    
        let new_body = match clause.body {
            Some(body) => {
                let mut new_body = Vec::new();
                process_body(body, &mut new_body, &mut varset);
                Some(if new_body.len() == 1 {
                    new_body.into_iter().next().expect("Sentence is empty")
                } else {
                    LogicVerb::And(new_body)
                })
                
            },
            None => None
                
        };
        (Clause {head: clause.head, body: new_body, context: clause.context}, varset)


    }
    

    
    fn process_body(input: parser::LogicVerb, output: &mut Vec<LogicVerb>, varset :&mut i32)  {
        match input {
            parser::LogicVerb::Sentence(s) =>{
                if s.name == "{} = {}"{
                    assert!(s.elements.len() == 2);
                    let mut it = s.elements.into_iter();
                    let a = it.next().expect("Sentence is empty");
                    let b = it.next().expect("Sentence is empty");
                    
                    
                    match (a, b){
                       (parser::Term::Variable(x), parser::Term::Variable(y)) => {
                           output.push(LogicVerb::Unify(x, y));
                       },
                        (parser::Term::Sentence(x), parser::Term::Sentence(y)) => {
                            *varset += 1;
                            let new_variable1 = parser::Variable {
                                variable_name: varset.to_string(),
                                variable_id: *varset,
                                context: x.context.clone()
                            };
                            *varset += 1;
                            let new_variable2 = parser::Variable {
                                variable_name: varset.to_string(),
                                variable_id: *varset,
                                context: y.context.clone()
                            };
                            output.push(LogicVerb::Structure(new_variable1.clone(), x));
                            output.push(LogicVerb::Structure(new_variable2.clone(), y));
                            output.push(LogicVerb::Unify(new_variable1, new_variable2));
                        },
                        (parser::Term::Variable(x), parser::Term::Sentence(y)) |
                        (parser::Term::Sentence(y), parser::Term::Variable(x)) => {
                            output.push(LogicVerb::Structure(x, y));

                            
                        }
                        
                    }

                    

                } else {
                    let mut new_arguments =  Vec::with_capacity(s.elements.len());
                    for element in s.elements {
                        match element {
                            parser::Term::Sentence(s) => {
                                *varset += 1;
                                let new_variable = parser::Variable {
                                    variable_name: varset.to_string(),
                                    variable_id: *varset,
                                    context: s.context.clone()
                                };
                                new_arguments.push(new_variable.clone());
                                output.push(LogicVerb::Structure(new_variable, s));
                            },
                            parser::Term::Variable(v) => {
                                new_arguments.push(v);
                                

                            }
                        }
                    }
                    output.push(LogicVerb::Sentence(Sentence {
                        name: s.name,
                        elements: new_arguments,
                        context: s.context
                    }));
                }


            },
            parser::LogicVerb::And(lvs) =>{
                let mut new_lvs = Vec::with_capacity(lvs.len());
                for lv in lvs {
                    process_body(lv, &mut new_lvs, varset);
                }
                output.push(LogicVerb::And(new_lvs));
            },
            parser::LogicVerb::Or(lvs) =>{
                let mut new_lvs = Vec::with_capacity(lvs.len());
                for lv in lvs {
                    let mut newvarset = *varset;
                    process_body(lv, &mut new_lvs, &mut newvarset);
                }
                output.push(LogicVerb::Or(new_lvs))
            },

        }


    }



}



