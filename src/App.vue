<script setup lang="ts">
import useForm from '@/scripts/useForm';

const form = useForm({
    name: '',
    email: '',
    remember: false,
});
</script>

<template>
    {{ form.fields.name }}
    <br>
    <input type="text" v-model="form.fields.name">
    <br>
    {{ form.fields.email }}
    <br>
    <input type="text" v-model="form.fields.email">
    <br>
    {{ form.fields.remember }}
    <br>
    <input type="checkbox" v-model="form.fields.remember">
    <br>
    <button @click.prevent="form.reset()">reset</button>
</template>
