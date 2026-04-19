import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { useEffect } from 'react'
import './App.css'

function App() {
  const [habit, setHabit] = useState('')
  const [habits, setHabits] = useState([])

  //load
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits) //parsing the string data back to JavaScript object/array
      setHabits(parsedHabits)
    }
  }, []) // [] means this effect runs only once when the component mounts

  //save
  useEffect(() => {
    if (habits.length === 0) return; // this is done to prevent saving an empty array to localStorage when the component first mounts and habits is initialized as an empty array. Without this check, the useEffect would run on the initial render and overwrite any existing habits in localStorage with an empty array. By adding this condition, we ensure that we only save to localStorage when there are actually habits to save, thus preserving any previously stored habits until the user decides to clear them or add new ones.
    const stringifiedHabits = JSON.stringify(habits)
    localStorage.setItem('habits', stringifiedHabits)
  }, [habits]) // [habits] means this effect runs every time the habits state changes even when mounting for the first time but we have a check to prevent saving an empty array to localStorage on the initial render

  const addHabit = () => {
    // Empty input check
    if (!habit.trim()) return

    // Duplicate habit check
    if (habits.some(h => h.name.toLowerCase() === habit.trim().toLowerCase())) {
      alert('Habit already exists! Please enter a different habit.');
      return;
    }

    // Gate keeping the inputs to prevent empty or duplicate habits(Defensive programming) 
    const mappedHabit = {
      name: habit,
      xp: 0,
      streak: 0,
      lastCompleted: null
    }
    setHabits([...habits, mappedHabit])
    setHabit('') // Clearing the container carrying habit from input field after adding the habit to the habits array
  }

  const completeHabit = (index) => {
    const updatedHabits = [...habits]
    const lastCompletedDate = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() : null;


    //Same day completion check - the latest date is provided by Date().toDateString().
    if (lastCompletedDate === new Date().toDateString()) {
      {
        alert('You have already completed this habit today! Come back tomorrow to earn more XP and maitain your streak!');
        return;
      }
    }
    if (updatedHabits[index].lastCompleted) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const streakMaintained = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() === yesterday.toDateString() : false;
      const isSameDay = lastCompletedDate === today.toDateString();
      // updatedHabits[index].streak = isSameDay ? updatedHabits[index].streak : updatedHabits[index].streak + 1;
      if (!isSameDay) {
        updatedHabits[index].streak = streakMaintained ? updatedHabits[index].streak + 1 : 1;
      }
      updatedHabits[index].xp = isSameDay ? updatedHabits[index].xp : updatedHabits[index].xp + 10;
    }
    else {
      updatedHabits[index].xp += 10;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const streakMaintained = updatedHabits[index].lastCompleted ? new Date(updatedHabits[index].lastCompleted).toDateString() === yesterday.toDateString() : false;
      updatedHabits[index].streak = streakMaintained ? updatedHabits[index].streak + 1 : 1;
    }
    updatedHabits[index].lastCompleted = new Date();

    // A big no :  comparing Date objects instead of strings
    setHabits(updatedHabits)
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
