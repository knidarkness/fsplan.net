mkdir temp
curl  -o "./temp/airport-data-with-nearby-by-region.json" https://find-sim-routes.fra1.digitaloceanspaces.com/airports-data/airport-data-with-nearby-by-region.json
mv ./temp/airport-data-with-nearby-by-region.json ./static/airport-data-with-nearby-by-region.json
yarn test
yarn build