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
      const parsedHabits = JSON.parse(storedHabits)
      setHabits(parsedHabits)
    }
  }, []) // [] means this effect runs only once when the component mounts

  //save
  useEffect(() => {
    if (habits.length === 0) return;
    const stringifiedHabits = JSON.stringify(habits)
    localStorage.setItem('habits', stringifiedHabits)
  }, [habits]) // [habits] means this effect runs every time the habits state changes

  const addHabit = () => {
    if (!habit.trim()) return

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
    localStorage.removeItem('habits');
    setHabits([]); // clear the habits state as well to reflect the change in the UI
  }

  // Step 1: I need array of habits.
  return (
    <>
      <div className="app-title">
        <h1>Habit Tracker</h1>
      </div>
      <div className="habit-form">
        <input
          type="text"
          placeholder="Enter a habit"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
        />
        <button onClick={() => addHabit()}>+</button>
      </div>
      <br />
      <div className="habit-display">
        {habits.map((habit, index) => (
          <div key={index}>
            <h2>{habit.name} - {habit.xp} </h2>
            <h2>Streak: {habit.streak}</h2>
            <h3>LastCompleted: {habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : 'Not completed yet'}</h3>
            <button onClick={() => completeHabit(index)}>
              Completed +10
            </button>
          </div>
        ))}
      </div>
      <div className='display-xp'>
        <h2> Total XP: {habits.reduce((total, habit) => total + habit.xp, 0)}</h2>
      </div>

      <div className='clear-local-storage'>
        <button onClick={() => clearLocalStorage()}> Clear Local Storage</button>
      </div>
    </>
  )
}

export default App
