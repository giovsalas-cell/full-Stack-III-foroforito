package com.foroforito.foroforito.repository;

import com.foroforito.foroforito.model.Tema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TemaRepository extends JpaRepository<Tema, Long> {
    List<Tema> findByCategoriaIdCategoriaAndEstado(Long idCategoria, String estado);

    List<Tema> findByIdUsuarioAndEstado(Long idUsuario, String estado);

    List<Tema> findByTituloContainingIgnoreCaseAndEstado(String texto, String estado);

    List<Tema> findByEstadoOrderByFechaDesc(String estado);
}