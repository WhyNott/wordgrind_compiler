function unify (x, y){
    if (x.bound.value === false && y.bound.value === false){
        if (x.bound.freshness > y.bound.freshness){
            console.log("Variable ${x.bound.freshness} now points to ${y.bound.freshness}");
            x.bound = y.bound;
        }
        else {
            console.log("Variable ${y.bound.freshness} now points to ${x.bound.freshness}");
	    y.bound = x.bound;
        }
	return true;
    } else if (x.bound.value === false && y.bound.value !== false) {
	x.bound.value = y.bound.value;
	return true;
    } else if (x.bound.value !== false && y.bound.value === false) {
	y.bound.value = x.bound.value;
	return true;
    } else if (typeof x.bound.value !== 'object' || typeof y.bound.value !== 'object'){
	return x.bound.value === y.bound.value;
    } else {
	if (x.bound.value.functor !== y.bound.value.functor || x.bound.value.args.length !== y.bound.value.args.length){
	    return false;
	}
	for (let i = 0; i < x.bound.value.args.length; i++){
	    let result = unify(x.bound.value.args[i], y.bound.value.args[i]);
	    if (!result){
		return false;
	    }
	}
	return true;
	
    }
}

function clone(term){
    //todo: replace it with something slightly faster, maybe from some js library or sth
    return JSON.parse(JSON.stringify(term));
}



const predicates = {
    "{} plus {} equals {}": (head_0, head_1, head_2, index, cont_0) => {
        const var_A  = {bound:{value: false, freshness: 0 + index }};
        const var_B  = {bound:{value: false, freshness: 1 + index }};
        const var_C  = {bound:{value: false, freshness: 2 + index }};
       
        const cont_1 = (next) => {
            if (unify(var_A, head_2)) {next()}
        };
        const cont_2 = (next) => {
            if (unify(head_1, {bound:{value:'0'}})) {cont_1(next)}
        };
        const cont_3 = (next) => {
            
            predicates["{} plus {} equals {}"](var_A, var_B, var_C, index+7, next);
        };
        const cont_4 = (next) => {
            if (unify(head_2, {bound:{value:{functor:'s of {}', args:[var_C]}}})) {cont_3(next)}
        };
  
        const cont_5 = (next) => {
            if (unify(head_1, {bound:{value:{functor:'s of {}', args:[var_B]}}})) {cont_4(next)}
        };

        const backup_var_A = clone(var_A.bound.value); 
        const backup_var_B = clone(var_B.bound.value); 
        const backup_var_C = clone(var_C.bound.value); 
        const backup_head_0 = clone(head_0.bound.value); 
        const backup_head_1 = clone(head_1.bound.value); 
        const backup_head_2 = clone(head_2.bound.value); 
        
        
        if (unify(var_A, head_0)) {cont_2(cont_0)};

        var_A.bound.value = backup_var_A; 
        var_B.bound.value = backup_var_B; 
        var_C.bound.value = backup_var_C; 
        head_0.bound.value = backup_head_0; 
        head_1.bound.value = backup_head_1; 
        head_2.bound.value = backup_head_2; 
      

        if (unify(var_A, head_0)) {cont_5(cont_0)};

        var_A.bound.value = backup_var_A; 
        var_B.bound.value = backup_var_B; 
        var_C.bound.value = backup_var_C; 
        head_0.bound.value = backup_head_0; 
        head_1.bound.value = backup_head_1; 
        head_2.bound.value = backup_head_2; 
      
    },

}


function test(){
    

    const var_A = {bound:{value:{functor:'s of {}', args:[
        {bound:{value:{functor:'s of {}', args:[
            {bound:{value:'0'}}
        ]}}}
    ]}}};

    const var_B = {bound:{value:{functor:'s of {}', args:[
        {bound:{value:{functor:'s of {}', args:[
            {bound:{value:'0'}}
        ]}}}
    ]}}};

    const var_C =  {bound:{value: false, freshness: 0}};

    const hi = () => {console.log(JSON.stringify(var_C.bound))};
    
    predicates["{} plus {} equals {}"](var_A, var_B, var_C, 0, hi);


    const var_A2 = {bound:{value:{functor:'s of {}', args:[
        
        {bound:{value:'0'}}
        
    ]}}};

    const var_B2 =  {bound:{value: false, freshness: 0}};
    
    const var_C2 = {bound:{value:{functor:'s of {}', args:[
        {bound:{value:{functor:'s of {}', args:[
            {bound:{value:'0'}}
        ]}}}
    ]}}};


    const hi2 = () => {console.log(JSON.stringify(var_B2.bound))};
    
    predicates["{} plus {} equals {}"](var_A2, var_B2, var_C2, 0, hi2);


    

}
