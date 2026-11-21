package com.foroforito.admin.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "COMENTARIO")
@Data
@NoArgsConstructor
public class Comentario {
    @Id
    @Column(name = "ID_COMENTARIO")
    private Long idComentario;
    @Column(name = "CONTENIDO")
    private String contenido;
    @Column(name = "ESTADO")
    private String estado;
    @Column(name = "ID_USUARIO")
    private Long idUsuario;
    @Column(name = "ID_TEMA")
    private Long idTema;
}
