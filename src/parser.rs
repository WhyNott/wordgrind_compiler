#![allow(dead_code)]
#![allow(clippy::not_unsafe_ptr_arg_deref)]

use crate::tl_database::{
     new_atom,  new_variable, Atom, Context, Variable,
};

use std::fmt;
#[derive(Debug, Clone)]
pub struct Sentence {
    pub name: Atom,
    pub elements: Vec<Term>,
    pub context: Context,
}

impl fmt::Display for Sentence {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "'{}'(", self.name)?;
        for (i, element) in self.elements.iter().enumerate() {
            write!(f, "{}", element)?;
            if i != (self.elements.len() - 1) {
                write!(f, ", ")?;
            }
        }
        write!(f, ")")
    }
}

#[derive(Debug, Clone)]
pub enum Term {
    Sentence(Sentence),
    Variable(Variable),
}

impl Term {
    fn sentence_name(&self) -> Atom {
        match self {
            Term::Sentence(s) => s.name,

            Term::Variable(_) => {
                panic!("Attempted to get a sentence name of an unbound term!")
            }
        }
    }
}

impl fmt::Display for Term {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Term::Sentence(s) => {
                write!(f, "{}", s)
            }

            Term::Variable(v) => {
                write!(f, "{}", v)
            }
        }
    }
}
use std::collections::BTreeMap;


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
                    if i != (verbs.len() - 1) {
                        write!(f, ",")?;
                    }
                    write!(f, "\n")?;
                }
                write!(f, "     )")
            }
            LogicVerb::Or(verbs) => {
                write!(f, "or(")?;
                for (i, sentence) in verbs.iter().enumerate() {
                    write!(f, "{}", sentence)?;
                    if i != (verbs.len() - 1) {
                        write!(f, ",")?;
                    }
                }
                write!(f, ")")
            }
        }
    }
}


#[derive(Debug, Clone)]
pub struct Clause {
    pub head: Sentence,
    pub body: Option<LogicVerb>,
    pub context: Context,
}

impl fmt::Display for Clause {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.head)?;
        match &self.body {
            Some(body) => {
                write!(f, ":- \n     {}", body)
            }
            None => Ok(()),
        }
    }
}



//since now the variable id's are unique file-wise, there is no need for all this logic for getting the highest varset, etc

//Okay, this function I still need. 

pub fn join_clauses_of_same_predicate(
    separate_clauses_by_predicate: &BTreeMap<(Atom, i32), Vec<Clause>>,
) -> BTreeMap<(Atom, i32), Clause> {
    //map of values to be returned
    let mut joined_clause_by_predicate: BTreeMap<(Atom, i32), Clause> = BTreeMap::new();
    //we iterate on every individual predicate
    for (pred_id, separate_clauses) in separate_clauses_by_predicate.iter() {
        //if there is only one clause of the predicate, there is nothing to join
        if separate_clauses.len() == 1 {
            joined_clause_by_predicate.insert(*pred_id, separate_clauses[0].clone());
        } else {
            let (name, arity) = pred_id;

            

            let joined_clause_context = separate_clauses[0].context;
            //we create n new variable (where n is the number of arguments in the head of the predicate)
            let mut joined_clause_head_args = Vec::with_capacity(*arity as usize);
            for i in 0..*arity {
                joined_clause_head_args.push(Term::Variable(new_variable(
                    i.to_string(),
                    joined_clause_context,
                    true,
                )));
            }
            //we create a new head for the predicate with the variables
            let joined_head = Sentence {
                name: *name,
                elements: joined_clause_head_args.clone(),
                context: joined_clause_context,
            };
            
            //array to store the disjunct clauses after they are processed
            let mut disjunction: Vec<LogicVerb> =
                Vec::with_capacity(separate_clauses.len() as usize);

            for clause in separate_clauses {
                let mut clause_as_disjunct = Vec::with_capacity(*arity as usize);

                for (head_arg, joined_head_arg) in clause
                    .head
                    .elements
                    .iter()
                    .zip(joined_clause_head_args.iter())
                {
                    clause_as_disjunct.push(LogicVerb::Sentence(Sentence {
                        name: new_atom("{} = {}"),
                        elements: vec![head_arg.clone(), joined_head_arg.clone()],
                        context: match head_arg {
                            Term::Sentence(Sentence { context, .. }) => *context,
                            Term::Variable(v) => v.get_context(),
                        },
                    }));
                }

                match &clause.body {
                    Some(lv) => match lv {
                        LogicVerb::Sentence(s) => {
                            clause_as_disjunct.push(LogicVerb::Sentence(s.clone()));
                            disjunction.push(LogicVerb::And(clause_as_disjunct));
                        }
                        LogicVerb::And(and) => {
                            clause_as_disjunct.append(&mut and.clone());

                            disjunction.push(LogicVerb::And(clause_as_disjunct));
                        }
                        LogicVerb::Or(or) => {
                            clause_as_disjunct.push(LogicVerb::Or(or.clone()));
                            disjunction.push(LogicVerb::And(clause_as_disjunct));
                        }
                    },
                    None => {
                        if !clause_as_disjunct.is_empty() {
                            //some weird edge case I guess?
                            disjunction.push(if clause_as_disjunct.len() == 1 {
                                clause_as_disjunct
                                    .into_iter()
                                    .next()
                                    .expect("Disjunct is empty")
                            } else {
                                LogicVerb::And(clause_as_disjunct)
                            });
                        } else {
                            panic!(
                                "I think this should be a compiler error but I don't remember why"
                            );
                        }
                    }
                }
            }

            joined_clause_by_predicate.insert(
                pred_id.clone(),
                Clause {
                    head: joined_head,
                    body: Some(if disjunction.len() == 1 {
                        disjunction
                            .into_iter()
                            .next()
                            .expect("disjunction is empty")
                    } else {
                        LogicVerb::Or(disjunction)
                    }),
                    context: joined_clause_context,
                },
            );
        }
    }
    joined_clause_by_predicate
}

