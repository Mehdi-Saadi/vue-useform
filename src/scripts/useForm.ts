import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import axios, { type AxiosResponse } from 'axios';
import { reactive, watch } from 'vue';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface VisitOptions {
    onBefore(): Promise<void> | void;
    onSuccess(response: AxiosResponse<any, any>): Promise<void> | void;
    onError(error: any): Promise<void> | void;
    onFinish(): Promise<void> | void;
}

type FormFields = {
  [key: string]: any;
};

interface FormProps<T> {
    fields: T;
    isDirty: boolean;
    errors: Partial<T>;
    processing: boolean;
    wasSuccessful: boolean;
    reset(...fields: (keyof T)[]): void;
    setError(field: keyof T, value: string): void;
    setError(errors: Partial<Record<keyof T, string>>): void;
    clearErrors(...fields: (keyof T)[]): void;
    submit(method: Method, url: string, options?: Partial<VisitOptions>): void;
    get(url: string, options?: Partial<VisitOptions>): void;
    post(url: string, options?: Partial<VisitOptions>): void;
    put(url: string, options?: Partial<VisitOptions>): void;
    patch(url: string, options?: Partial<VisitOptions>): void;
    delete(url: string, options?: Partial<VisitOptions>): void;
}

export default function useForm<T extends FormFields>(data: T) {
    let defaults = cloneDeep(data);

    const form = reactive<FormProps<T>>({
        fields: {
            ...cloneDeep(defaults)
        },
        isDirty: false,
        errors: {},
        processing: false,
        wasSuccessful: false,
        reset(...fields) {
            const resolvedData = cloneDeep(defaults);
            const clonedData = cloneDeep(resolvedData);
            if (fields.length === 0) {
                defaults = clonedData;
                Object.assign(this.fields, resolvedData);
            } else {
                Object.keys(resolvedData)
                    .filter((key) => fields.includes(key))
                    .forEach((key) => {
                        defaults[key as keyof T] = clonedData[key];
                        this.fields[key as keyof T] = resolvedData[key];
                    });
            }
        },
        setError(fieldOrFields: keyof T | Partial<Record<keyof T, string>>, maybeValue?: string) {
            Object.assign(this.errors, typeof fieldOrFields === 'string' ? { [fieldOrFields]: maybeValue } : fieldOrFields);
        },
        clearErrors(...fields) {
            this.errors = Object.keys(this.errors).reduce(
                (carry, field) => ({
                    ...carry,
                    ...(fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}),
                }),
                {},
            );
        },
        async submit(method, url, options = {}) {
            const { onBefore, onSuccess, onError, onFinish } = options;

            this.processing = true;

            if (onBefore) {
                await onBefore();
            }

            try {
                const response = method === 'delete'
                    ? await axios.delete(url, { data: this.fields })
                    : await axios[method](url, this.fields);

                this.wasSuccessful = true;
                this.isDirty = false;
                this.clearErrors();
                defaults = cloneDeep(this.fields);

                if (onSuccess) {
                    await onSuccess(response);
                }
            } catch (errors: any) {
                this.wasSuccessful = false;
                this.clearErrors();

                for (const error in errors.response.data.errors) {
                    this.setError(error, errors.response.data.errors[error][0]);
                }

                if (onError) {
                    await onError(errors);
                }
            } finally {
                this.processing = false;

                if (onFinish) {
                    await onFinish();
                }
            }
        },
        get(url, options) {
            this.submit('get', url, options);
        },
        post(url, options) {
           this.submit('post', url, options)
        },
        put(url, options) {
           this.submit('put', url, options)
        },
        patch(url, options) {
            this.submit('patch', url, options)
        },
        delete(url, options) {
            this.submit('delete', url, options)
        }
    });

    watch(
        form,
        () => {
            form.isDirty = !isEqual(form.fields, defaults)
        },
        { immediate: true, deep: true },
    );

    return form;
}
