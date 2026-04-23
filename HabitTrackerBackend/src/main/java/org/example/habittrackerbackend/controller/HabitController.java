package org.example.habittrackerbackend.controller;
// org-> example-> habittrackerbackend-> controller folder structure where package name should be lowercase

import org.example.habittrackerbackend.model.Habit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController //making this a RestController for rest apis where we will be creating get, put, post, delete mapping
@RequestMapping("/api/habits")
// explicitly assigning  url for this rest api //localhost:8080/api/habits without it just localhost:8080 would work
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:5173")
// Giving cross origin url access to this Controller to request anything CORS using CrossOrigin which takes in origins as a param
public class HabitController {

    private List<Habit> habits = new ArrayList<>(); // list of habits where we keep on adding habits or updating or deleting from it. For that session till we store it to db this holds the source of truth
    private Long idCounter = 1L; // counter of id starting from 1

    @GetMapping
    //just returning the list of habits if any. For first load it would just be [] and no url given to @GetMapping is like api/habits being the triggering url for it
    public List<Habit> getHabits() {
        return habits;
    }

    @PostMapping
    // same url hit using fetch from frontend but the method must be explicitly a 'POST' and a body of json must be send as this is taking @RequestBody as habit
    public Habit addHabit(@RequestBody Habit habit) {
        habit.setId(idCounter++);
        habit.setXp(0);
        habit.setStreak(0);
        habit.setLastCompleted(null);
//        Modifying the same habit and adding to the list using add method and returning it to frontend so it can also display the details in its list of habits after adding
        habits.add(habit);
        return habit;
    }

    @PutMapping("/{id}/complete")
    public Habit completeHabit(@PathVariable int id) {
        for (Habit habit : habits) {
//            The equals() method of Long expects another Long. getId is Long and id is int so if both has 1 equals will return false
            if (habit.getId().equals(Long.valueOf(id))) {
                LocalDate today = LocalDate.now();

                //same day --> do nothing
                if (today.equals(habit.getLastCompleted())) {
                    return habit;
                }

                //yesterday -> continue streak
                if (today.minusDays(1).equals(habit.getLastCompleted())) {
                    habit.setStreak(habit.getStreak() + 1);
                } else {
                    //first time or missed
                    habit.setStreak(1);
                }

                habit.setXp(habit.getXp() + 10);
                habit.setLastCompleted(today);
                return habit;
            }

        }
        throw new RuntimeException("Habit not found with id: " + id);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteHabit(@PathVariable int id){
        Boolean isDeleted = habits.removeIf(habit -> habit.getId() == id);

        if(!isDeleted){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
