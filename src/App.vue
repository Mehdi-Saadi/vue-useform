<script setup lang="ts">
import useForm from '@/scripts/useForm';

const form = useForm({});

const send = () => {
    form.get('https://jsonplaceholder.typicode.com/posts/1', {
        onBefore() {
            console.log('before');
        },
        onSuccess() {
            console.log('success');
        },
        onError(error) {
            console.log('error');
        },
        onFinish() {
            console.log('finish');
        },
    });
}
</script>

<template>
    <button @click.prevent="send">send</button>
    <span v-if="form.processing">processing</span>
    <span v-if="form.wasSuccessful">was successful</span>
</template>
