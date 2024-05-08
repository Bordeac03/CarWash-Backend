import React, { useEffect, useState, useRef, useMemo } from "react";
import { RiCarWashingFill } from "react-icons/ri";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { IoMdAdd } from "react-icons/io";
import { adminInstance, clientInstance } from "../util/instances";
import { CiSearch } from "react-icons/ci";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FiMinusCircle } from "react-icons/fi";
import { Spinner } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Home = () => {
    const [status, setStatus] = useState('Active');

    const [ID, setID] = useState(null);
    const [ID2, setID2] = useState(null);
    const [ID3, setID3] = useState(null);

    const [addID, setAddID] = useState(null);
    const searchInputRef = useRef();
    const [center, setCenter] = useState([44.4268, 26.1025]);
    const provider = new OpenStreetMapProvider();

    const [carWashes, setCarWashes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCarwash, setSelectedCarwash] = useState(null);
    const [totalCarWashes, setTotalCarWashes] = useState(0);

    /*
      logica home page:
        Avem un obiect searchParams pe car e il vom modifica in felul urmator:
         => poti folosi functia handleChangeSearchParams, ca sa modifici un param din searchParams, va trebui sa specifici name pentru input dupa urmatorul exemplu: 
              <input 
                type="text" 
                name="search" 
                value={searchParams.search} 
                onChange={(event) => handleChangeSearchParams(event)} 
              /> - pentru name="search", functia va modifica parametrul search din searchParams

        => daca vei pune butoane de plus, minus pentru pentru pagina si nu folosesti inputuri pentru a modifica parametri asigura-te ca verifici daca valoarea curenta pe care o setezi nu este aceiasi cu cea din obiectul searchParams, chiar daca nu schimbi valoarea, functia setSearchParams va crea alt obiect cu aceleasi valori ceea ce va rezulta cu trigger pe useEffect cu dependenta de searchParams ce proobabil va face request-uri inutile catre server, pentru a modifica valorile din searchParams folosesti:
            setSearchParams(prev => {
              return {
                ...prev,
                page/limit/search: value
              };
            });

        => calculeaza cate pagini sunt in total si afiseaza butoanele de next si back in functie de numarul de pagini
        => pentru a schimba statusul unui carwash foloseste functia handleCarwashStatusChange, care primeste ca parametru noul status si id-ul carwash-ului, functia va face un request catre server pentru a schimba statusul carwash-ului si altul pewntru a da rfresh listei de carwashes, recomand sa faci un map pe array-ul de carwash pentru a afisa fiecare carwash in parte si a acesa datele sale, jap jap
        => pentru a adauga un carwash vom construi un obiect JSON cu urmatorii parametri, eu iti  las o chestie ca la search, ramane la decizia ta daca o folosesti sau nu
    */

   const [uploadNewCarWash, setUploadNewCarWash] = useState({
       name: "",
       address: "",
       latitude: 0.0,
       longitude: 0.0,
       active: false,
       openTime: "",
       contact: ""
   });

    const [searchParams, setSearchParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    });


    const handleChangeSearchParams = (event) => {
        event.preventDefault();

        const searchValue = searchInputRef.current.value;
      
        if (searchParams.search && searchParams.search === searchValue) {
          return;
        }
      
        setSearchParams(prev => {
          return {
            ...prev,
            search: searchValue
          };
        });
      };

    const initialCarWashState = {
        name: "",
        address: "",
        latitude: 0.0,
        longitude: 0.0,
        active: false,
        openTime: "",
        contact: ""
      };

    // pentru <input/> foloseste urmatoarea functie
    const handleUploadNewCarWash = (event) => {
        if (uploadNewCarWash[event.target.name] && uploadNewCarWash[event.target.name] == event.target.value) {
          return;
        }
        setUploadNewCarWash(prev => {
          return {
            ...prev,
            [event.target.name]: event.target.value
          };
        });
    }

    const update = () => {
        adminInstance().get("/carwash", {params: {
          searchString: searchParams.search,
          pageNumber: searchParams.page,
          limit: searchParams.limit
        }})
        .then((res) => {
           console.log(res.data);
          if (!res.data) {
            return;
          }
          const carWashes = res.data.data.map(carWashes => ({
            id: carWashes.ID,
            name: carWashes.name,
            address: carWashes.address,
            active: carWashes.active,
            openTime: carWashes.openTime,
            contact: carWashes.contact
          }));

          setCarWashes(res.data.data);
          setTotalCarWashes(res.data.total);

        })
        .catch((err) => console.log(err));
    };

    const handleCarwashStatusChange = (id, status) => {
        adminInstance().patch("/carwash", {
            id: id,
            active: status
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        }
        )
        .catch((err) => console.log(err));
    };

    const handleUserStatusChange = (id, status) => {
        adminInstance().patch("/carwash/users", {
            id: id,
            active: status
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        }
        )
        .catch((err) => console.log(err));
    };

    const handleProductStatusChange = (id, status) => {
        clientInstance().patch("service", {
            id: id,
            active: status
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        }
        )
        .catch((err) => console.log(err));
    };

    const handleAddCarWash = () => {
        adminInstance().post("/carwash", uploadNewCarWash)
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        })
        .catch((err) => console.log(err));

        setUploadNewCarWash(initialCarWashState);
    };

