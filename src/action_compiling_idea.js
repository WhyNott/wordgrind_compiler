//deck object
// const decks = {
//     deck_1 : {
//         //now that I think about it, I don't think priority field is actually neccessary - just put items in a list in the priority order
//         //while we're at it, why not allow priority for choices as well? 
//         early_actions: [
//             (name, description, effects, next_deck, cont_0) => {
//                 const index = 0;
//                 //match each precondition with an item in db
//                 DB.match(/* nth precondition here */);
                
//                 //...
//                 name.unify_with(/* model of the name goes here */);
//                 description.unify_with(/* model of the description goes here */);
//                 effect.unify_with(make_structured_term("", [
//                     /* models of each effect go here */
//                 ]));
//                 next_deck.unify_with(/* model of the next deck goes here */);
//                 /* here goes logic */
//             },
                     
//         ],
//         choices: [...],
//         late_actions: [...] 
//     },
//     deck_2 : {
//         ...
//     }
// }

//todo:
//next deck field should go to the same one in a lot of cases



const DB = {
    store : {},

    function add(fact){
        const name = fact.is_atom() ? fact.value.toString() : fact.value.functor;
        if (name in this.store){
            this.store[name].push(fact);
        } else {
            this.store[name] = [fact];
        }
    },
    //note - to remove the need for trailing here, maybe it would make
    //sense to create a 'can_unify' method here, that unifies without making changes
    
    function remove(fact){
        if (name in this.store){
            trail.new_choice_point();
            for (let i = 0; i < this.store[name].length; i++){
                if (fact.unify_with(this.store[name][i])){
                    this.store[name].splice(i, 1);
                    i--;
                    trail.restore_choice_point();
                }
            }
            trail.remove_choice_point();
        }
    },
    
    function match_list(list, index, logic){
        const item = list[index];
        const name = item.is_atom() ? item.value.toString() : item.value.functor;
        if (name in this.store){
            trail.new_choice_point();
            for (fact of this.store[name]) {
                if (fact.unify_with(item)){
                    if (list.length() == (index+1))
                        logic();
                    else
                        match_one(list, index+1, logc);
                    trail.restore_choice_point();
                }
            }
            trail.remove_choice_point();
        } 
        
    },
    function match(logic, ...facts) {
        if (facts.length == 0)
            logic();
        else
            this.match_list(facts, 0, logic);
    },
    

}


const decks = {
    'default' : {
        early_actions: [],
        choices: [
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;
                const var_A = make_empty_variable('?A' + (index == 1 ? '' : index));
                const var_B = make_empty_variable('?B' + (index == 1 ? '' : index));
                
                name.unify_with(make_structured_term("Walk from {} to {}", [var_A, var_B]));
                description.unify_with(make_structured_term("You walk from {} to {}. You are now in {}.", [var_A, var_B, var_B]));
                effect.unify_with(make_structured_term("", [
                    make_structured_term("Player is in {}", [var_B]),
                    make_structured_term("removes", [
                        make_structured_term("Player is in {}", [var_A]),
                    ]),
                ]));

                const logic = () => {
                    new_backup_frame();
                
                    dc.add_new_step('<Walk from ?A to ?B.> condition' + (index == 1 ? '' : index));
                    
                    const cont_1 = () => {
                        predicates['{} is not {}'](var_A, var_B, index + 1, cont_0);
                        
                    };
                    const cont_2 = () => {
                        predicates['{} is a room'](var_A, index + 1, cont_1);
                        
                    };
                    predicates['{} is a room'](var_B, index + 1, cont_2);
                
                    remove_backup_frame();
                };
                
                DB.match(logic, 
                         make_structured_term("Player is in {}", [var_A]),
                        );                     
            },

            
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;
                const var_Item = make_empty_variable('?Item' + (index == 1 ? '' : index));
                const var_Place = make_empty_variable('?Place' + (index == 1 ? '' : index));
                const var_Followup = make_empty_variable('?Followup' + (index == 1 ? '' : index));
                
                
       
                name.unify_with(make_structured_term("Pick up {}.", [var_Item]));
                description.unify_with(make_structured_term("You have successfully picked up {}.", [var_Item]));
                effect.unify_with(make_structured_term("", [
                    make_structured_term("Player has {}", [var_Item]),
                    make_structured_term("removes", [
                        make_structured_term("{} is in {}", [var_Item, var_Place]),
                    ]),
                ]));
   
                
                const logic = () => {
                    new_backup_frame();
                    dc.add_new_step('<Pick up ?Item.> condition' + (index == 1 ? '' : index));
                    predicates['{} is the followup text for {}'](var_Followup, var_Item, index + 1, cont_0);
                    remove_backup_frame();

                };

                DB.match(logic,
                    make_structured_term("Player is in {}", [var_Place]),
                    make_structured_term("{} is in {}", [var_Item, var_Place])
                );

                
            },

            (name, description, effects, next_deck, cont_0) => {
                const index = 0;
                const var_Item = make_empty_variable('?Item' + (index == 1 ? '' : index));
                const var_Place = make_empty_variable('?Place' + (index == 1 ? '' : index));
                          
                
                name.unify_with(make_structured_term("Drop {}.", [var_Item]));
                description.unify_with(make_structured_term("You have dropped {}.", [var_Item]));
                effect.unify_with(make_structured_term("", [
                    make_structured_term("{} is in {}", [var_Item, var_Place]),
                    make_structured_term("removes", [
                        make_structured_term("Player has {}", [var_Item]),
                    ]),
                ]));

                DB.match(cont_0,
                         make_structured_term("Player is in {}", [var_Place]),
                         make_structured_term("Player has {}", [var_Item]),
                        );
            },
            
            (name, description, effects, next_deck, cont_0) => {
                const index = 0; 
                
                name.unify_with(make_atom("Use computer."));
                next_deck.unify_with(make_atom("Computer"));
                DB.match(cont_0,
                    make_structured_term("Player is in {}", [make_atom("Living Room")]);
                );
            },

        ],
        late_actions: [] 
    },
    'Computer' : {
        early_actions: [
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Things appear on the monitor."));
                description.unify_with(make_atom("Things appear on the monitor."));
                cont_0();
            },
        ],
        choices: [
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Play game."));
                description.unify_with(make_atom("You play a video game."));
                cont_0();
            },
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Browse the internet."));
                description.unify_with(make_atom("You spend some time aimlessly wandering on the internet."));
                cont_0();
            },
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Chat with a friend."));
                description.unify_with(make_atom("You start up the chat client."));
                next_deck.unify_with(make_atom("Chat"));
                cont_0();
            },

        ],
        late_actions: [] 
    },
    'Chat' : {
        early_actions: [],
        choices: [
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Ask to hang out."));
                cont_0();
            },
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Argue about politics."));
                cont_0();
            },
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Send a meme."));
                cont_0();
            },
        ],
        late_actions: [
            (name, description, effects, next_deck, cont_0) => {
                const index = 0;           
                name.unify_with(make_atom("Lol"));
                description.unify_with(make_atom("Your friend says 'LOL'."));
                cont_0();
            },
        ] 
    },
}


