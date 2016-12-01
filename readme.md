#Los solteros no cocinamos

Aplicacion para ordernar comida del restaurant "Los solteros no cocinamos"

##Api
Metodos aceptados por el servidor

|Peticiones	|Respuesta  |Significado|
|-----------|-----------|-----------|	
|GET		|200		|Ok			|
|POST		|201		|Creado		|
|PUT		|200		|Modificado |
|DELETE		|200		|Eliminado	|	

Las entidades que se pueden solicitar son los siguientes.
###Producto
***Metodo:*** GET  
***Ruta:*** /api/producto  
***Respuesta:*** La estructura de la respuesta,es un objeto donde productos es un arreglo de objetos que contiene todos los productos de la base de datos.  
```javascript
{
  "productos": [
    {
      "id_producto": 1,
      "nombre_producto": "Producto 3",
      "descripcion": "descripcion producto 3",
      "precio": "20",
      "categorias": [
        "comida"
      ],
      "imagenes": [
        "public\\images\\productos\\producto-1480557512058",
        "public\\images\\productos\\producto-1480557512264",
        "public\\images\\productos\\producto-1480557512353"
      ]
    },
    {
      "id_producto": 2,
      "nombre_producto": "Producto 3",
      "descripcion": "descripcion producto 3",
      "precio": "20",
      "categorias": [
        "comida"
      ],
      "imagenes": [
        "public\\images\\productos\\producto-1480557517047",
        "public\\images\\productos\\producto-1480557517068",
        "public\\images\\productos\\producto-1480557517092"
      ]
    }]
}
```
***Metodo:*** GET  
***Ruta:*** /api/producto/top  
***Respuesta:*** Se regresa un objeto con la propiedad productos, la cual es un arreglo de los 5 productos mas vendidos ordenados del mas vendido al menos vendido, donde cada elemento contiene el id del producto y las veces que se ha vendido.  

```javascript
{
  "productos": [
    {
      "cantidad": 5,
      "id_producto": 1
    },
    {
      "cantidad": 5,
      "id_producto": 3
    },
    {
      "cantidad": 4,
      "id_producto": 2
    },
    {
      "cantidad": 0,
      "id_producto": 4
    }
  ]
}
```
***Metodo:*** GET  
***Ruta:*** /api/producto/:id  
***Respuesta:*** Se obtiene un objeto producto que contiene toda la informacion del objeto cuyo id se indica en el parametro id.

```javascript
{
  "producto": {
    "id_producto": 1,
    "nombre_producto": "Producto 3",
    "descripcion": "descripcion producto 3",
    "precio": "20",
    "categorias": [
      "comida"
    ],
    "imagenes": [
      "public\\images\\productos\\producto-1480557512058",
      "public\\images\\productos\\producto-1480557512264",
      "public\\images\\productos\\producto-1480557512353"
    ]
  }
}
```
**NOTA** Sera necesario conectarse como administrador para poder crear, actualizar y eliminar productos.   


***Metodo:*** POST    
***Ruta:*** /api/producto    
***Peticion:*** En el cuerpo de la peticion debe incluirse un objeto "producto", cuya estructura debe ser como la que se muestra a continuacion, tambien se pueden enviar como maximo 5 imagenes que describan el producto, todos con el mismo nombre de campo "imagenes" y un tamaño maximo de las imagenes de 50mb.  
```js
{
	producto:{
		nombre_producto: "producto numero 1",
    	descripcion: "Descripcion del producto",
    	precio: 20.00,
    	categorias: ["categoria 1","categoria 2","categoria n"]
	}
}
```
***Respuesta:*** La respuesta consistira en un objeto producto que contiene toda la informacion de la entidad creada, incluyendo un identificador y un arreglo con las rutas de las imagenes.  

```js
{
	producto{
		"id_producto":1,
		"nombre_producto":"producto numero 1",
		"descripcion":"Descripcion producto",
		"precio":"20.00",
		"categorias":["categoria 1","categoria 2","categoria n"],
		"imagenes":["public\\images\\productos\\producto-1480566034989",
					"public\\images\\productos\\producto-1480566035081",
					"public\\images\\productos\\producto-1480566035510"]
			}
}	
```

***Metodo:*** PUT  
***Ruta:*** /api/producto/:id  
***Peticion:*** La peticion debe tener un objeto "producto" con los campos que se desean actualizar, tambien podra contener un campo imagenes con un maximo de 5 imagenes que describan al producto y un peso maximo de 50mb en total.  
***Respuesta:*** Se obtiene como respuesta el producto actualizado con la misma estructura que con una peticion POST.

***Metodo:*** DELETE  
***Ruta:*** /api/producto/:id  
***Respuesta:*** Se obtiene el codigo 200 si la eliminacion del objeto con id igual al parametro id se ha eliminado, 404 si no existe y 500 si existe algun error en el servidor.

