#![allow(dead_code)]
#![allow(clippy::not_unsafe_ptr_arg_deref)]

mod parser_c {
    #![allow(non_upper_case_globals)]
    #![allow(non_camel_case_types)]
    #![allow(non_snake_case)]

    include!(concat!(env!("OUT_DIR"), "/parser_bindings.rs"));
}

use std::ffi::CStr;
use std::ffi::CString;
use std::slice;

use crate::tl_database::{
    existing_variable, new_atom, new_context, new_variable, Atom, Context, Variable,
};

pub fn rustify_context(context: *const parser_c::Context) -> Context {
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

    new_context(leading_whitespace, line_number, column_number, file_name)
}
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

pub fn rustify_sentence(
    sentence: *const parser_c::Sentence,
    varset: &mut BTreeMap<String, i32>,
) -> Term {
    if unsafe { (*sentence).name.is_null() } {
        let variable;
        let variable_name;

        let context;
        unsafe {
            variable = sentence as *const parser_c::VariableSentence;
            variable_name = CStr::from_ptr((*variable).variable_name)
                .to_str()
                .expect("Incorrect utf8 data in variable name")
                .to_string();
            //note - the variable id used in the parser probably won't be needed anymore
            //variable_id = (*variable).variable_id;
            context = rustify_context((*variable).context);
        }
        if varset.contains_key(&variable_name) {
            let variable_id: i32;
            variable_id = *varset.get(&variable_name).expect("Item missing");
            Term::Variable(existing_variable(variable_id))
        } else {
            let retvar = new_variable(variable_name.clone(), context, false);
            varset.insert(variable_name, retvar.get_variable_id());
            Term::Variable(retvar)
        }
    } else {
        unsafe {
            let name = CStr::from_ptr((*sentence).name)
                .to_str()
                .expect("Incorrect utf8 data in sentence name")
                .to_string();
            let elements_old: &[parser_c::Sentence] =
                slice::from_raw_parts((*sentence).elements, (*sentence).elements_length as usize);
            let mut elements_new = Vec::with_capacity((*sentence).elements_length as usize);

            for element in elements_old {
                elements_new.push(rustify_sentence(element, varset));
            }
            let context = rustify_context((*sentence).context);

            Term::Sentence(Sentence {
                name: new_atom(&name),
                elements: elements_new,
                context,
            })
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

pub fn rustify_logic_verb(
    lverb: *const parser_c::LogicVerb,
    varset: &mut BTreeMap<String, i32>,
) -> LogicVerb {
    unsafe {
        let mut process_contents = || {
            let nested = *(*lverb).contents.nested;
            let contents_old: &[parser_c::LogicVerb] =
                slice::from_raw_parts(nested.contents, nested.contents_length as usize);
            let mut contents_new = Vec::with_capacity(nested.contents_length as usize);
            for element in contents_old {
                contents_new.push(rustify_logic_verb(element, varset));
            }
            contents_new
        };

        match (*lverb).type_ {
            parser_c::VerbType_L_SENTENCE => {
                LogicVerb::Sentence(match rustify_sentence((*lverb).contents.basic, varset) {
                    Term::Sentence(s) => s,
                    Term::Variable(v) => panic!("Clause head is variable: {:?}", v),
                })
            }
            parser_c::VerbType_L_AND => LogicVerb::And(process_contents()),
            parser_c::VerbType_L_OR => LogicVerb::And(process_contents()),
            _ => panic!("Incorrect logic_verb type!"),
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

pub fn rustify_clause(cl: *const parser_c::Clause, varset: &mut BTreeMap<String, i32>) -> Clause {
    unsafe {
        Clause {
            head: match rustify_sentence((*cl).head, varset) {
                Term::Sentence(s) => s,
                Term::Variable(v) => panic!("Clause head is variable: {:?}", v),
            },
            body: if (*cl).body.is_null() {
                None
            } else {
                Some(rustify_logic_verb((*cl).body, varset))
            },
            context: rustify_context((*cl).context),
        }
    }
}

pub fn tokenize_file<'a>(filename: &'a str, x: &'a mut i32) -> i32 {
    let c_filename = CString::new(filename).expect("CString::new failed");
    unsafe { parser_c::consult_file_oracle(c_filename.as_ptr() as *mut i8, x) }
}

use std::mem::MaybeUninit;

pub fn parse_clause(
    tokens_counter: &mut i32,
    tokens_size: &i32,
    oracle_counter: &mut i32,
) -> Clause {
    let oracle_size = 0; //I have a theory that this actually doesn't matter
    let clause;

    unsafe {
        let mut mu_clause = MaybeUninit::<parser_c::Clause>::zeroed();
        parser_c::clause_parse(
            mu_clause.as_mut_ptr(),
            parser_c::tokens,
            *tokens_size,
            tokens_counter,
            parser_c::oracle_base,
            oracle_size,
            oracle_counter,
        );
        clause = mu_clause.assume_init();
    }
    rustify_clause(&clause, &mut BTreeMap::new())
}

//since now the variable id's are unique file-wise, there is no need for all this logic for getting the highest varset, etc

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

fn rustify_parameters(
    param: *const parser_c::Parameters,
    varset: &mut BTreeMap<String, i32>,
) -> Parameters {
    let old_preconds: &[parser_c::AddRemSentence];
    let preconds_length;
    let old_effects: &[parser_c::AddRemSentence];
    let effects_length;
    let description;
    let logic;
    unsafe {
        preconds_length = (*param).preconds_length as usize;
        old_preconds = slice::from_raw_parts((*param).preconds, preconds_length);
        effects_length = (*param).effects_length as usize;
        old_effects = slice::from_raw_parts((*param).effects, effects_length);
        description = if (*param).description.is_null() {
            None
        } else {
            Some(rustify_sentence((*param).description, varset))
        };
        logic = if (*param).description.is_null() {
            None
        } else {
            Some(rustify_logic_verb((*param).logic, varset))
        };
    }
    let mut preconds = Vec::with_capacity(preconds_length);
    for precond in old_preconds {
        preconds.push((rustify_sentence(&precond.s, varset), precond.remove));
    }
    let mut effects = Vec::with_capacity(effects_length);
    for effect in old_effects {
        effects.push((rustify_sentence(&effect.s, varset), effect.remove));
    }

    Parameters {
        preconds,
        effects,
        description,
        logic,
    }
}

#[derive(Debug, Clone)]
pub enum ElementType {
    Action,
    EarlyAction,
    Choice,
}

#[derive(Debug, Clone)]
pub struct Element {
    tag: ElementType,
    name: Term,
    priority: i32,
    parameters: Parameters,
    next_deck: Option<Atom>,
}

fn rustify_element(
    element: *const parser_c::Element,
    varset: &mut BTreeMap<String, i32>,
) -> (Element, Option<Atom>) {
    let tag;
    let name;
    let priority;
    let parameters;
    let deck;
    let next_deck;

    unsafe {
        tag = match (*element).type_ {
            parser_c::ElementType_E_EARLY_ACTION => ElementType::EarlyAction,
            parser_c::ElementType_E_CHOICE => ElementType::Choice,
            parser_c::ElementType_E_LATE_ACTION => ElementType::Action,
            _ => panic!("Incorrect element type!"),
        };
        name = rustify_sentence((*element).name, varset);
        priority = (*element).priority;
        parameters = rustify_parameters((*element).params, varset);
        deck = if (*element).deck.is_null() {
            None
        } else {
            Some(rustify_sentence((*element).deck, varset).sentence_name())
        };
        next_deck = if (*element).next_deck.is_null() {
            None
        } else {
            Some(rustify_sentence((*element).next_deck, varset).sentence_name())
        };
    }

    (Element {
        tag,
        name,
        priority,
        parameters,
        next_deck,
    }, deck)
}

#[derive(Debug, Clone)]
pub struct InitialState {
    pub init_state: Vec<(Term, bool)>,
    pub init_description: Option<Term>,
}

fn rustify_initial_state(
    initial: *const parser_c::InitialState,
    varset: &mut BTreeMap<String, i32>,
) -> InitialState {
    let mut init_state;
    let old_init_state;
    let init_description;
    unsafe {
        let state_len = (*initial).state_length as usize;
        init_state = Vec::with_capacity(state_len);
        old_init_state = slice::from_raw_parts((*initial).init_state, state_len);
        init_description = if (*initial).init_description.is_null() {
            None
        } else {
            Some(rustify_sentence((*initial).init_description, varset))
        };
    }

    for state in old_init_state {
        init_state.push((rustify_sentence(&state.s, varset), state.remove));
    }

    InitialState {
        init_state,
        init_description,
    }
}

#[derive(Debug, Clone)]
pub struct Deck {
    pub early_actions: Vec<Element>,
    pub choices: Vec<Element>,
    pub late_actions: Vec<Element>,
}


pub enum TopLevelItem {
    Clause,
    DeckOpen,
    DeckClose,
    Initial,
    Element,
}

pub fn next_toplevel_item(oracle_counter: &mut i32) -> TopLevelItem {
    unsafe {
        let item_token = (*(parser_c::oracle_base.offset(*oracle_counter as isize))).toplevel;
        if item_token.tag != parser_c::OIType_OI_TOPLEVEL {
            panic!("Wrong token tag!");
        };
        match item_token.toplevel_tag {
            parser_c::ToplevelType_TP_CLAUSE => TopLevelItem::Clause,
            parser_c::ToplevelType_TP_DECK_OPEN => TopLevelItem::DeckOpen,
            parser_c::ToplevelType_TP_DECK_CLOSE => TopLevelItem::DeckClose,
            parser_c::ToplevelType_TP_INITIAL => TopLevelItem::Initial,
            parser_c::ToplevelType_TP_ELEMENT => TopLevelItem::Element,
            _ => panic!("Incorrect enum type!"),
        }
    }
}

pub struct Document {
    pub initial_conditions: Option<InitialState>,
    pub decks: BTreeMap<Atom, Deck>,
    pub predicates: BTreeMap<(Atom, i32), Clause>
}

pub fn consult_file(filename: &str) -> BTreeMap<(Atom, i32), Clause> {
    let mut tokens_size = 0;
    tokenize_file(filename, &mut tokens_size);
    let mut tokens_counter = 0;
    let mut oracle_counter = 0;
    let default = new_atom("default");
    let mut current_deck = default;
    let mut initial = None;
    let mut map: BTreeMap<(Atom, i32), Vec<Clause>> = BTreeMap::new();
    let mut map_decks: BTreeMap<Atom, Deck> = BTreeMap::new();

    //todo: this code should recognize tp_clause, tp_deck_open, tp_deck_close, tp_initial and tp_element
    //all thats left now is deck open and close!
    while tokens_counter < tokens_size {
        oracle_counter += 1;
        let next = next_toplevel_item(&mut oracle_counter);
        match next {
            TopLevelItem::Clause => {
                assert!(current_deck == default);
                let clause = parse_clause(&mut tokens_counter, &tokens_size, &mut oracle_counter);

                tokens_counter += 1;
                let arity = clause.head.elements.len() as i32;
                let cl_name = clause.head.name;

                let key = (cl_name, arity);
                if map.contains_key(&key) {
                    map.get_mut(&key).expect("404: not found").push(clause);
                } else {
                    map.insert(key, vec![clause]);
                }
            },

            TopLevelItem::Initial => {
                initial = unsafe {
                    let mut mu_initial = MaybeUninit::<parser_c::InitialState>::zeroed();
                    parser_c::initial_parse(
                        mu_initial.as_mut_ptr(),
                        parser_c::tokens,
                        tokens_size,
                        &mut tokens_counter,
                        parser_c::oracle_base,
                        0,
                        &mut oracle_counter,
                    );
                    Some(rustify_initial_state(&mu_initial.assume_init(), &mut BTreeMap::new()))               
                };
                tokens_counter += 1;
            },
            
            TopLevelItem::Element => {
                let (element, el_deck) = unsafe {
                    let mut mu_element = MaybeUninit::<parser_c::Element>::zeroed();
                    parser_c::element_parse(
                        mu_element.as_mut_ptr(),
                        parser_c::tokens,
                        tokens_size,
                        &mut tokens_counter,
                        parser_c::oracle_base,
                        0,
                        &mut oracle_counter,
                    );
                    rustify_element(&mu_element.assume_init(), &mut BTreeMap::new())               
                };
                tokens_counter += 1;
                
                let element_deck = match el_deck {
                    None => {
                        current_deck
                    }
                    Some(deck) => {
                        assert!(current_deck == default);
                        deck
                    }
                };
                //todo: write all that code that actually inserts these elements into the map
                //inserts if it exists, create new deck otherwise
                if map_decks.contains_key(&element_deck) {
                    let deck = map_decks.get_mut(&element_deck).expect("404: not found");
                    match element.tag {
                        ElementType::Action => {
                            deck.late_actions.push(element)
                        },
                        ElementType::EarlyAction => {
                             deck.early_actions.push(element)
                        },
                        ElementType::Choice => {
                             deck.choices.push(element)
                        },
                    }
                } else {
                    let mut deck = Deck {early_actions: Vec::new(), late_actions: Vec::new(), choices: Vec::new()};
                    match element.tag {
                        ElementType::Action => {
                            deck.late_actions.push(element)
                        },
                        ElementType::EarlyAction => {
                             deck.early_actions.push(element)
                        },
                        ElementType::Choice => {
                             deck.choices.push(element)
                        },
                    }
                    map_decks.insert(element_deck, deck);
                }
            }
            _ => panic!("not implemented yet"),
        }
    }

    clean_up_memory();
    join_clauses_of_same_predicate(&map)
}

pub fn clean_up_memory() {
    unsafe {
        parser_c::globals_free();
    }
}
