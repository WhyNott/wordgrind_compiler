use unicode_segmentation::UnicodeSegmentation;
use unicode_segmentation::UWordBounds;
use std::collections::HashMap;
use std::iter::Peekable; 

use crate::tl_database::{
     new_atom, new_context, new_variable, Atom, Context, Variable,
};

use crate::parser::{
    Sentence, Term, LogicVerb, Clause, ElementType, ElementOptions, Element,
    InitialState, Deck, WeaveItem, SpecialFactType, Document,
    join_clauses_of_same_predicate
};
use std::collections::BTreeMap;

extern crate yaml_rust;
use yaml_rust::yaml::{Yaml};


pub fn document_parse(yaml_doc:&Yaml) -> Document {
    let mut initial_conditions: Option<InitialState> = None;  
    let mut decks: BTreeMap<Atom, Deck> = BTreeMap::new();                
    let mut predicates: BTreeMap<(Atom, i32), Clause> = BTreeMap::new();                
    let mut special_facts: Vec<(Atom, SpecialFactType)> = Vec::new();

    let emsg = "Incorrect document format";
    for (key, value) in yaml_doc.as_hash().expect(emsg) {
        match key.as_str().expect(emsg) {
            "Initial state" => {
                initial_conditions = Some(initial_state_parse(value));
            },
            "Unique facts" => {
                for fact in value.as_vec().expect(emsg) {
                    //ugly hack, but works for now
                    let name = new_atom(&fact.as_str().expect(emsg).replace("?_", "{}"));
                    special_facts.push((name, SpecialFactType::Unique));
                }
            },
            "Predicates" => {
                let mut separarate_predicates: BTreeMap<(Atom, i32), Vec<Clause>> = BTreeMap::new();
                
                for pred in value.as_vec().expect(emsg) {
                    let clause = clause_parse(pred);
                    let head = (clause.head.name, clause.head.elements.len() as i32);
                    if let Some(vect) = separarate_predicates.get_mut(&head) {
                        vect.push(clause);
                    } else {
                        separarate_predicates.insert(head, vec![clause]);
                    }
                }
                predicates = join_clauses_of_same_predicate(&separarate_predicates);
            },
            s => {
                let deck_name = new_atom(s);
                let deck: Deck = deck_parse(deck_name, value);
                decks.insert(deck_name, deck);
            }
            
        }
        
    }

    Document { initial_conditions, decks, predicates, special_facts}

}

fn element_parse(key:&Yaml, hash_data:&Yaml, tag: ElementType) -> Element {
    let emsg = "Incorrect document format";
    let mut v_map : HashMap<String, Variable> = HashMap::new();
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());

    let name: Sentence = match term_parse(
        key.as_str().expect(emsg), &mut v_map, context) {

        Term::Sentence(s) => s,
    
        Term::Variable(v) => Sentence {
            name: new_atom("{}"),
            elements: vec![Term::Variable(v)],
            context
        }
    };

    hash_data["priority"].is_badvalue();
    
    let priority: i32 = if let Yaml::Integer(int) = hash_data["priority"] {
        int as i32 //lol
    } else {0};
    
    let preconds: Vec<(Term, bool)> = if let Yaml::Array(arr) = &hash_data["available when"] {
        let mut new_arr = Vec::with_capacity(arr.len());
        for sent in arr {
            let value = if let Yaml::String(strg) = sent {
                (term_parse(&strg,&mut v_map, context), true)
            } else {
                (term_parse(sent["not"].as_str().expect(emsg), &mut v_map, context), false)
            };
            new_arr.push(value);
        }
        new_arr
    } else {Vec::new()};
    
    

        
    let effects: Vec<(Term, bool)> = if let Yaml::Array(arr) = &hash_data["causes"] {
        let mut new_arr = Vec::with_capacity(arr.len());
        for sent in arr {
            let value = if let Yaml::String(s) = sent {
                (term_parse(&s, &mut v_map, context), true)
            } else {
                (term_parse(sent["removes"].as_str().expect(emsg), &mut v_map, context), false)
            };
            new_arr.push(value);
        }
         new_arr
    } else {Vec::new()};

    
    
    let description: Option<Term> = if let Yaml::String(s) = &hash_data["displays"] {
        Some(term_parse(&s, &mut v_map, context))
    } else {
        None
    };
    
    let logic: Option<LogicVerb> = if !hash_data["such that"].is_badvalue() {
        Some(logic_verb_parse(&hash_data["such that"], &mut v_map))
    } else {
        None
    };
        
    let next_deck: Option<Term> = if let Yaml::String(s) = &hash_data["next deck"] {
        Some(term_parse(&s, &mut v_map, context))
    } else {
        None
    };
    let mut options = ElementOptions {once: false, hide_name: false};
    if !hash_data["options"].is_badvalue(){
        if !hash_data["options"]["once"].is_badvalue(){
            options.once = hash_data["options"]["once"].as_bool().expect(emsg)
        }
        if !hash_data["options"]["hide name"].is_badvalue(){
            options.hide_name = hash_data["options"]["hide name"].as_bool().expect(emsg)
        }
    }

    Element {tag, name, priority, preconds, effects, description, logic, next_deck, options}
}

