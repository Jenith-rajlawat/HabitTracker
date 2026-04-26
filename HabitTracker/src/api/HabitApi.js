const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHabits = async () => {
    const response = await fetch(BASE_URL);
    if(!response.ok){
        throw new Error('Failed to fetch habits'); // API layer throws an error, which can be caugh in the UI layer to handle it gracefully. This is a good practice to separate concerns and keep the UI layer clean and focused on presentation logic.
    }
    return response.json();
}

export const addHabit = async (habitName) => {
    const response = await fetch(BASE_URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: habitName})
    })
    if(!response.ok){
        throw new Error('Failed to add habit');
    }
    return response.json();
}

export const completeHabit = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/complete`,{
        method: 'PUT'
    })
    if(!response.ok){
        throw new Error('Failed to complete habit');
    }
    return response.json();
}

export const deleteHabit = async (id) => {
     const response= await fetch(`${BASE_URL}/${id}/delete`,{
        method: 'DELETE'
    })
    if(!response.ok){
        throw new Error('Failed to delete habit');
    }
    return null;
}