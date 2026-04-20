package org.example.habittrackerbackend.model;

import java.time.LocalDate;

public class Habit {
    //id(long), name(string), xp(int), lastCOmpleted(localDate), streak(int)

    private Long id;
    private String name;
    private int xp;
    private int streak;
    private LocalDate lastCompleted;

    public Habit() {}

    public Habit(Long id, String name, int xp, int streak, LocalDate lastCompleted){
        this.id = id;
        this.name= name;
        this.xp = xp;
        this.streak = streak;
        this.lastCompleted = lastCompleted;
    }

    public Long getId() {return id;}
    public void setId(Long id){this.id = id;}
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public LocalDate getLastCompleted() { return lastCompleted; }
    public void setLastCompleted(LocalDate lastCompleted) { this.lastCompleted = lastCompleted; }
}
