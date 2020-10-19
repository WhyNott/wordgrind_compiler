const predicates = {
    '{} is a list': (head_0, index, cont_0) => {
        new_backup_frame();
        const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
        const var_Xs  = make_empty_variable('?Xs' + (index == 1 ? '' : index));
        dc.add_new_step('<{} is a list> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['{} is a list'](var_Xs, index + 1, cont_0);

        };
        const backup_var_X = var_X.backup_value(); reg_backup(var_X, index);
        const backup_var_Xs = var_Xs.backup_value(); reg_backup(var_Xs, index);
        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);


        {
            const model = make_atom_model('');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            }
        }

        var_X.value = backup_var_X;
        var_Xs.value = backup_var_Xs;
        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        {
            const model = make_structured_model('{} {}', [var_X, var_Xs, ]);
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_1();
            }
        }

        var_X.value = backup_var_X;
        var_Xs.value = backup_var_Xs;
        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

    '{} is a member of {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
        const var_Y  = make_empty_variable('?Y' + (index == 1 ? '' : index));
        const var_Xs  = make_empty_variable('?Xs' + (index == 1 ? '' : index));
        const var_Ys  = make_empty_variable('?Ys' + (index == 1 ? '' : index));
        dc.add_new_step('<{} is a member of {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_structured_model('{} {}', [var_X, var_Xs, ]);
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                }
            }

        };
        const cont_2 = () => {
            predicates['{} is a member of {}'](var_X, var_Ys, index + 1, cont_0);

        };
        const cont_3 = () => {
            {
                const model = make_structured_model('{} {}', [var_Y, var_Ys, ]);
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_2();
                }
            }

        };
        const backup_var_X = var_X.backup_value(); reg_backup(var_X, index);
        const backup_var_Y = var_Y.backup_value(); reg_backup(var_Y, index);
        const backup_var_Xs = var_Xs.backup_value(); reg_backup(var_Xs, index);
        const backup_var_Ys = var_Ys.backup_value(); reg_backup(var_Ys, index);
        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);
        const backup_head_1 = head_1.backup_value(); reg_backup(head_1, index);


        if (var_X.unify_with(head_0)){
            dc.add_new_step(`${var_X.direct_name()} = ${head_0.direct_name()}`);
            cont_1();
        }

        var_X.value = backup_var_X;
        var_Y.value = backup_var_Y;
        var_Xs.value = backup_var_Xs;
        var_Ys.value = backup_var_Ys;
        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        if (var_X.unify_with(head_0)){
            dc.add_new_step(`${var_X.direct_name()} = ${head_0.direct_name()}`);
            cont_3();
        }

        var_X.value = backup_var_X;
        var_Y.value = backup_var_Y;
        var_Xs.value = backup_var_Xs;
        var_Ys.value = backup_var_Ys;
        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

}
