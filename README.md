# Poetry


## Prerequisites

* Maven
* Docker
* Docker Compose
* GNU Make (optional)
* Angular CLI (optional)

## Build the app

Run the maven build, which produces a UI docker.

```
# Runs mvn clean install
make mvn
```

## Run the app

Run the docker compose app.

```
# Runs `docker-compose up -d`
make up
```

Access the UI at [http://localhost:8220](http://localhost:8220)

## UI Overview
Initial rough sketch:
![UI Sketch](./images/ui-sketch.jpg)

Actual UI:
![UI](./images/ui.jpg)

## Deployment
The UI is packaged as a Docker container.

![Deployment](./images/deployment.jpg)

## Assumptions

* All data will come from the https://poetrydb.org/ api.
* UI will make REST calls to get authors and titles.
* UI will load initially with an unfiltered list of all authors and titles.
* Max authors displayed: 20
* Max titles displayed: 20
* Max poem results displayed at a time: 1
* Clicking an author is the same as typing the author in the search field and clicking search.
* Clicking a title is the same as typing the title in the search field and clicking search.
* An error will be displayed if a 200 response is not received.
* The following characters will be sanitized from the search text, to prevent interference with the API syntax.
    - `,`
    - `;`
    - `/`

## Future work

- Support pagination, or a "show more" feature to get the next batch of filters.
