const predicates = {
    '{} drinks {}': (head_0, head_1, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} drinks {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            {
                const model = make_atom_model('martini');
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
                const model = make_atom_model('gin');
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
                const model = make_atom_model('vodka');
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
                const model = make_atom_model('gin');
                const model_name = model.pprint();
                if (head_1.unify_with(model)){
                    dc.add_new_step(`${head_1.direct_name()} = ${model_name}`);
                    cont_0();
                } else {
                    dc.add_new_step(`Failed: ${head_1.dereferenced_value().direct_name()} = ${model_name}`);
                }
            }

        };
        const cont_5 = () => {
            {
                const model = make_atom_model('gin');
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
            const model = make_atom_model('john');
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
            const model = make_atom_model('mary');
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
            const model = make_atom_model('susan');
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
            const model = make_atom_model('john');
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
            const model = make_atom_model('fred');
            const model_name = model.pprint();
            if (head_0.unify_with(model)){
                dc.add_new_step(`${head_0.direct_name()} = ${model_name}`);
                cont_5();
            } else {
                dc.add_new_step(`Failed: ${head_0.dereferenced_value().direct_name()} = ${model_name}`);
            }
        }

        trail.restore_choice_point();
        dc.add_new_step('backup restored');
        trail.remove_choice_point();

        remove_backup_frame();
    },

    '{} and {} are paired by {}': (head_A, head_B, head_Drink, index, cont_0) => {
        new_backup_frame();
        dc.add_new_step('<{} and {} are paired by {}> Entry' + (index == 1 ? '' : index));

        const cont_1 = () => {
            predicates['{} drinks {}'](head_B, head_Drink, index + 1, cont_0);

        };
        predicates['{} drinks {}'](head_A, head_Drink, index + 1, cont_1);

        remove_backup_frame();
    },

}
