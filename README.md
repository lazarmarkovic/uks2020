# UKS projekat: gitlab clone

Git branching model in use: https://nvie.com/posts/a-successful-git-branching-model/

## Docker setup list:
- Build docker images: 
    ```
    docker-compose build
    ```

- Start docker containers: 
    ```
    docker-compose up -d
    ```

- Shh into backend container:
    ```
    docker exec -ti <uks_baskend_container_id> bash

- Create superuser: 
    ```
    python manage.py createsuperuser
    ```