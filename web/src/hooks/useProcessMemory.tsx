export const useProcessMemory = (id:string) => {
    var route = 'http://127.0.0.1:8000/process_memory/' + id
    return fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};