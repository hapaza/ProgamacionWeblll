-- ============================================
-- IGNISTER - BASE DE DATOS COMPLETA
-- 27 TABLAS - PostgreSQL 15+
-- ============================================

CREATE DATABASE proyectoweb;


-- ============================================
-- TABLAS MAESTRAS
-- ============================================

-- Tabla 1: Cuenta
CREATE TABLE Cuenta (
    CodCuenta SERIAL PRIMARY KEY,
    Nombre VARCHAR(60) NOT NULL,
    Apellido VARCHAR(80) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Origen VARCHAR(50) NOT NULL,
    Tipo VARCHAR(40) DEFAULT 'cliente',
    CorreoElectronico VARCHAR(80) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    esta_activo BOOLEAN DEFAULT TRUE,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL
);

-- Tabla 2: Cliente
CREATE TABLE Cliente (
    NroCliente SERIAL PRIMARY KEY,
    FechaIngreso DATE DEFAULT CURRENT_DATE,
    CodCuenta INT UNIQUE REFERENCES Cuenta(CodCuenta) ON DELETE CASCADE
);

-- Tabla 3: Producto
CREATE TABLE Producto (
    IdProducto SERIAL PRIMARY KEY,
    marca VARCHAR(40) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Popularidad DECIMAL(10,2) DEFAULT 0,
    UrlImagen TEXT,
    descripcion_corta VARCHAR(255),
    stock_total INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 4: Especificacion
CREATE TABLE Especificacion (
    CodEspecificacion SERIAL PRIMARY KEY,
    Origen VARCHAR(40),
    Precio DECIMAL(12,2) NOT NULL,
    CantidadDisponible INT DEFAULT 0,
    Peso DECIMAL(10,2),
    Dimension DECIMAL(10,2),
    Color VARCHAR(20),
    IdProducto INT REFERENCES Producto(IdProducto) ON DELETE CASCADE
);

-- Tabla 5: Almacen
CREATE TABLE Almacen (
    CodAlmacen SERIAL PRIMARY KEY,
    Ubicacion VARCHAR(60),
    CantidadPaquetes INT DEFAULT 0,
    NombreEncargado VARCHAR(40),
    UltimaActualizacion DATE,
    IdProducto INT REFERENCES Producto(IdProducto)
);

-- Tabla 6: SolicitudPedido
CREATE TABLE SolicitudPedido (
    CodigoPedido SERIAL PRIMARY KEY,
    DescripcionRequerimiento TEXT NOT NULL,
    Estado VARCHAR(20) DEFAULT 'pendiente',
    PrecioCotizado DECIMAL(12,2),
    FechaLlegadaEstimada DATE,
    FechaSolicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaEntregaReal DATE,
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    CodEmpleado INT REFERENCES Cuenta(CodCuenta)
);

-- Tabla 7: mensaje
CREATE TABLE mensaje (
    CodMensaje SERIAL PRIMARY KEY,
    Tipo VARCHAR(80),
    Descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodCuenta INT REFERENCES Cuenta(CodCuenta)
);

-- Tabla 8: informe_reporte
CREATE TABLE informe_reporte (
    CodReporte SERIAL PRIMARY KEY,
    tipo VARCHAR(30),
    Descripcion TEXT,
    penalizacion VARCHAR(30),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodCuenta INT REFERENCES Cuenta(CodCuenta)
);

-- Tabla 9: Informe_gral
CREATE TABLE Informe_gral (
    IdInforme SERIAL PRIMARY KEY,
    Tipo VARCHAR(30),
    Descripcion VARCHAR(100),
    FechaAtencion DATE,
    Conclusion VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 10: Empleado
CREATE TABLE Empleado (
    CodEmpleado SERIAL PRIMARY KEY,
    Nombre VARCHAR(50),
    Cargo VARCHAR(30),
    CodCuenta INT UNIQUE REFERENCES Cuenta(CodCuenta),
    fecha_contratacion DATE DEFAULT CURRENT_DATE
);

-- Tabla 11: Factura
CREATE TABLE Factura (
    CodFactura SERIAL PRIMARY KEY,
    Detalle TEXT,
    Descuento DECIMAL(10,2) DEFAULT 0,
    MetodoPago VARCHAR(20),
    Total DECIMAL(12,2),
    impresa BOOLEAN DEFAULT FALSE,
    fecha_impresion TIMESTAMP,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodCuenta INT REFERENCES Cuenta(CodCuenta)
);

-- Tabla 12: Categoria
CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100)
);

-- Tabla 13: HistorialPrecioProducto
CREATE TABLE HistorialPrecioProducto (
    id_historial SERIAL PRIMARY KEY,
    IdProducto INT REFERENCES Producto(IdProducto),
    Precio DECIMAL(12,2) NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 14: LogSoloLectura
CREATE TABLE LogSoloLectura (
    id_log SERIAL PRIMARY KEY,
    fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuario INET,
    navegador TEXT,
    url_accedida VARCHAR(255)
);

-- ============================================
-- TABLAS DE RELACIÓN
-- ============================================

-- Tabla 15: tener_cuenta_cliente
CREATE TABLE tener_cuenta_cliente (
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NroCliente INT REFERENCES Cliente(NroCliente),
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    PRIMARY KEY (NroCliente, CodCuenta)
);

-- Tabla 16: tener_cuenta_reporte
CREATE TABLE tener_cuenta_reporte (
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    CodReporte INT REFERENCES informe_reporte(CodReporte),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CodCuenta, CodReporte)
);

