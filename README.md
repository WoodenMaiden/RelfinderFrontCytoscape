# RelfinderReformed frontend

## What is this ?

Relfinder is an implementation of the now deprecated [relfinder](http://www.visualdataweb.org/relfinder.php). Paired with an [API](https://github.com/WoodenMaiden/RelfinderReformedAPI) it will show the relations between rdf entities.

## Env variables

| Name        | Required - default value                                                                                                       | Description                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| RFR_API_URL | :x: - `""` (targets the same host useful when serving it from the [API](https://github.com/WoodenMaiden/RelfinderReformedAPI)) | URL to a [RelfinderReformed API](https://github.com/WoodenMaiden/RelfinderReformedAPI) |

## Run locally with `npm`

```bash
npm run start
# if you want to change the api url with an env variable prefix it with ``REACT_APP_``
# React does that for security reasons
REACT_APP_RFR_API_URL=http://some_url_to_an_api.com npm run start
```

## Build and run the project

### Manually

```sh
vim src/variables.js
#Edit each of the values according to the table above

npm i
npm i -g serve
npm run build

serve -s build
```

### With docker

```sh
docker build . -t rfrfront
docker run -e RFR_API_URL=http://someurltoanapi.com rfrfront
```
