package com.foroforito.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.foroforito.admin.model.Tema;

public interface TemaRepository extends JpaRepository<Tema, Long> {

    List<Tema> findByEstado(String estado);

}
