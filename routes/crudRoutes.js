const express = require('express');
const router =  express.Router();

module.exports = (db) => {

  // Ruta para registrar un pedido con su detalle
router.post('/createPedido', (req, res) => {
  // Extraer datos de la solicitud
  const { Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente, detallesPedido } = req.body;

  // Realizar la inserción del pedido en la tabla Pedido
  const sqlPedido = 'INSERT INTO Pedido (Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente) VALUES (?, ?, ?, ?)';
  db.query(sqlPedido, [Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente], (err, result) => {
    if (err) {
      console.error('Error al insertar pedido:', err);
      return res.status(500).json({ error: 'Error al insertar pedido' });
    }

    const Id_Pedido = result.insertId; // Obtener el ID del pedido insertado

    // Iterar sobre el detalle del pedido y realizar inserciones en Detalle
    const sqlDetalle = 'INSERT INTO Detalle (Cantidad, Id_Producto, Id_Pedido) VALUES ?';
    const values = detallesPedido.map((item) => [item.Cantidad, item.Id_Producto, Id_Pedido]);
    db.query(sqlDetalle, [values], (err, result) => {
      if (err) {
        console.error('Error al insertar detalle del pedido:', err);
        return res.status(500).json({ error: 'Error al insertar detalle del pedido' });
      }

      // Devolver respuesta exitosa
      res.status(201).json({ message: 'Pedido y detalle del pedido agregados con éxito' });
    });
  });
});

  router.post('/login', (req, res) => {
    const { nombre_Usuario, contrasena } = req.body;
  
    if (!nombre_Usuario || !contrasena) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
    }
  
    // Realizar la consulta para verificar las credenciales en la base de datos
    const sql = `SELECT rol FROM Usuario WHERE nombre_Usuario = ? AND contrasena = ?`;
    db.query(sql, [nombre_Usuario, contrasena], (err, result) => {
      if (err) {
        console.error('Error al verificar credenciales:', err);
        return res.status(500).json({ error: 'Error al verificar credenciales' });
      }
  
      if (result.length === 1) {
        const { rol } = result[0];
        res.json({ rol }); // Devolver el rol si las credenciales son correctas
      } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    });
  });
  

    router.get('/readCategorias', (req, res) =>{

        const sql = 'SELECT * FROM Categorias';
        
        db.query(sql,(err, result) =>{
          
            if (err) {
                console.error('Error al leer registros:', err);
                res.status(500).json({ error: 'Error al leer registros'});
            }   else {
                res.status(200).json(result);
            }
        });
    });

    // Ruta para leer la tabla Categoria de la Base de Datos, empleando procedimientos almacenados

router.get('/readCategorias', (req, res) => {
  // Nombre del procedimiento almacenado
  const storedProcedure = 'sp_GetAllCategoria';

  // Llama al procedimiento almacenado
  db.query(`CALL ${storedProcedure}`, (err, result) => {
    if (err) {
      console.error(`Error al ejecutar el procedimiento almacenado ${storedProcedure}:`, err);
      res.status(500).json({ error: `Error al ejecutar el procedimiento almacenado ${storedProcedure}` });
    } else {
      // Devolver los registros en formato JSON como respuesta
      res.status(200).json(result[0]); // Los resultados están en el primer elemento del array result
    }
  });
});


    

    router.get('/readCliente', (req, res) =>{

      const sql = 'SELECT * FROM Cliente';
      
      db.query(sql,(err, result) =>{
          if (err) {
              console.error('Error al leer registros:', err);
              res.status(500).json({ error: 'Error al leer registros'});
          }   else {
              res.status(200).json(result);
          }
      });
  });

  router.get('/readPedido', (req, res) =>{

    const sql = 'SELECT * FROM Pedido';
    
    db.query(sql,(err, result) =>{
        if (err) {
            console.error('Error al leer registros:', err);
            res.status(500).json({ error: 'Error al leer registros'});
        }   else {
            res.status(200).json(result);
        }
    });
});

  router.get('/readProducto', (req, res) =>{

  const sql = 'SELECT * FROM Producto';
  
  db.query(sql,(err, result) =>{
      if (err) {
          console.error('Error al leer registros:', err);
          res.status(500).json({ error: 'Error al leer registros'});
      }   else {
          res.status(200).json(result);
      }
  });
});

  router.get('/readDetalle', (req, res) =>{

  const sql = 'SELECT * FROM Detalle';
  
  db.query(sql,(err, result) =>{
      if (err) {
          console.error('Error al leer registros:', err);
          res.status(500).json({ error: 'Error al leer registros'});
      }   else {
          res.status(200).json(result);
      }
  });
});