###Usuario
Para poder realizar una peticion sobre los usuarios se necesitan privilegios de administrador y estar logeados en el sistema. 

***Metodo:***GET  
***Ruta:***/api/usuario/:id  
***Respuesta:*** Se obtiene el usuario cuyo id se indica en el paramtro id, exceptuando la contraseña del usuario
```js
{
  "usuario": {
    "id_usuario": 1,
    "username": "usuario1",
    "password": null,
    "avatar": "public/images/avatar/default.jpg",
    "tipo": "admin"
  }
}
```

***Metodo:*** POST  
***Ruta:***/api/usuario  
***Peticion:*** El cuerpo de la peticion debe contener un objeto usuario, indicando el nombre de usuario que debe ser unico, la contraseña (encriptada), el tipo de usuario (admin o cliente), y contener ademas un campo para subir un avatar para el usuario. En caso de no subir el archivo se asignara uno por defecto.  
```js
{"usuario":{
  "username": "usuario2",
  "password": "password",
  "tipo":"cliente"
}
}
```
***Respuesta:*** Se obtiene el objeto usuario con el nombre de usuario, id y tipo de usuario.
```js
{
  "usuario": {
    "username": "usuario2",
    "avatar": "public/images/avatar/default.jpg",
    "id_usuario": 3,
    "tipo": "cliente"
  }
}
```

***Metodo:*** PUT  
***Ruta:***/api/usuario/:id  
***Peticion:*** El cuerpo de la peticion debe contener el campo password (encriptado) que sera el unico que se puede modificar.
```js
{  
  "password": "password"
}
```
***Respuesta:*** Se obtiene el objeto usuario con el nombre de usuario, id y tipo de usuario.
```js
{
  "usuario": {
    "username": "usuario1",
    "avatar": "public/images/avatar/default.jpg",
    "id_usuario": 1,
    "tipo": "cliente"
  }
}
```
***Metodo:*** DELETE  
***Ruta:***/api/usuario/:id  
***Respuesta:*** Se obtiene una respuesta 200 si la eliminacion fue correcta.

###Cliente

***Metodo:***GET  
***Ruta:***/api/cliente/  
***Respuesta:*** Se obtiene una lista de todos los clientes que estan registrados en la base de datos
```js
{
  "clientes": [
    {
      "id_cliente": 1,
      "nombre": "Cliente nuevo 1",
      "direccion": "direccion del cliente nuevo 1",
      "telefono": "9512346712",
      "num_tarjeta": "101812671917",
      "correo": "correo2@mail.com",
      "id_usuario": 2
    },
    {
      "id_cliente": 2,
      "nombre": "Cliente nuevo 2",
      "direccion": "direccion del cliente nuevo 2",
      "telefono": "9512346712",
      "num_tarjeta": "101812671917",
      "correo": "correo2@mail.com",
      "id_usuario": 2
    },
    {
      "id_cliente": 3,
      "nombre": "Cliente nuevo 3",
      "direccion": "direccion del cliente nuevo 3",
      "telefono": "9512346712",
      "num_tarjeta": "101812671917",
      "correo": "correo2@mail.com",
      "id_usuario": 2
    }
  ]
}
```
***Metodo:*** GET  
***Ruta:*** /api/cliente/:id  
***Respuesta:*** Se obtiene la informacion del cliente cuyo id se indica en el parametro.

```js
{
  "cliente": {
    "id_cliente": 4,
    "id_usuario": 2,
    "nombre": "Cliente nuevo 1",
    "direccion": "direccion del cliente nuevo 1",
    "telefono": "9512346712",
    "num_tarjeta": "101812671917",
    "correo": "correo2@mail.com"
  }
}
```
***Metodo:*** GET
***Ruta:*** /api/cliente/:id/ventas  
***Respuesta:*** Se obtienen las ventas que corresponden al usuario que se indica en el parametro.
```js
{
  "cliente": {
    "id_cliente": 1,
    "nombre": "Cliente nuevo 1",
    "direccion": "direccion del cliente nuevo 1",
    "telefono": "9512346712",
    "num_tarjeta": "101812671917",
    "correo": "correo2@mail.com",
    "id_usuario": 2
  },
  "ventas": [
    {
      "id_venta": 2,
      "timestamp": "2016-12-01T02:05:14.000Z",
      "total": "100",
      "id_cliente": 1
    },
    {
      "id_venta": 3,
      "timestamp": "2016-12-01T02:06:15.000Z",
      "total": "100",
      "id_cliente": 1
    }
  ]
}
```

