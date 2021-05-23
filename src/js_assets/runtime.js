
const DB = {

    *[Symbol.iterator]() {
        for (const [key, value] of Object.entries(this.store)){
            for (element of value.data){
                yield element;
            }
        }
    },

    add: function (fact){
        const name = fact.is_atom() ? fact.value.toString() : fact.value.functor;
        if (name in this.store){
            if (this.store[name].unique)
                this.store[name].data = [fact];
            else
                this.store[name].data.push(fact);
        } else {
            this.store[name] = {data:[fact], unique:false};
        }
    },
    //note - to remove the need for trailing here, maybe it would make
    //sense to create a 'can_unify' method here, that unifies without making changes
    remove: function (fact){
        for (name in this.store){
            trail.new_choice_point();
            for (let i = 0; i < this.store[name].data.length; i++){
                if (fact.unify_with(this.store[name].data[i])){
                    this.store[name].data.splice(i, 1);
                    i--;
                    trail.restore_choice_point();
                }
            }
            trail.remove_choice_point();
        }
    },

    
    match_list: function (list, index, logic){
        let item = list[index];
        let negation = false;
        if (!item.is_atom() && item.value.functor == "not" ) {
            console.log("test")
            negation = true;
            item = item.value.args[0];
        }
        let name = item.is_atom() ? item.value.toString() : item.value.functor;
        
        
        if (name in this.store){
            trail.new_choice_point();
            for (fact of this.store[name].data) {
                if (fact.unify_with(item)){
                    if (negation){
                        //fail instantly on match
                        trail.restore_choice_point();
                        trail.remove_choice_point();
                        return;
                    } else {
                        if (list.length == (index+1))
                            logic();
                        else
                            this.match_list(list, index+1, logic);
                    }
                    trail.restore_choice_point();
                }
            }
            if (negation){
                if (list.length == (index+1))
                    logic();
                else
                    this.match_list(list, index+1, logic);
            }
            trail.remove_choice_point();
        } 
        
    },
    match: function (logic, ...facts) {
        if (facts.length == 0)
            logic();
        else
            this.match_list(facts, 0, logic);
    },
    

}



function apply_element(element) {
    if ('hide_name' in element.options && element.options.hide_name) {
        set_description(null, element.description);
    } else {
        set_description(element.name, element.description);
    }
    DB.add(make_structured_term("selected {}", [element.name.content()]));
    if (element.effects != null){
        for (effect of element.effects){
            if (!effect.is_atom() && effect.value.functor == "not"){
                DB.remove(effect.value.args[0]);
            } else {
                DB.add(effect);
            }
        }
    }
}



let deck_stack = [];

let current_deck = {deck: "default", pre_choice:true};

let available_choices = [];



function find_choices(){
    const deck = decks[current_deck.deck];
        
    const name        = make_empty_variable("name"); 
    const description = make_empty_variable("description"); 
    const effects     = make_empty_variable("effects"); 
    const next_deck   = make_empty_variable("next_deck");
    const options = {};
    let choices = [];
    
    const cont = () => {
        const copy_term = (term) => {
                const leading = term.dereferenced_value();
                if (leading.is_variable() && !leading.bound()){
                    console.log(leading);
                    throw "error";
                }
                if (leading.is_atom()){
                    return leading;
                } else {
                    let args = [];
                    for (arg of leading.value.args) {
                        args.push(copy_term(arg));
                    }
                    return make_structured_term(leading.value.functor, args);
                }
        };
        
        let found_choice = {};
        found_choice.name = copy_term(name.content());
        found_choice.description = description.bound() ? description.pprint(bracketed = false) : null;
        if (!effects.is_variable() || effects.bound()){
            
            found_choice.effects = copy_term(effects).value.args;
        } else
            found_choice.effects = null;
        found_choice.next_deck = next_deck.bound() ? next_deck.value.value : null;
        found_choice.options = options;
        choices.push(found_choice);
        dc.add_new_step('Found: ' + found_choice.name.pprint(bracketed = false));
    };

    trail.new_choice_point();
    for (possible_choice of deck.choices) {
        possible_choice(name, description, effects, next_deck, options, cont);
        trail.restore_choice_point();
    }
    trail.remove_choice_point();

    return choices;
}

