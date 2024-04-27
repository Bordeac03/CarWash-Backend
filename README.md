# CarWash-Backend

#### TO DO ON BACKEND (FOARTE IMPORTANT) ###

1. FIX LOGIN SI REGISTER
    -> LOGIN DIFERENTIAT PENTRU FIECARE ROL, UN USER CU TOKEN DE CLIENT NU TREBUIE SA POATA ACCESA ENDPOINTURI DE TIP /ADMIN/etc... SAU /CARWASH/etc...
    -> REGISTER DIFERENTIAT PENTRU FIECARE ROL, UN USER CU ROL DE CLIENT NU TREBUIE SA POATA SA ISI CREEZE UN CONT DE TIP ADMIN SAU CARWASH

2. ADMIN CONTROLLER MODULE
    <!-- -> GET: /admin/carwash - query params: search=?, page=?, limit=? (
        -> search: Vei primi un string cu adresa sau numele carwash-ului si vei cauta toate carwash-urile care contin acel string in nume sau adresa, daca nu primesti nimic, vei returna toate carwash-urile in limita paginarii
        -> page: Vei primi un numar intreg care reprezinta pagina pe care vrei sa o afisezi (deoarece nu e ok sa afisam toate carwash-urile o data, ar fi ineficient, motiv pentru care vom folosi paginarea)
        -> limit: Vei primi un numar intreg care reprezinta maximul de carwash-uri pe care vrei sa le afisezi pe o pagina

        !!! daca nu stii cum sa scrii query-ul de paginare, poti sa ma intrebi pe mine sau Cosmin, dar e foarte simplu, o sa iti trimit un exemplu de query care face asta

        ex: sql cu paginare cu cursor si python:
            cursor.execute("SELECT * FROM user WHERE email LIKE %s OR phone LIKE %s OR fullname LIKE %s LIMIT %s,%s;",("%" + search + "%","%" + search + "%","%" + search + "%",(page-1)*limit,limit))
    ) -> return (JSON): {
            "carwashes": [
                {
                    "ID": carwash.id,
                    "name": carwash.name,
                    "address": carwash.address,
                    "latitude": carwash.latitude,
                    "longitude": carwash.longitude,
                    "active": carwash.active,
                    "openTime": carwash.openTime,
                    "contact": carwash.contact,
                }, ...
            ],
            "total": total_carwashes (numarul total de carwash-uri care corespund query-ului)
        } -->

    <!-- -> POST: /admin/carwash - request body: {
        "name": carwash.name,
        "address": carwash.address,
        "latitude": carwash.latitude,
        "longitude": carwash.longitude,
        "openTime": carwash.openTime,
        "contact": carwash.contact,
    } -> return (JSON): {} -->

    <!-- -> PATCH: /admin/carwash - request body: {
        "ID": carwash.id,
        "name": carwash.name,
        "address": carwash.address,
        "latitude": carwash.latitude,
        "longitude": carwash.longitude,
        "openTime": carwash.openTime,
        "contact": carwash.contact,
    } (
        tinand cont ca metoda este un patch trebuie sa te astepti sa nu primesti toate campurile, ci doar campurile care se modifica, multe for fi nule sau empty string, cert e ca ID-ul carwash-ului va fi mereu primit
    ) -> return (JSON): {} -->

    -> DELETE: /admin/carwash - request body: {
        "ID": carwash.id
    } (make sure to delete its services from the database) -> return (JSON): {}

    -> GET: /admin/carwash/orders - query params: search=?, page=?, limit=?, orderBy=?, carWashID=? (
       -> search: Vei primi un string cu numele serviciului sau username si vei cauta toate comenzile care contin acel string in nume sau apartin acelui user, daca nu primesti nimic, vei returna toate comenzile in limita paginarii
       -> page: la fel ca la carwash-uri
       -> limit: la fel ca la carwash-uri
       -> orderBy: "ascending" sau "descending" (default "ascending") - va fi folosit pentru a sorta comenzile dupa data (sorteaza dupa ts)
       -> carWashID: Vei primi un numar intreg care reprezinta ID-ul carwash-ului pentru care vrei sa vezi comenzile, daca nu primesti nimic, vei returna eroare
    ) -> return (JSON): {
            "orders": [
                {
                    "ID": order.id,
                    "service": order.service,
                    "carwash": order.carwash,
                    "user": order.user,
                    "status": order.status,
                    "ts": order.ts,
                }, ...
            ],
            "total": total_orders (numarul total de comenzi care corespund query-ului)
        }
    
    -> PATCH: /admin/carwash/orders - request body: {
        "ID": order.id,
        "status": order.status
    } -> return (JSON): {}

    -> GET: /admin/carwash/services - query params: search=?, page=?, limit=? (
        -> search: Vei primi un string cu numele serviciului si vei cauta toate serviciile care contin acel string in nume, daca nu primesti nimic, vei returna toate serviciile in limita paginarii
        -> page: la fel ca la carwash-uri
        -> limit: la fel ca la carwash-uri
    ) -> return (JSON): {
            "services": [
                {
                    "ID": service.id,
                    "name": service.name,
                    "price": service.price,
                    "active": service.active,
                }, ...
            ],
            "total": total_services (numarul total de servicii care corespund query-ului)
        }

    -> POST: /admin/carwash/services - request body: {
        "name": service.name,
        "price": service.price,
        "active": service.active,
        "carwashID": service.carwashID
    } -> return (JSON): {}

    -> PATCH: /admin/carwash/services - request body: {
        "ID": service.id,
        "name": service.name,
        "price": service.price,
        "active": service.active,
    } -> return (JSON): {}

    -> DELETE: /admin/carwash/services - request body: {
        "ID": service.id
    } -> return (JSON): {}

    -> GET: /admin/carwash/users - query params: search=?, page=?, limit=?, carWashID=? (
        -> search: Vei primi un string cu email-ul sau numele user-ului si vei cauta toti user-ii care contin acel string in email sau nume, daca nu primesti nimic, vei returna toti user-ii in limita paginarii
        -> page: la fel ca la carwash-uri
        -> limit: la fel ca la carwash-uri
        -> carWashID: Vei primi un numar intreg care reprezinta ID-ul carwash-ului pentru care vrei sa vezi userii (din carWashConfig cred ca e tabelul)
    ) -> return (JSON): {
            "users": [
                {
                    "ID": user.id,
                    "email": user.email,
                    "fullname": user.fullname,
                    "phone": user.phone,
                    "role": user.role,
                    "active": user.active,
                }, ...
            ],
            "total": total_users (numarul total de useri care corespund query-ului)
        }

    -> POST: /admin/carwash/users - request body: {
        "email": user.email,
        "password": user.password,
        "fullname": user.fullname,
        "phone": user.phone,
        "role": user.role,
        "active": user.active,
        "carwashID": user.carwashID
    } (
        Adaugi utilizator cu rol specific si il legi de carwash-ul specific in tabela carWashConfig
    ) -> return (JSON): {}
