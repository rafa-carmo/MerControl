## Diretório da aplicação
FROM php:8.3-fpm AS base

FROM base AS builder
# Instalação do Node.js
WORKDIR /var/www/html

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
libldap2-dev \
libmemcached-dev


RUN docker-php-ext-install mysqli pdo pdo_mysql session xml ldap zip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN composer install
RUN npm run build


FROM base AS php

## Versão da Lib do Redis para PHP
ARG REDIS_LIB_VERSION=5.3.7

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    apt-utils
### apt-utils é um extensão de recursos do gerenciador de pacotes APT

RUN apt-get install -y --no-install-recommends supervisor

### Supervisor permite monitorar e controlar vários processos (LINUX)
### Bastante utilizado para manter processos em Daemon, ou seja, executando em segundo plano

# dependências recomendadas de desenvolvido para ambiente linux
RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    unzip \
    libpng-dev \
    libpq-dev \
    libxml2-dev \
    libldap2-dev \
    libmemcached-dev

# RUN docker-php-ext-configure zip
# RUN docker-php-ext-install zip

RUN docker-php-ext-install mysqli pdo pdo_mysql pdo_pgsql pgsql session xml ldap

# habilita instalação do Redis
RUN pecl install redis-${REDIS_LIB_VERSION} memcached \
    && docker-php-ext-enable redis memcached

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN docker-php-ext-install zip iconv simplexml pcntl gd fileinfo

#COPY php.ini-production /usr/local/etc/php/php.ini
# RUN cp ./Docker/8/php.ini-production /usr/local/etc/php/php.ini

COPY ./Docker/8/supervisord/supervisord.conf /etc/supervisor
COPY ./Docker/8/supervisord/conf /etc/supervisord.d/
RUN mkdir /var/log/app

WORKDIR /var/www/html
COPY --from=builder /var/www/html/public /var/www/html/public
COPY --from=builder /var/www/html/vendor/ /var/www/html/vendor/
COPY . .

RUN php artisan storage:link
RUN php artisan optimize:clear
RUN php artisan optimize

COPY Docker/8/php.ini-production /usr/local/etc/php/conf.d/99-custom.ini


RUN chmod 755 -R *
RUN chown -R www-data: *
RUN chmod -R 777 storage
RUN chmod -R 777 bootstrap

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