function choose_action(late, used){
    const deck = decks[current_deck.deck];
    const actions = late ? deck.late_actions : deck.early_actions; 
    
    const name        = make_empty_variable("name"); 
    const description = make_empty_variable("description"); 
    const effects     = make_empty_variable("effects"); 
    const next_deck   = make_empty_variable("next_deck");
    const options = {};

    let found_suitable = false;
    let chosen_action = {};
    
    const cont = () => {
        if (!found_suitable &&
            !('once' in options && options.once && used.includes(name.content().pprint()))
           ){
            found_suitable = true;
            chosen_action.name = name.content();
            chosen_action.description = description.pprint(bracketed = false);
            if (effects.bound()){
                const copy_term = (term) => {
                    const leading = term.dereferenced_value();
                    console.assert(leading.bound());
                    if (leading.is_atom()){
                        return leading;
                    } else {
                        let args = [];
                        for (arg of leading.value.args) {
                            args.push(copy_term(arg));
                        }
                        return make_structured_term(leading.value.functor, args);
                    }
                };
                chosen_action.effects = copy_term(effects).value.args;
            } else
                chosen_action.effects = null;
            chosen_action.options = options;
            chosen_action.next_deck = next_deck.bound() ? next_deck.value.value : null;
            used.push(chosen_action.name.pprint());
        }
    };

    trail.new_choice_point();
    for (action of actions) {
        if (found_suitable)
            break;
        action(name, description, effects, next_deck, options, cont);
        trail.restore_choice_point();
    }
    trail.remove_choice_point();

    return found_suitable ? chosen_action : null;
}


const STATES = {
    POP:0,
    PUSH:1,
    LATE:2,
    EARLY:3
};
function make_choice(n){
    
    let current_element = available_choices[n];
    apply_element(current_element);
    let state;
    if (current_element.next_deck === null) {
        state = STATES.LATE;
    } else {
        state = STATES.PUSH;
    }
    let used_actions = [];
    
    current_deck.pre_choice = false;
    while(true){
        
        if (state == STATES.LATE) {
        //code for executing late action 
            let action = choose_action(late=true, used=used_actions);
            if (action === null) {
                state = STATES.POP;
            } else {
                current_element = action;
                apply_element(current_element);
                if (current_element.next_deck === null) {
                    state = STATES.LATE;
                } else {
                    current_deck.pre_choice = false;
                    state = STATES.PUSH;
                }
            }
        } else if (state == STATES.EARLY) {
            //code for executing early action
            let action = choose_action(late=false, used=used_actions);
            if (action === null) {
                available_choices = find_choices();
                return;
            } else {
                current_element = action;
                apply_element(current_element);
                if (current_element.next_deck === null ){
                    state = STATES.EARLY;
                } else {
                    current_deck.pre_choice = true;
                    state = STATES.PUSH;
                }
            }
            
        } else if (state == STATES.POP) {
            //code for popping a deck from stack
            if (deck_stack.length > 0)
                current_deck = deck_stack.pop();
            else
                current_deck = {deck: "default", pre_choice:true};

            if (current_deck.pre_choice)
                state = STATES.EARLY;
            else
                state = STATES.LATE;
            
        } else if (state == STATES.PUSH) {
            //code for pushing current to the stack and seting lead as current deck
            if (current_deck != "default") {
                deck_stack.push(current_deck);
            }
            current_deck = {deck: current_element.next_deck, pre_choice:true};
            state = STATES.EARLY;
            
        } else {
            //throw an error here
            throw "Invalid state value!"
        }

    }

}


//logic stuff

let global_id_counter = 0;

let all_terms = [];
let backups = [];

function new_backup_frame(){
    backups.push([]);
}

function reg_backup(term, index){
    backups[backups.length-1].push({ data: { source: term.id,
                                             label: index.toString(),
                                             target: term.content().id
                                           }, classes: "backup"});
}

function remove_backup_frame(){
    backups.pop();
}

const trail = {
    stack : [],
    last_choice_point : [],
    last_id_counter : [],
    new_choice_point(){
        this.last_choice_point.push(this.stack.length);
        this.last_id_counter.push(global_id_counter);
    },
    add_postbinding(p){
        this.stack.push(p);
    },
    restore_choice_point(){
        const oldtop = this.last_choice_point[this.last_choice_point.length-1];
        for (let top = this.stack.length; top != oldtop; top--){
            let v = this.stack.pop();
            v.value = v;
        } 
    },
    remove_choice_point(){
        this.last_choice_point.pop();
        this.last_id_counter.pop();
    }
};


