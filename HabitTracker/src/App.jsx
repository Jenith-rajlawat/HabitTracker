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
  }, [habits])

  const addHabit = () => {
    if (!habit.trim()) return

    const mappedHabit = {
      name: habit,
      xp: 0
    }
    setHabits([...habits, mappedHabit])
    setHabit('')
  }

  const completeHabit = (index) => {
    const updatedHabits = [...habits]
    updatedHabits[index].xp += 10;
    setHabits(updatedHabits)
  }

  // Step 1: I need array of habits.
  return (
    <>
      <div className="App">
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
            <h2>{habit.name} - {habit.xp}</h2>
            <button onClick={() => completeHabit(index)}>
              Completed +10
            </button>
          </div>
        ))}
      </div>
      <div className='display-xp'>
        <h2>XP: {habits.reduce((total, habit) => total + habit.xp, 0)}</h2>
      </div>
    </>
  )
}

export default App