fn clause_parse(data: &Yaml) -> Clause {
    let head: Sentence;         
    let body: Option<LogicVerb>;
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
    let emsg = "Incorrect document format";
    let mut v_map : HashMap<String, Variable> = HashMap::new();
    
    let head_str = if let Yaml::String(string) = data {
        body = None;
        string
    } else {
        let (head, bod) = data.as_hash().expect(emsg).iter().next().expect(emsg);
        body = Some(logic_verb_parse(bod, &mut v_map));
        head.as_str().expect(emsg)
    };

    if let Term::Sentence(s) = term_parse(&head_str, &mut v_map, context) {
        head = s;
    } else {
        panic!("variable shouldnt be here");
    }
    
    Clause {head, body, context}
}


fn logic_verb_parse(data: &Yaml, v_map: &mut HashMap<String, Variable>) -> LogicVerb {
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
    
    if let Yaml::String(string) = data {
         if let Term::Sentence(s) = term_parse(&string, v_map, context) {
            LogicVerb::Sentence(s)
        } else {
            panic!("variable shouldnt be here");
        }
    } else {
        if let Yaml::Array(and) = &data["and"] {
            let mut and_processed = Vec::with_capacity(and.len());
            for item in and {
                and_processed.push(logic_verb_parse(&item, v_map));
            }
            LogicVerb::And(and_processed)
            
        } else if let Yaml::Array(or) = &data["or"] {
            let mut or_processed = Vec::with_capacity(or.len());
            for item in or {
                or_processed.push(logic_verb_parse(&item, v_map));
            }
            LogicVerb::Or(or_processed)
            
        } else {
            panic!("Incorrect logic verb type!");
        }
    }
}

fn weave_parse(deck_name: Atom, yaml_data: &Yaml) -> Vec<WeaveItem> {
    fn create_element(deck_name: Atom, name: &str, tag: ElementType) -> Element {
        let mut v_map : HashMap<String, Variable> = HashMap::new();
        let context = new_context("".to_string(), 0, 0, "Forged!".to_string());

        let options = if tag == ElementType::Choice {
            ElementOptions {once: false, hide_name: false}
        } else {
            ElementOptions {once: true, hide_name: true}
        };
        
        Element {
            tag,
            name: match term_parse(name, &mut v_map, context) {
                Term::Sentence(s) => s,
                _ => panic!("variable shouldnt be here"),
            },
            priority: 0,
            preconds: vec![],
            effects: vec![],
            description: if tag == ElementType::Choice {
                None
            }
            else {
                Some(term_parse(name, &mut v_map, context))
            },
            logic: None,
            next_deck: Some(Term::Sentence(Sentence{name: deck_name, elements: vec![], context})),
            options: options
        }
    }
    
    fn weave_parse_choice(deck_name: Atom, yaml_data: &Yaml, tape: &mut Vec<WeaveItem>) {
        let emsg = "Incorrect document format";
        if let Yaml::Array(data) = yaml_data {
            for item in data {
                let item_name;
                let item_contents;
                if let Yaml::Hash(h) = item {
                    let (hash_item_name, hash_item_contents) = h.iter().next().expect(emsg);
                    item_name = hash_item_name.as_str().expect(emsg);
                    item_contents = Some(hash_item_contents);
                } else {
                    item_name = item.as_str().expect(emsg);
                    item_contents = None;
                }
                
                let gather_name = item_name.to_string();
                let mut choice_name = item_name.chars();
                // is choice
                if choice_name.next().unwrap() == '>' {
                    if let Some(nested_data) = item_contents{
                        let index = tape.len();
                        //will be overwritten
                        let fake_element = create_element(deck_name, "test", ElementType::Choice);
                        let name : String = choice_name.collect();
                        let weave_element = create_element(deck_name, &name, ElementType::Choice);
                        tape.push(WeaveItem::Choice(fake_element, 0));
                        weave_parse_choice(deck_name, nested_data, tape);
                        tape[index] = WeaveItem::Choice(weave_element, tape.len());
                    } else {
                        let name : String = choice_name.collect();
                        let weave_element = create_element(deck_name, &name, ElementType::Choice);
                        tape.push(WeaveItem::Choice(weave_element, tape.len()+1));
                    }
                } else {
                    let weave_element = create_element(deck_name, &gather_name, ElementType::EarlyAction);
                    tape.push(WeaveItem::GatherPoint(weave_element));
                    //discard dict info for now
                }
            }
            
        } else {
            panic!(emsg)
        }   
    }
    let emsg = "Incorrect document format";
    let mut items: Vec<WeaveItem> = Vec::new();
    weave_parse_choice(deck_name, yaml_data, &mut items);
    items
}