function apply_element(element) {
    //out_pipe(element.description);
    if (element.effects != null){
        for (effect of element.effects){
            if (!effect.is_atom() && effect.value.functor == "removes"){
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

    let choices = [];
    
    const cont = () => {
        let found_choice = {};
        found_choice.name = name.pprint(bracketed = false);
        found_choice.description = description.pprint(bracketed = false);
        found_choice.effects = effects.bound() ? effects.value.args : null;
        found_choice.next_deck = next_deck.bound() ? next_deck.value.value : null;
        choices.push(found_choice);
    };

    trail.new_choice_point();
    for (possible_choice of deck.choices) {
        possible_choice(name, description, effects, next_deck, cont);
        trail.restore_choice_point();
    }
    trail.remove_choice_point();

    return choices;
}



function choose_action(late){
    const deck = decks[current_deck.deck];
    const actions = late ? deck.early_actions : deck.late_actions;
    
    const name        = make_empty_variable("name"); 
    const description = make_empty_variable("description"); 
    const effects     = make_empty_variable("effects"); 
    const next_deck   = make_empty_variable("next_deck");

    let found_suitable = false;
    let chosen_action = {};
    
    const cont = () => {
        if (!found_suitable){
            found_suitable = true;
            chosen_action.name = name.pprint(bracketed = false);
            chosen_action.description = description.pprint(bracketed = false);
            chosen_action.effects = effects.bound() ? effects.value.args : null;
            chosen_action.next_deck = next_deck.bound() ? next_deck.value.value : null;
        }
    };

    trail.new_choice_point();
    for (action of actions) {
        if (found_suitable)
            break;
        action(name, description, effects, next_deck, cont);
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
    let state;
    if (current_element.next_deck === null) {
        state = STATES.LATE;
    } else {
        state = STATES.PUSH;
    }
    current_deck.pre_choice = false;
    while(true){
        
        if state == STATES.LATE {
        //code for executing late action 
            let action = choose_action(late=true);
            if action === null {
                state = STATES.POP;
            } else {
                current_element = action;
                apply_element(current_element);
                if current_element.next_deck === null {
                    state = STATES.LATE;
                } else {
                    current_deck.pre_choice = false;
                    state = STATES.PUSH;
                }
            }
        } else if state == STATES.EARLY {
            //code for executing early action
            let action = choose_action(late=false);
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
            
        } else if state == STATES.POP {
            //code for popping a deck from stack
            if (deck_stack.length() > 0)
                current_deck = deck_stack.pop();
            else
                current_deck = {deck: "default", pre_choice:true};

            if (current_deck.pre_choice)
                state = STATES.EARLY;
            else
                state = STATES.LATE;
            
        } else if state == STATES.PUSH {
            //code for pushing current to the stack and seting lead as current deck
            if (current_deck != "default") {
                deck_stack.push(current_deck);
            }
            current_deck = {deck: current_element.next_deck, pre_choice:current_deck.pre_choice};
            
        } else {
            //throw an error here
            throw "Invalid state value!"
        }

    }

}
