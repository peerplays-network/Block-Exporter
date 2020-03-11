# Block Exporter

The installation instructions can be seen here https://peerplays.gitbook.io/community-project-docs/block-explorer/setting-up-the-explorer


## Database Setup Instructions.

Run the following command to spin up the database

```bash
docker-compose -f docker/docker-compose-dependency.yml up
```
If docker is not installed on the machine, download from the following URL: https://www.docker.com/products/docker-desktop

Once installed add the path: /var/docker_volumes to the file-sharing option. Also, the logged-in user should have read and write permissions to the aforementioned path.

The Database credentials are present in 
```bash
docker/docker-compose-dependency.yml
```
The same credentials should be present in /server/database/constants.js. 
The database is now configured.
