package com.example.foodshop.service;

import com.example.foodshop.domain.MenuItem;
import com.example.foodshop.dto.menu.MenuItemRequest;
import com.example.foodshop.dto.menu.MenuItemResponse;
import com.example.foodshop.repository.MenuItemRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.var;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuRepo;

    public MenuItemResponse create(MenuItemRequest req) {
        var m = MenuItem.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .available(req.getAvailable() != null ? req.getAvailable() : true)
                .imageUrl(req.getImageUrl())
                .build();
        var saved = menuRepo.save(m);
        return toResponse(saved);
    }

    public Page<MenuItemResponse> list(Pageable pageable) {
        return menuRepo.findAll(pageable).map(this::toResponse);
    }

    public Page<MenuItemResponse> listUser(Pageable pageable) {
    return menuRepo.findByAvailableTrue(pageable)
                   .map(this::toResponse);
}

    public MenuItemResponse update(Long id, MenuItemRequest req) {
        var m = menuRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        m.setName(req.getName());
        m.setDescription(req.getDescription());
        m.setPrice(req.getPrice());
        m.setAvailable(req.getAvailable());
        m.setImageUrl(req.getImageUrl());
        m.setAvailable(true);
        return toResponse(menuRepo.save(m));
    }

    public void delete(Long id) {
        menuRepo.deleteById(id);
    }

    private MenuItemResponse toResponse(MenuItem m) {
        return MenuItemResponse.builder()
                .id(m.getId()).name(m.getName()).description(m.getDescription())
                .price(m.getPrice()).available(m.getAvailable()).imageUrl(m.getImageUrl())
                .build();
    }

    public void toggleAvailability(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid menu item ID: " + id);
        }
        MenuItem item = menuRepo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Menu item with ID " + id + " not found"));
        item.setAvailable(!item.getAvailable()); // Toggle: true -> false, false -> true
        MenuItem saved = menuRepo.save(item);
        return;
    }
}
