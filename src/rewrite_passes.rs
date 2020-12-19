pub mod explicit_uni {
    use crate::parser;

    #[derive(Debug, Clone)]
    pub struct Sentence {
        pub name: String,
        pub elements: Vec<parser::Variable>,
        pub context: Box<parser::Context>,
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
        Unify(parser::Variable, parser::Variable),
        Structure(parser::Variable, parser::Sentence),
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
        pub context: Box<parser::Context>,
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

    pub fn process(input: (parser::Clause, i32)) -> (Clause, i32) {
        let clause = input.0;
        let mut varset = input.1;
        let mut new_body = Vec::new();
        let mut head_variables = Vec::new();

        for element in clause.head.elements.into_iter() {
            match element {
                parser::Term::Sentence(s) => {
                    varset += 1;
                    let new_variable = parser::Variable {
                        variable_name: "head_".to_owned() + &varset.to_string(),

                        variable_id: varset,
                        context: s.context.clone(),
                        is_head: true,
                    };
                    new_body.push(LogicVerb::Structure(new_variable.clone(), s));
                    head_variables.push(new_variable);
                }

                parser::Term::Variable(v) => {
                    //NOTE TODO FIXME ETC this is kind of wrong, since they really should be marked as head variables if they arent already, and they should be marked as such wherever they appear in the clause body
                    head_variables.push(v);
                }
            }
        }

        let new_body = match clause.body {
            Some(body) => {
                process_body(body, &mut new_body, &mut varset);
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
        (
            Clause {
                head: Sentence {
                    name: clause.head.name,
                    elements: head_variables,
                    context: clause.head.context,
                },
                body: new_body,
                context: clause.context,
            },
            varset,
        )
    }

    fn process_body(input: parser::LogicVerb, output: &mut Vec<LogicVerb>, varset: &mut i32) {
        match input {
            parser::LogicVerb::Sentence(s) => {
                if s.name == "{} = {}" {
                    assert!(s.elements.len() == 2);
                    let mut it = s.elements.into_iter();
                    let a = it.next().expect("Sentence is empty");
                    let b = it.next().expect("Sentence is empty");

                    match (a, b) {
                        (parser::Term::Variable(x), parser::Term::Variable(y)) => {
                            output.push(LogicVerb::Unify(x, y));
                        }
                        (parser::Term::Sentence(x), parser::Term::Sentence(y)) => {
                            *varset += 1;
                            let new_variable1 = parser::Variable {
                                variable_name: varset.to_string(),
                                variable_id: *varset,
                                context: x.context.clone(),
                                is_head: false,
                            };
                            *varset += 1;
                            let new_variable2 = parser::Variable {
                                variable_name: varset.to_string(),
                                variable_id: *varset,
                                context: y.context.clone(),
                                is_head: false,
                            };
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
                                *varset += 1;
                                let new_variable = parser::Variable {
                                    variable_name: varset.to_string(),
                                    variable_id: *varset,
                                    context: s.context.clone(),
                                    is_head: false,
                                };
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
                    process_body(lv, &mut new_lvs, varset);
                }
                output.push(LogicVerb::And(new_lvs));
            }
            parser::LogicVerb::Or(lvs) => {
                let mut new_lvs = Vec::with_capacity(lvs.len());
                for lv in lvs {
                    let mut newvarset = *varset;
                    process_body(lv, &mut new_lvs, &mut newvarset);
                }
                output.push(LogicVerb::Or(new_lvs))
            }
        }
    }
}

pub mod variable_inits {
    use crate::parser;
    use crate::rewrite_passes::explicit_uni;

    #[derive(Debug, Clone)]
    pub struct Clause {
        pub head: explicit_uni::Sentence,
        pub variables: Option<Vec<parser::Variable>>,
        pub body: Option<explicit_uni::LogicVerb>,
        pub context: Box<parser::Context>,
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

    pub fn process(input: (explicit_uni::Clause, i32)) -> (Clause, i32) {
        let (clause, num) = input;

        let variables = match &clause.body {
            None => None,
            Some(body) => {
                let mut gathered_variables = BTreeSet::new();
                process_body(body, &mut gathered_variables);
                Some(
                    gathered_variables
                        .into_iter()
                        .unique_by(|v| v.variable_name.clone())
                        .collect(),
                )
            }
        };

        (
            Clause {
                head: clause.head,
                body: clause.body,
                context: clause.context,
                variables,
            },
            num,
        )
    }

    fn process_sentence(input: &parser::Sentence, varset: &mut BTreeSet<parser::Variable>) {
        for element in &input.elements {
            match element {
                parser::Term::Sentence(s) => process_sentence(&s, varset),
                parser::Term::Variable(v) => {
                    varset.insert(v.clone());
                }
            }
        }
    }

    fn process_body(input: &explicit_uni::LogicVerb, varset: &mut BTreeSet<parser::Variable>) {
        use explicit_uni::LogicVerb;

        match input {
            LogicVerb::Sentence(s) => {
                for var in &s.elements {
                    varset.insert(var.clone());
                }
            }
            LogicVerb::And(a) | LogicVerb::Or(a) => {
                for lv in a {
                    process_body(lv, varset);
                }
            }
            LogicVerb::Unify(v1, v2) => {
                varset.insert(v1.clone());
                varset.insert(v2.clone());
            }
            LogicVerb::Structure(v, s) => {
                varset.insert(v.clone());
                process_sentence(s, varset);
            }
        }
    }
}

pub mod emission {
    use crate::parser;
    use crate::rewrite_passes::explicit_uni;
    use crate::rewrite_passes::variable_inits;

    #[derive(Debug)]
    pub struct Procedure {
        pub head: explicit_uni::Sentence,
        pub variables: Vec<parser::Variable>,
        pub continuations: Vec<EmissionVerb>,
        pub body: EmissionVerb,
        pub context: Box<parser::Context>,
    }

    use std::fmt;
    impl fmt::Display for Procedure {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "{} {{\n<", self.head)?;
            for var in &self.variables {
                write!(f, "{}({}), ", var, var.variable_id)?;
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
        Unify(parser::Variable, parser::Variable),
        Structure(parser::Variable, parser::Sentence),
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
                    None => {}
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
