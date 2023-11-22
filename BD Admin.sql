CREATE DATABASE bd_juju;
USE bd_juju;

CREATE TABLE bitacora (
id_bitacora INT NOT NULL AUTO_INCREMENT,
transaccion VARCHAR(10) NOT NULL,
usuario VARCHAR(40) NOT NULL,
fecha DATETIME NOT NULL,
tabla VARCHAR(20) NOT NULL,
PRIMARY KEY (id_bitacora)
);

CREATE TABLE Usuario (
  id_Usuario Int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre_Usuario Varchar(30) NOT NULL,
  contrasena Varchar(16) NOT NULL,
  rol Varchar(20) NOT NULL
);

INSERT INTO Usuario (nombre_Usuario, contrasena, rol)  VALUES ('gersania','123456', 'admin');
delete from Usuario where id_Usuario= 3;
INSERT INTO Usuario (nombre_Usuario, contrasena, rol)  VALUES ('camila','12345', 'admin');
SELECT * FROM Usuario;

CREATE TABLE Cliente (
  Id_Cliente INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(20),
  Apellido VARCHAR(20),
  Direccion VARCHAR(50),
  Telefono VARCHAR(9),
  Correo VARCHAR(50)
);

select * from cliente;


CREATE TABLE Pedido (
  Id_Pedido INT AUTO_INCREMENT PRIMARY KEY,
  Fecha_Pedido DATE,
  Direccion VARCHAR(100),
  Estado_Pedido VARCHAR(50),
  Id_Cliente INT NOT NULL
);

select * from categorias;

CREATE TABLE Categorias (
  Id_Categoria INT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Categoria VARCHAR(20)
);

SELECT * FROM Categorias;

CREATE TABLE Producto (
  Id_Producto INT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Producto VARCHAR(50),
  Descripcion VARCHAR(100),
  Precio DECIMAL(12, 2),
  Id_Categoria INT
);

ALTER TABLE Producto
ADD imagen LONGTEXT;


ALTER TABLE Producto ADD COLUMN Existencia float after Precio;

SELECT * FROM Producto;

select * from pedido;

CREATE TABLE Detalle (
  Id_Detalle INT AUTO_INCREMENT PRIMARY KEY,
  Cantidad INT,
  Id_Producto INT,
  Id_Pedido INT
);

CREATE TABLE Imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  imagenUrl VARCHAR(255) NOT NULL
);
DROP TABLE Imagenes;

select * from Detalle;

ALTER TABLE Producto
ADD CONSTRAINT fk_Producto_Categoria
FOREIGN KEY (Id_Categoria)
REFERENCES Categorias(Id_Categoria);

ALTER TABLE Detalle
ADD CONSTRAINT fk_Detalle_Producto
FOREIGN KEY (Id_Producto)
REFERENCES Producto(Id_Producto);

ALTER TABLE Detalle
ADD CONSTRAINT fk_Detalle_Pedido
FOREIGN KEY (Id_Pedido)
REFERENCES Pedido(Id_Pedido);

ALTER TABLE Pedido
ADD CONSTRAINT fk_Pedido_Cliente
FOREIGN KEY (Id_Cliente)
REFERENCES Cliente(Id_Cliente);


INSERT INTO Cliente (Nombre, Apellido, Direccion, Telefono, Correo)
VALUES ('Marcela', 'de suazo', 'Juigalpan', '5623-8956', 'marcosduartes@gmail.com');

INSERT INTO Pedido (Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente)
VALUES ('2023-10-10', 'UNO', 'En Proceso', 2);

INSERT INTO Categorias ( Nombre_Categoria)
VALUES ('Anillo');

select * from bitacora;

INSERT INTO Producto (Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria)
VALUES ('Pulsera de Acero', 'Pulsera de acero inoxidable', '100', 5 , 6);

INSERT INTO Detalle (Cantidad, Id_Producto, Id_Pedido)
VALUES (5, 7, 5 );

Select * from categorias;
UPDATE Cliente
SET Nombre = 'Mary',
    Apellido = 'Lopez',
    Direccion = 'Mercado',
    Telefono = '8856-2365',
    Correo = 'marylopez@gmail.com'
    WHERE Id_Cliente = 1;
    
SELECT * FROM Cliente;    
    
UPDATE Pedido
SET Fecha_Pedido = '2023-12-20',
    Direccion = 'PUMA',
    Estado_Pedido = 'Pendiente',
    Id_Cliente = 2
    WHERE Id_Pedido;
    
UPDATE Categorias
SET Nombre_Categoria = 'Pulsera'
    WHERE Id_Categoria = 6; 
    
    select * from Categorias;
    
UPDATE Producto 
SET Nombre_Producto = 'Pulsera de hilos',
    Descripcion = 'Pulsera con piedras y hilo rojo',
    Precio = '60',
    Id_Categoria = 6
    WHERE Id_Producto = 1;
    
UPDATE Detalle 
SET Cantidad = 5,
Id_Producto = 4,
Id_Pedido = 4
WHERE Id_Detalle = 2;    

