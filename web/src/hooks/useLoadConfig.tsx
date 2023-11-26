export const useLoadConfig = () => {
    return fetch('http://127.0.0.1:8000/load_config', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};