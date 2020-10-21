/*
when {<A> and <B>}
then also {<C> and <D>}
otherwise {<E>}
*/

let cond_X;

//else
const cont_1 = () =>{
      predicates['<E>'](cont_0);
}

const cont_2 = () =>{
      predicates['<D>'](cont_0);
}
const cont_3 = () =>{
      predicates['<C>'](cont_2);
}

//then
const cont_4 = () =>{
    cond_X = true;
    cont_3();
}
const cont_5 = () =>{
      predicates['<B>'](cont_4);
}
const cont_6 = () =>{
      predicates['<A>'](cont_5);
}

trail.new_choice_point();
cont_6();
trail.restore_choice_point();
if (!cond_X) {
    cont_1();
}
trail.restore_choice_point();
trail.remove_choice_point();

