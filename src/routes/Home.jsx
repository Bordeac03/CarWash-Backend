import React, { useEffect, useState } from "react";
import { RiCarWashingFill } from "react-icons/ri";
import { ToggleSlider }  from "react-toggle-slider";
import { IoMdAdd } from "react-icons/io";
import { adminInstance } from "../util/instances";

const Home = () => {
    const [status, setStatus] = useState('Active');
    const [ID, setID] = useState(null);
    const [ID2, setID2] = useState(null);
    const [ID3, setID3] = useState(null);
    const [ID4, setID4] = useState(null);

    const [carWashes, setCarWashes] = useState([]);
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
        => pentru a adauga un carwash vom construi un obiect JSON cu urmatorii parametri,  eu iti  las o chestie ca la search, ramane la decizia ta daca o folosesti sau nu
    */

    const [searchParams, setSearchParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    });

    const [uploadNewCarWash, setUploadNewCarWash] = useState({
        name: "",
        address: "",
        latitude: 0.0,
        longitude: 0.0,
        active: false,
        openTime: "",
        contact: ""
    });

    const handleChangeSearchParams = (event) => {
        if (searchParams[event.target.name] && searchParams[event.target.name] == event.target.value) {
          return;
        }
        setSearchParams(prev => {
          return {
            ...prev,
            [event.target.name]: event.target.value
          };
        });
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
          if (!res.data) {
            return;
          }
          setCarWashes(res.data.data);
          setTotalCarWashes(res.data.total);
        })
        .catch((err) => console.log(err));
    };

    const handleCarwashStatusChange = (id, status) => {
        // id -> carWashID
        // status -> boolean
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

    const handleAddCarWash = () => {
        adminInstance().post("/carwash", uploadNewCarWash)
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        })
        .catch((err) => console.log(err));
    };

// ======================================================================================================

    const handleStatusChange = (newStatus) => {
        console.log(newStatus); // Log the new status
        setStatus(newStatus);
    };

    const ToggleSliderWithStatus = () => {
        const handleChange = (event) => {
            const newStatus = event.target.checked ? 'Active' : 'Inactive';
            handleStatusChange(newStatus);
        };

        return <ToggleSlider onChange={handleChange} />;
    };

    // useEffect calls
    useEffect(() => {
        update();
    }, [searchParams]);

    return (
        <div>
            {ID !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "30%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                        <span></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Carwash Settings</span>
                        <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID(null)}}>X</span>
                    </div>
                    <div className='carwash-modal'>
                        <div>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add User</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Update Users</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add Products</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Update Products</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Order History</span>
                            </button>
                        </div>
                    </div>
                </div> )} 

            {ID2 !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID2 !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "55%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID2 !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                        <span></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add User</span>
                        <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID2(null)}}>X</span>
                    </div>
                    <div className='carwash-modal'>
                        <div>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add User</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add Products</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Order History</span>
                            </button>
                        </div>
                    </div>
                </div> )} 

                {ID3 !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID3 !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "55%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID3 !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                        <span></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add Products</span>
                        <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID3(null)}}>X</span>
                    </div>
                    <div className='carwash-modal'>
                        <div>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add User</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add Products</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Order History</span>
                            </button>
                        </div>
                    </div>
                </div> )} 

                {ID4 !== null && (
                <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: ID4 !== null ? "min(800px, 80%)" : 0, display: "flex", left: "50%", top: "55%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: ID4 !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                        <span></span>
                        <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Order History</span>
                        <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setID4(null)}}>X</span>
                    </div>
                    <div className='carwash-modal'>
                        <div>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add User</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Add Products</span>
                            </button>
                            <button className='modal-button'>
                                <IoMdAdd size="2rem" />
                                <span style={{fontSize:'1.6rem'}}>Order History</span>
                            </button>
                        </div>
                    </div>
                </div> )} 

            <div className="dashboard-admin">
                <h1>Admin Dashboard</h1>
                <table className="carwash-list">
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Name</td>
                            <td>Address</td>
                            <td>Status</td>
                        </tr>
                        <tr>
                            <td onClick={() => setID(1)}><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                            <td onClick={() => setID(1)}>Car Wash 1</td>
                            <td onClick={() => setID(1)}>1234 Main St</td>
                            <td><div><ToggleSliderWithStatus/> #RESPONSIVE SLIDER</div></td>
                        </tr>
                        <tr onClick={() => setID(1)}>
                            <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                            <td>Car Wash 1</td>
                            <td>1234 Main St</td>
                            <td><div><ToggleSliderWithStatus/> #RESPONSIVE SLIDER</div></td>
                        </tr>
                        <tr onClick={() => setID(1)}>
                            <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                            <td>Car Wash 1</td>
                            <td>1234 Main St</td>
                            <td><div><ToggleSliderWithStatus/> #RESPONSIVE SLIDER</div></td>
                        </tr>
                        <tr onClick={() => setID(1)}>
                            <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                            <td>Car Wash 1</td>
                            <td>1234 Main St</td>
                            <td><div><ToggleSliderWithStatus/> #RESPONSIVE SLIDER</div></td>
                        </tr>
                        <tr onClick={() => setID(1)}>
                            <td><button style={{fontSize:'3rem'}}><RiCarWashingFill /></button></td>
                            <td>Car Wash 1</td>
                            <td>1234 Main St</td>
                            <td><div><ToggleSliderWithStatus/> #RESPONSIVE SLIDER</div></td>
                        </tr>
                    </tbody>
                </table>
                <span> PAGE BACK // NEXT PAGE </span>
                <div className="user-div">
                    <button className='modal-button'>
                        <IoMdAdd size="2rem" />
                        <span style={{fontSize:'1.6rem'}}>Add Carwash</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;