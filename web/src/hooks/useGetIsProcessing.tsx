export const useGetIsProcessing = () => {
    return fetch('http://127.0.0.1:8000/get_is_processing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};