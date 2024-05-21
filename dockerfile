FROM openjdk:11-jdk-slim

LABEL maintainer="bordea37@gmail.com"

VOLUME /tmp
EXPOSE 8080

ARG JAR_FILE=target/CRBLA-0.0.1-SNAPSHOT.jar

ADD ${JAR_FILE} app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]