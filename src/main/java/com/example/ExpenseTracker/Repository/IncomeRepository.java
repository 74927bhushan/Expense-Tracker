package com.example.ExpenseTracker.Repository;

import com.example.ExpenseTracker.Entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income,Long> {
}