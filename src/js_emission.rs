use crate::rewrite_passes::emission as ast;
use std::fmt;

use std::fs::File;
use std::io::{self, BufRead};

use std::{
    io::{Write},
};


use crate::tl_database::{Variable};

use crate::parser::{SpecialFactType};
struct JSDocument<'a>(&'a ast::Document);

impl<'a> fmt::Display for JSDocument<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let doc = self.0;
        

        
        if let Some(initial_state) = &doc.initial_conditions {
            if let Some(sentence) = &initial_state.init_description {
                   writeln!(f, "const init_desc = '{}';", sentence.name)?;
            } else {
                writeln!(f, "const init_desc = '';")?;
            } 
            
            writeln!(f, "DB.store = {{")?;
            let mut initial_sentences = initial_state.init_state.clone();
            for (name, fact) in &doc.special_facts {
                writeln!(f, "    '{}' : {{", name)?;
                if let SpecialFactType::Unique = fact {
                    writeln!(f, "        unique: true,")?;
                }
                write!(f, "        data: [")?;
                if let Some(vect) = initial_sentences.remove(&name){
                    for sent in vect {
                         write!(f, "{},", JSSentence(&sent))?;
                    }
                }
                writeln!(f, "    ] \n }},")?;
            }

            //all the ones that don't have special fact info
            for (name, vect) in initial_sentences{
                writeln!(f, "    '{}' : {{", name)?;
                write!(f, "        data: [")?;
                for sent in vect {
                    write!(f, "{},", JSSentence(&sent))?;
                }
                
                writeln!(f, "    ] \n }},")?;
            }
            writeln!(f, "}};")?;
        } else {
            writeln!(f, "const init_desc = '';")?;
            writeln!(f, "DB.store = {{ }};")?;
            
        }
        
        
        
        writeln!(f, "const decks = {{")?;
        for (name, deck) in doc.decks.iter() {
            writeln!(f, "    '{}' : {{", name)?;
            write!(f, "{}", JSDeck(&deck))?;
            writeln!(f, "    }},")?;
        }
        
        writeln!(f, "}};")?;
        
        writeln!(f, "const predicates = {{")?;
        for procedure in doc.predicates.values(){
            writeln!(f,"{}", JSProcedure(procedure))?;
        }
        let file = File::open("js_assets/builtin.js").expect("Standard library file not present!");
        let mut builtin_predicates = io::BufReader::new(file).lines();
        builtin_predicates.next();//skip initial line
        for line in builtin_predicates {
            if let Ok(ip) = line {
                writeln!(f,"{}", ip)?;
            }
        }

        Ok(())
        //I dont need this writeln!(f, "}};")
        
    }
}





struct JSProcedure<'a>(&'a ast::Procedure);

impl<'a> fmt::Display for JSProcedure<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        emmit_procedure(f, self.0)
    }
}

pub fn print_procedure<'a>(proc:&'a ast::Procedure){
    println!("{}", JSProcedure(proc));
}


pub fn write_procedure<'a>( f : &mut std::io::BufWriter<&std::fs::File>, proc : &'a ast::Procedure){
    writeln!(f,"{}", JSProcedure(proc));
}

pub fn write_document<'a>( f : &mut std::io::BufWriter<&std::fs::File>, doc : &'a ast::Document){
    writeln!(f,"{}", JSDocument(doc)).expect("Failed to write document!");
}


struct JSDeck<'a>(&'a ast::Deck);

impl<'a> fmt::Display for JSDeck<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let deck = self.0;
        write!(f, "        ")?;
        writeln!(f, "early_actions: [")?;
        for element in &deck.early_actions {
            writeln!(f, "{}", JSElement(element))?;
        }
        write!(f, "        ")?;
        writeln!(f, "],")?;

        write!(f, "        ")?;
        writeln!(f, "choices: [")?;
        for element in &deck.choices {
            writeln!(f, "{}", JSElement(element))?;
        }
        write!(f, "        ")?;
        writeln!(f, "],")?;

        write!(f, "        ")?;
        writeln!(f, "late_actions: [")?;
        for element in &deck.late_actions {
            writeln!(f, "{}", JSElement(element))?;
        }
        write!(f, "        ")?;
        writeln!(f, "],")
    }
}


struct JSElement<'a>(&'a ast::Element);