fn deck_parse(deck_name: Atom, yaml_data:&Yaml) -> Deck {
    let mut early_actions: Vec<Element> = Vec::new();
    if let Yaml::Hash(h) = &yaml_data["Early actions"] {
        for (key, value) in h {
            early_actions.push(element_parse(key, value, ElementType::EarlyAction));
        }
    }
    
    let mut choices: Vec<Element> = Vec::new();
    if let Yaml::Hash(h) = &yaml_data["Choices"] {
        for (key, value) in h {
            choices.push(element_parse(key, value, ElementType::Choice));
        }
    }
    
    let mut late_actions: Vec<Element> = Vec::new();
    if let Yaml::Hash(h) = &yaml_data["Actions"] {
        for (key, value) in h {
            late_actions.push(element_parse(key, value, ElementType::Action));
        }
    }

    let weave: Vec<WeaveItem>; 
    if yaml_data["Weave"].is_badvalue() {
        weave = Vec::new(); 
    } else {
        weave = weave_parse(deck_name, &yaml_data["Weave"]);
    }
    

    Deck {early_actions, choices, late_actions, weave}
    
}

fn initial_state_parse(yaml_data:&Yaml) -> InitialState {
    let mut v_map : HashMap<String, Variable> = HashMap::new();
    let context = new_context("".to_string(), 0, 0, "Forged!".to_string());
    
    let emsg = "Incorrect document format";
    //okay, first check if condition and displays fields exist
    let init_description: Option<Sentence> = if let Yaml::String(strg) = &yaml_data["displays"] {
        if let Term::Sentence(s) = term_parse(&strg, &mut v_map, context) {
            Some(s)
        } else {
            panic!("variable shouldnt be here");
        }
    } else {
        None
    };
    let init_state: BTreeMap<Atom, Vec<Sentence>> = if let Yaml::Array(condition_data) = &yaml_data["condition"] {
        let mut condition_sentences : BTreeMap<Atom, Vec<Sentence>>  = BTreeMap::new();
        for yaml_cond in condition_data {
            if let Term::Sentence(s) = term_parse(yaml_cond.as_str().expect(emsg),&mut v_map, context) {
                if let Some(v) = condition_sentences.get_mut(&s.name) {
                    v.push(s);
                } else {
                    condition_sentences.insert(s.name, vec![s]);
                }
            } else {
                panic!("variable shouldnt be here");
            }
        }
        condition_sentences
    } else {
        BTreeMap::new()
    };

    InitialState {init_state, init_description}
    
}





