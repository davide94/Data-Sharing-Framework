#!/bin/bash

echo "logging_collector = on" >> /var/lib/postgresql/data/postgresql.conf
echo "log_destination = 'csvlog'" >> /var/lib/postgresql/data/postgresql.conf
echo "log_directory = 'pg_log'" >> /var/lib/postgresql/data/postgresql.conf
echo "log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'" >> /var/lib/postgresql/data/postgresql.conf

# forever start ../app.js
forever start -v -c ts-node app.ts