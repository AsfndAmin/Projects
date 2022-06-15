import { useState, useEffect } from 'react';

const useVerification = (callback: any, validate: any, values: object) => {

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
    }, [errors]);

    const handleSubmit = (event: any) => {
        if (event) event.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);

    };

    return {
        handleSubmit,
        errors,
        setErrors,
        isSubmitting,
        setIsSubmitting
    }
};

export default useVerification;