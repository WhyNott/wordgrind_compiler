const init_desc = 'You wake up in a cold sweat. You had nightmares all night, and now you have a horrible headache.';
DB.store = {
    'Player is in {}' : {
        data: [make_structured_model('Player is in {}', [make_atom_model('bedroom'), ]),    ] 
 },
    '{} is in {}' : {
        data: [make_structured_model('{} is in {}', [make_atom_model('Knife'), make_atom_model('kitchen'), ]),make_structured_model('{} is in {}', [make_atom_model('Batteries'), make_atom_model('kitchen'), ]),make_structured_model('{} is in {}', [make_atom_model('Soap'), make_atom_model('bathroom'), ]),make_structured_model('{} is in {}', [make_atom_model('TV Remote'), make_atom_model('living room'), ]),    ] 
 },
};
const decks = {
    'default' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Begin examination'));
                description.unify_with(make_atom_model('＂What is happening with you&quest;＂'));
                next_deck.unify_with(make_atom_model('Self-examination'));
            options.once = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Begin examination'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_Location  = make_empty_variable('?Location' + (index == 1 ? '' : index));
                name.unify_with(make_atom_model('Show stats'));
                description.unify_with(make_structured_model('You are currently in {}.', [var_Location, ]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [var_Location, ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_A  = make_empty_variable('?A' + (index == 1 ? '' : index));
                const var_B  = make_empty_variable('?B' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Walk from {} to {}', [var_A, var_B, ]));
                description.unify_with(make_structured_model('You walk from {} to {}.', [var_A, var_B, ]));
                effects.unify_with(make_structured_term('', [
                make_structured_model('Player is in {}', [var_B, ]),
                make_structured_term('not', [make_structured_model('Player is in {}', [var_A, ])]),
]));
                const logic = () => {
                    const cont_1 = () => {
                        predicates['{} and {} are walkable'](var_A, var_B, index + 1, cont_0);
                    };
                    const cont_2 = () => {
                        predicates['{} is a room'](var_A, index + 1, cont_1);
                    };
                    predicates['{} is a room'](var_B, index + 1, cont_2);

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
                make_structured_term('not', [make_structured_model('{} is in {}', [var_Item, var_Place, ])]),
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

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Take Paracetamol'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [make_atom_model('kitchen'), ]),
                    make_structured_term('not', [make_structured_model('selected {}', [make_atom_model('Take Paracetamol'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Use computer'));
                next_deck.unify_with(make_atom_model('Computer'));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [make_atom_model('bedroom'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Watch TV'));
                description.unify_with(make_atom_model('You watch some TV, but nothing very interesting is on. Mostly just more COVID cases.'));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [make_atom_model('living room'), ]),
                    make_structured_model('Player has {}', [make_atom_model('TV Remote'), ]),
                    make_atom_model('Remote has batteries'),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Watch TV.'));
                description.unify_with(make_atom_model('You can\'t turn on the TV, becuase you misplaced the remote somewhere.'));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [make_atom_model('living room'), ]),
                    make_structured_term('not', [make_structured_model('Player has {}', [make_atom_model('TV Remote'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Watch TV..'));
                description.unify_with(make_atom_model('You try to turn on the TV, but to no avail. You realize the remote does not have batteries! You took them out when you were babysitting your nephiew last week. His dumb cartoons were giving you a headache.'));
                DB.match(cont_0,
                    make_structured_model('Player is in {}', [make_atom_model('living room'), ]),
                    make_structured_model('Player has {}', [make_atom_model('TV Remote'), ]),
                    make_structured_term('not', [make_atom_model('Remote has batteries')]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Insert batteries into remote'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('Remote has batteries'),
                make_structured_term('not', [make_structured_model('Player has {}', [make_atom_model('Batteries'), ])]),
]));
                DB.match(cont_0,
                    make_structured_model('Player has {}', [make_atom_model('TV Remote'), ]),
                    make_structured_model('Player has {}', [make_atom_model('Batteries'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Self-examination' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('End intro'));
                description.unify_with(make_atom_model(' '));
                next_deck.unify_with(make_atom_model('default'));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You feel pretty bad. You are so weak that if it wasn\'t for your splitting headache you would go straight to sleep.'));
                description.unify_with(make_atom_model('You feel pretty bad. You are so weak that if it wasn\'t for your splitting headache you would go straight to sleep.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You toss an turn and lay down for a few minutes, but it\'s pointless. The heat of your body, and the shard of pain in your skull, are unbearable. Besides, its already past dawn, and you forgot to roll down your blinds.'));
                description.unify_with(make_atom_model('You toss an turn and lay down for a few minutes, but it\'s pointless. The heat of your body, and the shard of pain in your skull, are unbearable. Besides, its already past dawn, and you forgot to roll down your blinds.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('15'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('15'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Nice try, but by the time you had made it out of bed and halfway across your room, you realize it doesn\'t matter anymore. You have gotten up.'));
                description.unify_with(make_atom_model('Nice try, but by the time you had made it out of bed and halfway across your room, you realize it doesn\'t matter anymore. You have gotten up.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('＂Ugh, not again...＂ you think to yourself.'));
                description.unify_with(make_atom_model('＂Ugh, not again...＂ you think to yourself.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You\'ve already taken two pills for a toothache yesterday, and you are pretty sure there is some kind of a limit of Paracetamol usage it is unwise to cross. You like, read it in a magazine once.'));
                description.unify_with(make_atom_model('You\'ve already taken two pills for a toothache yesterday, and you are pretty sure there is some kind of a limit of Paracetamol usage it is unwise to cross. You like, read it in a magazine once.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Either way, there should be some Ibuprofen in your kitchen.'));
                description.unify_with(make_atom_model('Either way, there should be some Ibuprofen in your kitchen.'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Self-examination'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Self-examination'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Examine yourself'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Self-examination'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Self-examination'), ]),
]));
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Self-examination'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Try going to sleep anyway'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('15'), make_atom_model('Self-examination'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Cover your windows and get back to sleep'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Self-examination'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' No, seriously, get up to find painkillers'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Self-examination'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Self-examination'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Get up to find painkillers'));
                next_deck.unify_with(make_atom_model('Self-examination'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Self-examination'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Self-examination'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Self-examination'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Taking paracetamol' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('End painkiller'));
                description.unify_with(make_atom_model(' '));
                next_deck.unify_with(make_atom_model('default'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('paracetamol taken'),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Now, where did you put the thing?'));
                description.unify_with(make_atom_model('Now, where did you put the thing?'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Taking paracetamol'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Taking paracetamol'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Nope, it aint here. Just a bunch of cups and glasses.'));
                description.unify_with(make_atom_model('Nope, it aint here. Just a bunch of cups and glasses.'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You do remember now, it was the middle drawer. You reach inside, and there it is!'));
                description.unify_with(make_atom_model('You do remember now, it was the middle drawer. You reach inside, and there it is!'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Nope, not here. There is a garbage bin and a bunch of detergents. You don\'t feel bad enough to drink those.'));
                description.unify_with(make_atom_model('Nope, not here. There is a garbage bin and a bunch of detergents. You don\'t feel bad enough to drink those.'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Actually, the sight reminds you you store medicine in the middle drawer. You check, and yep, its there!'));
                description.unify_with(make_atom_model('Actually, the sight reminds you you store medicine in the middle drawer. You check, and yep, its there!'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Thats right, middle drawer! Its clearly laying here among a bunch of pills and medicaments.'));
                description.unify_with(make_atom_model('Thats right, middle drawer! Its clearly laying here among a bunch of pills and medicaments.'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('19'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('19'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You take a pill (should you take two) and drink it with a glass of water.'));
                description.unify_with(make_atom_model('You take a pill (should you take two) and drink it with a glass of water.'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Taking paracetamol'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Taking paracetamol'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Upper cupboard'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Taking paracetamol'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Lower cupboard under the sink'));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('16'), make_atom_model('Taking paracetamol'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Middle drawer\''));
                next_deck.unify_with(make_atom_model('Taking paracetamol'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('19'), make_atom_model('Taking paracetamol'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Taking paracetamol'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Computer' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Check your email'));
                description.unify_with(make_atom_model('No new messages!'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Play minesweeper'));
                description.unify_with(make_atom_model('This almost goes well, but you\'re bad at counting so you loose.'));
                cont_0();
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
            const model = make_atom_model('kitchen');
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
            const model = make_atom_model('living room');
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
            const model = make_atom_model('bathroom');
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
            const model = make_atom_model('bedroom');
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
        const cont_3 = () => {
            {
                const model = make_atom_model('Batteries');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_4 = () => {
            {
                const model = make_atom_model('Soap');
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
            const model = make_atom_model('It\'s really shiny.');
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
            const model = make_atom_model('It seems to be missing batteries.');
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

        {
            const model = make_atom_model('You\'re not really sure if they are AA or AAA.');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_3();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('It\'s slippery! ');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_4();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    '{} is connected to {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is connected to {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_atom_model('living room');
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
                const model = make_atom_model('bathroom');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_3 = () => {
            {
                const model = make_atom_model('bedroom');
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
            const model = make_atom_model('kitchen');
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
            const model = make_atom_model('living room');
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

        {
            const model = make_atom_model('living room');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_3();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    'predicate test': (index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<predicate test> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['c is true'](index + 1, cont_0);

        };
        trail.new_choice_point();

        predicates['a is true'](index + 1, cont_0);

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        predicates['b is true'](index + 1, cont_1);

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        predicates['d is true'](index + 1, cont_0);

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    '{} and {} are walkable': (head_A, head_B, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} and {} are walkable> Entry' + (index == 1 ? '' : index));

        trail.new_choice_point();

        predicates['{} is connected to {}'](head_A, head_B, index + 1, cont_0);

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        predicates['{} is connected to {}'](head_B, head_A, index + 1, cont_0);

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

