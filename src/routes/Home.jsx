import React, { useEffect, useState, useRef, useMemo } from "react";
import { RiCarWashingFill } from "react-icons/ri";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { IoMdAdd } from "react-icons/io";
import { adminInstance } from "../util/instances";
import { CiSearch } from "react-icons/ci";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward, IoMdCheckmark } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

const Home = () => {
    const [ID, setID] = useState(null);
    const [ID2, setID2] = useState(null);
    const [addUserID, setAddUserID] = useState(null);
    const [ID3, setID3] = useState(null);
    const [addProductID, setAddProductID] = useState(null);
    const [addID, setAddID] = useState(null);
    const [descending, setDescending] = useState(0);

    const searchInputRef = useRef();
    const productInputRef = useRef();
    const userInputRef = useRef();
    const [center, setCenter] = useState([44.4268, 26.1025]);
	const provider = new OpenStreetMapProvider({params: {
		countrycodes: 'ro'
	}});

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [carWashes, setCarWashes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedCarwash, setSelectedCarwash] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState({});
    const [totalCarWashes, setTotalCarWashes] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [isEditProductMode, setIsEditProductMode] = useState(false);
    const [editedCarwashIDs, setEditedCarwashIDs] = useState({});
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const statusChangedRef = useRef(false);
    const [hasFetchedUser, setHasFetchedUser] = useState(false);

    const initialCarWashState = {
        name: "",
        address: "",
        latitude: 0.0,
        longitude: 0.0,
        active: false,
        openTime: "",
        phoneNumber: "",
        email: ""
    };

    const initialUserState = {
        fullName: "",
        email: "",
        role: "carwash",
        password: "",
        active: false
    };

    const initialProductState = {
        name: "",
        price: 0,
        active: false
    };

    const [uploadNewCarWash, setUploadNewCarWash] = useState(initialCarWashState);

    const [addNewUser, setAddNewUser] = useState(initialUserState);

    const [addNewProduct, setAddNewProduct] = useState(initialProductState);

    const [searchParams, setSearchParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    });

    const [userSearchParams, setUserSearchParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    });

    const [productSearchParams, setProductSearchParams] = useState({
        page: 1,
        limit: 5,
        search: ''
    });

    const [orderHistorySearchParams, setOrderHistorySearchParams] = useState({
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

    const handleProductChangeSearchParams = (event) => {
        event.preventDefault();
        
        const searchValue = productInputRef.current.value;

        if (productSearchParams.search && productSearchParams.search === searchValue) {
            return;
        }

        setProductSearchParams(prev => {
            return {
                ...prev,
                search: searchValue
            };
        });
    };

    const handleUserChangeSearchParams = (event) => {
        event.preventDefault();
    
        const searchValue = userInputRef.current.value;
      
        if (userSearchParams.search && userSearchParams.search === searchValue) {
          return;
        }
      
        setUserSearchParams(prev => {
          return {
            ...prev,
            search: searchValue
          };
        });
    };

    const handlePagination = (direction) => {
        let newPage = userSearchParams.page;
        if (direction === 'next' && userSearchParams.page < Math.ceil(totalUsers / userSearchParams.limit)) {
            newPage = userSearchParams.page + 1;
        } else if (direction === 'prev' && userSearchParams.page > 1) {
            newPage = userSearchParams.page - 1;
        }
        setUserSearchParams(prev => ({...prev, page: newPage}));
        if (totalUsers === 0) {
            setUserSearchParams(prev => ({...prev, page: 1}));
        } else if (newPage > Math.ceil(totalUsers / userSearchParams.limit)) {
            setUserSearchParams(prev => ({...prev, page: Math.ceil(totalUsers / userSearchParams.limit)}));
        }
    };

    const handleOrderHistoryPagination = (direction) => {
        let newPage = orderHistorySearchParams.page;
        if (direction === 'next' && orderHistorySearchParams.page < Math.ceil(totalOrders / orderHistorySearchParams.limit)) {
            newPage = orderHistorySearchParams.page + 1;
        } else if (direction === 'prev' && orderHistorySearchParams.page > 1) {
            newPage = orderHistorySearchParams.page - 1;
        }
        setOrderHistorySearchParams(prev => ({...prev, page: newPage}));
        if (newPage > Math.ceil(totalOrders / orderHistorySearchParams.limit)) {
            setOrderHistorySearchParams(prev => ({...prev, page: Math.ceil(totalOrders / orderHistorySearchParams.limit)}));
        }
    };

    const handleCarWashPagination = (direction) => {
        let newPage = searchParams.page;
        const totalPages = Math.ceil(totalCarWashes / searchParams.limit);
    
        if (direction === 'next' && searchParams.page < totalPages) {
            newPage = searchParams.page + 1;
        } else if (direction === 'prev' && searchParams.page > 1) {
            newPage = searchParams.page - 1;
        }
    
        setSearchParams(prev => ({...prev, page: newPage}));
    
        if (totalCarWashes === 0) {
            setSearchParams(prev => ({...prev, page: 1}));
        } else if (newPage > totalPages) {
            setSearchParams(prev => ({...prev, page: totalPages}));
        }
    };

    const handleAddUser = () => {
        adminInstance().post("carwash/users", {
            fullName: addNewUser.fullName,
            email: addNewUser.email,
            password: addNewUser.password,
            role: addNewUser.role,
            active: addNewUser.active,
            carWashID: selectedCarwash.id
        })
        
        .then((res) => {
            if (res.status !== 200) {
                return;
            }
            
            getUser(selectedCarwash.id, userSearchParams);
            setAddUserID(null);
            setID2(1);
        })
        .catch((err) => console.log(err));
        
        setAddNewUser(initialUserState);
    };

    const getUser = (id) => {
        adminInstance().get("carwash/users", {params: {
        searchString: userSearchParams.search,
        pageNumber: userSearchParams.page,
        limit: userSearchParams.limit,
        carWashID: id
        }})
        .then((res) => {
        
        if (!res.data) {
            return;
        }
        const users = res.data.data.map(users => ({
            id: users.ID,
            fullName: users.fullName,
            email: users.email,
            role: users.role,
            active: users.active
        }));

        setUsers(res.data.data);
        setTotalUsers(res.data.total);

        if (res.data.total === 0) {
            setUserSearchParams(prev => ({...prev, page: 1}));
            } else {
            const totalNumberOfPages = Math.ceil(res.data.total / userSearchParams.limit);
            if (userSearchParams.page > totalNumberOfPages) {
                setUserSearchParams(prev => ({...prev, page: totalNumberOfPages}));
            }
        }

        })
        .catch((err) => console.log(err));
    };
    
    const handleUserStatusChange = (id, fullName, email, role, status, idCarwash) => {
        adminInstance().patch("carwash/users", {
            id: id,
            fullName: fullName,
            email: email,
            role: role,
            active: status,
            carWashID: idCarwash
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }   

            const updatedUsers = users.map(user => user.id === id ? { ...user, fullName: fullName, email: email, active: status } : user);
            setUsers(updatedUsers);

            if (!updatedUsers.find(user => user.carWashID === selectedCarwash.id)) {
                setUserSearchParams(prevParams => ({
                    ...prevParams,
                }));
                getUser(selectedCarwash.id);
            }

            console.log(id, fullName, email, role, status, idCarwash);
            statusChangedRef.current = true;
        })
        .catch((err) => console.log(err));
    };

    const getProduct = (idCarwash) => {
        adminInstance().get("/carwash/services", {
            params: {
                searchString: productSearchParams.search,
                pageNumber: productSearchParams.page,
                limit: productSearchParams.limit,
                carWashID: idCarwash
            }
        })
        .then ((res) => {
            if (!res.data) {
                return;
            }

            const products = res.data.data.map(products => ({
                id: products.ID,
                name: products.name,
                price: products.price,
                active: products.active
            }));
    
            setProducts(res.data.data);
    
            setTotalProducts(res.data.total)
        })
        .catch((err) => console.log(err));
    }

    const handleAddProduct = () => {
        adminInstance().post("carwash/services", {
            name: addNewProduct.name,
            price: addNewProduct.price,
            active: addNewProduct.active,
            carWashID: selectedCarwash.id
        })

        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            getProduct(selectedCarwash.id, productSearchParams);
            setAddProductID(null);
            setID3(1);
        })

        .catch((err) => console.log(err));

        setAddNewProduct(initialProductState);
    };

    const handleProductStatusChange = (id,name,idCarwash,price,status) => {
        adminInstance().patch("/carwash/services", {
            id: id,
            name: name,
            price: price,
            carWashID: idCarwash,
            active: status
        })

        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            setProducts(products.map(product => product.id === id ? { ...product, name: name, price: price, active: status } : product));

            setProductSearchParams(prevParams => ({
                ...prevParams,
            }));

            statusChangedRef.current = true;
        }
        )
        .catch((err) => console.log(err));
    };

    const handleDeleteProduct = (id) => {
        adminInstance().delete("/carwash/services", {
            data: {
                id: id
            }
        })

        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            setProductSearchParams(prevParams => ({
                ...prevParams,
                page: 1
            }));

            getProduct(selectedCarwash.id);
            setIsEditProductMode(false);
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

    const handleAddCarWash = () => {
        const contact = `${uploadNewCarWash.phoneNumber}, ${uploadNewCarWash.email}`;
        const newCarWash = {...uploadNewCarWash, contact};

        adminInstance().post("/carwash", newCarWash)
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        })
        .catch((err) => console.log(err));

        setUploadNewCarWash(initialCarWashState);
    };

    const handleDeleteCarWash = (id) => {
        adminInstance().delete("/carwash", {
            data: {
                id: id
            }
        })
        .then((res) => {
            if (res.status !== 200) {
                return;
            }

            update();
        })
        .catch((err) => console.log(err));
    };

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

    const getOrders = (id) => {
        adminInstance().get("/carwash/orders", {
            params: {
                searchString: '',
                pageNumber: orderHistorySearchParams.page,
                limit: orderHistorySearchParams.limit,
                descending: descending,
                carWashID: id
            }
        })
        .then ((res) => {
            if (!res.data) {
                return;
            }
            const orders = res.data.data.map(order => ({
                orderId: order.id,
                carWashOrderID: order.carWashID,
                userOrderID: order.userID,
                serviceOrderID: order.serviceID,
                orderTimeStamp: new Date(order.ts * 1000).toLocaleString(),
                orderCloseBy: order.closeBy,
                status: order.active,
            }));

            setOrders(orders);
            setTotalOrders(res.data.total);

            if (res.data.total === 0) {
                setOrderHistorySearchParams(prev => ({...prev, page: 1}));
            } else {
                const totalNumberOfPages = Math.ceil(res.data.total / orderHistorySearchParams.limit);
                if (orderHistorySearchParams.page > totalNumberOfPages) {
                    setOrderHistorySearchParams(prev => ({...prev, page: totalNumberOfPages}));
                }
            }
        })
        .catch((err) => console.log(err));
    };

