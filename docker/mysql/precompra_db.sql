-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2025 a las 16:45:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS precompra_db;
USE precompra_db;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `precompra_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendamientos`
--

CREATE TABLE `agendamientos` (
  `id` int(11) NOT NULL,
  `marca_vehiculo` varchar(100) DEFAULT NULL COMMENT 'Marca del Vehículo',
  `modelo_vehiculo` varchar(100) DEFAULT NULL COMMENT 'Modelo del Vehículo',
  `anio_vehiculo` varchar(10) DEFAULT NULL COMMENT 'Año del Vehículo',
  `patente` varchar(20) DEFAULT NULL COMMENT 'Patente del Vehículo',
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `apellido_cliente` varchar(100) DEFAULT NULL,
  `email_cliente` varchar(100) DEFAULT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `rut_cliente` varchar(20) DEFAULT NULL,
  `direccion_cliente` varchar(255) DEFAULT NULL,
  `region_cliente` varchar(100) DEFAULT NULL,
  `comuna_cliente` varchar(100) DEFAULT NULL,
  `tipo_vendedor` varchar(50) DEFAULT NULL,
  `nombre_vendedor` varchar(100) DEFAULT NULL,
  `telefono_vendedor` varchar(20) DEFAULT NULL,
  `direccion_vendedor` varchar(255) DEFAULT NULL,
  `region_vendedor` varchar(100) DEFAULT NULL,
  `comuna_vendedor` varchar(100) DEFAULT NULL,
  `fecha_agendada` date DEFAULT NULL,
  `bloque` varchar(50) DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agendamientos`
--

INSERT INTO `agendamientos` (`id`, `marca_vehiculo`, `modelo_vehiculo`, `anio_vehiculo`, `patente`, `nombre_cliente`, `apellido_cliente`, `email_cliente`, `telefono_cliente`, `rut_cliente`, `direccion_cliente`, `region_cliente`, `comuna_cliente`, `tipo_vendedor`, `nombre_vendedor`, `telefono_vendedor`, `direccion_vendedor`, `region_vendedor`, `comuna_vendedor`, `fecha_agendada`, `bloque`, `metodo_pago`, `fecha_creacion`) VALUES
(77, '', '', '', '', 'FRANCISCO EDUARDO', 'JIMENEZ ROMERO', 'cesar.719@gmail.com', '+56968075076', '121240750', 'ramon freire 12', 'IX', 'Lautaro', 'particular', 'essio guisti', '+56995754110', 'claro de lun ', 'IX', 'Temuco', '2025-07-10', 'AM', 'webpay', '2025-07-07 10:05:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendamientos_backup`
--

CREATE TABLE `agendamientos_backup` (
  `id` int(11) NOT NULL DEFAULT 0,
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `correo_cliente` varchar(100) DEFAULT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `bloque` time DEFAULT NULL,
  `vehiculo` text DEFAULT NULL,
  `vendedor` text DEFAULT NULL,
  `monto` int(11) DEFAULT NULL,
  `estado_pago` varchar(20) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendamientos_old`
--

CREATE TABLE `agendamientos_old` (
  `id` int(11) NOT NULL,
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `correo_cliente` varchar(100) DEFAULT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `bloque` time DEFAULT NULL,
  `vehiculo` text DEFAULT NULL,
  `vendedor` text DEFAULT NULL,
  `monto` int(11) DEFAULT NULL,
  `estado_pago` varchar(20) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agendamientos`
--
ALTER TABLE `agendamientos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `agendamientos_old`
--
ALTER TABLE `agendamientos_old`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unico_fecha_bloque` (`fecha`,`bloque`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agendamientos`
--
ALTER TABLE `agendamientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `agendamientos_old`
--
ALTER TABLE `agendamientos_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
