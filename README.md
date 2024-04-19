# vue-useform

Provides a useForm helper similar to inertia's useForm to work with forms.

## Installation

```shell
npm install vue-useform
```

## Features

### Available properties

- isDirty
- processing
- wasSuccessful

### Available methods

- reset
- setError
- clearErrors
- submit
- get
- post
- put
- patch
- delete

### Available submit options

- onBefore
- onSuccess
- onError
- onFinish

## Sample

### in your script setup tag:

```js
import useForm from 'vue-useform';

const form = useForm({
    name: '',
    email: '',
    password: '',
});

const submit = (): void => {
    form.post('url', {
        // also you can use asyc/await for request hooks(options):
        // async onBefore() { // await code here }
        onBefore() {
            // before making the request
        },
        onSuccess(response) {
            // on success
        },
        onError(error) {
            // on error
        },
        onFinish() {
            // after making the request, 
            // regardless of whether it was successful or not
        }
    });
};
```

### in your template:

```html
<form @submit.prevent="submit">

    <!-- name -->
    <InputField
        type="text"
        v-model="form.fields.name"
    />
    <InputError :message="form.errors.name" />

    <!-- email address -->
    <InputField
        type="email"
        v-model="form.fields.email"
    />
    <InputError :message="form.errors.email" />

    <!-- password -->
    <InputField
        type="password"
        v-model="form.fields.password"
    />
    <InputError :message="form.errors.password"/>

    <SubmitRegister :disabled="form.processing" value="Sign up with Email" />
</form>
```

To submit the form, you may use the get, post, put, patch and delete methods.

```js
form.submit(method, url, options)
form.get(url, options)
form.post(url, options)
form.put(url, options)
form.patch(url, options)
form.delete(url, options)
```

To clear form errors, use the clearErrors() method.

```js
// Clear all errors...
form.clearErrors()

// Clear errors for specific fields...
form.clearErrors('field', 'anotherfield')
```

you can set your own errors on the form using the setErrors() method.

```js
// Set a single error...
form.setError('field', 'Your error message.');

// Set multiple errors at once...
form.setError({
  foo: 'Your error message for the foo field.',
  bar: 'Some other error for the bar field.'
});
```

To reset the form's values back to their default values, you can use the reset() method.

```js
// Reset the form...
form.reset()

// Reset specific fields...
form.reset('field', 'anotherfield')
```

To determine if a form has any changes, you may use the isDirty property.

```html
<div v-if="form.isDirty">There are unsaved form changes.</div>
```
