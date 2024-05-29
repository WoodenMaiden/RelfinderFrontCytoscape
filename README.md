# RelfinderReformed frontend

## What is this ?

Relfinder is an implementation of the now deprecated [relfinder](http://www.visualdataweb.org/relfinder.php). Paired with an [API](https://github.com/WoodenMaiden/RelfinderReformedAPI) it will show the relations between rdf entities.

## Env variables

| Name        | Required - default value                                                                                                       | Description                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| RFR_API_URL | :x: - `"/api"` (targets the same host useful when serving it from the [API](https://github.com/WoodenMaiden/RelfinderReformedAPI)) or `"http://localhost:8080/"` in the docker to avoid looping (see description) | URL to a [RelfinderReformed API](https://github.com/WoodenMaiden/RelfinderReformedAPI), when using the nginx container it changes the value of [``proxy_pass``](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) on the `"/api"` route |

## Run locally with `npm`

```bash
npm run start

# or if you want to change the api url with an env variable prefix it with ``REACT_APP_``
# React does that for security reasons

REACT_APP_RFR_API_URL=http://some_url_to_an_api.com npm run start
```

## Build and run the project

```sh
docker build . -t rfrfront
docker run -e RFR_API_URL=http://someurltoanapi.com -p 8080:8080 rfrfront
```