DELETE FROM Cliente
WHERE Id_Cliente = 1;

SELECT * FROM Pedido;

DELETE FROM Pedido
WHERE Id_Pedido = 4 ;

DELETE FROM Categorias
WHERE Id_Categoria ;

DELETE FROM Producto
WHERE Id_Producto ;

DELETE FROM Detalle
WHERE Id_Detalle ;




/*Creacion de rol*/
CREATE ROLE 'admin';

/*Asignacion de permiso rol*/
GRANT ALL ON bd_juju.* TO 'admin';

/*Crear usuario*/
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';

/*Asigno rol a usuario creado*/
GRANT 'admin' TO 'admin'@'localhost';

/*Reviso de permisos de usuario*/
SHOW GRANTS FOR 'admin'@'localhost';
SHOW GRANTS FOR 'admin'@'localhost' USING 'admin';

SELECT CURRENT_ROLE();

SET DEFAULT ROLE ALL TO
'admin'@'localhost';

DELIMITER $$
CREATE DEFINER = CURRENT_USER
TRIGGER SalidaProductos
BEFORE INSERT ON Detalle
FOR EACH ROW
BEGIN
	DECLARE idP INT DEFAULT 0;
    DECLARE cant INT DEFAULT 0;
    SET idp=NEW.Id_Producto;
    SET cant=NEW.Cantidad;
    IF ((SELECT Existencia FROM Producto WHERE Producto.Id_Producto=idp) > cant) THEN
    
		UPDATE Producto SET Existencia=Existencia - cant
        WHERE Id_Producto=idp;
	ELSE
    SIGNAL SQLSTATE 'ERROR' SET MESSAGE_TEXT = 'Cantidad de producto no disponible';
    END IF;
END$$
DELIMITER ;




/*Trigger Insert*/

CREATE TRIGGER TinsertCliente
AFTER INSERT ON Cliente
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('INSERT', current_user(), NOW(), 'Cliente');


CREATE TRIGGER TinsertPedido
AFTER INSERT ON Pedido
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('INSERT', current_user(), NOW(), 'Pedido');

CREATE TRIGGER TinsertCategorias
AFTER INSERT ON Categorias
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('INSERT', current_user(), NOW(), 'Categorias');

CREATE TRIGGER TinsertProducto
AFTER INSERT ON Producto
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('INSERT', current_user(), NOW(), 'Producto');

CREATE TRIGGER TinsertDetalle
AFTER INSERT ON Detalle
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('INSERT', current_user(), NOW(), 'Detalle');

/*ACTUALIZAR*/

CREATE TRIGGER TupdateCliente
AFTER UPDATE ON Cliente
FOR EACH ROW
    INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
    VALUES('UPDATE', current_user(), NOW(), 'Cliente');
    
CREATE TRIGGER TupdatePedido
AFTER UPDATE ON Pedido
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('UPDATE', current_user(), NOW(), 'Pedido');    

CREATE TRIGGER TupdateCategorias
AFTER UPDATE ON Categorias
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('UPDATE', current_user(), NOW(), 'Categorias');

CREATE TRIGGER TupdateProducto
AFTER UPDATE ON Producto
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('UPDATE', current_user(), NOW(), 'Producto');

CREATE TRIGGER TupdateDetalle
AFTER UPDATE ON Detalle
FOR EACH ROW 
INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
VALUES('UPDATE', current_user(), NOW(), 'Detalle');

/*Eliminar*/

DELIMITER //
CREATE TRIGGER TdeleteCliente
AFTER DELETE ON cliente
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
  VALUES('DELETE', current_user(), NOW(), 'Cliente');
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER TdeletePedido
AFTER DELETE ON Pedido
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
  VALUES('DELETE', current_user(), NOW(), 'Pedido');
END;
//
DELIMITER ;

DELIMITER //

CREATE TRIGGER TdeleteCategorias
AFTER DELETE ON Categorias
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
  VALUES('DELETE', current_user(), NOW(), 'Categorias');
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER TdeleteProducto
AFTER DELETE ON Producto
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
  VALUES('DELETE', current_user(), NOW(), 'Producto');
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER TdeleteDetalle
AFTER DELETE ON Detalle
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(transaccion, usuario, fecha, tabla)
  VALUES('DELETE', current_user(), NOW(), 'Detalle');
END;
//
DELIMITER ;

SELECT * FROM bitacora;

/*PROCEDIMIENTOS ALMACENADOS*/

DELIMITER //

CREATE PROCEDURE InsertarCliente(
    IN Nombre varchar(20),
	IN Apellido varchar(20),
    IN Direccion varchar(50), 
    IN Telefono varchar(9), 
    IN Correo varchar(50)
    
)
BEGIN
     INSERT INTO Cliente (Nombre, Apellido, Direccion, Telefono, Correo)
     VALUES (Nombre, Apellido, Direccion, Telefono, Correo);
     
 END //
 
 DELIMITER ;
 
 DELIMITER //
 
 CREATE PROCEDURE InsertarPedido(
     IN Fecha_Pedido date, 
     IN Direccion varchar(100) ,
	 IN Estado_Pedido varchar(50), 
	 IN Id_Cliente int
     
 )
 BEGIN
      INSERT INTO Pedido (Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente)
      VALUES (Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente);
