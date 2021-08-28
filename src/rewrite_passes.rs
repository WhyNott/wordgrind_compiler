pub mod explicit_uni {
    use crate::parser;
    use crate::tl_database::{new_unnamed_variable, new_variable, Context, Variable, Atom, new_atom};

    #[derive(Debug, Clone)]
    pub struct Sentence {
        pub name: Atom,
        pub elements: Vec<Variable>,
        pub context: Context,
    }

    use std::fmt;
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
    pub enum LogicVerb {
        Sentence(Sentence),
        And(Vec<LogicVerb>),
        Or(Vec<LogicVerb>),
        Unify(Variable, Variable),
        Structure(Variable, parser::Sentence),
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

                LogicVerb::Unify(a, b) => {
                    write!(f, "unify({},{})", a, b)
                }
                LogicVerb::Structure(a, b) => {
                    write!(f, "structure({},{})", a, b)
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

    pub fn process(clause: parser::Clause) -> Clause {
        let mut new_body = Vec::new();
        let mut head_variables = Vec::new();

        for (i, element) in clause.head.elements.into_iter().enumerate() {
            match element {
                parser::Term::Sentence(s) => {
                    let new_variable =
                        new_variable(i.to_string(), s.context, true);
                    new_body.push(LogicVerb::Structure(new_variable.clone(), s));
                    head_variables.push(new_variable);
                }

                parser::Term::Variable(v) => {
                    //NOTE TODO FIXME ETC this is kind of wrong, since they really should be marked as head variables if they arent already, and they should be marked as such wherever they appear in the clause body
                    //Fixed for now, but we'll see
                    v.set_is_head(true);
                    head_variables.push(v);
                }
            }
        }

        let new_body = match clause.body {
            Some(body) => {
                process_body(body, &mut new_body);
                Some(if new_body.len() == 1 {
                    new_body.into_iter().next().expect("Sentence is empty")
                } else {
                    LogicVerb::And(new_body)
                })
            }
            None => {
                if new_body.is_empty() {
                    None
                } else {
                    Some(LogicVerb::And(new_body))
                }
            }
        };
        Clause {
            head: Sentence {
                name: clause.head.name,
                elements: head_variables,
                context: clause.head.context,
            },
            body: new_body,
            context: clause.context,
        }
    }

    pub fn process_body(input: parser::LogicVerb, output: &mut Vec<LogicVerb>) {
        match input {
            parser::LogicVerb::Sentence(s) => {
                if s.name == new_atom("{} = {}") {
                    assert!(s.elements.len() == 2);
                    let mut it = s.elements.into_iter();
                    let a = it.next().expect("Sentence is empty");
                    let b = it.next().expect("Sentence is empty");

                    match (a, b) {
                        (parser::Term::Variable(x), parser::Term::Variable(y)) => {
                            output.push(LogicVerb::Unify(x, y));
                        }
                        (parser::Term::Sentence(x), parser::Term::Sentence(y)) => {
                            let new_variable1 = new_unnamed_variable(x.context, false);

                            let new_variable2 = new_unnamed_variable(y.context, false);
                            output.push(LogicVerb::Structure(new_variable1.clone(), x));
                            output.push(LogicVerb::Structure(new_variable2.clone(), y));
                            output.push(LogicVerb::Unify(new_variable1, new_variable2));
                        }
                        (parser::Term::Variable(x), parser::Term::Sentence(y))
                        | (parser::Term::Sentence(y), parser::Term::Variable(x)) => {
                            output.push(LogicVerb::Structure(x, y));
                        }
                    }
                } else {
                    let mut new_arguments = Vec::with_capacity(s.elements.len());
                    for element in s.elements {
                        match element {
                            parser::Term::Sentence(s) => {
                                let new_variable = new_unnamed_variable(s.context, false);
                                new_arguments.push(new_variable.clone());
                                output.push(LogicVerb::Structure(new_variable, s));
                            }
                            parser::Term::Variable(v) => {
                                new_arguments.push(v);
                            }
                        }
                    }
                    output.push(LogicVerb::Sentence(Sentence {
                        name: s.name,
                        elements: new_arguments,
                        context: s.context,
                    }));
                }
            }
            parser::LogicVerb::And(lvs) => {
                let mut new_lvs = Vec::with_capacity(lvs.len());
                for lv in lvs {
                    process_body(lv, &mut new_lvs);
                }
                output.push(LogicVerb::And(new_lvs));
            }
            parser::LogicVerb::Or(lvs) => {
                let mut new_lvs = Vec::with_capacity(lvs.len());
                for lv in lvs {
                    process_body(lv, &mut new_lvs);
                }
                output.push(LogicVerb::Or(new_lvs))
            }
        }
    }
}

pub mod variable_inits {
    use crate::parser;
    use crate::rewrite_passes::explicit_uni;
    use crate::tl_database::{Context, Variable};
    #[derive(Debug, Clone)]
    pub struct Clause {
        pub head: explicit_uni::Sentence,
        pub variables: Option<Vec<Variable>>,
        pub body: Option<explicit_uni::LogicVerb>,
        pub context: Context,
    }

    use std::fmt;
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

    use itertools::Itertools;
    use std::collections::BTreeSet;

    pub fn process(clause: explicit_uni::Clause) -> Clause {
        let variables = match &clause.body {
            None => None,
            Some(body) => {
                let mut gathered_variables = BTreeSet::new();
                process_body(body, &mut gathered_variables);
                Some(
                    gathered_variables
                        .into_iter()
                        .unique_by(|v| v.get_variable_name())
                        .collect(),
                )
            }
        };

        Clause {
            head: clause.head,
            body: clause.body,
            context: clause.context,
            variables,
        }
    }

    pub fn process_sentence(input: &parser::Sentence, varset: &mut BTreeSet<Variable>) {
        for element in &input.elements {
            match element {
                parser::Term::Sentence(s) => process_sentence(&s, varset),
                parser::Term::Variable(v) => {
                    varset.insert(*v);
                }
            }
        }
    }

    pub fn process_term(input: &parser::Term, varset: &mut BTreeSet<Variable>) {
        match input {
            parser::Term::Sentence(s) => process_sentence(&s, varset),
            parser::Term::Variable(v) => {
                varset.insert(*v);
            }
        }   
    }

    pub fn process_body(input: &explicit_uni::LogicVerb, varset: &mut BTreeSet<Variable>) {
        use explicit_uni::LogicVerb;

        match input {
            LogicVerb::Sentence(s) => {
                for var in &s.elements {
                    varset.insert(*var);
                }
            }
            LogicVerb::And(a) | LogicVerb::Or(a) => {
                for lv in a {
                    process_body(lv, varset);
                }
            }
            LogicVerb::Unify(v1, v2) => {
                varset.insert(*v1);
                varset.insert(*v2);
            }
            LogicVerb::Structure(v, s) => {
                varset.insert(*v);
                process_sentence(s, varset);
            }
        }
    }
}

pub mod emission {
    use crate::parser;
    use crate::rewrite_passes::explicit_uni;
    use crate::rewrite_passes::variable_inits;
    use crate::tl_database::{Atom, Context, Variable, new_atom};
    use std::collections::{BTreeSet, BTreeMap};
    use itertools::Itertools;
    
    #[derive(Debug, Clone)]
    pub struct Deck {
        pub early_actions: Vec<Element>,
        pub choices: Vec<Element>,
        pub late_actions: Vec<Element>,
    }
    
    #[derive(Debug, Clone)]
    pub struct Document {
        pub initial_conditions: Option<parser::InitialState>,
        pub decks: BTreeMap<Atom, Deck>,
        pub predicates: BTreeMap<Atom, Procedure>,
        pub special_facts: Vec<(Atom, parser::SpecialFactType)>
    }
    
    pub fn process_document(input: parser::Document) -> Document {
        let initial_conditions = input.initial_conditions;  
        let mut decks: BTreeMap<Atom, Deck> = BTreeMap::new();                       
        let mut predicates: BTreeMap<Atom, Procedure> = BTreeMap::new();                        
        let special_facts: Vec<(Atom, parser::SpecialFactType)> = input.special_facts;
        
        for (name, deck) in input.decks {
            let mut early_actions: Vec<Element> = Vec::new();
            let mut choices: Vec<Element> = Vec::new();      
            let mut late_actions: Vec<Element> = Vec::new();
            
            for element in deck.early_actions {
                early_actions.push(process_element(element));
            }
            for element in deck.choices {
                choices.push(process_element(element));
            }
            for element in deck.late_actions {
                late_actions.push(process_element(element));
            } 

            if !deck.weave.is_empty(){
                let mut edges: Vec<(parser::Element, usize, usize)> = Vec::new();
                let mut nodes: Vec<usize> = Vec::new();
                flatten_weave(deck.weave, &mut nodes, &mut edges);
                //TODO: add initial early action that sets the initial value

                let first_node: usize = 0;
                let last_node = nodes[0];
                for (e, v, r) in edges {
                    
          
                    //for each element, add precondition for v and effect of r
                    let mut element = e.clone();
                    let precondition_element = parser::Term::Sentence(parser::Sentence{
                        name: new_atom("weave item {} for {}"),
                        elements: vec![
                            parser::Term::Sentence(parser::Sentence{
                                name: new_atom(&v.to_string()),
                                elements: vec![],
                                context: e.name.context.clone()
                            }),
                            parser::Term::Sentence(parser::Sentence{
                                name: name,
                                elements: vec![],
                                context: e.name.context.clone()
                            })
                                
                        ],
                        context: e.name.context.clone()
                    });

                    let weave_activated = parser::Term::Sentence(parser::Sentence{
                        name: new_atom("weave for {} activated"),
                        elements: vec![
                            parser::Term::Sentence(parser::Sentence{
                                name: name,
                                elements: vec![],
                                context: e.name.context.clone()
                            })
                                
                        ],
                        context: e.name.context.clone()
                    }); 
                    
                    //Hmm, so now I just need to make sure this doesn't activate once it
                    //has been selected.
                    if v == first_node {
                        element.preconds.push((weave_activated.clone(), false));
                        element.effects.push((weave_activated, true));
                    } else {
                        element.preconds.push((precondition_element.clone(), true));
                        
                    }

                    let next_node = if r != last_node {r.to_string()} else {"completed".to_string()};
                    //remove the precondition weave number
                    element.effects.push((precondition_element, false));
                    element.effects.push((parser::Term::Sentence(parser::Sentence{
                        name: new_atom("weave item {} for {}"),
                        elements: vec![
                            parser::Term::Sentence(parser::Sentence{
                                name: new_atom(&next_node),
                                elements: vec![],
                                context: e.name.context.clone()
                            }),
                            parser::Term::Sentence(parser::Sentence{
                                name: name,
                                elements: vec![],
                                context: e.name.context.clone()
                            })
                        ],
                        context: e.name.context.clone()
                    }), true));

                    //then append the element to appropriate deck section
                    match &e.tag {
                        parser::ElementType::Choice => {
                            choices.push(process_element(element));
                        },
                        parser::ElementType::EarlyAction => {
                            early_actions.push(process_element(element));
                        },
                        _ => panic!("dsfsdfsadfsdf")
                    }
                }
               
            }
            
            let new_deck = Deck {early_actions, choices, late_actions};
            decks.insert(name, new_deck);

            
        }
        
        for ((name, _), pred) in input.predicates {
            let explicit_uni = explicit_uni::process(pred);
            let var_inits = variable_inits::process(explicit_uni);
            let emission = process(var_inits);
            predicates.insert(name, emission);
        }

        
        
        Document {initial_conditions, decks, predicates, special_facts} 
    }
    use std::cell::RefCell;
    use parser::{WeaveItem};
    use std::rc::Rc;

    
    fn flatten_weave(input: Vec<WeaveItem>, nodes: &mut Vec<usize>, edges: &mut Vec<(parser::Element, usize, usize)>) {
        
        fn process_contents(input: &Vec<WeaveItem>, begin: usize, end: usize, nodes: &mut Vec<usize>,
                            edges: &mut Vec<(parser::Element, usize, usize)>, first_node: usize, end_node: usize) {
            let mut last_node = first_node;
            let mut past_choices : Vec<(parser::Element, usize, usize)> = Vec::new();
            let mut i = begin;
            while i < end {
                match &input[i] {
                    WeaveItem::GatherPoint(el) => {
                        if !past_choices.is_empty() {
                            let new_node = last_node + 1;
                            nodes.push(new_node);
                            for (choice, start, end) in past_choices.drain(..) {
                                if start == end {
                                    edges.push((choice, last_node, new_node));
                                } else {
                                    
                                    let middle_node = start + input.len() + 1;
                                    nodes.push(middle_node);
                                    edges.push((choice, last_node, middle_node));
                                    process_contents(input, start, end, nodes, edges, middle_node, new_node);
                                }
                            }
                            last_node = new_node;
                            
                        }
                        let new_node;
                        if (i+1) == end {
                            new_node = end_node;
                        } else {
                            new_node = last_node + 1;
                            nodes.push(new_node);
                        }
                        edges.push((el.clone(), last_node, new_node));
                        last_node = new_node;
                    },
                    WeaveItem::Choice(el, end) => {
                        past_choices.push((el.clone(), i+1, *end));
                        i = end-1;
                    } 
                }
                i += 1;
            }

            if !past_choices.is_empty() {
                let new_node = end_node;
                for (choice, start, end) in past_choices.drain(..) {
                    if start == end {
                        edges.push((choice, last_node, new_node));
                    } else {
                        
                        let middle_node = start + input.len() + 1;
                        nodes.push(middle_node);
                        edges.push((choice, last_node, middle_node));
                        process_contents(input, start, end, nodes, edges, middle_node, new_node);
                    }
                }
                last_node = new_node;
                
            }
            
        }

        let input_len = input.len();
        nodes.push(input_len);
        nodes.push(0);
        process_contents(&input, 0, input_len, nodes, edges, 0, input_len);
        
    }

    
#[derive(Debug, Clone)]
pub struct Element {
        pub tag: parser::ElementType,//
        pub name: parser::Sentence,//
        pub variables: Vec<Variable>,//
        pub priority: i32,
        pub preconds: Vec<(parser::Term, bool)>,//
        pub effects: Vec<(parser::Term, bool)>,//
        pub description: Option<parser::Term>,//
        pub logic: Vec<EmissionVerb>,//
        pub logic_body: Option<EmissionVerb>,//
        pub next_deck: Option<parser::Term>,//
        pub options: parser::ElementOptions,
    }
    
   
    fn process_element(input:parser::Element)-> Element{
        let mut gathered_variables = BTreeSet::new();
        let mut logic_body = None;
        let logic = match input.logic {
            None => vec![],
            Some(lv) => {
                let mut ex_uni_list = Vec::new();
                explicit_uni::process_body(lv, &mut ex_uni_list);
                let ex_uni : explicit_uni::LogicVerb =
                    if ex_uni_list.len() == 1 {
                        ex_uni_list.into_iter().next().expect("Sentence is empty")
                    } else {
                        explicit_uni::LogicVerb::And(ex_uni_list)
                    };
                variable_inits::process_body(&ex_uni, &mut gathered_variables);
                let mut continuations = Vec::new();
                logic_body = Some(process_body(ex_uni, &mut continuations, false));
                continuations
            }
        };
        variable_inits::process_sentence(&input.name, &mut gathered_variables);
        for (precond, _) in &input.preconds {
            variable_inits::process_term(precond, &mut gathered_variables);
        }
        for (effect, _) in &input.effects {
            variable_inits::process_term(effect, &mut gathered_variables);
        }
        match &input.description{
            None => {},
            Some(dsc) => variable_inits::process_term(dsc, &mut gathered_variables),
        }

        match &input.next_deck{
            None => {},
            Some(dsc) => variable_inits::process_term(dsc, &mut gathered_variables),
        }
        Element {
            tag: input.tag,
            name: input.name,
            variables: gathered_variables
                        .into_iter()
                        .unique_by(|v| v.get_variable_name())
                        .collect(),
            priority: input.priority,
            preconds: input.preconds,
            effects: input.effects,
            description: input.description,
            logic: logic,
            logic_body,
            next_deck: input.next_deck,
            options: input.options,
        }
        
    }
    

    #[derive(Debug, Clone)]
    pub struct Procedure {
        pub head: explicit_uni::Sentence,
        pub variables: Vec<Variable>,
        pub continuations: Vec<EmissionVerb>,
        pub body: EmissionVerb,
        pub context: Context,
    }

    use std::fmt;
    impl fmt::Display for Procedure {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "{} {{\n<", self.head)?;
            for var in &self.variables {
                write!(f, "{}({}), ", var, var.get_variable_id())?;
            }
            write!(f, ">\n{}\n}}", self.body)?;
            writeln!(f, " Continuations: {{")?;
            for (i, cont) in self.continuations.iter().enumerate() {
                writeln!(f, "{} : {}, ", i + 1, cont)?;
            }
            writeln!(f, "}}")
        }
    }

    //and means going in nested depth - either continuations or conditions
    //or means going in broadness
    #[derive(Debug, Clone)]
    pub enum Semidet {
        Unify(Variable, Variable),
        Structure(Variable, parser::Sentence),
    }

    impl fmt::Display for Semidet {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            match &self {
                Semidet::Unify(a, b) => {
                    write!(f, "unify({},{})", a, b)
                }
                Semidet::Structure(a, b) => {
                    write!(f, "structure({},{})", a, b)
                }
            }
        }
    }

    #[derive(Debug, Clone)]
    pub enum EmissionVerb {
        Cond(Semidet, i32),
        Or(Vec<EmissionVerb>),
        Call(explicit_uni::Sentence, i32),
    }

    impl fmt::Display for EmissionVerb {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            match &self {
                EmissionVerb::Cond(sem, num) => write!(f, "if({}) {{{}}})", sem, num),

                EmissionVerb::Or(emverb) => {
                    writeln!(f, "//make backup here")?;
                    for em in emverb {
                        writeln!(f, "{}", em)?;
                        writeln!(f, "//restore backup here")?;
                    }
                    Ok(())
                }
                EmissionVerb::Call(sent, num) => write!(f, "{}({})", sent, num),
            }
        }
    }

    //the first version is focused on being super-simple,
    //even if it's going to be painfully inefficient
    //only after you make sure that version is correct, move on

    pub fn process(input: variable_inits::Clause) -> Procedure {
        let mut continuations = Vec::new();
        Procedure {
            head: input.head,
            variables: input
                .variables
                .expect("There should probably be some variables by now."),
            body: process_body(
                input.body.expect("There should really be a body by now."),
                &mut continuations,
                false,
            ),
            continuations,
            context: input.context,
        }
    }

    fn process_body(
        input: explicit_uni::LogicVerb,
        mut conts: &mut Vec<EmissionVerb>,
        last: bool,
    ) -> EmissionVerb {
        let cont_num = if last { 0 } else { conts.len() as i32 };
        match input {
            explicit_uni::LogicVerb::Sentence(s) => EmissionVerb::Call(s, cont_num),
               explicit_uni::LogicVerb::And(lvs) => {
                let lvs_len = lvs.len();
                let mut lvs_iterator = lvs.into_iter();
                let first_element = lvs_iterator.next().expect("And is empty!");

                let mut lvs_iterator_reverse = lvs_iterator.rev();

                match lvs_iterator_reverse.next() {
                    None => {},
                    Some(lv) => {
                        let result = process_body(lv, &mut conts, true);
                        conts.push(result);
                    }
                }

                for lv in lvs_iterator_reverse {
                    let result = process_body(lv, &mut conts, false);
                    conts.push(result);
                }
                process_body(first_element, &mut conts, lvs_len == 1)
            }
            explicit_uni::LogicVerb::Or(lvs) => {
                let mut new_or = Vec::with_capacity(lvs.len());
                for lv in lvs.into_iter() {
                    new_or.push(process_body(lv, &mut conts, false));
                }
                EmissionVerb::Or(new_or)
            }
            explicit_uni::LogicVerb::Unify(v1, v2) => {
                EmissionVerb::Cond(Semidet::Unify(v1, v2), cont_num)
            }

            explicit_uni::LogicVerb::Structure(v, s) => {
                EmissionVerb::Cond(Semidet::Structure(v, s), cont_num)
            }
        }
    }
}
