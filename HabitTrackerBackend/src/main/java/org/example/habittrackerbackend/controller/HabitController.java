package org.example.habittrackerbackend.controller;


import org.example.habittrackerbackend.model.Habit;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PutMapping("/{id}/complete")
    public Habit completeHabit(@PathVariable int id ){
        for(Habit habit: habits){
            if(habit.getId().equals(id)){
                LocalDate today = LocalDate.now();

                //same day --> do nothing
                if(today.equals(habit.getLastCompleted())){
                    return habit;
                }

                //yesterday -> continue streak
                if(today.minusDays(1).equals(habit.getLastCompleted())){
                    habit.setStreak(habit.getStreak()+1);
                }else {
                    //first time or missed
                    habit.setStreak(1);
                }

                habit.setXp(habit.getXp()+10);
                habit.setLastCompleted(today);
                return habit;
            }

        }
       throw new RuntimeException("Habit not found with id: "+ id);
    }
}
