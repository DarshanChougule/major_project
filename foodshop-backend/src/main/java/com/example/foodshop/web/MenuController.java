package com.example.foodshop.web;

import com.example.foodshop.dto.menu.*;
import com.example.foodshop.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/user/menu")
    public Page<MenuItemResponse> list(@RequestParam(name = "page",defaultValue = "0") int page,
                                       @RequestParam(name = "size",defaultValue = "12") int size) {
        return menuService.listUser(PageRequest.of(page, size, Sort.by("name").ascending()));
    }
    @GetMapping("/admin/menu")
    public Page<MenuItemResponse> listAdmin(@RequestParam(name = "page",defaultValue = "0") int page,
                                       @RequestParam(name = "size",defaultValue = "12") int size) {
        return menuService.list(PageRequest.of(page, size, Sort.by("name").ascending()));
    }

    @PostMapping("/admin/menu")
    public ResponseEntity<MenuItemResponse> create(@RequestBody @Valid MenuItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.create(req));
    }

    @PutMapping("/admin/menu/{id}")
    public MenuItemResponse update(@PathVariable(name="id") Long id, @RequestBody @Valid MenuItemRequest req) {
        return menuService.update(id, req);
    }

    @PutMapping("/admin/menus/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="id") Long id) {
        menuService.toggleAvailability(id);
        return ResponseEntity.noContent().build();
    }
}
