package com.foroforito.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foroforito.admin.model.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByIdTema(Long idTema);

    List<Comentario> findByEstado(String estado);
}
