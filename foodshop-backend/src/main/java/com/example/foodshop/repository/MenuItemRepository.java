package com.example.foodshop.repository;

import com.example.foodshop.domain.MenuItem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Page<MenuItem> findByAvailableTrue(Pageable pageable);
}
