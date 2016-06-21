FROM google/nodejs
ADD package.json npm-shrinkwrap.json* /app/
RUN npm --unsafe-perm install
# RUN apt-get update -qq && apt-get upgrade -y
ADD . /app
WORKDIR /app
EXPOSE 8080
