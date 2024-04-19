import useForm from '@/scripts/useForm';
import { describe, it, expect } from 'vitest';

type Fields = {
    name: string,
    email: string,
    password: string,
    remember: boolean,
};

const emptyFields: Fields = {
    name: '',
    email: '',
    password: '',
    remember: false,
};

const  filledFields: Fields = {
    name: 'john due',
    email: 'john@due.com',
    password: 'password',
    remember: true,
};

// isDirty tested using Vue Devtools

describe('reset', () => {
    it('can reset the whole fields', () => {
        const form = useForm(emptyFields);
    
        form.fields.name = 'mehdi saadi';
        form.fields.email = 'mehdi.0.saadi@gmail.com';
        form.fields.password = 'password';
        form.fields.remember = true;

        form.reset();

        expect(form.fields).toMatchObject(emptyFields);
    });

    it('can reset defined fields', () => {
        const form = useForm(filledFields);
    
        form.fields.name = '';
        form.fields.email = '';

        form.reset('name', 'email');

        expect(form.fields).toMatchObject(filledFields);
    });

    it('can reset defined field', () => {
        const form = useForm(filledFields);
    
        form.fields.name = '';
        form.fields.email = '';

        // reseting only email field
        form.reset('email');

        expect(form.fields).toMatchObject({
            name: '',
            email: 'john@due.com',
            password: 'password',
            remember: true,
        });
    });
});

// it('sets isDirty to true when initial value of fields is changed', () => {
//     const firstForm = useForm(emptyFields);

//     firstForm.fields.firstName = 'changed firstName';
//     expect(firstForm.isDirty).toBe(true);


// });
