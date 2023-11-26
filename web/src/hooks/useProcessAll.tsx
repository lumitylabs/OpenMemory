export const useProcessAll = () => {
    return fetch('http://127.0.0.1:8000/process_all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};