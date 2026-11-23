#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ROL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ROL")
    private Long idRol;

    @Column(name = "NOMBRE", nullable = false, unique = true, length = 30)
    private String nombre;
}