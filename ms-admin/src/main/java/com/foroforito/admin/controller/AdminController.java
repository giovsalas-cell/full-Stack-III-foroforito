package com.foroforito.admin.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foroforito.admin.model.Comentario;
import com.foroforito.admin.model.Tema;
import com.foroforito.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ---------- Consultas ----------

    @GetMapping("/temas")
    public List<Tema> listarTemas(@RequestParam(defaultValue = "ACTIVO") String estado) {
        return adminService.listarTemas(estado);
    }

    @GetMapping("/comentarios")
    public List<Comentario> listarComentarios(@RequestParam(defaultValue = "ACTIVO") String estado) {
        return adminService.listarComentarios(estado);
    }

    @GetMapping("/temas/{id}/comentarios")
    public List<Comentario> comentariosDeTema(@PathVariable Long id) {
        return adminService.comentariosDeTema(id);
    }

    // ---------- Temas ----------

    @PutMapping("/temas/{id}/banear")
    public Tema banearTema(@PathVariable Long id) {
        return adminService.banearTema(id);
    }

    @PutMapping("/temas/{id}/reactivar")
    public Tema reactivarTema(@PathVariable Long id) {
        return adminService.reactivarTema(id);
    }

    // ---------- Comentarios ----------

    @PutMapping("/comentarios/{id}/banear")
    public Comentario banearComentario(@PathVariable Long id) {
        return adminService.banearComentario(id);
    }

    @PutMapping("/comentarios/{id}/reactivar")
    public Comentario reactivarComentario(@PathVariable Long id) {
        return adminService.reactivarComentario(id);
    }
}