END //

DELIMITER ;      

DELIMITER //

CREATE PROCEDURE InsertarCategorias(
     IN Nombre_Categoria varchar(20)
     
)
BEGIN
     INSERT INTO Categorias (Nombre_Categoria)
     VALUES (Nombre_Categoria);
     
END //

DELIMITER ; 

DELIMITER //

CREATE PROCEDURE InsertarProducto(
     IN Nombre_Producto varchar(50) ,
	 IN Descripcion varchar(100), 
     IN Precio decimal(12,2), 
     IN Id_Categoria int
     
)
BEGIN
     INSERT INTO Producto (Nombre_Producto, Descripcion, Precio, Id_Categoria)
     VALUES (Nombre_Producto, Descripcion, Precio, Id_Categoria);
     
END //

DELIMITER ; 

DELIMITER // 

 CREATE PROCEDURE InsertarDetalle(
     IN Cantidad int ,
     IN Id_Producto int ,
     IN Id_Pedido int
	 
     
)
BEGIN
     INSERT INTO Detalle (Cantidad, Id_Producto, Id_Pedido)
     VALUES (Cantidad, Id_Producto, Id_Pedido);
     
END //

DELIMITER ; 

/*ACTUALIZAR*/

DELIMITER //

CREATE PROCEDURE ActualizarCliente(
    IN Nombre varchar(20),
	IN Apellido varchar(20),
    IN Direccion varchar(50), 
    IN Telefono varchar(9), 
    IN Correo varchar(50)
    
)
BEGIN
     UPDATE Cliente
    SET Nombre = Nombre,
    Apellido = Apellido,
    Direccion = Direccion,
    Telefono = Telefono,
    Correo = Correo
    WHERE Id_Cliente = Id_Cliente;
     
 END //
 
 DELIMITER ;  
 
 DELIMITER //
 
 CREATE PROCEDURE ActualizarPedido(
     IN Fecha_Pedido date, 
     IN Direccion varchar(100) ,
	 IN Estado_Pedido varchar(50), 
	 IN Id_Cliente int
     
 )
 BEGIN
      UPDATE Pedido
     SET Fecha_Pedido = Fecha_Pedido,
    Direccion = Direccion,
    Estado_Pedido = Estado_Pendiente,
    Id_Cliente = Id_Cliente
    WHERE Id_Pedido = Id_Pedido;
END //

DELIMITER ;  

DELIMITER //

CREATE PROCEDURE ActualizarCategorias(
     IN Nombre_Categoria varchar(20)
     
)
BEGIN
     UPDATE Categorias
    SET Nombre_Categoria = Nombre_Categoria
    WHERE Id_Categoria = Id_Categoria; 
     
END //

DELIMITER ; 

DELIMITER // 

CREATE PROCEDURE ActualizarProducto(
     IN Nombre_Producto varchar(50) ,
	 IN Descripcion varchar(100), 
     IN Precio decimal(12,2), 
     IN Id_Categoria int
     
)
BEGIN
     UPDATE Producto 
    SET Nombre_Producto = Nombre_Producto,
    Descripcion = Descripcion,
    Precio = Precio,
    Id_Categoria = Id_Categoria
    WHERE Id_Producto = Id_Producto;
END //

DELIMITER ; 

DELIMITER // 

 CREATE PROCEDURE ActualizarDetalle(
     IN Cantidad int ,
     IN Id_Producto int ,
     IN Id_Pedido int
	 
     
)
BEGIN
    UPDATE Detalle 
    SET Cantidad = Cantidad,
    Id_Producto = Id_Producto,
    Id_Pedido = Id_Pedido    
    WHERE Id_Detalle = Id_Detalle;    

     
END //

DELIMITER ; 

/*ELIMINAR*/

DELIMITER //

CREATE PROCEDURE EliminarCliente(IN Id_Cliente INT)
BEGIN
    DELETE FROM Cliente
    WHERE Id_Cliente = ClienteID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE EliminarPedidoPorId(IN Id_Pedido INT)
BEGIN
    DELETE FROM Pedido WHERE Id_Pedido = PedidoID;
END //

DELIMITER ;  

DELIMITER //

CREATE PROCEDURE EliminarCategoriaPorId(IN Id_Categoria INT)
BEGIN
    DELETE FROM Categorias WHERE Id_Categoria = CategoriaID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE EliminarProductoPorId(IN Id_Producto INT)
BEGIN
    DELETE FROM Producto WHERE Id_Producto = ProductoID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE EliminarDetallePorId(IN Id_Detalle INT)
BEGIN
    DELETE FROM Detalle WHERE Id_Detalle = DetalleID;
END //

DELIMITER ;








  


     
TinsertCategorias