function reset_globals(){
    
                                
    global_id_counter = 0;      
                                
    all_terms = [];             
} 

//this is set to the debug controller by the main page when this file is loaded
let dc = null;

function produce_nodes(){
    let nodes = [];
    let edges = [];
    for (backup_frame of backups){
        for (backup of backup_frame){ 
            edges.push(backup);
        }
    }
    
    for (term of all_terms){
        const label = term.is_variable() ?
              term.name
              :
              term.pprint();
        
        const term_category = term.is_variable() ? "variable" : (
            term.is_atom() ? "atom" : "structured"
        );

        const copy_category = term.is_model() ? "model" : (
            term.is_copy() ? "copy" : "normal"
        );
        
        nodes.push({data: {label: label, id: term.id },
                    
                    classes: [term_category, copy_category]});

        if (term.is_variable()) {
            if (term.value.id != term.id) {
                edges.push({ data: { source: term.id, target: term.value.id } })
            }
        } else if (!term.is_atom()){
            let i = 0;
            for (arg of term.value.args) {
                edges.push({ data: {
                    source: term.id,
                    target: arg.id,
                    label: i.toString()
                }})
                i++;
            }
            
        }
        
        
    }
    return {nodes: nodes, edges: edges};
}


function make_empty_variable(name, copy = false){
    const variable = Object.create(term_prototype, {
        variable: {value : true},
        id: {value: global_id_counter++},
        name: {value: name}
    });
    variable.value = variable;
    if (copy !== false)
        variable.copy_num = copy;
    all_terms.push(variable);
    return variable;
}

function make_atom(val){
    const retval = Object.create(term_prototype, {
        value: {value: val},
        id: {value: global_id_counter++},
        name: {value: val.toString()}
    });
    all_terms.push(retval);
    return retval;
}

function make_structured_term(functor, args){
    const struct = {functor:functor, args:args};
    const retval = Object.create(term_prototype, {
        value: {value : struct},
        id: {value: global_id_counter++},
        name: {value : functor}
    });
    all_terms.push(retval);
    return retval; 
}

function make_atom_model(val){
    const retval = Object.create(term_prototype, {
        value: {value: val},
        id: {value: global_id_counter++},
        name: {value: val.toString()},
        model: {value : true}
    });
    all_terms.push(retval);
    return retval;
}

function make_structured_model(functor, args){
    const struct = {functor:functor, args:args};
    const retval = Object.create(term_prototype, {
        value: {value : struct},
        id: {value: global_id_counter++},
        name: {value : functor},
        model: {value : true}
    });
    all_terms.push(retval);
    return retval; 
}