impl<'a> fmt::Display for JSElement<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let e = self.0;
        write!(f, "            ")?;
        writeln!(f,"(name, description, effects, next_deck, options, cont_0) => {{")?;
        write!(f, "                ")?;
        writeln!(f,"const index = 0;")?;

        for variable in &e.variables {
            write!(f, "                ")?;
            writeln!(f, "const {0}  = make_empty_variable('?{1}' + (index == 1 ? '' : index));",
                     JSVariable(&variable), variable.get_variable_name())?;
        }

        write!(f, "                ")?;
        writeln!(f,"name.unify_with({});", JSSentence(&e.name))?;
        
        if let Some(desc) = &e.description {
            write!(f, "                ")?;
            writeln!(f, "description.unify_with({});", JSTerm(&desc))?;
        }

        if let Some(next) = &e.next_deck {
            write!(f, "                ")?;
            writeln!(f, "next_deck.unify_with({});", JSTerm(&next))?;
        }

        if e.effects.len() != 0 {
            write!(f, "                ")?;
            writeln!(f,"effects.unify_with(make_structured_term('', [")?;
            for (effect, keep) in &e.effects {
                write!(f, "                ")?;
                if !*keep {
                    writeln!(f, "make_structured_term('not', [{}]),", JSTerm(&effect))?;
                } else {
                    writeln!(f, "{},", JSTerm(&effect))?;
                }
            }
            writeln!(f, "]));")?;
        }

        let final_cont;
        
        if let Some(logic_body) = &e.logic_body {
            write!(f, "                ")?;
            writeln!(f,"const logic = () => {{")?;
            for (i, cont) in e.logic.iter().enumerate() {
                write!(f, "                    ")?;
                writeln!(f, "const cont_{} = () => {{", i+1)?;
                write!(f, "{}", JSVerb(&cont, &e.variables, 24))?;
                writeln!(f,"                    }};")?;
            }
            
            writeln!(f, "{}", JSVerb(&logic_body, &e.variables, 20))?;
            write!(f, "                ")?;
            writeln!(f, "}};")?;
            final_cont = "logic";
        } else {
            final_cont = "cont_0";
        }

        if e.options.once {
            write!(f, "            ")?;
            writeln!(f,"options.once = true;")?;
        }
        if e.options.hide_name {
            write!(f, "           ")?;
            writeln!(f,"options.hide_name = true;")?;
        }

        if e.preconds.len() != 0 {
            write!(f, "                ")?;
            writeln!(f, "DB.match({},", final_cont)?;
            for (precond, positive) in &e.preconds {
                write!(f, "                    ")?;
                if !*positive {
                    writeln!(f, "make_structured_term('not', [{}]),", JSTerm(&precond))?;
                } else {
                    writeln!(f, "{},", JSTerm(&precond))?;
                }
            }
            
            write!(f, "                ")?;
            writeln!(f, ");")?;
        } else {
            write!(f, "                ")?;
            writeln!(f,"{}();", final_cont)?;
        }

        write!(f, "            ")?;
        writeln!(f, "}},")
    }
}
    


use crate::parser as parser;


struct JSSentence<'a>(&'a parser::Sentence);

impl<'a> fmt::Display for JSSentence<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = self.0;
        let proper_escaped_name = str::replace(&s.name.get_string(), "'", "\\'");
        
        if s.elements.is_empty(){
            write!(f, "make_atom_model('{}')", proper_escaped_name)
        } else {
            write!(f, "make_structured_model('{}', [", proper_escaped_name)?;
            for element in &s.elements {    
                write!(f, "{}, ", JSTerm(&element))?;
            }
            write!(f, "])")
        }
    }
}




struct JSVariable<'a>(&'a Variable);
impl<'a> fmt::Display for JSVariable<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let v = self.0;
        if v.get_is_head() {
            write!(f, "head_{}", v.get_variable_name())
        } else {
            write!(f, "var_{}", v.get_variable_name())
        }
    }
}

struct JSTerm<'a>(&'a parser::Term);
impl<'a> fmt::Display for JSTerm<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let term = self.0;
        match term {
            parser::Term::Sentence(s) => {
                write!(f, "{}", JSSentence(&s))
            },
            parser::Term::Variable(v) => {     
                write!(f, "{}", JSVariable(&v))
            },
            
        }

    }
}


use indoc::writedoc;

