DB.store = {
    'Player is in {}' : {
        data: [make_structured_model('Player is in {}', [make_atom_model('Kitchen'), ]),    ] 
 },
    '{} is in {}' : {
        data: [make_structured_model('{} is in {}', [make_atom_model('Knife'), make_atom_model('Kitchen'), ]),make_structured_model('{} is in {}', [make_atom_model('TV Remote'), make_atom_model('Living Room'), ]),    ] 
 },
};
const decks = {
    'default' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_A  = make_empty_variable('?A' + (index == 1 ? '' : index));
                const var_B  = make_empty_variable('?B' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Walk from {} to {}', [var_A, var_B, ]));
                description.unify_with(make_structured_model('You walk from {} to {}. You are now in {}.', [var_A, var_B, var_B, ]));
                effects.unify_with(make_structured_term('', [
                    make_structured_model('Player is in {}', [var_B, ]),
                    make_structured_term('not', [make_structured_model('Player is in {}', [var_A, ])]),
                ]));
                const logic = () => {
                    new_backup_frame();
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
                    make_structured_model('Player is in {}', [var_A, ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_Item  = make_empty_variable('?Item' + (index == 1 ? '' : index));
                const var_Place  = make_empty_variable('?Place' + (index == 1 ? '' : index));
                const var_Followup  = make_empty_variable('?Followup' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Pick up {}', [var_Item, ]));
                description.unify_with(make_structured_model('You have sucessfully picked up {}. {}', [var_Item, var_Followup, ]));
                effects.unify_with(make_structured_term('', [
                    make_structured_model('Player has {}', [var_Item, ]),
                    make_structured_model('not', [make_structured_model('{} is in {}', [var_Item, var_Place, ])]),
]));
                const logic = () => {
                    predicates['{} is the followup text for {}'](var_Followup, var_Item, index + 1, cont_0);

                };
                DB.match(logic,
                    make_structured_model('Player is in {}', [var_Place, ]),
                    make_structured_model('{} is in {}', [var_Item, var_Place, ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_Item  = make_empty_variable('?Item' + (index == 1 ? '' : index));
                const var_Place  = make_empty_variable('?Place' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Drop {}', [var_Item, ]));
                description.unify_with(make_structured_model('You have dropped {}.', [var_Item, ]));
                effects.unify_with(make_structured_term('', [
                make_structured_model('{} is in {}', [var_Item, var_Place, ]),
                make_structured_term('not', [make_structured_model('Player has {}', [var_Item, ])]),
]));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [var_Place, ]),
                    make_structured_model('Player has {}', [var_Item, ]),
                );
            },

        ],
        late_actions: [
        ],
    },
};
const predicates = {
    '{} is a room': (head_0, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is a room> Entry' + (index == 1 ? '' : index));

        trail.new_choice_point();

        {
            const model = make_atom_model('Kitchen');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('Living room');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    '{} is the followup text for {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is the followup text for {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_atom_model('Knife');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_2 = () => {
            {
                const model = make_atom_model('TV Remote');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        trail.new_choice_point();

        {
            const model = make_atom_model('It is really shiny');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_1();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('It seems to be missing batteries');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_2();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    //Built-in predicates (a standard library of sorts)
    '{} is not {}':(A, B, index, cont) => {
        if (!A.unify_with(B)){
            cont();
        }
    },

    '{} + {} = {}':(A, B, C, index, cont) => {
        if (!A.bound()) {
            console.assert(B.dereferenced().is_atom());
            console.assert(C.dereferenced().is_atom());
            A.unify_with(make_atom(C.content().value - B.content().value));
            cont();
        } else if (!B.bound()) {
            console.assert(A.dereferenced().is_atom());
            console.assert(C.dereferenced().is_atom());
            B.unify_with(make_atom(C.content().value - A.content().value));
            cont();
        } else if (!C.bound()) {
            console.assert(B.dereferenced().is_atom());
            console.assert(A.dereferenced().is_atom());
            C.unify_with(make_atom(A.content().value + B.content().value));
            cont();
        } else {
            console.assert(A.dereferenced().is_atom());
            console.assert(B.dereferenced().is_atom());
            console.assert(C.dereferenced().is_atom());
            if (C.unify_with(make_atom(A.content().value + B.content().value)))
                cont();
        }
        
    },
    '{} - {} = {}':(A, B, C, index, cont) => {
        predicates['{} + {} = {}'](C, B, A, index, cont);
    },
    //"shifted to" predicates for now will just add/subtract 5 lmao
    '{} is shifted to {} as {}':(Start, Dir, End, index, cont) => {
        console.assert(Start.bound());
        console.assert(Dir.bound());
        if (Dir.content().value == "+")
            End.unify_with(make_atom(Start.content().value + 5));
        else if (Dir.content().value == "-")
            End.unify_with(make_atom(Start.content().value - 5));
        else
            console.assert(false);
        cont();
    },

    '{} greater than {}':(A, B, index, cont) => {
        console.assert(A.bound());
        console.assert(B.bound());
        if (A.content().value > B.content().value)
            cont();
    },

    '{} lesser than {}':(A, B, index, cont) => {
        predicates['{} greater than {}'](B, A, index, cont);
    },
 
};

