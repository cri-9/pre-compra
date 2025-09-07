# Comando para reemplazar nginx.conf en el VPS
# Copiar y pegar este comando completo en el VPS

cat > nginx/nginx.conf << 'EOF'
# Archivo nginx.conf actualizado para el VPS (corrige errores)

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Configuración de logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Headers de seguridad globales
    include /etc/nginx/security-headers.conf;

    # Configuración de seguridad
    server_tokens off;
    
    # Limitar tamaño del cuerpo de la solicitud
    client_max_body_size 10M;
    client_body_buffer_size 128k;
    
    # Timeouts de seguridad
    client_body_timeout 10s;
    client_header_timeout 10s;
    keepalive_timeout 5s 5s;
    send_timeout 10s;

    # Configuración de gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Redirección HTTP a HTTPS
    server {
        listen 80;
        server_name visualmecanica.cl www.visualmecanica.cl;
        
        # Servir security.txt en HTTP también
        location /.well-known/security.txt {
            alias /var/www/html/pre-compra/security.txt;
            add_header Content-Type text/plain;
        }

        location /security.txt {
            alias /var/www/html/pre-compra/security.txt;
            add_header Content-Type text/plain;
        }

        # Redireccionar todo lo demás a HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # Configuración HTTPS con seguridad mejorada
    server {
        listen 443 ssl;
        http2 on;  # Nueva sintaxis para HTTP2
        server_name visualmecanica.cl www.visualmecanica.cl;
        
        # Certificados Let's Encrypt reales
        ssl_certificate /etc/letsencrypt/live/visualmecanica.cl/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/visualmecanica.cl/privkey.pem;
        
        # Configuración SSL segura
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_stapling on;
        ssl_stapling_verify on;
        
        # HSTS (HTTP Strict Transport Security)
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

        # Servir security.txt
        location /.well-known/security.txt {
            alias /var/www/html/pre-compra/security.txt;
            add_header Content-Type text/plain;
        }

        location /security.txt {
            alias /var/www/html/pre-compra/security.txt;
            add_header Content-Type text/plain;
        }

        # Bloquear acceso a archivos sensibles
        location ~ /\.(ht|git|env) {
            deny all;
        }

        location ~ \.(sql|conf|log)$ {
            deny all;
        }
        
        # Proxy para el frontend
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Proxy para el backend API
        location /api/ {
            proxy_pass http://backend:80/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Proxy para archivos PHP del backend
        location /Backend/ {
            proxy_pass http://backend:80/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
