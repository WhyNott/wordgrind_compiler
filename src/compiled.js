const predicates = {
    '{} is daughter of {}': (X, Y, index, cont_0) => {
        new_backup_frame();
        const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
        const var_Y  = make_empty_variable('?Y' + (index == 1 ? '' : index));
        dc.add_new_step('<{} is daughter of {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['{} is female'](var_X, index + 1, cont_0);

        };
        predicates['{} is father of {}'](var_Y, var_Y, index + 1, cont_1);

        remove_backup_frame();
    },

    '{} is father of {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is father of {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_atom_model('isaac');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                }
            }

        };
        const cont_2 = () => {
            {
                const model = make_atom_model('lot');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                }
            }

        };
        const cont_3 = () => {
            {
                const model = make_atom_model('milcah');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                }
            }

        };
        const cont_4 = () => {
            {
                const model = make_atom_model('yiscah');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                }
            }

        };
        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);
        const backup_head_1 = head_1.backup_value(); reg_backup(head_1, index);


        {
            const model = make_atom_model('abraham');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_1();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('haran');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_2();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('haran');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_3();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('haran');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_4();
            }
        }

        head_0.value = backup_head_0;
        head_1.value = backup_head_1;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

    '{} is female': (head_0, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is female> Entry' + (index == 1 ? '' : index));

        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);


        {
            const model = make_atom_model('yiscah');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            }
        }

        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('milcah');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            }
        }

        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

    '{} is male': (head_0, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} is male> Entry' + (index == 1 ? '' : index));

        const backup_head_0 = head_0.backup_value(); reg_backup(head_0, index);


        {
            const model = make_atom_model('isaac');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            }
        }

        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        {
            const model = make_atom_model('lot');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_0();
            }
        }

        head_0.value = backup_head_0;
        dc.add_new_step('backup restored');

        remove_backup_frame();
    },

    '{} is son of {}': (X, Y, index, cont_0) => {
        new_backup_frame();
        const var_X  = make_empty_variable('?X' + (index == 1 ? '' : index));
        const var_Y  = make_empty_variable('?Y' + (index == 1 ? '' : index));
        dc.add_new_step('<{} is son of {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['{} is male'](var_X, index + 1, cont_0);

        };
        predicates['{} is father of {}'](var_Y, var_Y, index + 1, cont_1);

        remove_backup_frame();
    },

}