pub fn term_parse(source: &str,  v_map: &mut HashMap<String, Variable>, context: Context) -> Term {
    let mut split = source.split_word_bounds();
    let emsg = "Unexpected end of string!";
    
    if split.next().expect(emsg) == "?" {
        if let Some(var_name) = split.next() {
            if split.next() == None {
                let var = match v_map.get(var_name) {
                    None => {
                        let v = new_variable(var_name.to_string(), context, false);
                        v_map.insert(var_name.to_string(), v);
                        v
                    },
                    Some(v) => *v
                };
                return Term::Variable(var);
            }

        }
    }

    
    split = source.split_word_bounds();

    let sentence_string: String = if check_if_open(&mut split) {
        let mut s = String::from("<");
        s.push_str(source);
        s.push_str(">");
        s
    } else {
        source.to_string()
    };

    return Term::Sentence(sentence_parse(&mut sentence_string.split_word_bounds().peekable(), v_map, context));

}

//This code will finally need to be fixed, but I'm not really sure how.
//RIght now it crashes if ? is the last symbol, and also thinks every ? is a variable.

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_if_open() {
        assert!(check_if_open(&mut "<asd> sdfsdff <sdfsdf>"       .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<<asd> sdfsdff <sdfsdf>>"    .split_word_bounds()) == false);
        
        assert!(check_if_open(&mut "sdfsdf"                          .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<sdfsdf>"                       .split_word_bounds()) == false);
        
        assert!(check_if_open(&mut "sdfsdf <sdfdsf> sdsfsdf"     .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<sdfsdf <sdfdsf> sdsfsdf>"  .split_word_bounds()) == false);
        
        assert!(check_if_open(&mut "?sfsdfsdf dsfsdf ?sdfsdfsd"   .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<?sfsdfsdf dsfsdf ?sdfsdfsd>".split_word_bounds()) == false);
        
        assert!(check_if_open(&mut "<dsafsdf> dsfdssdfs"           .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<<dsafsdf> dsfdssdfs>"        .split_word_bounds()) == false);

        assert!(check_if_open(&mut "dsfdssdfs <dsafsdf>"           .split_word_bounds()) == true);
        assert!(check_if_open(&mut "<dsfdssdfs <dsafsdf>>"        .split_word_bounds()) == false);
    }

    fn test_sentence_parse() {
        //<atom>
        //<<complex> ?term>
        //<?Civ is shifted to <+> as ?CivNext>
    }
}

pub fn check_if_open(source: &mut UWordBounds) -> bool {
    let mut counter:i32 = 0;
    let mut first_time: bool = true;
    let mut encountered_brackets = false;
    
    for word in source {
        if counter == 0 && !first_time {
            return true;
        }
        first_time = false;
        
        if word == "<" {
            counter += 1;
            encountered_brackets = true;
        }
        if word == ">" {
            counter -= 1;
        }
    }
    return !encountered_brackets;

}


/// This function assumes that the bound sequece have been checked that its not a variable
/// and that it is closed (chained with < and > at the ends if it was detected to be open)
pub fn sentence_parse(source: &mut Peekable<UWordBounds>,  v_map: &mut HashMap<String, Variable>, context: Context) -> Sentence {
    let mut sentence_name = String::new();
    let mut elements = Vec::new();

    let emsg = "Unexpected end of string!";
    let first_word = source.next().expect(emsg);
    assert!(first_word == "<");

    while let Some(word) = source.peek() {   
        match *word {
            "<" => {
                elements.push(Term::Sentence(sentence_parse(source, v_map, context)));
                sentence_name.push_str("{}");
            },
            ">" => {
                source.next().expect(emsg);
                let name = new_atom(&sentence_name);
                return Sentence {name, elements, context};
            },

            s => {
                if source.next().expect(emsg) == "?" &&
                    source.peek().is_some() &&
                    !source.peek().expect(emsg).is_empty(){
                        let var_name = source.next().expect(emsg);
                        let var = match v_map.get(var_name) {
                            None => {
                                let v = new_variable(var_name.to_string(), context, false);
                                v_map.insert(var_name.to_string(), v);
                                v
                            },
                            Some(v) => *v
                        };
                
                        elements.push(Term::Variable(var));
                        sentence_name.push_str("{}");
                        
                    } else {
                        sentence_name.push_str(s);
                    }
                
                
            }
            
          
            
        }
         
    }
    unreachable!("Missing closing bracket!")
}
    

