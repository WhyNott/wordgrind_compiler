const init_desc = '';
DB.store = { };
const decks = {
    'default' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Hello'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Hello'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Hi'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Hi'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Howdy'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Howdy'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Test'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Test'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Cheer'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Cheer'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Aeou'));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Aeou'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
                const var_unn_13  = make_empty_variable('?unn_13' + (index == 1 ? '' : index));
                name.unify_with(make_atom_model('This choice will only appear when there are less then 3 choices'));
                const logic = () => {
                    const cont_1 = () => {
                        predicates['{} lesser than {}'](var_X, var_unn_13, index + 1, cont_0);
                    };
                    const cont_2 = () => {
                        {
                            const model = make_atom_model('3');
                            const model_name = model.pprint();
                            if (var_unn_13.unify_with(model)){
                                dc.add_new_step(`${var_unn_13.direct_name()} = ${model_name}`);
                                cont_1();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_13.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    predicates['{} prior choices available'](var_X, index + 1, cont_2);

                };
                logic();
            },

        ],
        late_actions: [
        ],
    },
};
const predicates = {
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
            A.unify_with(make_atom(
                (parseInt(C.content().value) - parseInt(B.content().value)).toString()
            ));
            cont();
        } else if (!B.bound()) {
            console.assert(A.dereferenced().is_atom());
            console.assert(C.dereferenced().is_atom());
            B.unify_with(make_atom(
                (parseInt(C.content().value) - parseInt(A.content().value)).toString()
            ));
            cont();
        } else if (!C.bound()) {
            console.assert(B.dereferenced().is_atom());
            console.assert(A.dereferenced().is_atom());
            C.unify_with(make_atom(
                (parseInt(A.content().value) + parseInt(B.content().value)).toString()
            ));
            cont();
        } else {
            console.assert(A.dereferenced().is_atom());
            console.assert(B.dereferenced().is_atom());
            console.assert(C.dereferenced().is_atom());
            if (C.unify_with(make_atom(
                (parseInt(A.content().value) + parseInt(B.content().value)).toString()
            )))
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
            End.unify_with(make_atom(parseInt(Start.content().value) + 5));
        else if (Dir.content().value == "-")
            End.unify_with(make_atom(parseInt(Start.content().value) - 5));
        else
            console.assert(false);
        cont();
    },

    '{} greater than {}':(A, B, index, cont) => {
        console.assert(A.bound());
        console.assert(B.bound());
        if (parseInt(A.content().value) > parseInt(B.content().value))
            cont();
    },

    '{} lesser than {}':(A, B, index, cont) => {
        predicates['{} greater than {}'](B, A, index, cont);
    },

    "{} prior choices available":(X, index, cont) => {
        const current_choice_num = available_choices.length;
        if (X.bound()) {
            if (parseInt(X.content().value) == current_choice_num) {
                cont();
            }
        } else {
            X.unify_with(make_atom(current_choice_num));
            cont();
        }
    }
 
};

