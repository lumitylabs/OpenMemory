export const useStartCapture = () => {
    return fetch('http://127.0.0.1:8000/start_capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};
