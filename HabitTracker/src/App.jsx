import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { useEffect } from 'react'
import './App.css'

function App() {
  const [habit, setHabit] = useState('') //single habit from the input field initialized as an empty string
  const [habits, setHabits] = useState([]) // array of habits initialized as an empty array, each habit will be an object with properties like name, xp, streak, lastCompleted etc. which will be filled when the user adds a habit and interacts with it.

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
        const response = await fetch('http://localhost:8080/api/habits');
        console.log('Fetch response:', response);
        console.log('Fetch response status:', response.status);
        console.log('Fetch response headers:', response.headers);
        const data = await response.json();
        console.log('Fetch response json ', data);
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
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
      const postedHabit = await fetch('http://localhost:8080/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: habit //only send name and backend fill rest to their initial values
        })

      })
      const mappedHabit = await postedHabit.json();
      // Gate keeping the inputs to prevent empty or duplicate habits(Defensive programming) 
      // const mappedHabit = {
      //   name: habit,
      //   xp: 0,
      //   streak: 0,
      //   lastCompleted: null
      // }
      setHabits([...habits, mappedHabit])
      setHabit('') // Clearing the container carrying habit from input field after adding the habit to the habits array
    } catch (error) {
      console.error('Error adding habit:', error);
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
    debugger;
    try {
      const response = await fetch(`http://localhost:8080/api/habits/${id}/complete`, {
        method: 'PUT'
      })
      const updatedHabit = await response.json();
      const updatedHabits = habits.map(habit => habit.id === id ? updatedHabit : habit);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  }

  const clearLocalStorage = () => {
    const confirmClear = confirm('Are you sure you want to clear all habits? This action cannot be undone.');
    if (!confirmClear) return; // If the user cancels the action, we exit the function without clearing the habits.
    localStorage.removeItem('habits');
    setHabits([]); // clear the habits state as well to reflect the change in the UI
  }


  const deleteHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits)); // Update localStorage after deletion
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
            {habits.length === 0 && (
              <div className="empty-state">
                <p>No habits yet. Add your first one.</p>
              </div>
            )}
            {habits.map((habit, index) => {
              const completedToday =
                habit.lastCompleted &&
                new Date(habit.lastCompleted).toDateString() === new Date().toDateString();

              return (
                <div className="habit-card" key={index}>
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
                    onClick={() => completeHabit(index)}>
                    Completed +10
                  </button>

                  <button className="delete-btn" onClick={() => deleteHabit(index)}>
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
