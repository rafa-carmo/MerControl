ARG NODE_VERSION=22
ARG PHP_VERSION=8.2.27-fpm

## Diretório da aplicação
FROM php:8.2.27-fpm
WORKDIR /var/www/html

# COPY . .
RUN apt update
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash

RUN apt install -y nodejs
RUN npm install -g npm@latest

RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    unzip \
    libpng-dev \
    libpq-dev \
    libxml2-dev \
    libldap2-dev

RUN docker-php-ext-install mysqli pdo pdo_mysql session xml ldap
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY Docker/Dev/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# RUN composer install
# RUN npm install

RUN docker-php-ext-install zip iconv simplexml pcntl gd fileinfo

# RUN php artisan storage:link
# RUN php artisan optimize:clear

# RUN chmod 755 -R *
# RUN chown -R www-data: *
# RUN chmod -R 777 storage
# RUN chmod -R 777 bootstrap

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["/usr/bin/php", "-d", "/var/www/html/artisan", "serve", "--host=0.0.0.0"]
