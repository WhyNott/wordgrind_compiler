#![allow(dead_code)]
#![allow(clippy::not_unsafe_ptr_arg_deref)]

//time to gut this thing completely.
//Lets turn lsp on, and fix up the imminent error

use crate::tl_database::{
    existing_variable, new_atom, new_context, new_variable, Atom, Context, Variable,
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

fn join_clauses_of_same_predicate(
    separate_clauses_by_predicate: &BTreeMap<(Atom, i32), Vec<Clause>>,
) -> BTreeMap<(Atom, i32), Clause> {
    let mut joined_clause_by_predicate: BTreeMap<(Atom, i32), Clause> = BTreeMap::new();
    for (pred_id, separate_clauses) in separate_clauses_by_predicate.iter() {
        if separate_clauses.len() == 1 {
            joined_clause_by_predicate.insert(*pred_id, separate_clauses[0].clone());
        } else {
            let (name, arity) = pred_id;

            let mut joined_clause_head_args = Vec::with_capacity(*arity as usize);

            let joined_clause_context = separate_clauses[0].context;

            for i in 0..*arity {
                joined_clause_head_args.push(Term::Variable(new_variable(
                    i.to_string(),
                    joined_clause_context,
                    true,
                )));
            }
            let joined_head = Sentence {
                name: *name,
                elements: joined_clause_head_args.clone(),
                context: joined_clause_context,
            };
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

#[derive(Debug, Clone)]
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

//list of components that need to be generated for an element:

//- name
//- list of all variables
//- description
//- options
//- effects
//- next deck
//- logic
//- preconditions




#[derive(Debug, Clone)]
pub struct InitialState {
    pub init_state: Vec<Sentence>,
    pub init_description: Option<Sentence>,
}


#[derive(Debug, Clone)]
pub struct Deck {
    pub early_actions: Vec<Element>,
    pub choices: Vec<Element>,
    pub late_actions: Vec<Element>,
}

//Add data structures for weaving
pub enum WeaveItem {
    GatherPoint(Sentence),
    Choice(Sentence, Vec<WeaveItem>)
}


pub enum TopLevelItem {
    Clause,
    DeckOpen,
    DeckClose,
    Initial,
    Element,
}


pub enum SpecialFactType {
    Unique,
    //Stackable
}
//No, you have had enough. Take a rest now. 
pub struct Document {
    pub initial_conditions: Option<InitialState>,
    pub decks: BTreeMap<Atom, Deck>,
    pub predicates: BTreeMap<(Atom, i32), Clause>,
    pub special_facts: Vec<(Atom, SpecialFactType)>
}

pub fn consult_file(filename: &str) -> Document {
    fn make_atom(name: &str) -> Term {
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
        Term::Sentence(Sentence{
            name: new_atom(&name.to_string()),
            elements: Vec::new(),
            context
        })
    }
    fn make_atom_n(name: &str) -> Sentence {
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
        Sentence{
            name: new_atom(&name.to_string()),
            elements: Vec::new(),
            context
        }
    }
    
    fn make_structured_term(name: &str, elements: Vec<Term>) -> Term {
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
        Term::Sentence(Sentence{
            name: new_atom(&name.to_string()),
            elements:elements.clone(),
            context
        })
    }
    fn make_structured_term_n(name: &str, elements: Vec<Term>) -> Sentence {
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
        Sentence{
            name: new_atom(&name.to_string()),
            elements:elements.clone(),
            context
        }
    }
    fn make_variable(name: &str) -> Term {
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
        Term::Variable(
             new_variable(name.to_string(), context, false)
        )
    }

    
    
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
    let mut decks =  BTreeMap::new();
    {
        let var_AP = make_variable("?AP");
        let var_Civ = make_variable("?Civ");
        let var_Week = make_variable("?Week");

        //for End week
        let var_Current = make_variable("?Current");
        let var_Next = make_variable("?Next");
        
        decks.insert(new_atom("default"), Deck{
            early_actions: vec![
                Element {
                    tag: ElementType::EarlyAction,
                    name: make_atom_n("Show Stats"),
                    priority: 1,
                    preconds: vec![
                        (make_structured_term("{} action points", vec![var_AP.clone()]), true),
                        (make_structured_term("civilisation {}", vec![var_Civ.clone()]), true),
                        (make_structured_term("week {}", vec![var_Week.clone()]), true),
                    ],
                    effects: vec![],
                    description: Some(
                        make_structured_term(
                            "<p>It is week {}.</p> <p>You have {} AP, and your civ stat is {}.</p>",
                            vec![var_Week.clone(), var_AP.clone(), var_Civ.clone()]
                        )
                    ),
                    logic: None,
                    next_deck: None,
                    options: ElementOptions {once: true, hide_name: true}
                }
            ],
            choices: vec![
                Element {
                    tag: ElementType::Choice,
                    name: make_atom_n("Stay here"),
                    priority: 1,
                    preconds: vec![],
                    effects: vec![],
                    description: None,
                    logic: None,
                    next_deck: Some(make_atom("Light world")),
                    options: ElementOptions {once: false, hide_name: true}
                },
                Element {
                    tag: ElementType::Choice,
                    name: make_atom_n("Cross over"),
                    priority: 2,
                    preconds: vec![],
                    effects: vec![],
                    description: None,
                    logic: None,
                    next_deck: Some(make_atom("Dark world")),
                    options: ElementOptions {once: false, hide_name: true}
                },
                Element {
                    tag: ElementType::Choice,
                    name: make_atom_n("Plan"),
                    priority: 3,
                    preconds: vec![],
                    effects: vec![],
                    description: None,
                    logic: None,
                    next_deck: Some(make_atom("Plan")),
                    options: ElementOptions {once: false, hide_name: true}
                },

                Element {
                    tag: ElementType::Choice,
                    name: make_atom_n("End week"),
                    priority: 4,
                    next_deck: None,
                    preconds: vec![
                        (make_structured_term("week {}", vec![var_Current.clone()]), true)
                    ],
                    effects: vec![
                        (make_structured_term("{} action points", vec![make_atom("7")]),  true),
                        (make_structured_term("week {}", vec![var_Next.clone()]), true)
                    ],
                    description: None,
                    logic: Some(LogicVerb::Sentence(
                        Sentence {
                            name: new_atom("{} + {} = {}"),
                            elements: vec![var_Current.clone(), make_atom("1"), var_Next.clone()],
                            context
                        }
                    )),
                    options: ElementOptions {once: false, hide_name: true}
                },

            ],
            late_actions: vec![],
        });
    }
    //let me check, how many more?
    //uh, 7 I guess
    {
        //Go to work
        let var_AP = make_variable("?AP");
        let var_APNext = make_variable("?APNext");
        let var_Civ = make_variable("?Civ");
        let var_CivNext = make_variable("?CivNext");
        
        decks.insert(new_atom("Light world"), Deck {
            early_actions: vec![],
            choices: vec![
                Element {
                    tag: ElementType::Choice,
                    name: make_atom_n("Go to work"),
                    priority: 1,
                    preconds: vec![
                        (make_structured_term("{} action points", vec![var_AP.clone()]), true), 
                        (make_structured_term("civilisation {}", vec![var_Civ.clone()]), true),
                    ],
                    effects: vec![
                        (make_structured_term("{} action points", vec![var_APNext.clone()]), true),
                        (make_structured_term("civilisation {}", vec![var_CivNext.clone()]), true)
                    ],
                    description: None,
                    //
                    logic: Some(LogicVerb::And(vec![
                        LogicVerb::Sentence(
                            make_structured_term_n("{} greater than {}", vec![var_AP.clone(), make_atom("0")])
                        ),
                        LogicVerb::Sentence(
                            make_structured_term_n("{} - {} = {}", vec![var_AP, make_atom("1"), var_APNext])
                        ),
                       LogicVerb::Sentence(make_structured_term_n("{} is shifted to {} as {}", vec![
                            var_Civ,
                            make_atom("+"),
                            var_CivNext
                        ])),
                    ])),
                    next_deck: None,
                    options: ElementOptions {once: false, hide_name: false}
                },
            ],
            late_actions: vec![],
        });
        
    }
    //decks.insert(new_atom(), Deck{
    //    early_actions: vec![],
    //    choices: vec![],
    //    late_actions: vec![],
    //});
    //decks.insert(new_atom(), Deck{
    //    early_actions: vec![],
    //    choices: vec![],
    //    late_actions: vec![],
    //});
    
    Document {
        decks,
        predicates: BTreeMap::new(),
        special_facts: vec![
            (new_atom("week {}"), SpecialFactType::Unique),
            (new_atom("{} action points"), SpecialFactType::Unique),
            (new_atom("civilisation {}"), SpecialFactType::Unique),
        ],
        initial_conditions: Some(
            InitialState{
                init_description: None,
                init_state: vec![
                    make_structured_term_n("week {}", vec![make_atom("1")]),
                    make_structured_term_n("{} action points", vec![make_atom("7")]),
                    make_structured_term_n("civilisation {}", vec![make_atom("5")])
                ]                        
            }
        ),
        

    }
    
}

use unicode_segmentation::UnicodeSegmentation;
use unicode_segmentation::UWordBounds;
use std::collections::HashMap;

pub fn term_parse(source: &mut UWordBounds,  v_map: &mut HashMap<String, Variable>, context: Context) -> Term {
    if source.as_str() == "?" {
        source.next();
        //code for handling variable
        let var = match v_map.get(source.as_str()) {
            None => {
                let v = new_variable(source.as_str().to_string(), context, false);
                v_map.insert(source.as_str().to_string(), v);
                v
            },
            Some(v) => *v

        };
        
        Term::Variable(var)
        
    } else {
        if source.as_str() == "<" {
            source.next();
        }
        let mut sentence_name = String::new();
        let mut elements = Vec::new();
        //Ugh, its actually realy out of whack
        loop {
            match source.as_str() {
                "?" | "<" => {
                    elements.push(term_parse(source, v_map, context));
                    sentence_name.push_str("{}");
                },
                ">" | "" => {
                    let name = new_atom(&sentence_name);
                    return Term::Sentence(Sentence {name, elements, context});
                },
                s => {
                    sentence_name.push_str(s);
                }
            }

        }
    }
    
} 
