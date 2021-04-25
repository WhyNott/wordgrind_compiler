use unicode_segmentation::UnicodeSegmentation;
use unicode_segmentation::UWordBounds;
use std::collections::HashMap;
use std::iter::Peekable; 

use crate::tl_database::{
    existing_variable, new_atom, new_context, new_variable, Atom, Context, Variable,
};

use crate::parser::{
    Sentence, Term, LogicVerb, Clause, Parameters, ElementType, ElementOptions, Element,
    InitialState, Deck, WeaveItem, TopLevelItem, SpecialFactType, Document
};


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

//This def. needs more work
//<asd> sdfsdff <sdfsdf>
//sdfsdf
//<sdfsdf <sdfdsf> sdsfsdf>>
//?sfsdfsdf dsfsdf ?sdfsdfsd
//<dsafsdf> dsfdssdfs

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
    

