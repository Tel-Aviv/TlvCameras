# TlvCameras

This is a frontend React app for the analytic traffic cameras installed in Tel-Aviv city

# How to build
1. This project is UI part of TlvCamerasGql GraphQL server. At build-time it depends on exposed GQL schema, so the first step of building is 
```sh 
$ yarn relay
```
that tries to download the schema and compile the sources against it.

2. 
```sh 
$ yarn build
```
3. Point some HTTP server to the home directory of the project and navigate to <code>index.html</code>.
