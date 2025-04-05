source .env

rsync -av --exclude='node_modules' --exclude='.git' ./ root@$DOMAIN:/root/infra