/*Insertar*/    

     // Ruta para verificar las credenciales y obtener el rol del usuario



    router.post('/createCategorias', (req, res) => {
      // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
      const { Nombre_Categoria } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre_Categoria ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para insertar un nuevo registro con ID específico
      const sql = `INSERT INTO Categorias (Nombre_Categoria) VALUES (?)`;
      const values = [Nombre_Categoria];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al insertar registro:', err);
          res.status(500).json({ error: 'Error al insertar registro' });
        } else {
          // Devuelve el ID del nuevo registro como respuesta
          res.status(201).json({ message: 'Categoria agregada con exito'});
        }
      });
    });

    // Ruta para insertar registros en la tabla Categoria de la Base de Datos, empleando procedimientos almacenados

router.post('/createCategorias', (req, res) => {
  // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
  const { Nombre_Categoria } = req.body;

  // Verifica si se proporcionaron los datos necesarios
  if (!Nombre_Categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Nombre del procedimiento almacenado
  const storedProcedure = 'sp_InsertCategorias';

  // Llama al procedimiento almacenado
  db.query(
    `CALL ${storedProcedure}(?)`,
    [Nombre_Categoria],
    (err, result) => {
      if (err) {
        console.error(`Error al ejecutar el procedimiento almacenado ${storedProcedure}:`, err);
        res.status(500).json({ error: `Error al ejecutar el procedimiento almacenado ${storedProcedure}` });
      } else {
        // Devuelve un mensaje como respuesta
        res.status(200).json({ message: 'Registro agregado exitosamente' });
      }
    }
  );
});

    router.post('/createCliente', (req, res) => {
      // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
      const { Nombre, Apellido, Direccion, Telefono, Correo } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre || !Apellido || !Direccion || !Telefono || !Correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para insertar un nuevo registro con ID específico
      const sql = `INSERT INTO Cliente (Nombre, Apellido, Direccion, Telefono, Correo) VALUES (?, ?, ?, ?, ?)`;
      const values = [Nombre, Apellido, Direccion, Telefono, Correo];

  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al insertar registro:', err);
          res.status(500).json({ error: 'Error al insertar registro' });
        } else {
          // Devuelve el ID del nuevo registro como respuesta
          res.status(201).json({ message: 'Cliente agregado con exito'});
        }
      });
    });

    router.post('/createPedido', (req, res) => {
      // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
      const { Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente} = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Fecha_Pedido || !Direccion || !Estado_Pedido || !Id_Cliente ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para insertar un nuevo registro con ID específico
      const sql = `INSERT INTO Pedido (Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente) VALUES (?, ?, ?, ?)`;
      const values = [Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al insertar registro:', err);
          res.status(500).json({ error: 'Error al insertar registro' });
        } else {
          // Devuelve el ID del nuevo registro como respuesta
          res.status(201).json({ message: 'Pedido agregado con exito'});
        }
      });
    });

    router.post('/createProducto', (req, res) => {
      // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
      const { Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria, imagen} = req.body;
      
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre_Producto || !Descripcion || !Precio  || !Existencia || !Id_Categoria || !imagen) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para insertar un nuevo registro con ID específico
      const sql = `INSERT INTO Producto (Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria, imagen];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al insertar registro:', err);
          res.status(500).json({ error: 'Error al insertar registro' });
        } else {
          // Devuelve el ID del nuevo registro como respuesta
          res.status(201).json({ message: 'Producto agregado con exito'});
        }
      });
    });

    router.post('/createDetalle', (req, res) => {
      // Recibe los datos del nuevo registro desde el cuerpo de la solicitud (req.body)
      const { Cantidad, Id_Producto, Id_Pedido } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Cantidad || !Id_Producto || !Id_Pedido ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para insertar un nuevo registro con ID específico
      const sql = `INSERT INTO Detalle (Cantidad, Id_Producto, Id_Pedido  ) VALUES (?,?,?)`;
      const values = [Cantidad];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al insertar registro:', err);
          res.status(500).json({ error: 'Error al insertar registro' });
        } else {
          // Devuelve el ID del nuevo registro como respuesta
          res.status(201).json({ message: 'Detalle agregado con exito' });
        }
      });
    });


  /*Actualizar*/

    router.put('/updateCategorias/:id', (req, res) => {
      // Obtén el ID del registro a actualizar desde los parámetros de la URL
      const id = req.params.id;
  
      // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
      const { Nombre_Categoria } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre_Categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para actualizar el registro por ID
      const sql = `
        UPDATE Categorias
        SET Nombre_Categoria = ?
        WHERE Id_Categoria = ?
      `;
  
      const values = [Nombre_Categoria, id];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el registro:', err);
          res.status(500).json({ error: 'Error al actualizar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro actualizado con éxito' });
        }
      });
    });

    // Ruta para actualizar registros en la tabla Categoria de la Base de Datos, empleando procedimientos almacenados

router.put('/updateCategorias/:Id_Categoria', (req, res) => {
  // Obtén el ID del registro a actualizar desde los parámetros de la URL
  const Id_Categoria = req.params.Id_Categoria;

  // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
  const { Nombre_Categoria } = req.body;

  // Verifica si se proporcionaron los datos necesarios
  if (!Nombre_Categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Nombre del procedimiento almacenado
  const storedProcedure = 'sp_UpdateCategorias';

  // Llama al procedimiento almacenado
  db.query(
    `CALL ${storedProcedure}(?, ?)`,
    [Id_Categoria, Nombre_Categoria],
    (err, result) => {
      if (err) {
        console.error(`Error al ejecutar el procedimiento almacenado ${storedProcedure}:`, err);
        res.status(500).json({ error: `Error al ejecutar el procedimiento almacenado ${storedProcedure}` });
      } else {
        // Devuelve un mensaje de éxito
        res.status(200).json({ message: 'Registro actualizado exitosamente' });
      }
    }
  );
});

    router.put('/updateCliente/:id', (req, res) => {
      // Obtén el ID del registro a actualizar desde los parámetros de la URL
      const id = req.params.id;
  
      // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
      const { Nombre, Apellido, Direccion, Telefono, Correo } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre || !Apellido || !Direccion || !Telefono || !Correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para actualizar el registro por ID
      const sql = `
        UPDATE Cliente
        SET Nombre = ?, Apellido = ?, Direccion = ?, Telefono = ?, Correo = ?
        WHERE Id_Cliente = ?
      `;
  
      const values = [Nombre, Apellido, Direccion, Telefono, Correo, id];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el registro:', err);
          res.status(500).json({ error: 'Error al actualizar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro actualizado con éxito' });
        }
      });
    });

    router.put('/updatePedido/:id', (req, res) => {
      // Obtén el ID del registro a actualizar desde los parámetros de la URL
      const id = req.params.id;
  
      // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
      const { Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Fecha_Pedido || !Direccion || !Estado_Pedido || !Id_Cliente ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para actualizar el registro por ID
      const sql = `
        UPDATE Pedido
        SET Fecha_Pedido = ?, Direccion = ?, Estado_Pedido = ?, Id_Cliente = ?
        WHERE Id_Pedido = ?
      `;
  
      const values = [Fecha_Pedido, Direccion, Estado_Pedido, Id_Cliente, id];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el registro:', err);
          res.status(500).json({ error: 'Error al actualizar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro actualizado con éxito' });
        }
      });
    });

    router.put('/updateProducto/:id', (req, res) => {
      // Obtén el ID del registro a actualizar desde los parámetros de la URL
      const id = req.params.id;
  
      // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
      const { Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria, imagen} = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Nombre_Producto || !Descripcion || !Precio || !Existencia || !Id_Categoria || !imagen) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para actualizar el registro por ID
      const sql = `
        UPDATE Producto
        SET Nombre_Producto = ?, Descripcion = ?, Precio = ?, Existencia = ?, Id_Categoria = ? , imagen = ?
        WHERE Id_Producto = ?
      `;
  
      const values = [Nombre_Producto, Descripcion, Precio, Existencia, Id_Categoria, imagen, id];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el registro:', err);
          res.status(500).json({ error: 'Error al actualizar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro actualizado con éxito' });
        }
      });
    });
    
    router.put('/updateDetalle/:id', (req, res) => {
      // Obtén el ID del registro a actualizar desde los parámetros de la URL
      const id = req.params.id;
  
      // Recibe los datos actualizados desde el cuerpo de la solicitud (req.body)
      const { Cantidad, Id_Producto, Id_Pedido } = req.body;
  
      // Verifica si se proporcionaron los datos necesarios
      if (!Cantidad) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Realiza la consulta SQL para actualizar el registro por ID
      const sql = `
        UPDATE Detalle
        SET Cantidad = ?, Id_Producto = ?, Id_Pedido = ?
        WHERE Id_Detalle = ?
      `;
  
      const values = [Cantidad, Id_Producto, Id_Pedido, id];
  
      // Ejecuta la consulta
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el registro:', err);
          res.status(500).json({ error: 'Error al actualizar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro actualizado con éxito' });
        }
      });
    });

    /*Eliminar*/

    router.delete('/deleteCategorias/:id', (req, res) => {
      // Obtén el ID del registro a eliminar desde los parámetros de la URL
      const id = req.params.id;
  
      // Realiza la consulta SQL para eliminar el registro por ID
      const sql = 'DELETE FROM Categorias WHERE Id_Categoria = ?';
  
      // Ejecuta la consulta
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el registro:', err);
          res.status(500).json({ error: 'Error al eliminar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro eliminado con éxito' });
        }
      });
    });

    // Ruta para eliminar registros en la tabla Categoria de la Base de Datos, empleando procedimientos almacenados

router.delete('/deleteCategorias/:Id_Categoria', (req, res) => {
  // Obtén el ID del registro a eliminar desde los parámetros de la URL
  const Id_Categoria = req.params.Id_Categoria;

  // Nombre del procedimiento almacenado
  const storedProcedure = 'sp_DeleteCategorias';

  // Llama al procedimiento almacenado
  db.query(`CALL ${storedProcedure}(?)`, [Id_Categoria], (err, result) => {
    if (err) {
      console.error(`Error al ejecutar el procedimiento almacenado ${storedProcedure}:`, err);
      res.status(500).json({ error: `Error al ejecutar el procedimiento almacenado ${storedProcedure}` });
    } else {
      // Devuelve un mensaje de éxito
      res.status(200).json({ message: 'Registro eliminado exitosamente' });
    }
  });
});


    router.delete('/deleteCliente/:id', (req, res) => {
      // Obtén el ID del registro a eliminar desde los parámetros de la URL
      const id = req.params.id;
  
      // Realiza la consulta SQL para eliminar el registro por ID
      const sql = 'DELETE FROM Cliente WHERE Id_Cliente = ?';
  
      // Ejecuta la consulta
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el registro:', err);
          res.status(500).json({ error: 'Error al eliminar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro eliminado con éxito' });
        }
      });
    });

    router.delete('/deletePedido/:id', (req, res) => {
      // Obtén el ID del registro a eliminar desde los parámetros de la URL
      const id = req.params.id;
  
      // Realiza la consulta SQL para eliminar el registro por ID
      const sql = 'DELETE FROM Pedido WHERE Id_Pedido = ?';
  
      // Ejecuta la consulta
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el registro:', err);
          res.status(500).json({ error: 'Error al eliminar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro eliminado con éxito' });
        }
      });
    });

    router.delete('/deleteProducto/:id', (req, res) => {
      // Obtén el ID del registro a eliminar desde los parámetros de la URL
      const id = req.params.id;
  
      // Realiza la consulta SQL para eliminar el registro por ID
      const sql = 'DELETE FROM Producto WHERE Id_Producto = ?';
  
      // Ejecuta la consulta
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el registro:', err);
          res.status(500).json({ error: 'Error al eliminar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro eliminado con éxito' });
        }
      });
    });

    router.delete('/deleteDetalle/:id', (req, res) => {
      // Obtén el ID del registro a eliminar desde los parámetros de la URL
      const id = req.params.id;
  
      // Realiza la consulta SQL para eliminar el registro por ID
      const sql = 'DELETE FROM Detalle WHERE Id_Detalle = ?';
  
      // Ejecuta la consulta
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el registro:', err);
          res.status(500).json({ error: 'Error al eliminar el registro' });
        } else {
          // Devuelve un mensaje de éxito
          res.status(200).json({ message: 'Registro eliminado con éxito' });
        }
      });
    });

   
    return router;
};


