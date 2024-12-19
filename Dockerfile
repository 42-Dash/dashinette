FROM golang:1.22.5

# All dependencies required to build the Go project
RUN apt-get update && apt-get install -y curl build-essential sudo cargo

WORKDIR /app

COPY /go.sum go.sum
COPY /go.mod go.mod
COPY /config/maps.json config/maps.json

COPY /internals internals
COPY /dashes/marvin/maps dashes/marvin/maps
COPY /pkg pkg
COPY /cmd/marvin/tester/main.go main.go

RUN go build -o tester .
