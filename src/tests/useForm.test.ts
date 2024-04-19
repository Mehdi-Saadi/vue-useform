import useForm from '@/scripts/useForm';
import { describe, it, expect } from 'vitest';

type Fields = {
    name: string,
    email: string,
    password: string,
    remember: boolean,
};

type FieldErrors = {
    [key in keyof Fields]: string
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

const errors: Partial<FieldErrors> = {
    'name': 'error message for name field',
    'email': 'error message for email field',
    'password': 'error message for password field',
    'remember': 'error message for remember field',
};

// isDirty tested using Vue Devtools

describe('reset', () => {
    it('can reset the all fields', () => {
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

describe('setError', () => {
    it('will set error message for one specific field', () => {
        const form = useForm(emptyFields);

        form.setError('email', 'error message for email field');

        expect(form.errors).toMatchObject({
            'email': 'error message for email field'
        });
    });

    it('will set error message for one or multiple fields', () => {
        const form = useForm(emptyFields);
        form.setError(errors);

        expect(form.errors).toMatchObject(errors);
    });
});

describe('clearErrors', () => {
    it('clears all the error messages if no argument is provided', () => {
        const form = useForm(emptyFields);

        form.setError(errors);

        form.clearErrors();

        expect(form.errors).toMatchObject({});
    });

    it('only clears specified fields', () => {
        const form = useForm(emptyFields);

        form.setError(errors);

        form.clearErrors('name', 'email');

        expect(form.errors).toMatchObject({
            'password': 'error message for password field',
            'remember': 'error message for remember field',
        });
    });
});
