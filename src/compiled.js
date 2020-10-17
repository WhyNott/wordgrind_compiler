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
                }
            }

        };
        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);
        const backup_head_1 = head_1.backup_value(); reg_backup(head_1, index);
        const backup_head_2 = head_2.backup_value(); reg_backup(head_2, index);


        {
            const model = make_atom_model('bond street');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_2();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('oxford_circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_4();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('bond street');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_6();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_8();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_10();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('picadilly circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_12();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('green park');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_14();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('oxford circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_16();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('piccadilly circus');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_18();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('tottenham court');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_20();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('leicester square');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_22();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

    '{} plus {} equals {}': (head_0, head_1, head_2, index, cont_0) => {
        new_backup_frame();
        const var_A  = make_empty_variable('?A' + (index == 1 ? '' : index));
        const var_B  = make_empty_variable('?B' + (index == 1 ? '' : index));
        const var_C  = make_empty_variable('?C' + (index == 1 ? '' : index));
        dc.add_new_step('<{} plus {} equals {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            if (var_A.unify_with(head_2)){
                dc.add_new_step(`${var_A.direct_name()} = ${head_2.direct_name()}`);
                cont_0();
            }

        };
        const cont_2 = () => {
            {
                const model = make_atom_model('0');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_1();
                }
            }

        };
        const cont_3 = () => {
            predicates['{} plus {} equals {}'](var_A, var_B, var_C, index + 1, cont_0);

        };
        const cont_4 = () => {
            {
                const model = make_structured_model('s of {}', [var_C, ]);
                const model_name = model.pprint();
                if (head_2.unify_with(model)){
                    dc.add_new_step(`${head_2.direct_name()} = ${model_name}`);
                    cont_3();
                }
            }

        };
        const cont_5 = () => {
            {
                const model = make_structured_model('s of {}', [var_B, ]);
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_4();
                }
            }

        };
        const backup_var_A = var_A.backup_value(); reg_backup(var_A, index);
        const backup_var_B = var_B.backup_value(); reg_backup(var_B, index);
        const backup_var_C = var_C.backup_value(); reg_backup(var_C, index);
        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);
        const backup_head_1 = head_1.backup_value(); reg_backup(head_1, index);
        const backup_head_2 = head_2.backup_value(); reg_backup(head_2, index);


        if (var_A.unify_with(head_0)){
            dc.add_new_step(`${var_A.direct_name()} = ${head_0.direct_name()}`);
            cont_2();
        }

        var_A.value = backup_var_A;
        var_B.value = backup_var_B;
        var_C.value = backup_var_C;
        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        if (var_A.unify_with(head_0)){
            dc.add_new_step(`${var_A.direct_name()} = ${head_0.direct_name()}`);
            cont_5();
        }

        var_A.value = backup_var_A;
        var_B.value = backup_var_B;
        var_C.value = backup_var_C;
        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        head_2.value = backup_head_2;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

}
