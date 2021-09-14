const init_desc = '';
DB.store = { };
const decks = {
    'default' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Train place description'));
                description.unify_with(make_atom_model('The trainstation looks thusly.'));
            options.once = true;
           options.hide_name = true;
                cont_0();
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Play intro'));
                next_deck.unify_with(make_atom_model('Intro'));
                cont_0();
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Use interactive kiosk'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                DB.match(cont_0,
                    make_structured_term('not', [make_atom_model('kiosk used')]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Use the kiosk again'));
                next_deck.unify_with(make_atom_model('Use the kiosk again'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_atom_model('left the kiosk without finishing')]),
]));
                DB.match(cont_0,
                    make_atom_model('left the kiosk without finishing'),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Read the newspaper'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                cont_0();
            },

        ],
        late_actions: [
        ],
    },
    'Intro' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('It had happened entirely by an accident. Julius and Andrea must have went to the other cart while you zoned out staring out the window, trying to see if you can already feel the difference. You couldn\'t, but then you noticed that the train had stopped. The name of the station seemed vaguely familiar. Wasn\'t that the station you were all supposed to change at{}You looked and they were gone. You really should have known better, but maybe it has started to work by then, because you really really should have realized that they would not have left you all by yourself in the train without saying anything, especially after you\'ve just taken 150 ug of LSD.', [var_ , ]));
                description.unify_with(make_structured_model('It had happened entirely by an accident. Julius and Andrea must have went to the other cart while you zoned out staring out the window, trying to see if you can already feel the difference. You couldn\'t, but then you noticed that the train had stopped. The name of the station seemed vaguely familiar. Wasn\'t that the station you were all supposed to change at{}You looked and they were gone. You really should have known better, but maybe it has started to work by then, because you really really should have realized that they would not have left you all by yourself in the train without saying anything, especially after you\'ve just taken 150 ug of LSD.', [var_ , ]));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Intro'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Intro'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('It was all a silly thing. The plan was, you were supposed to reach the house at around one and they would sit you there, but that all went out of the window because Andrea was late. Then the traffic strikes, Julius lost his way, and it was quarter to two and still a good chunk of the city to travel. You were like, no way, let me take it now, I\'m not gonna loose another night. You felt bad because maybe that was a little childish, but you are anxious about sleep. If you took it at five, you probably wouldn\'t sleep until five. It was just past exam season, too. So in the end Julius said, whatever, take it here, we will lead you to the house, just don\'t do anything stupid.'));
                description.unify_with(make_atom_model('It was all a silly thing. The plan was, you were supposed to reach the house at around one and they would sit you there, but that all went out of the window because Andrea was late. Then the traffic strikes, Julius lost his way, and it was quarter to two and still a good chunk of the city to travel. You were like, no way, let me take it now, I\'m not gonna loose another night. You felt bad because maybe that was a little childish, but you are anxious about sleep. If you took it at five, you probably wouldn\'t sleep until five. It was just past exam season, too. So in the end Julius said, whatever, take it here, we will lead you to the house, just don\'t do anything stupid.'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('And you even left your phone charging in the car, so it would have been a disaster even if they had actually been waiting for you on the station, which of course, they weren\'t. And you only realized that when the train started moving, and they were waving and shouting at you from the window.'));
                description.unify_with(make_atom_model('And you even left your phone charging in the car, so it would have been a disaster even if they had actually been waiting for you on the station, which of course, they weren\'t. And you only realized that when the train started moving, and they were waving and shouting at you from the window.'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('I mean Jesus Christ, everyone has an instinct to grab their phone before leaving. And you were so worried that what, they were going to abandon you there?'));
                description.unify_with(make_atom_model('I mean Jesus Christ, everyone has an instinct to grab their phone before leaving. And you were so worried that what, they were going to abandon you there?'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Hey, if it\'s any comforting, they will feel pretty dumb about it, too. Why did they leave a tripping guy alone like that{}It is somewhat expected you would do something stupid.', [var_ , ]));
                description.unify_with(make_structured_model('Hey, if it\'s any comforting, they will feel pretty dumb about it, too. Why did they leave a tripping guy alone like that{}It is somewhat expected you would do something stupid.', [var_ , ]));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Not that you necessarily are tripping yet. You still feel kind of normal. Kind of?'));
                description.unify_with(make_atom_model('Not that you necessarily are tripping yet. You still feel kind of normal. Kind of?'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You only now realize, you have been sitting on the bench for quite a while. You aren\'t sure how long.'));
                description.unify_with(make_atom_model('You only now realize, you have been sitting on the bench for quite a while. You aren\'t sure how long.'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Intro'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Intro'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Taken it, why?'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Intro'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' So you went and left the train car without them.'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Intro'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Intro'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' There is a tingling feeling in your body.'));
                next_deck.unify_with(make_atom_model('Intro'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Intro'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Intro'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Intro'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Use interactive kiosk' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('End kiosk'));
                description.unify_with(make_atom_model(' '));
                next_deck.unify_with(make_atom_model('default'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('kiosk used'),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('There are three interactive kiosks embedded into the back wall of the station, but two seem shut down. One is displaying a Windows error box, and the other is completely black. The third one seems working well enough, displaying the logo of the railway company on a white screen.'));
                description.unify_with(make_atom_model('There are three interactive kiosks embedded into the back wall of the station, but two seem shut down. One is displaying a Windows error box, and the other is completely black. The third one seems working well enough, displaying the logo of the railway company on a white screen.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Use interactive kiosk'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Use interactive kiosk'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You never were one for industrial art, but something about its shape strikes you as aesthetically pleasing. Even the cover of dirt and flaking paint looks more like a decorative pattern, applied to break the monotony of its round, regular edges. It brings to mind an image of a mountain rock, covered with moss in all the right spots.'));
                description.unify_with(make_atom_model('You never were one for industrial art, but something about its shape strikes you as aesthetically pleasing. Even the cover of dirt and flaking paint looks more like a decorative pattern, applied to break the monotony of its round, regular edges. It brings to mind an image of a mountain rock, covered with moss in all the right spots.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('39'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('40'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('39'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Despite of the dirt\'s appeal as part of the whole, it still feels kind of gross when you actually touch the screen.'));
                description.unify_with(make_atom_model('Despite of the dirt\'s appeal as part of the whole, it still feels kind of gross when you actually touch the screen.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('40'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('40'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('The web of finger smudges on the surface tells you what to do. You tap the screen before you even need to think about it.'));
                description.unify_with(make_atom_model('The web of finger smudges on the surface tells you what to do. You tap the screen before you even need to think about it.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('After a slight delay, the kiosk displays the menu. The screen is quite low resolution, you can see the individual pixels with ease, but somehow to you, right now, that feels less like a shortcoming and more like a wonderful quirk. Even the slightly outdated quasi-material design of the menu feels like it\'s been given new life - tiny icons and lines wave up and down slightly, and you could swear that the time indicator in the right corner...'));
                description.unify_with(make_atom_model('After a slight delay, the kiosk displays the menu. The screen is quite low resolution, you can see the individual pixels with ease, but somehow to you, right now, that feels less like a shortcoming and more like a wonderful quirk. Even the slightly outdated quasi-material design of the menu feels like it\'s been given new life - tiny icons and lines wave up and down slightly, and you could swear that the time indicator in the right corner...'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Oh right. The time. Its half past two. This suddenly reminds you were going to do something here. But what was it?'));
                description.unify_with(make_atom_model('Oh right. The time. Its half past two. This suddenly reminds you were going to do something here. But what was it?'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('C\'mon. Focus.'));
                description.unify_with(make_atom_model('C\'mon. Focus.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('That\'s actually a very sensible idea! You congratulate yourself in your head. That\'s probably what sober you would do, too.'));
                description.unify_with(make_atom_model('That\'s actually a very sensible idea! You congratulate yourself in your head. That\'s probably what sober you would do, too.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('49'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('50'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('49'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You bring up the schedule option. The kiosk seemingly switches to a different app, overlayed in a small window over the old menu, with a completely different font and a clashing yellow-red-gray colour scheme that looks circa from 2005. You discover that, in fact, not everything looks beautiful on LSD.'));
                description.unify_with(make_atom_model('You bring up the schedule option. The kiosk seemingly switches to a different app, overlayed in a small window over the old menu, with a completely different font and a clashing yellow-red-gray colour scheme that looks circa from 2005. You discover that, in fact, not everything looks beautiful on LSD.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('50'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('51'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('50'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You stare at the screen for a moment, trying to make out anything from it. It is very difficult.'));
                description.unify_with(make_atom_model('You stare at the screen for a moment, trying to make out anything from it. It is very difficult.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('51'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('51'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You bring up the map of the railroad. It\'s full of lines with various colors, and names of stations that tell you nothing at all.'));
                description.unify_with(make_atom_model('You bring up the map of the railroad. It\'s full of lines with various colors, and names of stations that tell you nothing at all.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('53'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('54'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('53'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Honestly, you\'re not even sure of the address of the house you were going to.'));
                description.unify_with(make_atom_model('Honestly, you\'re not even sure of the address of the house you were going to.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('54'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('55'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('54'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('You can find the station you are at, but what way was the train going, and what line{}One of the stations adjacent to yours is separated by quite a long chunk of green line, but is it because its actually farther away or is it just the way the diagram is laid out?', [var_ , ]));
                description.unify_with(make_structured_model('You can find the station you are at, but what way was the train going, and what line{}One of the stations adjacent to yours is separated by quite a long chunk of green line, but is it because its actually farther away or is it just the way the diagram is laid out?', [var_ , ]));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('56'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('57'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('56'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Would you even know this if you were sober?'));
                description.unify_with(make_atom_model('Would you even know this if you were sober?'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('57'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('57'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Hmm.'));
                description.unify_with(make_atom_model('Hmm.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Oh snap. There is a man behind you. Clearly he wants to use the kiosk. You\'re taking the only usable machine.'));
                description.unify_with(make_atom_model('Oh snap. There is a man behind you. Clearly he wants to use the kiosk. You\'re taking the only usable machine.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('10'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You now realize you have probably been staring at it way too long without doing anything. Shit, shit, shit. Can he tell?'));
                description.unify_with(make_atom_model('You now realize you have probably been staring at it way too long without doing anything. Shit, shit, shit. Can he tell?'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('10'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('10'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('＂There you... go.＂ - you say with a slight stutter. The man nods with an absent expression and takes over the machine.'));
                description.unify_with(make_atom_model('＂There you... go.＂ - you say with a slight stutter. The man nods with an absent expression and takes over the machine.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('63'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('64'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('63'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You suddenly feel very stupid. Clearly, what you were doing was perfectly ordinary and he thought nothing of you. Your behaviour was perfectly fine. You could have stayed there as long as you wanted to and finish your business.'));
                description.unify_with(make_atom_model('You suddenly feel very stupid. Clearly, what you were doing was perfectly ordinary and he thought nothing of you. Your behaviour was perfectly fine. You could have stayed there as long as you wanted to and finish your business.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('64'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('65'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('64'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Well, mabe it wasn\'t that bad. You can do something else in the meantime and come back when he\'s done.'));
                description.unify_with(make_atom_model('Well, mabe it wasn\'t that bad. You can do something else in the meantime and come back when he\'s done.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('65'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('65'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Are you even doing anything weird{}You can\'t trust your passage of time, but you are like, pressing buttons and from the outside it probably looks prefectly normal. You\'re just being a chicken for no reason.', [var_ , ]));
                description.unify_with(make_structured_model('Are you even doing anything weird{}You can\'t trust your passage of time, but you are like, pressing buttons and from the outside it probably looks prefectly normal. You\'re just being a chicken for no reason.', [var_ , ]));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('67'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('68'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('67'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Looking back at the map, the only thing you can say for certain is you are not in the condition to get anywhere by yourself. You really need to find some way to contact your friends.'));
                description.unify_with(make_atom_model('Looking back at the map, the only thing you can say for certain is you are not in the condition to get anywhere by yourself. You really need to find some way to contact your friends.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You look at the schelude again. Comparing current time, whats written in the table, and how long you have been here is very difficult, and takes you several tries, but in the end you\'re left with the impression that at least one train must have come back this way from the opposite direction. Therefore, your friends are not here, they must have opted not to come back for you for whatever reason. Therefore, you must find a way to contact them.'));
                description.unify_with(make_atom_model('You look at the schelude again. Comparing current time, whats written in the table, and how long you have been here is very difficult, and takes you several tries, but in the end you\'re left with the impression that at least one train must have come back this way from the opposite direction. Therefore, your friends are not here, they must have opted not to come back for you for whatever reason. Therefore, you must find a way to contact them.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('71'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('71'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You just slowly finish everything you were going to do, and then leave the kiosk to the man.'));
                description.unify_with(make_atom_model('You just slowly finish everything you were going to do, and then leave the kiosk to the man.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Take a look at it first'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('39'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Approach it straight away'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Uhhhhh...'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Ummmm...'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' ...Check when the next train comes...?'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('checking when the next train comes'),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('49'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' ...See how far, like, you are from the house or something...'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('checking where you are'),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('53'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model(' ...How long is the next station, anyway{}Maybe they will return for you.', [var_ , ]));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('55'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('56'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('55'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Wait, is someone staring at you?'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('9'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('8'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Leave the kiosk!'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('left the kiosk without finishing'),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('63'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Actually...'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('67'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' So, where exactly are you?'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('68'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('69'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_atom_model('checking where you are'),
                    make_structured_model('weave item {} for {}', [make_atom_model('68'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' So, when is the next train?'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('68'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('71'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_atom_model('checking when the next train comes'),
                    make_structured_model('weave item {} for {}', [make_atom_model('68'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Use the kiosk again' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('The man who was taking up the kiosk before is now gone. He might have been gone for a while, but you only noticed it now. There is something weird with your perception of time.'));
                description.unify_with(make_atom_model('The man who was taking up the kiosk before is now gone. He might have been gone for a while, but you only noticed it now. There is something weird with your perception of time.'));
                next_deck.unify_with(make_atom_model('Use the kiosk again'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Use the kiosk again'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use the kiosk again'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Use the kiosk again'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Huh... As you approach the kiosk, you realize that something is wrong. The screen is dark, only lit up with glitchy white and magenta stripes near an impact point in the center.'));
                description.unify_with(make_atom_model('Huh... As you approach the kiosk, you realize that something is wrong. The screen is dark, only lit up with glitchy white and magenta stripes near an impact point in the center.'));
                next_deck.unify_with(make_atom_model('Use the kiosk again'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use the kiosk again'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use the kiosk again'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Yepp, looks like someone smashed the screen in. It does look kind of pretty to you actually, the shape of broken glass and the colors, almost like some kind of glitch art instalation. But it means you can\'t use it.'));
                description.unify_with(make_atom_model('Yepp, looks like someone smashed the screen in. It does look kind of pretty to you actually, the shape of broken glass and the colors, almost like some kind of glitch art instalation. But it means you can\'t use it.'));
                next_deck.unify_with(make_atom_model('Use the kiosk again'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use the kiosk again'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use the kiosk again'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You decide to move away from there before someone thinks you did it.'));
                description.unify_with(make_atom_model('You decide to move away from there before someone thinks you did it.'));
                next_deck.unify_with(make_atom_model('Use the kiosk again'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use the kiosk again'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Use the kiosk again'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Step in and check the map again'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use the kiosk again'), ]),
]));
                DB.match(cont_0,
                    make_atom_model('checking where you are'),
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use the kiosk again'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Step in and check the schelude'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use the kiosk again'), ]),
]));
                DB.match(cont_0,
                    make_atom_model('checking when the next train comes'),
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use the kiosk again'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Impact point?'));
                effects.unify_with(make_structured_term('', [
                make_atom_model('witnessed broken kiosk'),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use the kiosk again'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Use the kiosk again'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Use the kiosk again'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Read the newspaper' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('The newspaper is one of those free ad-filled magazines they give out in public places. Kind of a waste of paper when you think about.'));
                description.unify_with(make_atom_model('The newspaper is one of those free ad-filled magazines they give out in public places. Kind of a waste of paper when you think about.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Read the newspaper'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Read the newspaper'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('There columns of the paper were mostly filled with ads, with just tiny bits of article text on each page. The ads themselves aren\'t particularly pretty, no pleasing geometric shapes to gawk at, maybe one pretty logo of a building company, but with very poor print resolution. When you actually skim he lines of text though, you find yourself quite affected. It is as if someone was screaming right to your ear about NEW BEST DEALS and about how THERE IS A NEW CAR DEALERSHIP IN TOWN and you were supposed to earnestly feel the emotion, and you do earnestly feel the emotion, and...'));
                description.unify_with(make_atom_model('There columns of the paper were mostly filled with ads, with just tiny bits of article text on each page. The ads themselves aren\'t particularly pretty, no pleasing geometric shapes to gawk at, maybe one pretty logo of a building company, but with very poor print resolution. When you actually skim he lines of text though, you find yourself quite affected. It is as if someone was screaming right to your ear about NEW BEST DEALS and about how THERE IS A NEW CAR DEALERSHIP IN TOWN and you were supposed to earnestly feel the emotion, and you do earnestly feel the emotion, and...'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You wonder if this is what it was like to read advertisements as a little child.'));
                description.unify_with(make_atom_model('You wonder if this is what it was like to read advertisements as a little child.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('Isn\'t LSD supposed to make you more susceptable to suggestion{}At least CIA seemed to think so. Would suck if you brainwashed yourself for the sake of a local car dealership.', [var_ , ]));
                description.unify_with(make_structured_model('Isn\'t LSD supposed to make you more susceptable to suggestion{}At least CIA seemed to think so. Would suck if you brainwashed yourself for the sake of a local car dealership.', [var_ , ]));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('21'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You have more urgent matters anyway.'));
                description.unify_with(make_atom_model('You have more urgent matters anyway.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('21'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('21'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Yes there are. Mostly local news, some historical trivia, an article for some capaign to encourage seniors to learn how to use the internet... Probably who the target audience of this paper are.'));
                description.unify_with(make_atom_model('Yes there are. Mostly local news, some historical trivia, an article for some capaign to encourage seniors to learn how to use the internet... Probably who the target audience of this paper are.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('23'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('24'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('23'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                const var_   = make_empty_variable('? ' + (index == 1 ? '' : index));
                name.unify_with(make_structured_model('You flip the pages a few times, until another article catches your mind. It looks more... serious then the other ones, seemingly an actual news article. Something about fraud{}You start reading it...', [var_ , ]));
                description.unify_with(make_structured_model('You flip the pages a few times, until another article catches your mind. It looks more... serious then the other ones, seemingly an actual news article. Something about fraud{}You start reading it...', [var_ , ]));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('24'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('25'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('24'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('And then half a minute later you realize you have zoned out. Damn it.'));
                description.unify_with(make_atom_model('And then half a minute later you realize you have zoned out. Damn it.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('25'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('26'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('25'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Right. You leave the newspaper on the bench. You have more important things to do.'));
                description.unify_with(make_atom_model('Right. You leave the newspaper on the bench. You have more important things to do.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('27'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('27'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You start reading from the beginning, and while you loose your track once or twice this time you make it to the end of the article.'));
                description.unify_with(make_atom_model('You start reading from the beginning, and while you loose your track once or twice this time you make it to the end of the article.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('29'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('30'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('29'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('It was about a person from the local branch of a big insurance company, who was caught defrauding money !!!! FINISH this later'));
                description.unify_with(make_atom_model('It was about a person from the local branch of a big insurance company, who was caught defrauding money !!!! FINISH this later'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('30'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Read the newspaper'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('30'), make_atom_model('Read the newspaper'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' This is overwhelming, lets stop.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('20'), make_atom_model('Read the newspaper'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Are there any actual articles inside?'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('23'), make_atom_model('Read the newspaper'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Arent you supposed to be finding your way out of this station?'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('26'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('27'), make_atom_model('Read the newspaper'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('26'), make_atom_model('Read the newspaper'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Give it another shot.'));
                next_deck.unify_with(make_atom_model('Read the newspaper'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('26'), make_atom_model('Read the newspaper'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('29'), make_atom_model('Read the newspaper'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('26'), make_atom_model('Read the newspaper'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Buying food' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Hmm, what kind of food would you like'));
                description.unify_with(make_atom_model('Hmm, what kind of food would you like'));
                next_deck.unify_with(make_atom_model('Buying food'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Buying food'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Buying food'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Buying food'), ])]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Burger'));
                next_deck.unify_with(make_atom_model('Buying food'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Buying food'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Hot dog'));
                next_deck.unify_with(make_atom_model('Buying food'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Buying food'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Something that would please let me sleep'));
                next_deck.unify_with(make_atom_model('Buying food'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Buying food'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Buying food'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Descend downstairs' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('There is nothing left for you to do on the platform. Lets see what the rest of the station looks like.'));
                description.unify_with(make_atom_model('There is nothing left for you to do on the platform. Lets see what the rest of the station looks like.'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Descend downstairs'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Descend downstairs'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Descend downstairs'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You climb down the stairs, into the tunnel that leads between the train platforms. While your motor skills seem uneffected, you do occasionally have a problem with missing a step with your foot. Still, it probably doesn\'t look suspicious from the outside, does it?'));
                description.unify_with(make_atom_model('You climb down the stairs, into the tunnel that leads between the train platforms. While your motor skills seem uneffected, you do occasionally have a problem with missing a step with your foot. Still, it probably doesn\'t look suspicious from the outside, does it?'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Descend downstairs'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You finally emerge in a central area, with some cash registers, a small caffe shop and a waiting area separated from you by some mechanical ticket gates. You also spot an old payphone on the far-end side. A chance to call home, perhaps?'));
                description.unify_with(make_atom_model('You finally emerge in a central area, with some cash registers, a small caffe shop and a waiting area separated from you by some mechanical ticket gates. You also spot an old payphone on the far-end side. A chance to call home, perhaps?'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Descend downstairs'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('And hence you would have no way of going back. Somewhat inconvenient. Maybe you shouldn\'t be limiting your choices, at a time like this?'));
                description.unify_with(make_atom_model('And hence you would have no way of going back. Somewhat inconvenient. Maybe you shouldn\'t be limiting your choices, at a time like this?'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('18'), make_atom_model('Descend downstairs'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You clumsily take the ticket from your pocket and insert it to the machine. It takes it and opens the gate. You walk through. The aura of irreversability, which would probably still be present when sober, grows quite a bit stronger.'));
                description.unify_with(make_atom_model('You clumsily take the ticket from your pocket and insert it to the machine. It takes it and opens the gate. You walk through. The aura of irreversability, which would probably still be present when sober, grows quite a bit stronger.'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Descend downstairs'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Descend downstairs'), ]),
                );
            },

        ],
        choices: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Does it?'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('3'), make_atom_model('Descend downstairs'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Exit through the ticket gate'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Descend downstairs'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Wait, going there would eat-up your ticket!'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('17'), make_atom_model('Descend downstairs'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('4'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Exit anyway'));
                next_deck.unify_with(make_atom_model('Descend downstairs'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('18'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Descend downstairs'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('18'), make_atom_model('Descend downstairs'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Stay on the upper platform'));
                next_deck.unify_with(make_atom_model('default'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('18'), make_atom_model('Descend downstairs'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('5'), make_atom_model('Descend downstairs'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('18'), make_atom_model('Descend downstairs'), ]),
                );
            },

        ],
        late_actions: [
        ],
    },
    'Use payphone' : {
        early_actions: [
            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('The telephone booth is quite dirty, and there is a faded piece of paper on the wall with the telephone company logo saying ＂We are thinking of removing this payphone＂. Well, it\'s a really good thing they are still on the thinking stage, because this dirty metal box might be your only chance you have of contacting your friends.'));
                description.unify_with(make_atom_model('The telephone booth is quite dirty, and there is a faded piece of paper on the wall with the telephone company logo saying ＂We are thinking of removing this payphone＂. Well, it\'s a really good thing they are still on the thinking stage, because this dirty metal box might be your only chance you have of contacting your friends.'));
                next_deck.unify_with(make_atom_model('Use payphone'));
                effects.unify_with(make_structured_term('', [
                make_structured_model('weave for {} activated', [make_atom_model('Use payphone'), ]),
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('0'), make_atom_model('Use payphone'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use payphone'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_term('not', [make_structured_model('weave for {} activated', [make_atom_model('Use payphone'), ])]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Come to think of it, it might be the first time in your life you are using a payphone.'));
                description.unify_with(make_atom_model('Come to think of it, it might be the first time in your life you are using a payphone.'));
                next_deck.unify_with(make_atom_model('Use payphone'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use payphone'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use payphone'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('1'), make_atom_model('Use payphone'), ]),
                );
            },

        ],
        choices: [
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

