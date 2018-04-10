FROM golang

RUN mkdir -p /opt/gopath/src/github.com/hyperledger/api-server

COPY ./ /opt/gopath/src/github.com/hyperledger/api-server

WORKDIR /opt/gopath/src/github.com/hyperledger/api-server

RUN apt-get update && apt-get install gcc && apt-get install libtool -y 

RUN ls -lart 

RUN GOPATH=/opt/gopath go build

RUN ls -lart && file api-server 

CMD /opt/gopath/src/github.com/hyperledger/api-server/api-server
