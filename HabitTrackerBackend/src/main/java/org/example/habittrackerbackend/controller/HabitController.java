package org.example.habittrackerbackend.controller;


import org.example.habittrackerbackend.model.Habit;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
//@CrossOrigin(origins = "http://localhost:5173")
public class HabitController {

    private List<Habit> habits = new ArrayList<>();
    private Long idCounter = 1L;

    @GetMapping
    public List<Habit> getHabits(){
        return habits;
    }

    @PostMapping
    public Habit addHabit(@RequestBody Habit habit){
        habit.setId(idCounter++);
        habit.setXp(0);
        habit.setStreak(0);
        habit.setLastCompleted(null);

        habits.add(habit);
        return habit;
    }
}