#[derive(Debug, Clone)]
pub struct Parameters {
    pub preconds: Vec<(Term, bool)>,
    pub effects: Vec<(Term, bool)>,
    pub description: Option<Term>,
    pub logic: Option<LogicVerb>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ElementType {
    Action,
    EarlyAction,
    Choice,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct ElementOptions {
    pub once: bool,
    pub hide_name: bool
}

#[derive(Debug, Clone)]
pub struct Element {
    pub tag: ElementType,
    pub name: Sentence,
    pub priority: i32,
    pub preconds: Vec<(Term, bool)>,
    pub effects: Vec<(Term, bool)>,
    pub description: Option<Term>,
    pub logic: Option<LogicVerb>,
    pub next_deck: Option<Term>,
    pub options: ElementOptions,
}



#[derive(Debug, Clone)]
pub struct InitialState {
    pub init_state: BTreeMap<Atom, Vec<Sentence>>,
    pub init_description: Option<Sentence>,
}

impl fmt::Display for InitialState {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        writeln!(f, "{{Initial state:")?;

        if let Some(s) = &self.init_description {
            writeln!(f, "Description: \n {}", s)?;
        }
  
        writeln!(f, "State:")?;
        for (name, element) in &self.init_state {
            writeln!(f, "-{}[", name)?;
            for subelement in element {
                writeln!(f, "--{}", subelement)?;
            }
            writeln!(f, "]")?;
        }
        writeln!(f, "}}")
    }
}


#[derive(Debug, Clone)]
pub struct Deck {
    pub weave: Vec<WeaveItem>,
    pub early_actions: Vec<Element>,
    pub choices: Vec<Element>,
    pub late_actions: Vec<Element>,
}


#[derive(Debug, Clone)]
pub enum WeaveItem {
    GatherPoint(Element),
    Choice(Element, usize),
}

#[derive(Debug, Clone)]
pub enum TopLevelItem {
    Clause,
    DeckOpen,
    DeckClose,
    Initial,
    Element,
}

#[derive(Debug, Clone)]
pub enum SpecialFactType {
    Unique,
    //Stackable
}
#[derive(Debug, Clone)]
pub struct Document {
    pub initial_conditions: Option<InitialState>,
    pub decks: BTreeMap<Atom, Deck>,
    pub predicates: BTreeMap<(Atom, i32), Clause>,
    pub special_facts: Vec<(Atom, SpecialFactType)>
}


