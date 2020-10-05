//<<s of <0>> plus <s of <0>> equals ?X>
//<?X plus <s of <0>> equals <s of <0>>>

//Next step will be adding a plot for visualizing the bound variables as a directed graph

let global_variable_counter = 0;

let global_id_counter = 0;

let all_terms = [];


function produce_nodes(){
    let nodes = [];
    let edges = [];
    for (term of all_terms){
        const label = term.is_variable() ?
              term.name
              :
              term.pprint();
        
        const category = term.is_variable() ? "variable" : (
            term.is_atom() ? "atom" : "structured"
        );
        
        nodes.push({data: {label: label, id: term.id },
                    
                    classes: category});

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


function make_empty_variable(name){
    const variable = Object.create(term_prototype, {
        variable: {value : true},
        id: {value: global_id_counter++},
        name: {value: name}
    });
    variable.value = variable;
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

    bound(){
        console.assert(this.is_variable());
        if (Object.is(this.value, this)){
            return false;
        } else {
            return true;
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

    
    bind(sq){
        console.assert(this.is_variable());
        if (sq.is_model()){
            this.value = sq.copy();
        } else {
            this.value = sq;
        }
        
    },
    
    copy(){
        if (this.is_variable()){
            const a = this.dereferenced();
            if (a.is_variable()){
                const b = make_empty_variable(a.name + "_copy_" + (global_variable_counter++));
                a.value = b;
                return b;
            } else {
                return a;
            }
        } else if (this.is_atom()) {
            return make_atom(this.value);
        } else {
            let new_args = [];
            for (val of this.value.args){
                new_args.push(val.copy());
            }
            return make_structured_term(this.value.functor, new_args);
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

    pprint(bracketed = true){
        const term = this.dereferenced_value();
        let out = "";
        if (term.is_variable()){
            out += ("?"+term.name);
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
            out += content.functor.replace(/{}/, function () {
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
        Object.keys(v_map.map_data).forEach(function(key,index) {
            out_pipe(key+" = " + v_map.map_data[key].pprint());
        });
    };


    predicates[input.value.functor](...input.value.args, output);
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




//okay, so this should recur infinitely, but for some reason it doesn't
//I think the reason has something to do with the head variables not resetting properly sometimes
const predicates = {
    "{} plus {} equals {}": (head_0, head_1, head_2, cont_0) => {
        const var_A  = make_empty_variable("A" + (global_variable_counter++));
        const var_B  = make_empty_variable("B" + (global_variable_counter++));
        const var_C  = make_empty_variable("C" + (global_variable_counter++)); 
        
        const cont_1 = (next) => {
            if (var_A.unify_with(head_2)) {next()}
        };
        const cont_2 = (next) => {
            if (head_1.unify_with(make_atom_model("0"))){
                cont_1(next);
            }
        };
        const cont_3 = (next) => {         
            predicates["{} plus {} equals {}"](var_A, var_B, var_C, next);
        };
        const cont_4 = (next) => {
            if (head_2.unify_with(make_structured_model('s of {}', [var_C]))) {
                cont_3(next);
            }
        };
  
        const cont_5 = (next) => {
            if (head_1.unify_with(make_structured_model('s of {}', [var_B]))) {cont_4(next)};
        };

        const backup_var_A  = var_A.dereferenced_value() .value;
        const backup_var_B  = var_B.dereferenced_value() .value; 
        const backup_var_C  = var_C.dereferenced_value() .value; 
        const backup_head_0 = head_0.dereferenced_value().value; 
        const backup_head_1 = head_1.dereferenced_value().value; 
        const backup_head_2 = head_2.dereferenced_value().value; 
        
        
        if (var_A.unify_with(head_0)) {cont_2(cont_0)};

        var_A.value = backup_var_A; 
        var_B.value = backup_var_B; 
        var_C.value = backup_var_C; 
        head_0.value = backup_head_0; 
        head_1.value = backup_head_1; 
        head_2.value = backup_head_2; 
      

        if (var_A.unify_with(head_0)) {cont_5(cont_0)};

        var_A.value = backup_var_A; 
        var_B.value = backup_var_B; 
        var_C.value = backup_var_C; 
        head_0.value = backup_head_0; 
        head_1.value = backup_head_1; 
        head_2.value = backup_head_2; 
      
    },

}
