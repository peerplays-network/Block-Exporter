# Block Exporter

The installation instructions can be seen here https://peerplays.gitbook.io/community-project-docs/block-explorer/setting-up-the-explorer

## Instructions to setup Database

Prerequisite: 
- Docker-desktop must be installed on the system, with the path /var/docker_volumes added to the file-sharing options of docker settings.
- the current logged in user should also have read and write access to the path  /var/docker_volumes

To spin up the database run the following command:
```bash
docker-compose -f docker/docker-compose.dependency.yml up
```
Also, update server/database/constants.js with the db credentials, which can be obtained from /docker/docker-compose.dependency.yml 
