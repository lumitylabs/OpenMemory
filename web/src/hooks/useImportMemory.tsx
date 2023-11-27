export const useImportMemory = (formData:any) => {
    return fetch('http://127.0.0.1:8000/import_memory/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json());
};