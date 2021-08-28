const init_desc = '';
DB.store = { };
const decks = {
    'default' : {
        early_actions: [
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
                name.unify_with(make_atom_model('It had happened entirely by an accident. Julius and Andrea must have went to the other cart while you zoned out staring out the window, trying to see if you can already feel the difference. You couldn\'t, but then you noticed that the train had stopped. The name of the station seemed vaguely familiar. Wasn\'t that the station you were all supposed to change at&quest; You looked and they were gone. You really should have known better, but maybe it has started to work by then, because you really really should have realized that they would not have left you all by yourself in the train without saying anything, especially after you\'ve just taken 150 ug of LSD.'));
                description.unify_with(make_atom_model('It had happened entirely by an accident. Julius and Andrea must have went to the other cart while you zoned out staring out the window, trying to see if you can already feel the difference. You couldn\'t, but then you noticed that the train had stopped. The name of the station seemed vaguely familiar. Wasn\'t that the station you were all supposed to change at&quest; You looked and they were gone. You really should have known better, but maybe it has started to work by then, because you really really should have realized that they would not have left you all by yourself in the train without saying anything, especially after you\'ve just taken 150 ug of LSD.'));
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
                name.unify_with(make_atom_model('I mean Jesus Christ, everyone has an instinct to grab their phone before leaving. And you were so worried that what, they were going to abandon you there&quest;'));
                description.unify_with(make_atom_model('I mean Jesus Christ, everyone has an instinct to grab their phone before leaving. And you were so worried that what, they were going to abandon you there&quest;'));
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
                name.unify_with(make_atom_model('Hey, if it\'s any comforting, they will feel pretty dumb about it, too. Why did they leave a tripping guy alone like that&quest; It is somewhat expected you would do something stupid.'));
                description.unify_with(make_atom_model('Hey, if it\'s any comforting, they will feel pretty dumb about it, too. Why did they leave a tripping guy alone like that&quest; It is somewhat expected you would do something stupid.'));
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
                name.unify_with(make_atom_model('Not that you necessarily are tripping yet. You still feel kind of normal. Kind of&quest;'));
                description.unify_with(make_atom_model('Not that you necessarily are tripping yet. You still feel kind of normal. Kind of&quest;'));
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
                name.unify_with(make_atom_model(' Taken it, why&quest;'));
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
                name.unify_with(make_atom_model('You never were one for industrial art, but something about it\'s shape strikes you as aesthetically pleasing. Even the cover of dirt and flaking paint looks more like a decorative pattern, applied to break the monotony of it\'s round, regular edges. It brings to mind an image of a mountain rock, covered with moss in all the right spots.'));
                description.unify_with(make_atom_model('You never were one for industrial art, but something about it\'s shape strikes you as aesthetically pleasing. Even the cover of dirt and flaking paint looks more like a decorative pattern, applied to break the monotony of it\'s round, regular edges. It brings to mind an image of a mountain rock, covered with moss in all the right spots.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('32'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('33'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('32'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Despite of the dirt\'s appeal as part of the whole, it still feels kind of gross when you actually touch the screen.'));
                description.unify_with(make_atom_model('Despite of the dirt\'s appeal as part of the whole, it still feels kind of gross when you actually touch the screen.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('33'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('33'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('The web of finger smudges on the surface tells you what to do. You tap the screen before you even need to think about it.'));
                description.unify_with(make_atom_model('The web of finger smudges on the surface tells you what to do. You tap the screen before you even need to think about it.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('35'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('2'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('35'), make_atom_model('Use interactive kiosk'), ]),
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
                name.unify_with(make_atom_model('Oh right. The time. Its half past two. This suddenly reminds you were going to do something here. But what was it&quest;'));
                description.unify_with(make_atom_model('Oh right. The time. Its half past two. This suddenly reminds you were going to do something here. But what was it&quest;'));
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
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('43'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You bring up the schedule option. The kiosk seemingly switches to a different app, overlayed in a small window over the old menu, with a completely different font and a clashing yellow-red-gray colour scheme that looks circa from 2005. You discover that, in fact, not everything looks beautiful on LSD.'));
                description.unify_with(make_atom_model('You bring up the schedule option. The kiosk seemingly switches to a different app, overlayed in a small window over the old menu, with a completely different font and a clashing yellow-red-gray colour scheme that looks circa from 2005. You discover that, in fact, not everything looks beautiful on LSD.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('43'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('44'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('43'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You stare at the screen for a moment, trying to make out anything from it. It is very difficult.'));
                description.unify_with(make_atom_model('You stare at the screen for a moment, trying to make out anything from it. It is very difficult.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('44'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('44'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You bring up the map of the railroad. It\'s full of lines with various colors, and names of stations that tell you nothing at all.'));
                description.unify_with(make_atom_model('You bring up the map of the railroad. It\'s full of lines with various colors, and names of stations that tell you nothing at all.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('46'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('47'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('46'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Honestly, you\'re not even sure of the address of the house you were going to.'));
                description.unify_with(make_atom_model('Honestly, you\'re not even sure of the address of the house you were going to.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('47'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('48'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('47'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You can find the station you are at, but what way was the train going, and what line&quest; One of the stations adjacent to yours is separated by quite a long chunk of green line, but is it because its actually farther away or is it just the way the diagram is laid out&quest;'));
                description.unify_with(make_atom_model('You can find the station you are at, but what way was the train going, and what line&quest; One of the stations adjacent to yours is separated by quite a long chunk of green line, but is it because its actually farther away or is it just the way the diagram is laid out&quest;'));
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
                name.unify_with(make_atom_model('Would you even know this if you were sober&quest;'));
                description.unify_with(make_atom_model('Would you even know this if you were sober&quest;'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('50'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('7'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('50'), make_atom_model('Use interactive kiosk'), ]),
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
                name.unify_with(make_atom_model('You now realize you have probably been staring at it way too long then you should normally without doing anything. Shit, shit, shit. You suddenly feel very self-conscious. You can\'t handle the pressure.'));
                description.unify_with(make_atom_model('You now realize you have probably been staring at it way too long then you should normally without doing anything. Shit, shit, shit. You suddenly feel very self-conscious. You can\'t handle the pressure.'));
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
                name.unify_with(make_atom_model('＂There you... go.＂ - you say with a slight stutter. The man nods with a faint smile and takes over the machine.'));
                description.unify_with(make_atom_model('＂There you... go.＂ - you say with a slight stutter. The man nods with a faint smile and takes over the machine.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('12'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('12'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('You suddenly feel very stupid. Clearly, he thought nothing of you. Your behaviour was perfectly fine. You could have stayed there as long as you wanted to and finish your business.'));
                description.unify_with(make_atom_model('You suddenly feel very stupid. Clearly, he thought nothing of you. Your behaviour was perfectly fine. You could have stayed there as long as you wanted to and finish your business.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('13'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model('Well, maybe it wasn\'t that bad. You can do something else in the meantime.'));
                description.unify_with(make_atom_model('Well, maybe it wasn\'t that bad. You can do something else in the meantime.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('completed'), make_atom_model('Use interactive kiosk'), ]),
]));
            options.once = true;
           options.hide_name = true;
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('14'), make_atom_model('Use interactive kiosk'), ]),
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
                make_structured_model('weave item {} for {}', [make_atom_model('32'), make_atom_model('Use interactive kiosk'), ]),
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
                make_structured_model('weave item {} for {}', [make_atom_model('35'), make_atom_model('Use interactive kiosk'), ]),
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
                name.unify_with(make_atom_model(' ...Check when the next train comes...&quest;'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('42'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' ...See how far, like, you are from the house or something...'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('46'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('6'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' ...How long is the next station, anyway&quest; Maybe they will return for you.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('48'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('49'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('48'), make_atom_model('Use interactive kiosk'), ]),
                );
            },

            (name, description, effects, next_deck, options, cont_0) => {
                const index = 0;
                name.unify_with(make_atom_model(' Wait, is someone staring at you&quest;'));
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
                name.unify_with(make_atom_model(' Escape immediately.'));
                next_deck.unify_with(make_atom_model('Use interactive kiosk'));
                effects.unify_with(make_structured_term('', [
                make_structured_term('not', [make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ])]),
                make_structured_model('weave item {} for {}', [make_atom_model('12'), make_atom_model('Use interactive kiosk'), ]),
]));
                DB.match(cont_0,
                    make_structured_model('weave item {} for {}', [make_atom_model('11'), make_atom_model('Use interactive kiosk'), ]),
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

