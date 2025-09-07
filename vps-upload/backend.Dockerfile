# Imagen base con PHP y Apache
FROM php:8.2-apache

# Instalar extensiones de PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar mod_rewrite y mod_headers para Apache
RUN a2enmod rewrite headers ssl

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuración de seguridad para Apache
RUN echo '<Directory /var/www/html>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    <Files ~ "\.(env|log|sql|conf|bak)$">\n\
        Require all denied\n\
    </Files>\n\
</Directory>' > /etc/apache2/conf-available/custom.conf && a2enconf custom

# Configuración de seguridad PHP
RUN echo "expose_php = Off" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "display_errors = Off" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "log_errors = On" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "session.cookie_httponly = 1" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "session.cookie_secure = 1" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "session.use_only_cookies = 1" >> /usr/local/etc/php/conf.d/security.ini && \
    echo "session.cookie_samesite = 'Strict'" >> /usr/local/etc/php/conf.d/security.ini

# Configurar headers de seguridad en Apache
RUN echo "ServerTokens Prod" >> /etc/apache2/apache2.conf && \
    echo "ServerSignature Off" >> /etc/apache2/apache2.conf

# Copiar el código fuente (incluye Backend, vendor, etc.)
COPY . /var/www/html/
# Copiar router.php a la ruta esperada por el frontend/nginx
COPY router.php /var/www/html/pre-compra/router.php 

# Crear usuario no-root para mayor seguridad
RUN groupadd -r webuser && useradd -r -g webuser webuser

# Establecer permisos seguros
RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/
RUN find /var/www/html/ -type f -name "*.php" -exec chmod 644 {} \;
RUN find /var/www/html/ -type f -name "*.env*" -exec chmod 600 {} \;

# Instalar dependencias de Composer si existe composer.json
RUN if [ -f /var/www/html/composer.json ]; then \
        cd /var/www/html && composer install --no-dev --optimize-autoloader; \
    fi

# Exponer el puerto 80
EXPOSE 80

# Configuración de producción/desarrollo
ARG ENVIRONMENT=development
RUN if [ "$ENVIRONMENT" = "production" ]; then \
        echo "display_errors=Off\nerror_reporting=0\nlog_errors=On" > /usr/local/etc/php/conf.d/env.ini; \
    else \
        echo "display_errors=On\nerror_reporting=E_ALL" > /usr/local/etc/php/conf.d/env.ini; \
    fi

# Asegúrate de que AllowOverride esté en All para que .htaccess funcione
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Comando por defecto
CMD ["apache2-foreground"]
