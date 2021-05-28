use std::cell::RefCell;
use std::fmt;

#[derive(Debug, Clone)]
pub struct ContextData {
    pub leading_whitespace: String,
    pub line_number: i32,
    pub column_number: i32,
    pub file_name: String,
}

#[derive(Debug, Clone)]
pub struct VariableData {
    pub variable_name: String,
    pub context: Context,
    pub is_head: bool,
}

use std::collections::HashMap;
thread_local! {
    static CONTEXTS: RefCell<Vec<ContextData>> =  RefCell::new(Vec::new());
    static VARIABLES: RefCell<Vec<VariableData>> =  RefCell::new(Vec::new());
    static ATOMS: RefCell<(HashMap<String, i32>, HashMap<i32, String>, i32)> =  RefCell::new((HashMap::new(), HashMap::new(), 0));
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Context(usize);

impl Context {
    pub fn get_leading_whitespace(&self) -> String {
        CONTEXTS.with(|v| v.borrow()[self.0].leading_whitespace.clone())
    }
    pub fn get_line_number(&self) -> i32 {
        CONTEXTS.with(|v| v.borrow()[self.0].line_number)
    }
    pub fn get_column_number(&self) -> i32 {
        CONTEXTS.with(|v| v.borrow()[self.0].column_number)
    }
    pub fn get_file_name(&self) -> String {
        CONTEXTS.with(|v| v.borrow()[self.0].file_name.clone())
    }
}

pub fn new_context(
    leading_whitespace: String,
    line_number: i32,
    column_number: i32,
    file_name: String,
) -> Context {
    let mut index = 0;
    CONTEXTS.with(|v| {
        index = v.borrow().len();
        v.borrow_mut().push(ContextData {
            leading_whitespace,
            line_number,
            column_number,
            file_name,
        });
    });
    Context(index)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Variable(usize);

impl Variable {
    pub fn get_variable_name(&self) -> String {
        VARIABLES.with(|v| v.borrow()[self.0].variable_name.clone())
    }

    pub fn get_variable_id(&self) -> i32 {
        self.0 as i32
    }

    pub fn get_context(&self) -> Context {
        VARIABLES.with(|v| v.borrow()[self.0].context)
    }

    pub fn get_is_head(&self) -> bool {
        VARIABLES.with(|v| v.borrow()[self.0].is_head)
    }
    pub fn set_is_head(&self, nv: bool) {
        VARIABLES.with(|v| v.borrow_mut()[self.0].is_head = nv)
    }
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "?{}({}){}",
            self.get_variable_name(),
            self.get_variable_id(),
            if self.get_is_head() { "h" } else { "" }
        )
    }
}

pub fn existing_variable(id: i32) -> Variable {
    Variable(id as usize)
}

pub fn new_variable(variable_name: String, context: Context, is_head: bool) -> Variable {
    let mut index = 0;
    VARIABLES.with(|v| {
        index = v.borrow().len();
        v.borrow_mut().push(VariableData {
            variable_name,
            context,
            is_head,
        });
    });
    Variable(index)
}

pub fn new_unnamed_variable(context: Context, is_head: bool) -> Variable {
    let mut index = 0;
    VARIABLES.with(|v| {
        index = v.borrow().len();
        let variable_name = "unn_".to_owned() + &index.to_string();
        v.borrow_mut().push(VariableData {
            variable_name,
            context,
            is_head,
        });
    });
    Variable(index)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Atom(i32);

impl Atom {
    pub fn get_string(&self) -> String {
        ATOMS
            .with(|v| v.borrow().1.get(&self.0).unwrap().to_string())

    }
}

impl fmt::Display for Atom {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.get_string())
    }
}

pub fn new_atom(string: &str) -> Atom {
    let mut index = 0;
    ATOMS.with(|v| {
        let (si_map, is_map, top_index) =  &mut *v.borrow_mut();
        
        match (si_map).get(string) {
            Some(ind) => index = *ind,
            None => {
                *top_index += 1;
                si_map.insert(string.to_string(), *top_index);
                is_map.insert(*top_index, string.to_string());
                index = *top_index;
            }
        };
    });
    Atom(index)
}