***Metodo:*** POST  
***Ruta:***/api/cliente  
***Peticion:*** El cuerpo de la peticion debe contener un objeto cliente, con la estructura que se muestra a continuacion, sera necesario primero ser usuario de la aplicacion (contar con un id_usuario) para poder registrarse como cliente.
```js
{"cliente":{
  "id_usuario":2,
  "nombre": "Cliente nuevo 1",
  "direccion": "direccion del cliente nuevo 1",
  "telefono":"9512346712",
  "num_tarjeta": "101812671917",
  "correo":"correo2@mail.com"
}
}
```
***Respuesta:*** Se obtiene el objeto cliente.
```js
{
  "cliente": {
    "id_cliente": 4,
    "id_usuario": 2,
    "nombre": "Cliente nuevo 1",
    "direccion": "direccion del cliente nuevo 1",
    "telefono": "9512346712",
    "num_tarjeta": "101812671917",
    "correo": "correo2@mail.com"
  }
}
```

***Metodo:*** PUT  
***Ruta:***/api/cliente/:id  
***Peticion:*** El cuerpo de la peticion debe contener el objeto cliente con los campos que se requiere actualizar.
```js
{"cliente":{
  "id_usuario":2,
  "nombre": "Nuevo nombre"
}
}
```
***Respuesta:*** Se obtiene el objeto cliente con la informacion del cliente actualizada.
```js
{
  "cliente": {
    "id_cliente": 4,
    "id_usuario": 2,
    "nombre": "Nuevo nombre",
    "direccion": "direccion del cliente nuevo 1",
    "telefono": "9512346712",
    "num_tarjeta": "101812671917",
    "correo": "correo2@mail.com"
  }
}
```
***Metodo:*** DELETE  
***Ruta:***/api/cliente/:id  
***Respuesta:*** Se obtiene una respuesta 200 si la eliminacion fue correcta.

###Promociones
**NOTA** Sera necesario conectarse como administrador para poder crear, actualizar y eliminar promociones.  

***Metodo:*** GET  
***Ruta:*** /api/promocion  
***Respuesta:*** La estructura de la respuesta,es un objeto donde promociones es un arreglo de objetos que contiene todos las promociones y los productos que aplican a dicha promocion ubicados dentro de la base de datos.  
```javascript
{
  "promociones": [
    {
      "id_promocion": 1,
      "descripcion": "todos los productos a 20 pesos",
      "tipo": "descuento",
      "vigencia": null,
      "Productos": [
        {
          "id_producto": 1,
          "nombre_producto": "producto nuevo actualizado",
          "descripcion": "descripcion producto 3",
          "precio": "20",
          "categorias": [
            "comida"
          ],
          "imagenes": [
            "public\\images\\productos\\producto-1480557512058",
            "public\\images\\productos\\producto-1480557512264",
            "public\\images\\productos\\producto-1480557512353"
          ],
          "ProductoPromocion": {
            "nuevoPrecio": "30",
            "ProductoIdProducto": 1,
            "PromocionIdPromocion": 1
          }
        }
      ]
    },
    {
      "id_promocion": 2,
      "descripcion": "todos los productos a 20 pesos",
      "tipo": "descuento",
      "vigencia": null,
      "Productos": [
        {
          "id_producto": 1,
          "nombre_producto": "producto nuevo actualizado",
          "descripcion": "descripcion producto 3",
          "precio": "20",
          "categorias": [
            "comida"
          ],
          "imagenes": [
            "public\\images\\productos\\producto-1480557512058",
            "public\\images\\productos\\producto-1480557512264",
            "public\\images\\productos\\producto-1480557512353"
          ],
          "ProductoPromocion": {
            "nuevoPrecio": "30",
            "ProductoIdProducto": 1,
            "PromocionIdPromocion": 2
          }
        }
      ]
    }]
}
```

***Metodo:*** GET  
***Ruta:*** /api/promocion/:id  
***Respuesta:*** Se obtiene un objeto promocion que contiene toda la informacion del objeto cuyo id se indica en el parametro id y los productos relacionados a la promocion.  

```javascript
{
  "promocion": {
    "id_promocion": 1,
    "descripcion": "todos los productos a 20 pesos",
    "tipo": "descuento",
    "vigencia": null
  },
  "productos": [
    {
      "id_producto": 1,
      "nombre_producto": "producto nuevo actualizado",
      "descripcion": "descripcion producto 3",
      "precio": "20",
      "categorias": [
        "comida"
      ],
      "imagenes": [
        "public\\images\\productos\\producto-1480557512058",
        "public\\images\\productos\\producto-1480557512264",
        "public\\images\\productos\\producto-1480557512353"
      ],
      "ProductoPromocion": {
        "nuevoPrecio": "30",
        "ProductoIdProducto": 1,
        "PromocionIdPromocion": 1
      }
    }
  ]
}
```

***Metodo:*** POST    
***Ruta:*** /api/promocion  
***Peticion:*** En el cuerpo de la peticion debe incluirse un objeto "promocion", cuya estructura debe ser como la que se muestra a continuacion.

