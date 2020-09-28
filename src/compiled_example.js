//ok, so for now variables don't have ID's. we'll see how well that goes.
//<<s of <0>> plus <s of <0>> equals ?X>
//<?X plus <s of <0>> equals <s of <0>>>
const term_prototype = {
    variable: false,
    model: false,
    value: null,

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
        if (this.value === null){
            return false;
        } else {
            return true;
        }
    },
    
    dereferenced(){
        if (this.bound()){
            return this.value.dereferenced_value();
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
                const b = Object.create(term_prototype, {variable: {value : true}}); //new empty variable
                a.value = b;
                return b;
            } else {
                return a;
            }
        } else if (this.is_atom()) {
            return this;
        } else {
            let new_args = [];
            for (val of this.value.args){
                new_args.push(val.copy());
            }
            const term_copy = {functor: this.value.functor, args: new_args}; 
            
            return Object.create(term_prototype, {value: {value : term_copy}}); //new term (marked as instance)
        }
        
    },
    
    unify_with(other){
        const x = this.dereferenced_value();
        const y = other.dereferenced_value();

        if (x.is_variable()) {
            x.bind(y);
            return true;
        } else if (y.is_variable()) {
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
            out += "?_";
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
                const new_var = Object.create(term_prototype, {variable: {value : true}});
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
                return Object.create(term_prototype, {value: {value : sentence_name}});
            else {
                const str = {functor: sentence_name, args:elements};
                return Object.create(term_prototype, {value: {value : str}});
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





const predicates = {
    "{} plus {} equals {}": (head_0, head_1, head_2, cont_0) => {
        const var_A  = Object.create(term_prototype, {variable: {value : true}});
        const var_B  = Object.create(term_prototype, {variable: {value : true}});
        const var_C  = Object.create(term_prototype, {variable: {value : true}});
       
        const cont_1 = (next) => {
            if (var_A.unify_with(head_2)) {next()}
        };
        const cont_2 = (next) => {
            if (head_1.unify_with(Object.create(term_prototype, {value: {value : "0"}}))){
                cont_1(next);
            }
        };
        const cont_3 = (next) => {
            
            predicates["{} plus {} equals {}"](var_A, var_B, var_C, next);
        };
        const cont_4 = (next) => {
            const content = {functor:'s of {}', args:[var_C]};
            const model = Object.create(term_prototype, {
                value: {value : content},
                model: {value : true}
            });
            if (head_2.unify_with(model)) {
                cont_3(next);
            }
        };
  
        const cont_5 = (next) => {
            const content = {functor:'s of {}', args:[var_B]};
            const model = Object.create(term_prototype, {
                value: {value : content},
                model: {value : true}
            });
            if (head_1.unify_with(model)) {cont_4(next)};
        };

        const backup_var_A = var_A.value; 
        const backup_var_B = var_B.value; 
        const backup_var_C = var_C.value; 
        const backup_head_0 = head_0.value; 
        const backup_head_1 = head_1.value; 
        const backup_head_2 = head_2.value; 
        
        
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
