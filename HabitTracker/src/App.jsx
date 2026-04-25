import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { useEffect } from 'react'
import './App.css'
import { getHabits, addHabit as addHabitApi, completeHabit as completeHabitApi, deleteHabit as deleteHabitApi } from './api/HabitApi'

function App() {
  const [habit, setHabit] = useState('') //single habit from the input field initialized as an empty string
  const [habits, setHabits] = useState([]) // array of habits initialized as an empty array, each habit will be an object with properties like name, xp, streak, lastCompleted etc. which will be filled when the user adds a habit and interacts with it.
  const [loading, setLoading] = useState(true); // loading state to show a loading indicator while fetching habits from the API
  const [error, setError] = useState(null); // error state to handle and display any errors that occur during API calls
  //load
  useEffect(() => {
    // const storedHabits = localStorage.getItem('habits')
    // fetch('http://localhost:8080/api/habits')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Fetched data:', data);
    //     setHabits(data)
    //   })
    //   .catch(error => console.error('Error fetching habits:', error));

    const loadHabits = async () => {
      try {
        const response = await getHabits();
        setHabits(response);
      } catch (error) {
        console.error('Error fetching habits:', error);
        setError('Failed to fetch habits.');
      } finally {
        setLoading(false);
      }
    }
    loadHabits();
    // const parsedHabits = JSON.parse(storedHabits) //parsing the string data back to JavaScript object/array

  }, []) // [] means this effect runs only once when the component mounts

  // addHabit() → POST
  // completeHabit() → PUT
  // deleteHabit() → DELETE

  //  Save only when user performs an action, rather then using useEffect to save on every change in habits state, we can directly call the save function inside the addHabit, completeHabit and deleteHabit functions after updating the habits state. This way, we ensure that we are saving to localStorage only when there is an actual change made by the user, rather than on every render or state change which might not always be triggered by user actions. This approach can help optimize performance and reduce unnecessary writes to localStorage.

  //save
  useEffect(() => {
    if (habits.length === 0) return; // this is done to prevent saving an empty array to localStorage when the component first mounts and habits is initialized as an empty array. Without this check, the useEffect would run on the initial render and overwrite any existing habits in localStorage with an empty array. By adding this condition, we ensure that we only save to localStorage when there are actually habits to save, thus preserving any previously stored habits until the user decides to clear them or add new ones.
    const stringifiedHabits = JSON.stringify(habits)
    localStorage.setItem('habits', stringifiedHabits)
  }, [habits]) // [habits] means this effect runs every time the habits state changes even when mounting for the first time but we have a check to prevent saving an empty array to localStorage on the initial render

  const addHabit = async () => {
    // Empty input check
    if (!habit.trim()) return

    // Duplicate habit check
    if (habits.some(h => h.name.toLowerCase() === habit.trim().toLowerCase())) {
      alert('Habit already exists! Please enter a different habit.');
      return;
    }
    try {
      const postedHabit = await addHabitApi(habit.trim());
      // Gate keeping the inputs to prevent empty or duplicate habits(Defensive programming) 
      // const mappedHabit = {
      //   name: habit,
      //   xp: 0,
      //   streak: 0,
      //   lastCompleted: null
      // }
      setHabits([...habits, postedHabit])
      setHabit('') // Clearing the container carrying habit from input field after adding the habit to the habits array
    } catch (error) {
      console.error('Error adding habit:', error);
      alert('Failed to add habit.');
      setError('Failed to add habit.'); // Set the error state to display an error message in the UI if needed
    }

  }

  // const completeHabit = (index) => {
  //   const updatedHabits = [...habits]
  //   const lastCompletedDate = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() : null;


  //   //Same day completion check - the latest date is provided by Date().toDateString().
  //   if (lastCompletedDate === new Date().toDateString()) {
  //     {
  //       alert('You have already completed this habit today! Come back tomorrow to earn more XP and maitain your streak!');
  //       return;
  //     }
  //   }
  //   if (updatedHabits[index].lastCompleted) {
  //     const today = new Date();
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);
  //     const streakMaintained = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() === yesterday.toDateString() : false;
  //     const isSameDay = lastCompletedDate === today.toDateString();
  //     // updatedHabits[index].streak = isSameDay ? updatedHabits[index].streak : updatedHabits[index].streak + 1;
  //     if (!isSameDay) {
  //       updatedHabits[index].streak = streakMaintained ? updatedHabits[index].streak + 1 : 1;
  //     }
  //     updatedHabits[index].xp = isSameDay ? updatedHabits[index].xp : updatedHabits[index].xp + 10;
  //   }
  //   else {
  //     updatedHabits[index].xp += 10;
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);
  //     const streakMaintained = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() === yesterday.toDateString() : false;
  //     updatedHabits[index].streak = streakMaintained ? updatedHabits[index].streak + 1 : 1;
  //   }
  //   updatedHabits[index].lastCompleted = new Date();

  //   // A big no :  comparing Date objects instead of strings
  //   setHabits(updatedHabits)
  // }

  const completeHabit = async (id) => {
    try {
      const response = await completeHabitApi(id);
      const updatedHabits = habits.map(habit => habit.id === id ? response : habit);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error completing habit:', error);
      alert('Failed to complete habit.');
      setError('Failed to complete habit.');
    }
  }

  const clearLocalStorage = () => {
    const confirmClear = confirm('Are you sure you want to clear all habits? This action cannot be undone.');
    if (!confirmClear) return; // If the user cancels the action, we exit the function without clearing the habits.
    localStorage.removeItem('habits');
    setHabits([]); // clear the habits state as well to reflect the change in the UI
  }


  const deleteHabit = async (id) => {
    // const updatedHabits = habits.filter(habit => habit.id !== id);
    try {
      const response = await deleteHabitApi(id); //20% important concept: Component handler and API function should not have the same name
      const updatedHabits = habits.filter(habit => habit.id !== id);
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits)); // Update localStorage after deletion
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit.');
      setError('Failed to delete habit.');
    }
  }

  // Step 1: I need array of habits.
  return (
    <>
      <div className='app'>
        <div className='container'>
          <h1 className="app-title">Habit Tracker</h1>

          <div className="habit-form">
            <input
              type="text"
              placeholder="Enter a habit"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addHabit();
                }
              }}
            />
            <button onClick={() => addHabit()}>+</button>
          </div>

          <div className='summary-card'>
            <h2> Total XP: {habits.reduce((total, habit) => total + habit.xp, 0)}</h2>
            <button className="clear-btn"
              onClick={() => clearLocalStorage()}>
              Clear All
            </button>
          </div>

          <div className="habit-list">
            {error && <div className="error">{error}</div>}
            {loading ? (
              <div className="loading">Loading habits...</div>
            ) : habits.length === 0 && (
              <div className="empty-state">
                <p>No habits yet. Add your first one.</p>
              </div>
            )}
            {habits.map((habit) => {
              const completedToday =
                habit.lastCompleted &&
                new Date(habit.lastCompleted).toDateString() === new Date().toDateString();

              return (
                <div className="habit-card" key={habit.id}>
                  <div className="habit-card-top">
                    <h2>{habit.name}</h2>
                    {completedToday && <span className="done-badge">Done Today</span>}
                    {/* UX Thinking to show crucial information on action - Don't just change data communicate with the user */}
                  </div>
                  <p><strong>XP:</strong> {habit.xp}</p>
                  <p><strong>Streak:</strong> 🔥 {habit.streak}</p>
                  <p>
                    <strong>Last Completed:</strong>{" "}
                    {habit.lastCompleted
                      ? new Date(habit.lastCompleted).toDateString()
                      : "Not completed yet"}
                  </p>

                  <button
                    className='complete-btn'
                    onClick={() => completeHabit(habit.id)}
                    disabled={completedToday}
                  >
                    {completedToday ? "Completed" : "Mark as Completed"}
                  </button>

                  <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                    Delete
                  </button>
                </div>
              );

            })}
          </div>

        </div>
      </div>
    </>
  )
}

export default App