// ======================================================================================================

    useEffect(() => {
        update();
    }, [searchParams]);

    useEffect(() => {
        if (selectedCarwash && !statusChangedRef.current && !hasFetchedUser) {
            getUser(selectedCarwash.id);
            setHasFetchedUser(true);
        }
        statusChangedRef.current = false;
    }, [userSearchParams]);

    useEffect(() => {
        if (selectedCarwash) {
            getUser(selectedCarwash.id);
        }
    }, [userSearchParams.page, userSearchParams.search, selectedCarwash]);
    
    useEffect(() => {
        if (selectedCarwash && !statusChangedRef.current) {
            getProduct(selectedCarwash.id);
        }
        statusChangedRef.current = false;
    }, [productSearchParams]);

    useEffect(() => {
        if (ID2 === 1) {
            setIsEditMode(false);
        } else {
            setUserSearchParams(prevParams => ({ ...prevParams, search: '' }));
        }
    }, [ID2]);

    useEffect(() => {
        if (ID3 === 1) {
            setIsEditProductMode(false);
        } else {
            setProductSearchParams(prevParams => ({ ...prevParams, search: '' }));
            if (selectedCarwash) {
                getProduct(selectedCarwash.id);
            }
        }
    }, [ID3]);

    useEffect(() => {
        if (selectedCarwash) {
            setProductSearchParams(prevParams => ({
                ...prevParams,
                page: 1
            }));
            setUserSearchParams(prevParams => ({
                ...prevParams,
                page: 1
            }));
        }
        setHasFetchedUser(false);
    }, [selectedCarwash]);

    useEffect(() => {
        if (selectedCarwash) {
            getOrders(selectedCarwash.id, orderHistorySearchParams);
        }
    }, [orderHistorySearchParams.page, selectedCarwash, descending]);

   
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
          </Marker>
        );
      };

    return (
        <div>
            {ID !== null && (
                <div className='shadow' style={{width: ID !== null ? "min(800px, 80%)" : 0, opacity: ID !== null ? 1 : 0}}>
                    <span style={{marginLeft:'auto'}} onClick={() => {setID(null)}}>X</span>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        {ID === null ? (
                            <span className='arrow-back'>
                                <IoIosArrowBack />
                            </span>
                        ):( <span className='arrow-back'></span>)}
                        <span className='order-title'>Order History for {selectedCarwash.name}</span>
                        <span className='arrow-forward' onClick={() =>{setID(null), setID2(1)}}><IoIosArrowForward /></span>
                    </div>
                    <button className='orderBy-button' onClick={() => setDescending(prev => prev === 0 ? 1 : 0)}>
                            Toggle Sort Order
                    </button>
                    <div className='addproducts-modal'>
                        <table className="users-list">
                            <tbody>
                                <tr className='users-list-header'>
                                    <td>ID</td>
                                    <td>User ID</td>
                                    <td>CarWash ID</td>
                                    <td>Service ID</td>
                                    <td>Order TimeStamp</td>
                                    <td>Status</td>
                                </tr> 
                                {orders.map((e,i) =>
                                    <tr key={i} className='users-list-row'>
                                        <td>{e.orderId}</td>
                                        <td>{e.userOrderID}</td>
                                        <td>{e.carWashOrderID}</td>
                                        <td>{e.serviceOrderID}</td>
                                        <td>{e.orderTimeStamp}</td>
                                        <td>{e.status ? 'Active' : 'Inactive'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-center'>
                        <span className='arrow-minus' onClick={() => handleOrderHistoryPagination('prev')}>{<FaMinus />}</span>
                        <span style={{marginBottom:".4em"}}>{orderHistorySearchParams.page} of {Math.round(totalOrders / orderHistorySearchParams.limit) === 0 ? 1 : Math.ceil(totalOrders / orderHistorySearchParams.limit)}</span>
                        <span className='arrow-plus' onClick={() => handleOrderHistoryPagination('next')}>{<FaPlus />}</span>
                    </div>
                </div> 
            )} 

            {ID2 !== null && (
                <div className='shadow' style={{width: ID2 !== null ? "min(800px, 80%)" : 0, opacity: ID2 !== null ? 1 : 0}}>
                    <span style={{marginLeft:'auto'}} onClick={() => {setID2(null)}}>X</span>
                    <div className='flex-space-between'>
                        <span className='arrow-back' onClick={() =>{setID(1), setID2(null)}}><IoIosArrowBack /></span>
                        <span className='order-title'>Users list for {selectedCarwash.name}</span>
                        <span className='arrow-forward' onClick={() =>{setID2(null), setID3(1)}}><IoIosArrowForward /></span>
                    </div>
                    <div className='carwash-modal'>
                        <div className='userProducts-searchContainer'>
                            <div>
                                <input 
                                    type="text" 
                                    name="search" 
                                    ref = {userInputRef}
                                    placeholder='Search a user by name or email...'
                                />
                                <button type='submit' onClick={handleUserChangeSearchParams} >
                                    <CiSearch style = {{height:'100%', fontSize:'1.5rem'}}/>
                                </button>
                            </div>
                        </div>   
                        <table className="users-list">
                            <tbody>
                                <tr className='users-list-header'>
                                    <td>Full Name</td>
                                    <td>E-Mail</td>
                                    {isEditMode && <td>CarWash</td>}
                                    <td>Actions</td>
                                </tr>
                                {users.map((user) => 
                                <tr key={user.id} className='users-list-row'>
                                    <td>
                                        {isEditMode ? 
                                            <input className="user-input" type="text" defaultValue={user.fullName} onChange={(event) => setEditedName(event.target.value)}/> 
                                            : 
                                            user.fullName
                                        }
                                    </td>
                                    <td>
                                        {isEditMode ? 
                                            <input className="user-input"  type="text" defaultValue={user.email} onChange={(event) => setEditedEmail(event.target.value)}/> 
                                            : 
                                            user.email
                                        }
                                    </td>
                                    {isEditMode && 
                                        <td>
                                        <select className="user-input-select" defaultValue={selectedCarwash.id} onChange={(e) => setEditedCarwashIDs(prev => ({ ...prev, [user.id]: e.target.value }))}>
                                            {carWashes.map((carwash) => (
                                                <option key={carwash.id} value={carwash.id}>{carwash.name}</option>
                                            ))}
                                        </select>
                                        </td>
                                    }
                                    <td onClick={(event) => event.stopPropagation()}>
                                        {isEditMode ? 
                                            <div>
                                                <button style={{fontSize:'2rem'}} onClick={() => setIsEditMode(!isEditMode)}>
                                                    <FaEdit />
                                                </button>
                                                <button style={{fontSize:'2rem'}} onClick={(event) => {
                                                    handleUserStatusChange(user.id, editedName || user.fullName, editedEmail || user.email, user.role, user.active, editedCarwashIDs[user.id] || selectedCarwash.id);
                                                    setIsEditMode(!isEditMode);
                                                }}>
                                                    <IoMdCheckmark />
                                                </button>
                                            </div>
                                            : 
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" checked={user.active} onChange={(event) => handleUserStatusChange(user.id, user.fullName, user.email, user.role, event.target.checked, selectedCarwash.id)}/>
                                                    <span className="slider round"></span>
                                                </label>
                                                <button onClick={() => setIsEditMode(!isEditMode)}>
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-center'>
                        <span className='arrow-minus' onClick={() => handlePagination('prev')}><FaMinus /></span>
                        <span style={{marginBottom:".4em"}}>
                            {userSearchParams.page} of {Math.round(totalUsers / userSearchParams.limit) === 0 ? 1 : Math.ceil(totalUsers / userSearchParams.limit)}
                        </span>
                        <span className='arrow-plus' onClick={() => handlePagination('next')}><FaPlus /></span>
                    </div>
                    <div className='flex-center'>
                        <button className='button-user-products' onClick={() => {setAddUserID(1), setID2(null)}}>
                            <IoMdAdd size="2rem" />
                            <span style={{fontSize:'1.6rem'}}>Add User</span>
                        </button>
                    </div>
                </div> 
            )}

            {ID3 !== null && (
                <div className='shadow' style={{width: ID3 !== null ? "min(800px, 80%)" : 0, opacity: ID3 !== null ? 1 : 0}}>
                    <span style={{marginLeft:'auto'}} onClick={() => {setID3(null)}}>X</span>
                    <div className='flex-space-between'>
                        <span className='arrow-back' onClick={() =>{setID2(1), setID3(null)}}><IoIosArrowBack /></span>
                        <span className='order-title'>Products page for {selectedCarwash.name}</span>
                        {ID3 === null ? (
                            <span className='arrow-forward'>
                                <IoIosArrowForward />
                            </span>
                        ):( <span className='arrow-forward'></span>)}
                    </div>
                    <div className='carwash-modal'>
                        <div className='userProducts-searchContainer'>
                            <div>
                                <input 
                                    type="text" 
                                    name="search" 
                                    ref = {productInputRef}
                                    placeholder='Search a product...'
                                />
                                <button type='submit' onClick={handleProductChangeSearchParams} >
                                    <CiSearch style = {{height:'100%', fontSize:'1.5rem'}}/>
                                </button>
                            </div>
                        </div>   
                        <table className="users-list">
                            <tbody>
                                <tr className='users-list-header'>
                                    <td>Name</td>
                                    <td>Price</td>
                                    <td>Action</td>
                                </tr>
                                {products.map((e,i) => 
                                <tr key={i} className='users-list-row'>
                                    <td>
                                        {isEditProductMode ? 
                                            <input className="user-input" type="text" defaultValue={e.name} onChange={(event) => setEditedName(event.target.value)}/> 
                                            : 
                                            e.name
                                        }
                                    </td>
                                    <td>
                                        {isEditProductMode ? 
                                            <input className="user-input"  type="number" defaultValue={e.price} onChange={(event) => setEditedPrice(event.target.value)}/> 
                                            : 
                                            e.price
                                        }
                                    </td>
                                    <td onClick={(event) => event.stopPropagation()}>
                                        {isEditProductMode ? 
                                            <div>
                                                <button className='edit-button' onClick={() => setIsEditProductMode(!isEditProductMode)}>
                                                    <FaEdit />
                                                </button>
                                                <button className='check-button' onClick={(event) => {
                                                    handleProductStatusChange(e.id, editedName || e.name, selectedCarwash.id, editedPrice || e.price, e.active);
                                                    setIsEditProductMode(!isEditProductMode);
                                                }}>
                                                    <IoMdCheckmark />
                                                </button>
                                                <button className='delete-button' onClick={(event) => {
                                                    handleDeleteProduct(e.id);
                                                }}>
                                                    <FaRegTrashCan />
                                                </button>
                                            </div>
                                            : 
                                            <div>
                                                <label className="switch">
                                                    <input type="checkbox" checked={e.active} onChange={(event) => handleProductStatusChange(e.id, e.name, selectedCarwash.id, e.price, event.target.checked)}/>
                                                    <span className="slider round"></span>
                                                </label>
                                                <button className='edit-button' onClick={() => setIsEditProductMode(!isEditProductMode)}>
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-center'>
                        <span className='arrow-minus' onClick={() => {if(productSearchParams.page <= 1)return; setProductSearchParams(prev => ({...prev, page: prev.page - 1}));}}>{<FaMinus />}</span>
                        <span style={{marginBottom:".4em"}}>{productSearchParams.page} of {Math.round(totalProducts / productSearchParams.limit) === 0 ? 1 : Math.ceil(totalProducts / productSearchParams.limit)}</span>
                        <span className='arrow-plus' onClick={() => {if(productSearchParams.page >= Math.ceil(totalProducts / productSearchParams.limit))return; setProductSearchParams(prev => ({...prev, page: prev.page + 1}));}}>{<FaPlus />}</span>
                    </div>
                    <div className='flex-center'>
                        <button className='button-user-products' onClick={() => {setAddProductID(1), setID3(null)}}>
                            <IoMdAdd size="2rem" />
                            <span style={{fontSize:'1.6rem'}}>Add Products</span>
                        </button>
                    </div>
                </div> 
            )}

            {addID !== null && (
                        <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: addID !== null ? "min(70rem, 80%)" : 0, display: "flex", left: "50%", top: "45%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: addID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <span></span>
                                <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add CarWash</span>
                                <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setAddID(null)}}>X</span>
                            </div>
                            <div className='carwash-modal'>
                                   <form style={{display:'flex', flexDirection:'column', width:'100%', marginRight:'.8rem'}} onSubmit={handleAddCarWash}>
                                        <span style = {{color:'var(--normal)'}}>Name</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="text" 
                                            value={uploadNewCarWash.name} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, name: e.target.value}))}
                                            required
                                        />
                                        <span style = {{color:'var(--normal)'}}>Address</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="text" 
                                            value={uploadNewCarWash.address} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, address: e.target.value}))}
                                            required
                                        />
                                        <span style = {{color:'var(--normal)'}}>OpenTime</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}} 
                                            type="text" 
                                            value={uploadNewCarWash.openTime} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, openTime: e.target.value}))}
                                            required
                                        />
                                        <span style = {{color:'var(--normal)'}}>Phone Number</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="tel" 
                                            pattern = "[0-9]{10}" 
                                            value={uploadNewCarWash.phoneNumber} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, phoneNumber: e.target.value}))}
                                            required
                                        />
                                        <span style = {{color:'var(--normal)'}}>Email</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="email" 
                                            value={uploadNewCarWash.email} 
                                            onChange={(e) => setUploadNewCarWash(prev => ({...prev, email: e.target.value}))}
                                            required
                                        />
                                        <button type="submit" style={{marginLeft:'4rem', display: 'flex', alignItems: 'center'}} className='addCarwash-button'>
                                            <IoMdAdd size="2rem" style={{marginBottom:'.25rem'}} />Add Carwash
                                        </button>
                                    </form>
                                   <div>
                                    <MapContainer style={{ width: "600px", height: "400px" }} center={center} zoom={18} zoomControl={false} minZoom={5}>
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

            {addUserID !== null && (
                        <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: addUserID !== null ? "min(35rem, 80%)" : 0, display: "flex", left: "50%", top: "45%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: addUserID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                                <span></span>
                                <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add User</span>
                                <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setAddUserID(null), setID2(1)}}>X</span>
                            </div>
                            <div className='addUsers-modal'>
                                       <span style = {{color:'var(--normal)'}}>Name</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                                type="text" 
                                                value={addNewUser.fullName} 
                                                onChange={(e) => setAddNewUser(prev => ({...prev, fullName: e.target.value}))}
                                                />
                                        <span style = {{color:'var(--normal)'}}>E-Mail</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="text" 
                                            value={addNewUser.email} 
                                            onChange={(e) => setAddNewUser(prev => ({...prev, email: e.target.value}))}
                                            />
                                        <span style = {{color:'var(--normal)'}}>Password</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="password" 
                                            value={addNewUser.password} 
                                            onChange={(e) => setAddNewUser(prev => ({...prev, password: e.target.value}))}
                                            />
        
                                        <button className='addUsers-button' onClick={handleAddUser}>
                                            <IoMdAdd size="2rem" />
                                            <span style={{fontSize:'1.6rem'}}>Add User</span>
                                        </button>
                            </div>
                </div> )}
            
            {addProductID !== null && (
                        <div className='shadow' style={{position: "absolute", backgroundColor: "var(--lightest)", transition: ".5s ease", width: addProductID !== null ? "min(25rem, 80%)" : 0, display: "flex", left: "50%", top: "45%", transform: "translate(-50%,-50%)", overflow: "hidden", opacity: addProductID !== null ? 1 : 0, flexDirection: "column", borderRadius: "10px", padding: "2em", fontSize: "1.2em", gap:".2em", border:'2px solid var(--normal)', boxSizing:'border-box', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex:'3000'}}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em"}}>
                                <span></span>
                                <span style={{fontSize: "1.5em", fontWeight: "900", color:"var(--normal)"}}>Add Products</span>
                                <span className='hover' style={{cursor: "pointer", borderRadius: "12px", fontWeight: "600", color:"#000000"}} onClick={() => {setAddProductID(null), setID3(1)}}>X</span>
                            </div>
                            <div className='addProducts-modal'>
                                       <span style = {{color:'var(--normal)'}}>Name</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                                type="text" 
                                                value={addNewProduct.name} 
                                                onChange={(e) => setAddNewProduct(prev => ({...prev, name: e.target.value}))}
                                                />
                                        <span style = {{color:'var(--normal)'}}>Price</span>
                                        <input style={{backgroundColor: "transparent", color: "var(--accent)", border: "1px solid var(--accent)", padding: ".5em", borderRadius: "10px", marginBottom: "1em"}}
                                            type="number" 
                                            value={addNewProduct.price} 
                                            onChange={(e) => setAddNewProduct(prev => ({...prev, price: e.target.value}))}
                                            />
                                        <button className='addProducts-button' onClick={handleAddProduct}>
                                            <IoMdAdd size="2rem" />
                                            <span style={{fontSize:'1.6rem'}}>Add Product</span>
                                        </button>
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
                                <td>Contact</td>
                                <td>Actions</td>
                            </tr>
                            {carWashes.map((e,i) => 
                            <tr key={i} style={{color:'var(--accent)'}} onClick={async () => {
                                setID(i);
                                setSelectedCarwash(e);
                            }}>
                                <td><span style={{fontSize:'3rem', color:'var(--normal)'}}><RiCarWashingFill /></span></td>
                                <td>{e.name}</td>
                                <td>{e.address}</td>
                                <td>{e.contact}</td>
                                <td onClick={(event) => event.stopPropagation()}>
                                    <div>
                                        <label className="switch">
                                            <input type="checkbox" checked={e.active} onChange={(event) => handleCarwashStatusChange(e.id, event.target.checked)}/>
                                            <span className="slider round"></span>
                                        </label>
                                        <button onClick={(event) => {
                                            handleDeleteCarWash(e.id);
                                        }}>
                                            <FaRegTrashCan />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", gap: "1em", fontSize:"1.2em", padding: "1em", alignItems: "center"}}>
                    <span onClick={() => handleCarWashPagination('prev')}>{<FaMinus />}</span>
                    <span>{searchParams.page} of {Math.ceil(totalCarWashes / searchParams.limit) === 0 ? 1 : Math.ceil(totalCarWashes / searchParams.limit)}</span>
                    <span onClick={() => handleCarWashPagination('next')}>{<FaPlus />}</span>
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