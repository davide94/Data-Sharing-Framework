FROM postgres:alpine
ENV LOGS_FOLDER=$LOGS_FOLDER
ENV LOGGING_POLICY=$LOGGING_POLICY
ENV REQUEST_ID=$REQUEST_ID

RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_9.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh #install node

WORKDIR /app

COPY ["../src/dam.package.json", "../src"]
COPY $RESOURCE "./sql/init.sql"

RUN npm install

COPY . .

CMD [ "npm", "start" ]