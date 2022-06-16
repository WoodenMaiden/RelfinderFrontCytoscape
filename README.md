# RelfinderReformed frontend

## What is this ?
Relfinder is an implementation of the now deprecated [relfinder](http://www.visualdataweb.org/relfinder.php). Paired with an [API](https://github.com/WoodenMaiden/RelfinderReformedAPI) it will show  the relations betwwen two rdf entities.

## Env variables
| Name | Required - default value| Description|
|-|-|-|
| API_URL | :x: - ``http://localhost:8080`` | URL to a [RelfinderReformed API](https://github.com/WoodenMaiden/RelfinderReformedAPI)|

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
docker run -e API_URl=http://someurltoanapi.com rfrfront
```