```js
{"productos":["2"],
"promocion":{"tipo":"descuento",
			"descripcion":"todos los productos a 20 pesos",
			"nuevoPrecio":"30",
			"vigencia":"01/12/2016"}
}
```
***Respuesta:*** La respuesta consistira en un objeto promocion que contiene toda la informacion de la entidad creada, incluyendo un identificador. 

```js
{
  "promocion": {
    "id_promocion": 8,
    "descripcion": "todos los productos a 30 pesos",
    "tipo": "descuento",
    "vigencia": "2016-01-12T06:00:00.000Z"
  },
  "productos": [
    {
      "id_producto": 2,
      "nombre_producto": "Producto 3",
      "descripcion": "descripcion producto 3",
      "precio": "20",
      "categorias": [
        "comida"
      ],
      "imagenes": [
        "public\\images\\productos\\producto-1480557517047",
        "public\\images\\productos\\producto-1480557517068",
        "public\\images\\productos\\producto-1480557517092"
      ],
      "ProductoPromocion": {
        "nuevoPrecio": "30",
        "ProductoIdProducto": 2,
        "PromocionIdPromocion": 8
      }
    }
  ]
}
```

***Metodo:*** PUT  
***Ruta:*** /api/promocion/:id  
***Peticion:*** La peticion debe tener un objeto "promocion" con los campos que se desean actualizar.  
***Respuesta:*** Se obtiene como respuesta el producto actualizado con la misma estructura que con una peticion POST.

***Metodo:*** DELETE  
***Ruta:*** /api/promocion/:id  
***Respuesta:*** Se obtiene el codigo 200 si la eliminacion del objeto con id igual al parametro id se ha eliminado, 404 si no existe y 500 si existe algun error en el servidor.

###Ventas

***Metodo:*** GET  
***Ruta:*** /api/venta  
***Respuesta:*** La estructura de la respuesta,es un objeto donde promociones es un arreglo de objetos que contiene todos las ventas  dentro de la base de datos.  
```javascript
{
  "ventas": [
    {
      "id_venta": 2,
      "timestamp": "2016-12-01T02:05:14.000Z",
      "total": "100",
      "id_cliente": 1
    },
    {
      "id_venta": 3,
      "timestamp": "2016-12-01T02:06:15.000Z",
      "total": "100",
      "id_cliente": 1
    },
    {
      "id_venta": 4,
      "timestamp": "2016-12-01T03:30:18.000Z",
      "total": "100",
      "id_cliente": 2
    }
  ]
}
```

***Metodo:*** GET  
***Ruta:*** /api/venta/:id  
***Respuesta:*** Se obtiene un objeto venta que contiene toda la informacion del objeto cuyo id se indica en el parametro id y los productos incluidos en  la venta.  

```javascript
{
  "venta": {
    "id_venta": 2,
    "timestamp": "2016-12-01T02:05:14.000Z",
    "total": "100",
    "id_cliente": 1
  },
  "productos": [
    {
      "id_producto": 2,
      "nombre_producto": "Producto 3",
      "descripcion": "descripcion producto 3",
      "precio": "20",
      "categorias": [
        "comida"
      ],
      "imagenes": [
        "public\\images\\productos\\producto-1480557517047",
        "public\\images\\productos\\producto-1480557517068",
        "public\\images\\productos\\producto-1480557517092"
      ],
      "DetalleVenta": {
        "cantidad": 2,
        "subtotal": "40",
        "VentumIdVenta": 2,
        "ProductoIdProducto": 2
      }
    }
  ]
}
```

***Metodo:*** POST    
***Ruta:*** /api/venta  
***Peticion:*** En el cuerpo de la peticion debe incluirse un objeto "venta" y un arreglo de los productos que se vendieron asi como la cantidad de dichos productos y el subtotal, cuya estructura debe ser como la que se muestra a continuacion.

```js
{"productos":[{
  "id_producto": "2",
	"cantidad":2,
	"subtotal":40
},
  {"id_producto":"3",
  "cantidad":3,
	"subtotal":60
}],
"venta":{"total":"100","id_cliente":"1"}
}
```
***Respuesta:*** La respuesta consistira en un objeto venta que contiene toda la informacion de la entidad creada, incluyendo un identificador. 

```js
{
  "venta": {
    "timestamp": "2016-12-01T05:40:10.000Z",
    "id_venta": 5,
    "total": "100",
    "id_cliente": 1
  }
}
```

***Metodo:*** DELETE  
***Ruta:*** /api/venta/:id  
***Respuesta:*** Se obtiene el codigo 200 si la eliminacion del objeto con id igual al parametro id se ha eliminado, 404 si no existe y 500 si existe algun error en el servidor.