const term_prototype = {
    variable: false,
    model: false,
 
    is_atom(){
        return typeof this.value !== 'object' && this.value !== null;
    },
    
    is_variable(){
        return this.variable;
    },

    is_model(){
        return this.model;
    },

    is_copy(){
        return 'copy_num' in this;
    },

    bound(){
        if (Object.is(this.value, this)){
            return false;
        } else {
            return true;
        }
    },

    backup_value(){
        if (this.is_variable() && this.value.is_copy()){
            return this.id == this.value.copy_num ? this : this.value;
        } else {
            return this.value;
        }

    },
    
    dereferenced(){
        if (this.is_variable()) {
            if (this.bound()){
                if (this.is_atom() || 'functor' in this.value)
                    return this;
                else
                    return this.value.dereferenced_value(); 
            } else {
                return this;
            }
        } else {
            return this;
        }
        
    },

    //note: I think I don't understand what this function does and hence I have no idea what to call it
    dereferenced_value(){
        if (this.is_variable()){
            return this.dereferenced();
        } else {
            return this;
        }
        
    },


    content(){
        if (this.is_variable()){
            return this.value;
        } else {
            return this;
        }
    },
    
    bind(sq){
        console.assert(this.is_variable());
        console.assert(!this.bound());
        if (this.id < trail.last_id_counter[trail.last_id_counter.length-1]){
            trail.add_postbinding(this);
        }
        
        //L1 binding
        if (sq.is_atom()){
            this.value = sq;
        } 
        //L2 binding
        else if (sq.is_variable() && !sq.bound()){
            if (this.id < sq.id){ //this is older then sq
                sq.value = this.copy();
            } else {
                this.value = sq.copy();
            }            
        } 
        //L3 binding
        else if (sq.is_model()){
            this.value = sq.copy();
        } else {
            this.value = sq;
        }
        
    },
    
    copy(){
        if (this.is_atom()){
            return this;
        } else if (this.is_variable()){
            const a = this.dereferenced();
            if (a.is_variable() && !a.bound()){
                const b = make_empty_variable(a.name, a.id);
                 b.value = a;
                return b;
            } else {
                return a;
            }
        } else {
            let new_args = [];
            for (val of this.value.args){
                new_args.push(val.copy());
            }
            const term = make_structured_term(this.value.functor, new_args);
            term.copy_num = term.id;
            return term;
        }
        
    },
    
    unify_with(other){
        const x = this.dereferenced_value();
        const y = other.dereferenced_value();

        if (x.is_variable() && !x.bound()) {
            x.bind(y);
            return true;
        } else if (y.is_variable() && !y.bound()) {
            y.bind(x);
            return true;
        } else if (x.value === y.value){
            return true;
        } else if (x.is_atom() || y.is_atom()){
            return false;
        } else {
            if (x.value.functor !== y.value.functor || x.value.args.length !== y.value.args.length){
                return false;
            } else {
                for (let i = 0; i < x.value.args.length; i++){
	            const result = x.value.args[i].unify_with(y.value.args[i]);
	            if (!result){
		        return false;
	            }
	        }
	        return true;  
            } 
        }

    },

    direct_name(){
        if (this.is_variable()){
            return this.name;
        } else {
            return this.pprint();
        }
    },

    pprint(bracketed = true){
        const term = this.dereferenced_value();
        let out = "";
        if (term.is_variable()){
            out += (term.name);
        } else if (term.is_atom()) {
            if (bracketed)
                out += "<";
            out += term.value.toString();
        if (bracketed)
            out += ">";
            
        } else {
            const content = term.value;
            let i = 0;
            if (bracketed)
                out += "<";
            out += content.functor.replaceAll("{}", function () {
                return typeof content.args[i] != 'undefined' ? (content.args[i++]).pprint(bracketed) : '';
            });
            if (bracketed)
                out += ">";
        }
        return out;
        
        
    },
    

}


function query(string, out_pipe){
    const v_map = {
        map_data: {},
        insert: function (variable) {
            if (variable in this.map_data)
                return this.map_data[variable];
            else {
                const new_var = make_empty_variable(variable);
                this.map_data[variable] = new_var;
                return new_var;

            }

        }

    };

    const input = sentence_parse(string, {"value":0}, v_map);
    
    let succedeed = false;
    const output = ()=>{
        succedeed = true;
        dc.add_new_step("Success");
        Object.keys(v_map.map_data).forEach(function(key,index) {
            out_pipe(key+" = " + v_map.map_data[key].pprint());
        });
        out_pipe("true");
    };


    predicates[input.value.functor](...input.value.args, 1, output);
    if (!succedeed)
        out_pipe("false");
    

}



function sentence_parse(string, index, v_map){
    let sentence_name = "";
    const elements = [];
    console.assert(string[index.value] == "<");
    index.value++;
    for (; index.value < string.length; index.value++){
        const i = index.value;
        if (string[i] == ">"){
            if (elements.length == 0)
                return make_atom(sentence_name);
            else {
                return make_structured_term(sentence_name, elements);
            }
        }
        else if (string[i] == "<"){
            sentence_name = sentence_name.concat("{}");
            elements.push(sentence_parse(string, index, v_map));
        } else if (string[i] == "?" && (string[i-1] == " " || string[i-1] == "<")){
            sentence_name = sentence_name.concat("{}");
            let variable_name = "";
            for (; string[index.value] != " " && string[index.value] != ">"; index.value++){
                variable_name = variable_name.concat(string[index.value]);
            }
            elements.push(v_map.insert(variable_name));
            index.value--; //the ending space or bracket should be parsed too
        }
        else {
            sentence_name = sentence_name.concat(string[i]);

        }
            

    }
    throw "sentence string ended unexpectedly!"
}

