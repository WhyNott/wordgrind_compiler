use crate::rewrite_passes::emission as ast;
use std::fmt;

use std::{
    fs::File,
    io::{BufWriter, Write},
};


//this whole thing is MASSIVELY stupid
//there are more clones here then in... uh... place with a lot of clones

struct JSProcedure(ast::Procedure);

impl fmt::Display for JSProcedure {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        emmit_procedure(f, &self.0)
    }
}

pub fn print_procedure(proc : ast::Procedure){
    println!("{}", JSProcedure(proc));
}


pub fn write_procedure( f : &mut std::io::BufWriter<&std::fs::File>, proc : ast::Procedure){
    writeln!(f,"{}", JSProcedure(proc));
}



use crate::parser as parser;


struct JSSentence(parser::Sentence);

impl fmt::Display for JSSentence {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = &self.0;
        if s.elements.is_empty(){
            write!(f, "make_atom_model('{}')", s.name)
        } else {
            write!(f, "make_structured_model('{}', [", s.name)?;
            for element in &s.elements {    
                write!(f, "{}, ", JSTerm(element.clone()))?;
            }
            write!(f, "])")
        }
    }
}




struct JSVariable(parser::Variable);
impl fmt::Display for JSVariable {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let v = &self.0;
        if v.is_head {
            write!(f, "{}", v.variable_name)
        } else {
            write!(f, "var_{}", v.variable_name)
        }
    }
}

struct JSTerm(parser::Term);
impl fmt::Display for JSTerm {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let term = &self.0;
        match term {
            parser::Term::Sentence(s) => {
                write!(f, "{}", JSSentence(s.clone()))
            },
            parser::Term::Variable(v) => {     
                write!(f, "{}", JSVariable(v.clone()))
            },
            
        }

    }
}


use indoc::writedoc;

struct JSVerb(ast::EmissionVerb, Vec<parser::Variable>, usize);
impl fmt::Display for JSVerb {
fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let verb = &self.0;
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
                      {0:i$}    }}
                      {0:i$}}}
                      ", "", JSSentence(sent.clone()), JSVariable(x.clone()),
                           num, i=indent)
                    
                },
                ast::Semidet::Unify(a, b) => {
                    writedoc!(f, "
                      {0:i$}if ({1}.unify_with({2})){{
                      {0:i$}    dc.add_new_step(`${{{1}.direct_name()}} = ${{{2}.direct_name()}}`);
                      {0:i$}    cont_{3}();
                      {0:i$}}}
                      ", "", JSVariable(a.clone()), JSVariable(b.clone()), num, i=indent)
                }
                
            }
            
        },

        ast::EmissionVerb::Or(clauses) => {
            for variable in variables {
                writeln!(f, "{0:i$}const backup_{1} = {1}.backup_value(); reg_backup({1}, index);",
                         "", JSVariable(variable.clone()), i=indent)?;
            }
            writeln!(f)?;
            
            for clause in clauses{    
                writeln!(f, "\n{}",
                         JSVerb((*clause).clone(), variables.clone(), indent))?;
                
                
                for variable in variables {
                    writeln!(f, "{0:i$}{1}.value = backup_{1};",
                         "", JSVariable(variable.clone()), i=indent)?;
                }
                writeln!(f, "{0:i$}dc.add_new_step('backup restored');", "", i=indent)?;
            }
            Ok(())
              

        },

        ast::EmissionVerb::Call(predicate, num) => {
            write!(f, "{0:i$}predicates['{1}'](", "", predicate.name, i=indent)?;
            for variable in &predicate.elements{
                write!(f, "{}, ", JSVariable(variable.clone()))?;
            }
            writeln!(f, "index + 1, cont_{});", num)
        }
        

        
    }
}
}

fn emmit_procedure(f: &mut fmt::Formatter, proc : &ast::Procedure) -> fmt::Result {
    write!(f, "    ")?; write!(f, "'{}': (", proc.head.name)?;
    for arg in &proc.head.elements {
        write!(f, "{}, ", arg.variable_name)?;
    }
    
    writeln!(f, "index, cont_0) => {{")?;
    write!(f, "        ")?; writeln!(f, "new_backup_frame();")?;
    
    for variable in &proc.variables {
        //no need to initialize function parameters
        if variable.is_head {
            continue;
        }
        
        write!(f, "        ")?;
        writeln!(f, "const var_{0}  = make_empty_variable('?{0}' + (index == 1 ? '' : index));",
                 variable.variable_name)?;
    }
    write!(f, "        ")?;
    writeln!(f, "dc.add_new_step('<{}> Entry' + (index == 1 ? '' : index));", proc.head.name)?;
    writeln!(f)?;
    

    for (i, cont) in proc.continuations.iter().enumerate() {
        write!(f, "        ")?;
        writeln!(f, "const cont_{} = () => {{", i+1)?;
        writeln!(f, "{}", JSVerb(cont.clone(), proc.variables.clone(), 12))?;
        writeln!(f,"        }};")?;
    }
    
    

    writeln!(f, "{}", JSVerb(proc.body.clone(), proc.variables.clone(), 8))?;

    write!(f, "        ")?; writeln!(f, "remove_backup_frame();")?;

    write!(f, "    ")?; writeln!(f, "}},")

   
}





