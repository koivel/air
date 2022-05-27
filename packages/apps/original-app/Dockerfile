FROM nginx:latest
COPY packages/apps/original-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/packages/apps/original-app /usr/share/nginx/html
EXPOSE 80