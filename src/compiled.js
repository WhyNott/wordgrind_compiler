const init_desc = 'Play me to the moon.';
DB.store = {
    'week {}' : {
        unique: true,
        data: [make_structured_model('week {}', [make_atom_model('1'), ]),    ] 
 },
    '{} action points' : {
        unique: true,
        data: [make_structured_model('{} action points', [make_atom_model('7'), ]),    ] 
 },
    'civilisation {}' : {
        unique: true,
        data: [make_structured_model('civilisation {}', [make_atom_model('5'), ]),    ] 
 },
    'money {}' : {
        unique: true,
        data: [make_structured_model('money {}', [make_atom_model('0'), ]),    ] 
 },
};
const decks = {
    'default' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Stay here'));
                next_deck.unify_with(make_atom_model('Light world'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Cross over'));
                next_deck.unify_with(make_atom_model('Dark world'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Plan'));
                next_deck.unify_with(make_atom_model('Plans'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_Current  = make_empty_variable('?Current' + (index == 1 ? '' : index));
                const var_Next  = make_empty_variable('?Next' + (index == 1 ? '' : index));
                const var_unn_14  = make_empty_variable('?unn_14' + (index == 1 ? '' : index));
                name.unify_with(make_atom_model('End week'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('{} action points', [make_atom_model('7'), ]),
                make_structured_model('week {}', [var_Next, ]),
]));
                const logic = () => {
                    const cont_1 = () => {
                        predicates['{} + {} = {}'](var_Current, var_unn_14, var_Next, index + 1, cont_0);
                    };
                    {
                        const model = make_atom_model('1');
                        const model_name = model.pprint();
                        if (var_unn_14.unify_with(model)){
                            dc.add_new_step(`${var_unn_14.direct_name()} = ${model_name}`);
                            cont_1();
                        } else {
                            dc.add_new_step(`Failed: ${var_unn_14.dereferenced_value().direct_name()} = ${model_name}`);
                        }
                    }

                };
                DB.match(logic,
                    make_structured_model('week {}', [var_Current, ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Light world' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_AP  = make_empty_variable('?AP' + (index == 1 ? '' : index));
                const var_Civ  = make_empty_variable('?Civ' + (index == 1 ? '' : index));
                const var_Mon  = make_empty_variable('?Mon' + (index == 1 ? '' : index));
                const var_APNext  = make_empty_variable('?APNext' + (index == 1 ? '' : index));
                const var_CivNext  = make_empty_variable('?CivNext' + (index == 1 ? '' : index));
                const var_MonNext  = make_empty_variable('?MonNext' + (index == 1 ? '' : index));
                const var_unn_15  = make_empty_variable('?unn_15' + (index == 1 ? '' : index));
                const var_unn_16  = make_empty_variable('?unn_16' + (index == 1 ? '' : index));
                const var_unn_17  = make_empty_variable('?unn_17' + (index == 1 ? '' : index));
                const var_unn_18  = make_empty_variable('?unn_18' + (index == 1 ? '' : index));
                name.unify_with(make_atom_model('Go to work'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('{} action points', [var_APNext, ]),
                make_structured_model('civilisation {}', [var_CivNext, ]),
                make_structured_model('money {}', [var_MonNext, ]),
]));
                const logic = () => {
                    const cont_1 = () => {
                        predicates['{} + {} = {}'](var_Mon, var_unn_18, var_MonNext, index + 1, cont_0);
                    };
                    const cont_2 = () => {
                        {
                            const model = make_atom_model('5');
                            const model_name = model.pprint();
                            if (var_unn_18.unify_with(model)){
                                dc.add_new_step(`${var_unn_18.direct_name()} = ${model_name}`);
                                cont_1();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_18.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_3 = () => {
                        predicates['{} is shifted to {} as {}'](var_Civ, var_unn_17, var_CivNext, index + 1, cont_2);
                    };
                    const cont_4 = () => {
                        {
                            const model = make_atom_model('+');
                            const model_name = model.pprint();
                            if (var_unn_17.unify_with(model)){
                                dc.add_new_step(`${var_unn_17.direct_name()} = ${model_name}`);
                                cont_3();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_17.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_5 = () => {
                        predicates['{} - {} = {}'](var_AP, var_unn_16, var_APNext, index + 1, cont_4);
                    };
                    const cont_6 = () => {
                        {
                            const model = make_atom_model('1');
                            const model_name = model.pprint();
                            if (var_unn_16.unify_with(model)){
                                dc.add_new_step(`${var_unn_16.direct_name()} = ${model_name}`);
                                cont_5();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_16.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_7 = () => {
                        predicates['{} greater than {}'](var_AP, var_unn_15, index + 1, cont_6);
                    };
                    {
                        const model = make_atom_model('0');
                        const model_name = model.pprint();
                        if (var_unn_15.unify_with(model)){
                            dc.add_new_step(`${var_unn_15.direct_name()} = ${model_name}`);
                            cont_7();
                        } else {
                            dc.add_new_step(`Failed: ${var_unn_15.dereferenced_value().direct_name()} = ${model_name}`);
                        }
                    }

                };
                DB.match(logic,
                    make_structured_model('{} action points', [var_AP, ]),
                    make_structured_model('civilisation {}', [var_Civ, ]),
                    make_structured_model('money {}', [var_Mon, ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Go back'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'Dark world' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_AP  = make_empty_variable('?AP' + (index == 1 ? '' : index));
                const var_Civ  = make_empty_variable('?Civ' + (index == 1 ? '' : index));
                const var_Mon  = make_empty_variable('?Mon' + (index == 1 ? '' : index));
                const var_APNext  = make_empty_variable('?APNext' + (index == 1 ? '' : index));
                const var_CivNext  = make_empty_variable('?CivNext' + (index == 1 ? '' : index));
                const var_MonNext  = make_empty_variable('?MonNext' + (index == 1 ? '' : index));
                const var_unn_19  = make_empty_variable('?unn_19' + (index == 1 ? '' : index));
                const var_unn_20  = make_empty_variable('?unn_20' + (index == 1 ? '' : index));
                const var_unn_21  = make_empty_variable('?unn_21' + (index == 1 ? '' : index));
                const var_unn_22  = make_empty_variable('?unn_22' + (index == 1 ? '' : index));
                name.unify_with(make_atom_model('Go scavenging'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('{} action points', [var_APNext, ]),
                make_structured_model('civilisation {}', [var_CivNext, ]),
                make_structured_model('money {}', [var_MonNext, ]),
]));
                const logic = () => {
                    const cont_1 = () => {
                        predicates['{} + {} = {}'](var_Mon, var_unn_22, var_MonNext, index + 1, cont_0);
                    };
                    const cont_2 = () => {
                        {
                            const model = make_atom_model('5');
                            const model_name = model.pprint();
                            if (var_unn_22.unify_with(model)){
                                dc.add_new_step(`${var_unn_22.direct_name()} = ${model_name}`);
                                cont_1();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_22.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_3 = () => {
                        predicates['{} is shifted to {} as {}'](var_Civ, var_unn_21, var_CivNext, index + 1, cont_2);
                    };
                    const cont_4 = () => {
                        {
                            const model = make_atom_model('-');
                            const model_name = model.pprint();
                            if (var_unn_21.unify_with(model)){
                                dc.add_new_step(`${var_unn_21.direct_name()} = ${model_name}`);
                                cont_3();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_21.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_5 = () => {
                        predicates['{} - {} = {}'](var_AP, var_unn_20, var_APNext, index + 1, cont_4);
                    };
                    const cont_6 = () => {
                        {
                            const model = make_atom_model('1');
                            const model_name = model.pprint();
                            if (var_unn_20.unify_with(model)){
                                dc.add_new_step(`${var_unn_20.direct_name()} = ${model_name}`);
                                cont_5();
                            } else {
                                dc.add_new_step(`Failed: ${var_unn_20.dereferenced_value().direct_name()} = ${model_name}`);
                            }
                        }
                    };
                    const cont_7 = () => {
                        predicates['{} greater than {}'](var_AP, var_unn_19, index + 1, cont_6);
                    };
                    {
                        const model = make_atom_model('0');
                        const model_name = model.pprint();
                        if (var_unn_19.unify_with(model)){
                            dc.add_new_step(`${var_unn_19.direct_name()} = ${model_name}`);
                            cont_7();
                        } else {
                            dc.add_new_step(`Failed: ${var_unn_19.dereferenced_value().direct_name()} = ${model_name}`);
                        }
                    }

                };
                DB.match(logic,
                    make_structured_model('{} action points', [var_AP, ]),
                    make_structured_model('civilisation {}', [var_Civ, ]),
                    make_structured_model('money {}', [var_Mon, ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Go back'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'Plans' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('placeholder for now'));
                description.unify_with(make_atom_model('This option is left empty for now.'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Go back'));
                cont_0();
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

