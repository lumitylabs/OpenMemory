export const useDeleteMemory = (id:string) => {
    var route = 'http://127.0.0.1:8000/delete_memory/' + id
    return fetch(route, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};
