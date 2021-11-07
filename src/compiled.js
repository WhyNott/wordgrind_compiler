const init_desc = '';
DB.store = { };
const decks = {
    'default' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('main menu'));
                next_deck.unify_with(make_atom_model('menu'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'menu' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Continue'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('New game'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Sound options'));
                next_deck.unify_with(make_atom_model('sound'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Options'));
                next_deck.unify_with(make_atom_model('nested menu'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('return'));
                next_deck.unify_with(make_atom_model('return'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'sound' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Sound effects'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Music'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('return'));
                next_deck.unify_with(make_atom_model('return'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'nested menu' : {
        early_actions: [
        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Game'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Video'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Sound'));
                next_deck.unify_with(make_atom_model('sound'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('return'));
                next_deck.unify_with(make_atom_model('return'));
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
 
};

