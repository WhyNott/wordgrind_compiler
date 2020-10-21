const predicates = {
    '{} is connected to {} by {} line': (head_0, head_1, head_2, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is connected to {} by {} line> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_atom_model('central');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_2 = () => {
            {
                const model = make_atom_model('oxford circus');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_1();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_3 = () => {
            {
                const model = make_atom_model('central');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_4 = () => {
            {
                const model = make_atom_model('tottenham court road');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_3();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_5 = () => {
            {
                const model = make_atom_model('jubilee');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_6 = () => {
            {
                const model = make_atom_model('green park');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_5();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_7 = () => {
            {
                const model = make_atom_model('jubilee');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_8 = () => {
            {
                const model = make_atom_model('charing cross');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_7();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_9 = () => {
            {
                const model = make_atom_model('piccadilly');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_10 = () => {
            {
                const model = make_atom_model('piccadilly circus');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_9();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_11 = () => {
            {
                const model = make_atom_model('piccadilly');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_12 = () => {
            {
                const model = make_atom_model('leicester square');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_11();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_13 = () => {
            {
                const model = make_atom_model('victoria');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_14 = () => {
            {
                const model = make_atom_model('oxford circus');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_13();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_15 = () => {
            {
                const model = make_atom_model('bakerloo');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_16 = () => {
            {
                const model = make_atom_model('picadilly circus');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_15();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_17 = () => {
            {
                const model = make_atom_model('bakerloo');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_18 = () => {
            {
                const model = make_atom_model('charing cross');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_17();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_19 = () => {
            {
                const model = make_atom_model('northern');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_20 = () => {
            {
                const model = make_atom_model('leicester square');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_19();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_21 = () => {
            {
                const model = make_atom_model('northern');
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_2.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_22 = () => {
            {
                const model = make_atom_model('charing cross');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_21();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        trail.new_choice_point();

        {
            const model = make_atom_model('bond street');
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
            const model = make_atom_model('oxford_circus');
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

        {
            const model = make_atom_model('bond street');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_6();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_8();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_10();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('picadilly circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_12();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_14();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('oxford circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_16();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('piccadilly circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_18();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('tottenham court');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_20();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('leicester square');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_22();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    '{} is reachable from {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
        const var_Y  = make_empty_variable('?Y' + (index == 1 ? '' : index));
        const var_Z  = make_empty_variable('?Z' + (index == 1 ? '' : index));
        const var_L  = make_empty_variable('?L' + (index == 1 ? '' : index));
        dc.add_new_step('<{} is reachable from {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['{} is connected to {} by {} line'](var_X, var_Y, var_L, index + 1, cont_0);

        };
        const cont_2 = () => {
            if (var_Y.unify_with(head_1)){
                dc.add_new_step(`${var_Y.direct_name()} = ${head_1.direct_name()}`);
                cont_1();
            } else {
                dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${head_1.dereferenced_value().direct_name()}`);
            }

        };
        const cont_3 = () => {
            predicates['{} is reachable from {}'](var_Z, var_Y, index + 1, cont_0);

        };
        const cont_4 = () => {
            predicates['{} is connected to {} by {} line'](var_X, var_Z, var_L, index + 1, cont_3);

        };
        const cont_5 = () => {
            if (var_Y.unify_with(head_1)){
                dc.add_new_step(`${var_Y.direct_name()} = ${head_1.direct_name()}`);
                cont_4();
            } else {
                dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${head_1.dereferenced_value().direct_name()}`);
            }

        };
        const backup_var_X = var_X.backup_value(); reg_backup(var_X, index);
        const backup_var_Y = var_Y.backup_value(); reg_backup(var_Y, index);
        const backup_var_Z = var_Z.backup_value(); reg_backup(var_Z, index);
        const backup_var_L = var_L.backup_value(); reg_backup(var_L, index);
        trail.new_choice_point();

        if (var_X.unify_with(head_0)){
            dc.add_new_step(`${var_X.direct_name()} = ${head_0.direct_name()}`);
            cont_2();
        } else {
            dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${head_0.dereferenced_value().direct_name()}`);
        }

        var_X.value = backup_var_X;
        var_Y.value = backup_var_Y;
        var_Z.value = backup_var_Z;
        var_L.value = backup_var_L;
        trail.restore_choice_point();
        dc.add_new_step('backup restored');

        if (var_X.unify_with(head_0)){
            dc.add_new_step(`${var_X.direct_name()} = ${head_0.direct_name()}`);
            cont_5();
        } else {
            dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${head_0.dereferenced_value().direct_name()}`);
        }

        var_X.value = backup_var_X;
        var_Y.value = backup_var_Y;
        var_Z.value = backup_var_Z;
        var_L.value = backup_var_L;
        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

}