-- Tabla 17: comprar
CREATE TABLE comprar (
    FechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    IdProducto INT REFERENCES Producto(IdProducto),
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(12,2),
    CodFactura INT REFERENCES Factura(CodFactura),
    PRIMARY KEY (CodCuenta, IdProducto, FechaCompra)
);

-- Tabla 18: contar
CREATE TABLE contar (
    cantidad INT DEFAULT 1,
    IdProducto INT REFERENCES Producto(IdProducto),
    CodEspecificacion INT REFERENCES Especificacion(CodEspecificacion),
    PRIMARY KEY (IdProducto, CodEspecificacion)
);

-- Tabla 19: realizar
CREATE TABLE realizar (
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Cantidad INT DEFAULT 1,
    CodigoPedido INT REFERENCES SolicitudPedido(CodigoPedido),
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    PRIMARY KEY (CodigoPedido, CodCuenta)
);

-- Tabla 20: calificacion
CREATE TABLE calificacion (
    Calificacion DECIMAL(3,2) CHECK (Calificacion >= 0 AND Calificacion <= 5),
    CodMensaje INT REFERENCES mensaje(CodMensaje),
    IdProducto INT REFERENCES Producto(IdProducto),
    PRIMARY KEY (CodMensaje, IdProducto)
);

-- Tabla 21: disponer
CREATE TABLE disponer (
    CodEmpleado INT REFERENCES Empleado(CodEmpleado),
    Fecha DATE DEFAULT CURRENT_DATE,
    IdInforme INT REFERENCES Informe_gral(IdInforme),
    PRIMARY KEY (CodEmpleado, IdInforme)
);

-- Tabla 22: atiende
CREATE TABLE atiende (
    Conclusion TEXT,
    FechaAtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodigoPedido INT REFERENCES SolicitudPedido(CodigoPedido),
    CodEmpleado INT REFERENCES Empleado(CodEmpleado),
    PRIMARY KEY (CodigoPedido, CodEmpleado)
);

-- Tabla 23: actualizar
CREATE TABLE actualizar (
    Fecha DATE DEFAULT CURRENT_DATE,
    Cantidad INT,
    CodEmpleado INT REFERENCES Empleado(CodEmpleado),
    IdProducto INT REFERENCES Producto(IdProducto),
    tipo_cambio VARCHAR(30),
    PRIMARY KEY (CodEmpleado, IdProducto, Fecha)
);

-- Tabla 24: otorga
CREATE TABLE otorga (
    Motivo VARCHAR(30),
    CodMensaje INT REFERENCES mensaje(CodMensaje),
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    PRIMARY KEY (CodMensaje, CodCuenta)
);

-- Tabla 25: afectar
CREATE TABLE afectar (
    CodReporte INT REFERENCES informe_reporte(CodReporte),
    FechaEjecucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CodCuenta INT REFERENCES Cuenta(CodCuenta),
    PRIMARY KEY (CodReporte, CodCuenta)
);

-- Tabla 26: tiene
CREATE TABLE tiene (
    ModoEmision VARCHAR(10),
    IdProducto INT REFERENCES Producto(IdProducto),
    CodigoPedido INT REFERENCES SolicitudPedido(CodigoPedido),
    CodFactura INT REFERENCES Factura(CodFactura),
    CONSTRAINT check_producto_o_pedido CHECK (
        (IdProducto IS NOT NULL AND CodigoPedido IS NULL) OR
        (IdProducto IS NULL AND CodigoPedido IS NOT NULL)
    ),
    PRIMARY KEY (CodFactura, COALESCE(IdProducto, 0), COALESCE(CodigoPedido, 0))
);

-- Tabla 27: producto_categoria
CREATE TABLE producto_categoria (
    IdProducto INT REFERENCES Producto(IdProducto),
    id_categoria INT REFERENCES Categoria(id_categoria),
    PRIMARY KEY (IdProducto, id_categoria)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_cuenta_correo ON Cuenta(CorreoElectronico);
CREATE INDEX idx_producto_popularidad ON Producto(Popularidad DESC);
CREATE INDEX idx_pedido_estado ON SolicitudPedido(Estado);
CREATE INDEX idx_factura_cuenta ON Factura(CodCuenta);

-- ============================================
-- DATOS INICIALES
-- ============================================
INSERT INTO Categoria (nombre_categoria, descripcion) VALUES
('Laptops', 'Computadoras portátiles de última generación'),
('Smartphones', 'Teléfonos inteligentes'),
('Accesorios', 'Accesorios tecnológicos'),
('Audio', 'Audífonos y parlantes');

INSERT INTO Producto (marca, Nombre, Popularidad, UrlImagen, descripcion_corta, stock_total) VALUES
('TechBrand', 'UltraBook Pro', 85, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'Laptop de alto rendimiento', 50),
('SoundCore', 'Auriculares Pro', 90, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Audio de alta calidad', 100),
('PhoneX', 'Smartphone Max', 95, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 'Cámara profesional', 30);

INSERT INTO Especificacion (Origen, Precio, CantidadDisponible, Peso, Dimension, Color, IdProducto) VALUES
('China', 1299.99, 50, 1.8, 30.4, 'Gris espacial', 1),
('Japón', 89.99, 100, 0.3, 15.0, 'Negro', 2),
('Corea', 899.99, 30, 0.2, 14.5, 'Azul', 3);

-- Usuario admin (contraseña: Admin123!)
INSERT INTO Cuenta (Nombre, Apellido, FechaNacimiento, Origen, CorreoElectronico, Contraseña, rol)
VALUES ('Admin', 'Ignister', '1990-01-01', 'Perú', 'admin@ignister.com', 
        '$2b$10$YourHashedPasswordHere', 'admin');