struct JSVerb<'a>(&'a ast::EmissionVerb, &'a Vec<Variable>, usize);
impl<'a> fmt::Display for JSVerb<'a> {
fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let verb = self.0;
    let variables = &self.1;
    let indent = self.2 as usize;
    match verb {
        ast::EmissionVerb::Cond(s, num) => {
            match s {
                ast::Semidet::Structure(x, sent) => {
                    writedoc!(f, "
                      {0:i$}{{
                      {0:i$}    const model = {1};
                      {0:i$}    const model_name = model.pprint();
                      {0:i$}    if ({2}.unify_with(model)){{
                      {0:i$}        dc.add_new_step(`${{{2}.direct_name()}} = ${{model_name}}`);
                      {0:i$}        cont_{3}();
                      {0:i$}    }} else {{
                      {0:i$}        dc.add_new_step(`Failed: ${{{2}.dereferenced_value().direct_name()}} = ${{model_name}}`);
                      {0:i$}    }}
                      {0:i$}}}
                      ", "", JSSentence(sent), JSVariable(x),
                           num, i=indent)
                    
                },
                ast::Semidet::Unify(a, b) => {
                    writedoc!(f, "
                      {0:i$}if ({1}.unify_with({2})){{
                      {0:i$}    dc.add_new_step(`${{{1}.direct_name()}} = ${{{2}.direct_name()}}`);
                      {0:i$}    cont_{3}();
                      {0:i$}}} else {{
                      {0:i$}    dc.add_new_step(`Failed: ${{{2}.dereferenced_value().direct_name()}} = ${{{2}.dereferenced_value().direct_name()}}`);
                      {0:i$}}}
                      ", "", JSVariable(a), JSVariable(b), num, i=indent)
                }
                
            }
            
        },

        ast::EmissionVerb::Or(clauses) => {
            for variable in *variables {
                if variable.get_is_head() {
                        continue;
                }
                writeln!(f, "{0:i$}const backup_{1} = {1}.backup_value(); reg_backup({1}, index);",
                         "", JSVariable(variable), i=indent)?;
            }
            writeln!(f,"{0:i$}trail.new_choice_point();", "", i=indent)?;
            
            for clause in clauses{    
                writeln!(f, "\n{}",
                         JSVerb(clause, variables, indent))?;
                
                
                for variable in *variables {
                    if variable.get_is_head() {
                        continue;
                    }
                    writeln!(f, "{0:i$}{1}.value = backup_{1};",
                         "", JSVariable(variable), i=indent)?;
                }
                writeln!(f,"{0:i$}trail.restore_choice_point();", "", i=indent)?;
                writeln!(f, "{0:i$}dc.add_new_step('backup restored');", "", i=indent)?;
            }
            writeln!(f,"{0:i$}trail.remove_choice_point();", "", i=indent)
              

        },

        ast::EmissionVerb::Call(predicate, num) => {
            write!(f, "{0:i$}predicates['{1}'](", "", predicate.name, i=indent)?;
            for variable in &predicate.elements{
                write!(f, "{}, ", JSVariable(variable))?;
            }
            writeln!(f, "index + 1, cont_{});", num)
        }
        

        
    }
}
}


fn emmit_procedure(f: &mut fmt::Formatter, proc : &ast::Procedure) -> fmt::Result {
    write!(f, "    ")?; write!(f, "'{}': (", proc.head.name)?;
    for arg in &proc.head.elements {
        write!(f, "{}, ", JSVariable(&arg))?;
    }
    
    writeln!(f, "index, cont_0) => {{")?;
    write!(f, "        ")?; writeln!(f, "new_backup_frame();")?;

    for variable in &proc.variables {
        //no need to initialize function parameters
        if variable.get_is_head() {
            continue;
        }
        
        
        write!(f, "        ")?;
        writeln!(f, "const {0}  = make_empty_variable('?{1}' + (index == 1 ? '' : index));",
                 JSVariable(&variable), variable.get_variable_name())?;
    }
    write!(f, "        ")?;
    writeln!(f, "dc.add_new_step('<{}> Entry' + (index == 1 ? '' : index));", proc.head.name)?;
    writeln!(f)?;
    

    for (i, cont) in proc.continuations.iter().enumerate() {
        write!(f, "        ")?;
        writeln!(f, "const cont_{} = () => {{", i+1)?;
        writeln!(f, "{}", JSVerb(&cont, &proc.variables, 12))?;
        writeln!(f,"        }};")?;
    }
    
    

    writeln!(f, "{}", JSVerb(&proc.body, &proc.variables, 8))?;

    write!(f, "        ")?; writeln!(f, "remove_backup_frame();")?;

    write!(f, "    ")?; writeln!(f, "}},")

   
}




