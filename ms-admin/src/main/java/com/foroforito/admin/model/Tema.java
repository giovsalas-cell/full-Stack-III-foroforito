package com.foroforito.admin.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TEMA")
@Data
@NoArgsConstructor
public class Tema {

    @Id
    @Column(name = "ID_TEMA")
    private Long idTema;

    @Column(name = "TITULO")
    private String titulo;

    @Column(name = "ESTADO", length = 20)
    private String estado;

    @Column(name = "ID_USUARIO")
    private Long idUsuario;
}