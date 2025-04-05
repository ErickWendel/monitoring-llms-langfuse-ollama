source .env

rsync -av \
--exclude='node_modules' \
--exclude='.git' \
--exclude='*-data' \
--exclude='letsencrypt' \
./ root@$DOMAIN:/root/infra