// ======================================================================================================

    // useEffect calls
    useEffect(() => {
        update();
    }, [searchParams]);
    

    const UpdateCenter = ({ address }) => {
        const map = useMap();
      
        useEffect(() => {
          const updateCenter = async () => {
            const results = await provider.search({ query: address });
            if (results.length > 0) {
              const { x, y } = results[0];
              map.flyTo([y, x], 15);
            }
          };
      
          updateCenter();
        }, [address, map]);
      
        return null;
      };
      
      const DraggableMarker = () => {
        const markerRef = useRef(null);
        const map = useMapEvents({
          click(e) {
            const position = e.latlng;
            setCenter([position.lat, position.lng]);
            // Reverse geocoding to update the address
            const reverseGeocode = async () => {
              const results = await provider.search({ query: `${position.lat}, ${position.lng}` });
              if (results.length > 0) {
                setUploadNewCarWash(prev => ({
                  ...prev, 
                  address: results[0].label,
                  latitude: position.lat,
                  longitude: position.lng,
                }));
              }
            };
            reverseGeocode();
          },
          dragend() {
            const marker = markerRef.current;
            if (marker != null) {
              const position = marker.getLatLng();
              setCenter([position.lat, position.lng]);
              // Reverse geocoding to update the address
              const reverseGeocode = async () => {
                const results = await provider.search({ query: `${position.lat}, ${position.lng}` });
                if (results.length > 0) {
                  setUploadNewCarWash(prev => ({
                    ...prev, 
                    address: results[0].label,
                    latitude: position.lat,
                    longitude: position.lng,
                  }));
                }
              };
              reverseGeocode();
            }
          },
        });
      
        return (
          <Marker
            draggable={true}
            position={center}
            ref={markerRef}>
            <Popup minWidth={90}>
              <span>Drag to move!</span>
            </Popup>
          </Marker>
        );
      };

    return (
        <div>
            {ID !== null && (
                 <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "30%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <span className='hover' style={{cursor: "pointer", marginLeft:'auto', borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID(null)}}>X</span>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        {ID === null ? (
                            <span style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}>
                                <IoIosArrowBack />
                            </span>
                        ):( <span style={{padding: "1em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}></span>)}
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)", marginBottom:'.6rem'}}>Order History for {selectedCarwash.name}</span>
                        <span onClick={() =>{setID(null), setID2(1)}} style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}><IoIosArrowForward /></span>
                    </div>
                    <div className='carwash-modal'>
                        <table className="users-list">
                            <tbody>
                                <tr style={{color:'var(--normal)'}}>
                                    <td>Name</td>
                                    <td>Address</td>
                                    <td>Status</td>
                                    <td>Order By</td>
                                </tr>
                                <tr style={{fontWeight:'400'}}>
                                    <td>43</td>
                                    <td>43</td>
                                    <td>43</td>
                                    <td>43</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> )} 

            {ID2 !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID2 !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "30%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID2 !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <span className='hover' style={{cursor: "pointer", marginLeft:'auto', borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID2(null)}}>X</span>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <span  onClick={() =>{setID(1), setID2(null)}} style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}><IoIosArrowBack /></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)", marginBottom:'.6rem'}}>Users list for {selectedCarwash.name}</span>
                        <span  onClick={() =>{setID2(null), setID3(1)}} style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}><IoIosArrowForward /></span>
                    </div>
                    <div className='carwash-modal'>
                        <table className="users-list">
                            <tbody>
                                <tr style={{color:'var(--normal)'}}>
                                    <td>Full Name</td>
                                    <td>E-Mail</td>
                                    <td>Status</td>
                                    <td>Role</td>
                                </tr>
                                {Array.isArray(users.data) && users.data.map((e,i) => 
                                <tr key={i} onClick={() => {setID3(i), setSelectedUser(e)}} style={{fontWeight:'400'}}>
                                    <td>{e.fullName}</td>
                                    <td>{e.email}</td>
                                    <td onClick={(event) => event.stopPropagation()}><label className="switch"><input type="checkbox" checked={e.active} onChange={(event) => handleUserStatusChange(e.id, event.target.checked)}/><span className="slider round"></span></label></td>
                                    <td>{e.role}</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> )} 

            {ID3 !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID3 !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "30%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID3 !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                      <span className='hover' style={{cursor: "pointer", marginLeft:'auto', borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID3(null)}}>X</span>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <span  onClick={() =>{setID2(1), setID3(null)}} style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}><IoIosArrowBack /></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)", marginBottom:'.6rem'}}>Products page for {selectedCarwash.name}</span>
                        {ID3 === null ? (
                            <span style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}>
                                <IoIosArrowForward />
                            </span>
                        ):( <span style={{padding: "1em", cursor: "pointer", borderRadius: "10px", fontSize:'1.7rem'}}></span>)}
                    </div>
                    <div className='carwash-modal'>
                        <table className="users-list">
                                <tbody>
                                <tr style={{color:'var(--normal)'}}>
                                        <td>Name</td>
                                        <td>Price</td>
                                        <td>Status</td>
                                        <td>Delete</td>
                                    </tr>
                                    {products.map((e,i) => 
                                    <tr key={i} onClick={() => {setID2(i), setSelectedUser(e)}} style={{fontWeight:'400'}}>
                                        <td>{e.name}</td>
                                        <td>{e.price}</td>
                                        <td onClick={(event) => event.stopPropagation()}><label className="switch"><input type="checkbox" checked={e.active} onChange={(event) => handleProductStatusChange(e.id, event.target.checked)}/><span className="slider round"></span></label></td>
                                        <td>Delete button</td>
                                    </tr>
                                    )}
                                </tbody>
                        </table>
                    </div>
                </div> )} 

            {addID !== null && (
                        <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: addID !== null ? "min(70rem, 80%)" : 0, display: "flex", left: "50%", top: "45%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: addID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                                <span></span>
                                <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add CarWash</span>
                                <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setAddID(null)}}>X</span>
                            </div>
                            <div className='carwash-modal'>
                                   <div>
                                       <span style = {{color:'var(--normal)'}}>Name</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                                type="text" 
                                                value={uploadNewCarWash.name} 
                                                onChange={(e) => setUploadNewCarWash(prev => ({...prev, name: e.target.value}))}
                                                />
                                        <span style = {{color:'var(--normal)'}}>Address</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="text" 
                                            value={uploadNewCarWash.address} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, address: e.target.value}))}
                                            />
                                        <span style = {{color:'var(--normal)'}}>OpenTime</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}} 
                                            type="text" 
                                            value={uploadNewCarWash.openTime} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, openTime: e.target.value}))}
                                            />
                                        <span style = {{color:'var(--normal)'}}>Contact</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="text" 
                                            value={uploadNewCarWash.contact} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, contact: e.target.value}))}
                                            />
        
                                        <button className='modal-button' onClick={handleAddCarWash}>
                                            <IoMdAdd size="2rem" />
                                            <span style={{fontSize:'1.6rem'}}>Add Carwash</span>
                                        </button>
                                   </div>
                                   <div>
                                   <MapContainer style={{ width: "100%", height: "100%" }} center={center} zoom={18} zoomControl={false} minZoom={5}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <DraggableMarker />
                                    <UpdateCenter address={uploadNewCarWash.address} />
                                    </MapContainer>
                                   </div>
                            </div>
                </div> )}

            <div className="dashboard-admin">

                <div className="search-table-div">
                    <div className='searchContainer'>
                        <div>
                            <input 
                                type="text" 
                                name="search" 
                                ref = {searchInputRef}
                                placeholder='Search a carwash by name or address...'
                            />
                            <button type='submit' onClick={handleChangeSearchParams} >
                                <CiSearch style = {{height:'100%', fontSize:'1.5rem'}}/>
                            </button>
                        </div>
                    </div>        

                    <table className="carwash-list">
                        <tbody>
                            <tr style={{fontSize:'1.5em', fontWeight:'700'}}>
                                <td></td>
                                <td>Name</td>
                                <td>Address</td>
                                <td>Status</td>
                            </tr>
                            {carWashes.map((e,i) => 
                            <tr style={{color:'var(--accent)'}} onClick={async () => {
                                setID(i);
                                setSelectedCarwash(e);
                                const response = await adminInstance().get("/carwash/users", {
                                    params: {
                                    searchString: '',
                                    pageNumber: searchParams.page,
                                    limit: searchParams.limit,
                                    carWashID: e.id
                                    }
                                });
                                const data = response.data;
                                setUsers(data);

                                const response2 = await clientInstance().get("service", {
                                    params: {
                                        carWashID: e.id,
                                    }
                                });
                                const data2 = response2.data;
                                setProducts(data2);
                            }}>
                                <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                                <td>{e.name}</td>
                                <td>{e.address}</td>
                                <td onClick={(event) => event.stopPropagation()}><label className="switch"><input type="checkbox" checked={e.active} onChange={(event) => handleCarwashStatusChange(e.id, event.target.checked)}/><span className="slider round"></span></label></td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", gap: "1em", fontSize:"1.2em", padding: "1em", alignItems: "center"}}>
                    <span style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", marginRight: "-.8em", fontSize:'1.2rem'}} onClick={() => {if(searchParams.page <= 1)return; setSearchParams(prev => ({...prev, page: prev.page - 1}));}}>{<FaMinus />}</span>
                    <span style={{marginBottom:".4em"}}>{searchParams.page} of {Math.round(totalCarWashes / searchParams.limit) === 0 ? 1 : Math.ceil(totalCarWashes / searchParams.limit)}</span>
                    <span style={{padding: ".5em", cursor: "pointer", borderRadius: "10px", marginLeft: "-.8em"}} onClick={() => {if(searchParams.page >= Math.ceil(totalCarWashes / searchParams.limit))return; setSearchParams(prev => ({...prev, page: prev.page + 1}));}}>{<FaPlus />}</span>
                </div>

                <div className="user-div">
                    <button className='modal-button' onClick={() => setAddID(1)}>
                        <IoMdAdd size="2rem" />
                        <span style={{fontSize:'1.6rem'}}>Add Carwash</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;