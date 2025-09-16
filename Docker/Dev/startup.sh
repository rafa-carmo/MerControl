cd /var/www/html
composer install
npm install
php artisan migrate
composer run dev-docker
