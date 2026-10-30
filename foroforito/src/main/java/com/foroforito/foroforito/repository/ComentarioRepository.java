package com.foroforito.foroforito.repository;

import com.foroforito.foroforito.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByTemaIdTemaAndEstadoOrderByFechaAsc(Long idTema, String estado);

    long countByTemaIdTemaAndEstado(Long idTema, String estado);

    List<Comentario> findByTemaIdTema(Long idTema);
}