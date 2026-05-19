const { pool } = require('../../../infrastructure/database/postgres/connection');

const getProducts = async (filters = {}) => {
  let query = `
    SELECT 
      p."IdProducto",
      p."marca",
      p."Nombre",
      p."Popularidad",
      p."UrlImagen",
      p."descripcion_corta",
      p."stock_total",
      e."Precio",
      e."Color",
      COALESCE(AVG(c."Calificacion"), 0) as "calificacion_promedio"
    FROM "Producto" p
    LEFT JOIN "Especificacion" e ON p."IdProducto" = e."IdProducto"
    LEFT JOIN "calificacion" c ON p."IdProducto" = c."IdProducto"
    WHERE p."stock_total" > 0
  `;
  
  const params = [];
  let paramIndex = 1;
  
  if (filters.category) {
    query += ` AND p."IdProducto" IN (
      SELECT "IdProducto" FROM "producto_categoria" pc 
      JOIN "Categoria" c ON pc."id_categoria" = c."id_categoria"
      WHERE c."nombre_categoria" = $${paramIndex}
    )`;
    params.push(filters.category);
    paramIndex++;
  }
  
  if (filters.minPrice) {
    query += ` AND e."Precio" >= $${paramIndex}`;
    params.push(filters.minPrice);
    paramIndex++;
  }
  
  if (filters.maxPrice) {
    query += ` AND e."Precio" <= $${paramIndex}`;
    params.push(filters.maxPrice);
    paramIndex++;
  }
  
  if (filters.search) {
    query += ` AND (p."Nombre" ILIKE $${paramIndex} OR p."marca" ILIKE $${paramIndex})`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }
  
  query += ` GROUP BY p."IdProducto", e."Precio", e."Color"`;
  
  if (filters.sort === 'price_asc') {
    query += ` ORDER BY e."Precio" ASC`;
  } else if (filters.sort === 'price_desc') {
    query += ` ORDER BY e."Precio" DESC`;
  } else if (filters.sort === 'popularity') {
    query += ` ORDER BY p."Popularidad" DESC`;
  } else {
    query += ` ORDER BY p."Popularidad" DESC`;
  }
  
  const result = await pool.query(query, params);
  return result.rows;
};

const getProductById = async (id) => {
  const query = `
    SELECT 
      p."IdProducto",
      p."marca",
      p."Nombre",
      p."Popularidad",
      p."UrlImagen",
      p."descripcion_corta",
      p."stock_total",
      p."fecha_creacion",
      e."Origen",
      e."Precio",
      e."CantidadDisponible",
      e."Peso",
      e."Dimension",
      e."Color",
      COALESCE(AVG(c."Calificacion"), 0) as "calificacion_promedio",
      COUNT(c."CodMensaje") as "total_calificaciones"
    FROM "Producto" p
    LEFT JOIN "Especificacion" e ON p."IdProducto" = e."IdProducto"
    LEFT JOIN "calificacion" c ON p."IdProducto" = c."IdProducto"
    WHERE p."IdProducto" = $1
    GROUP BY p."IdProducto", e."Precio", e."Origen", e."CantidadDisponible", e."Peso", e."Dimension", e."Color"
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getProductStats = async (id) => {
  // Estadísticas de precio y popularidad para el gráfico
  const query = `
    SELECT 
      p."Popularidad",
      e."Precio",
      COALESCE(AVG(c."Calificacion"), 0) as "rating_promedio",
      COUNT(DISTINCT comp."CodCuenta") as "total_compras",
      (
        SELECT json_agg(json_build_object('fecha', "FechaRegistro", 'precio', "Precio"))
        FROM "HistorialPrecioProducto"
        WHERE "IdProducto" = $1
        ORDER BY "FechaRegistro" DESC
        LIMIT 12
      ) as "historial_precios"
    FROM "Producto" p
    LEFT JOIN "Especificacion" e ON p."IdProducto" = e."IdProducto"
    LEFT JOIN "calificacion" c ON p."IdProducto" = c."IdProducto"
    LEFT JOIN "comprar" comp ON p."IdProducto" = comp."IdProducto"
    WHERE p."IdProducto" = $1
    GROUP BY p."Popularidad", e."Precio"
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || {};
};

const getPriceHistory = async (id) => {
  const query = `
    SELECT 
      TO_CHAR("FechaRegistro", 'YYYY-MM-DD') as fecha,
      "Precio"
    FROM "HistorialPrecioProducto"
    WHERE "IdProducto" = $1
    ORDER BY "FechaRegistro" DESC
    LIMIT 12
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows;
};

const createProduct = async (productData) => {
  const { marca, Nombre, UrlImagen, descripcion_corta, stock_total, Precio, Origen, Color } = productData;
  
  const result = await pool.query(
    `INSERT INTO "Producto" ("marca", "Nombre", "UrlImagen", "descripcion_corta", "stock_total")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING "IdProducto"`,
    [marca, Nombre, UrlImagen, descripcion_corta, stock_total]
  );
  
  const productId = result.rows[0].IdProducto;
  
  await pool.query(
    `INSERT INTO "Especificacion" ("Origen", "Precio", "CantidadDisponible", "Color", "IdProducto")
     VALUES ($1, $2, $3, $4, $5)`,
    [Origen, Precio, stock_total, Color, productId]
  );
  
  return { IdProducto: productId, ...productData };
};

const updateProduct = async (id, productData) => {
  const { marca, Nombre, Precio, stock_total } = productData;
  
  await pool.query(
    `UPDATE "Producto" SET "marca" = $1, "Nombre" = $2, "stock_total" = $3 WHERE "IdProducto" = $4`,
    [marca, Nombre, stock_total, id]
  );
  
  await pool.query(
    `UPDATE "Especificacion" SET "Precio" = $1 WHERE "IdProducto" = $2`,
    [Precio, id]
  );
  
  return { IdProducto: id, ...productData };
};

const deleteProduct = async (id) => {
  // Eliminación lógica
  await pool.query(`UPDATE "Producto" SET "stock_total" = 0 WHERE "IdProducto" = $1`, [id]);
};

module.exports = {
  getProducts,
  getProductById,
  getProductStats,
  getPriceHistory,
  createProduct,
  updateProduct,
  deleteProduct
};