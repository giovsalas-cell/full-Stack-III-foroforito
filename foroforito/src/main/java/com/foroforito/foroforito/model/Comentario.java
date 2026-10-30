package com.foroforito.foroforito.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "COMENTARIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_COMENTARIO")
    private Long idComentario;

    @Column(name = "CONTENIDO", nullable = false, length = 1000)
    private String contenido;

    @Column(name = "FECHA")
    private LocalDateTime fecha;

    @Column(name = "ESTADO", length = 20)
    private String estado;

    // Número del usuario que comentó (vive en ms-usuarios)
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;

    @ManyToOne
    @JoinColumn(name = "ID_TEMA", nullable = false)
    private Tema tema;

    @PrePersist
    public void antesDeGuardar() {
        this.fecha = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "ACTIVO";
        }
    }
}