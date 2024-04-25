import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useContext } from 'react'; 
import { OpenStreetMapProvider } from 'leaflet-geosearch';
// import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { RiCarWashingFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { clientInstance } from '../util/instances';
import { UserContext } from '../util/UserContext';
import Cookies from 'js-cookie';
import L from 'leaflet'

const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

const Location = () => {
	const map = useMap();
	const [location, setLocation] = useState(null);
	

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setLocation([position.coords.latitude, position.coords.longitude]);
			});
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}, []);

	useEffect(() => {
		if (location?.length <= 0 || location === null)
			return;
		if (!map)
			return;
		map.setView(location, map.getZoom(), {
			animate: true,
		});
	}, [location,map]);

	return location === null ? null : (
		<Marker position={location} >
			<Popup>
				Current location
			</Popup>
		</Marker>
	)
}

const SearchField = () => {
	const provider = new OpenStreetMapProvider({params: {
		countrycodes: 'ro'
	}});
	const [results, setResults] = useState([]);
	const map = useMap();
	const lastMarker = useRef(null);
	const div = useRef(null);

	const debouncedSearch = debounce((query) => {
		provider.search({ query }).then((result) => {
			setResults(result);
		});
	}, 300);

	const handleSuggestion = (result) => {
		if (!result)
			return;

		map.setView([result.y, result.x], 17, {
			animate: true,
		});

		if (lastMarker.current) {
			map.removeLayer(lastMarker.current);
		}
		
		lastMarker.current = L.marker([result.y, result.x]).addTo(map)
		.bindPopup('Your destination')
		.openPopup();
		setResults([]);
	}

	useEffect(() => {
		const searchContainer = div.current;

		const handleMouseOver = () => {
			console.log("disable");
			map.dragging.disable();
		};
	
		const handleMouseOut = () => {
			map.dragging.enable();
		};
	
		searchContainer.addEventListener('mouseover', handleMouseOver);
		searchContainer.addEventListener('mouseout', handleMouseOut);
	
		return () => {
		searchContainer.removeEventListener('mouseover', handleMouseOver);
		searchContainer.removeEventListener('mouseout', handleMouseOut);
		};
	}, [map])
	

	return (
		<div ref={div} className='searchContainer'>
			<div>
				<input onChange={e => debouncedSearch(e.target.value)} type='text' placeholder='Search for carwash...'/>
				<button type='submit' onClick={() => handleSuggestion(results.length > 0 ? results[0] : undefined)}>
					<i className='fa fa-search' />
				</button>
			</div>
			<div className='suggestionsContainer'>
				{results.map((result,index) => (
					<span key={index} onClick={() => handleSuggestion(result)}>
						{result.label}
					</span>
				))}
			</div>
		</div>
	);
};
  

export const Home = () => {

	const [shops, setShops] = useState([
		{
			position: [44.46560480895902, 26.085481471163934],
			name: "carwash 1",
			address: "Piața Charles de Gaulle 3, București",
			photos: [

				{
					id: 1,
					src: "https://media-cdn.tripadvisor.com/media/photo-s/10/82/e3/1b/wwwbobcoffee.jpg",
					alt: "BOB Coffee Lab"
				},
				{
					id: 2,
					src: "https://europeancoffeetrip.com/wp-content/uploads/2017/09/bob-1024x683.jpg",
					alt: "BOB Coffee Lab"
				},
				{
					id: 3,
					src: "https://bucharest.io/wp-content/uploads/bob.jpg",
					alt: "BOB Coffee Lab"
				}
			
			],
			services: [
			{
				product: "Basic Wash",
				price: "50 RON",
				size: "Small Car"
			}, 
			{
				product: "Basic Wash",
				price: "70 RON",
				size: "Medium Car"
			},
			{
				product: "Basic Wash",
				price: "90 RON",
				size: "Large Car"
			},
			{
				product: "Deluxe Wash",
				price: "100 RON",
				size: "Small Car"
			},
			{
				product: "Deluxe Wash",
				price: "120 RON",
				size: "Medium Car"
			},
			{
				product: "Deluxe Wash",
				price: "140 RON",
				size: "Large Car"
			},
			{
				product: "Premium Wash",
				price: "150 RON",
				size: "Small Car"
			},
			{
				product: "Premium Wash",
				price: "170 RON",
				size: "Medium Car"
			},
			{
				product: "Premium Wash",
				price: "190 RON",
				size: "Large Car"
			}
		],
			contactInfo: {
				phone: "0748 880 038",
				email: "dog@bob.coffee"
			}
		},
		{	
			position: [44.4614023197076, 26.09392495767213],
			name: "carwash2",
			address: "Calea Dorobanți 186, București 010584",
			photos: [
				{
					id: 1,
					src: "https://www.anuala.ro/proiecte/2022/170/thumb.jpg",
					alt: "Origo Dorobanti"
				},
				{
					id: 2,
					src: "https://media-cdn.tripadvisor.com/media/photo-s/28/97/57/51/our-concept-coffee-shop.jpg",
					alt: "Origo Dorobanti"
				},
				{
					id: 3,
					src: "https://www.igloo.ro/wp-content/uploads/IMG_1970.jpg",
					alt: "Origo Dorobanti"
				}
			],
			services: [
				{
					product: "Basic Wash",
					price: "50 RON",
					size: "Small Car"
				}, 
				{
					product: "Basic Wash",
					price: "70 RON",
					size: "Medium Car"
				},
				{
					product: "Basic Wash",
					price: "90 RON",
					size: "Large Car"
				},
				{
					product: "Deluxe Wash",
					price: "100 RON",
					size: "Small Car"
				},
				{
					product: "Deluxe Wash",
					price: "120 RON",
					size: "Medium Car"
				},
				{
					product: "Deluxe Wash",
					price: "140 RON",
					size: "Large Car"
				},
				{
					product: "Premium Wash",
					price: "150 RON",
					size: "Small Car"
				},
				{
					product: "Premium Wash",
					price: "170 RON",
					size: "Medium Car"
				},
				{
					product: "Premium Wash",
					price: "190 RON",
					size: "Large Car"
				}
			],
			contactInfo: {
				phone: "0759 637 564",
				email: "office@origocoffee.ro"
			}
		},
		{
			position: [44.465489924792635, 26.08584307116393],
			name: "carwash3",
			address: "Piața Charles de Gaulle 13, București 011857",
			photos: [
				{
					id: 1,
					src: "data:image/jpeg;base64,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",
					alt: "New STEAM Coffee Shop"
				},
				{
					id: 2,
					src: "https://lh5.googleusercontent.com/p/AF1QipOIteF4wUW_67MqLMsaUSwduVZDV_4uxZ49eC-h=w203-h152-k-no",
					alt: "New STEAM Coffee Shop"
				},
				{
					id: 3,
					src: "https://lh5.googleusercontent.com/p/AF1QipNVkY_DnhCrPQjEt1au0xIjRcs-8Jt9d_9sibeQ=w203-h152-k-no",
					alt: "New STEAM Coffee Shop"
				}
			],
			services: [
			{
				product: "Basic Wash",
				price: "50 RON",
				size: "Small Car"
			}, 
			{
				product: "Basic Wash",
				price: "70 RON",
				size: "Medium Car"
			},
			{
				product: "Basic Wash",
				price: "90 RON",
				size: "Large Car"
			},
			{
				product: "Deluxe Wash",
				price: "100 RON",
				size: "Small Car"
			},
			{
				product: "Deluxe Wash",
				price: "120 RON",
				size: "Medium Car"
			},
			{
				product: "Deluxe Wash",
				price: "140 RON",
				size: "Large Car"
			},
			{
				product: "Premium Wash",
				price: "150 RON",
				size: "Small Car"
			},
			{
				product: "Premium Wash",
				price: "170 RON",
				size: "Medium Car"
			},
			{
				product: "Premium Wash",
				price: "190 RON",
				size: "Large Car"
			}
		],
		contactInfo: {
				phone: "0751 680 914",
				email: "steamcoffe@coffee.com",
			}
		},
		{
			position: [44.421901183309515, 26.020715557672126],
			name: "carwash4",
			address: "Bucharest 061403",
			photos: [
				{
					id: 1,
					src: "https://lh5.googleusercontent.com/p/AF1QipNZyxa7If5Fz5k17PfENOwdlG2bZmOZQe2sA6aG=w203-h114-k-no",
					alt: "Atelierul De Cafea"
				},
				{
					id: 2,
					src: "https://lh5.googleusercontent.com/p/AF1QipPPCosw6JhYbDMLVWmTxu7Z6g6Y0if7Rc8EHhZu=w203-h417-k-no",
					alt: "Atelierul De Cafea"
				},
				{
					id: 3,
					src: "https://lh5.googleusercontent.com/p/AF1QipNbqNqXEXKqSixnU0RfQdNTCPXH4iekcJXNpe4q=w203-h360-k-no",
					alt: "Atelierul De Cafea"
				}
			],
			services: [
				{
					product: "Basic Wash",
					price: "50 RON",
					size: "Small Car"
				}, 
				{
					product: "Basic Wash",
					price: "70 RON",
					size: "Medium Car"
				},
				{
					product: "Basic Wash",
					price: "90 RON",
					size: "Large Car"
				},
				{
					product: "Deluxe Wash",
					price: "100 RON",
					size: "Small Car"
				},
				{
					product: "Deluxe Wash",
					price: "120 RON",
					size: "Medium Car"
				},
				{
					product: "Deluxe Wash",
					price: "140 RON",
					size: "Large Car"
				},
				{
					product: "Premium Wash",
					price: "150 RON",
					size: "Small Car"
				},
				{
					product: "Premium Wash",
					price: "170 RON",
					size: "Medium Car"
				},
				{
					product: "Premium Wash",
					price: "190 RON",
					size: "Large Car"
				}
			],
			contactInfo: {
				phone: "0733 109 619",
				email: "leonardcaffe@yahoo.com"
			}
		},
		{
			position: [44.480024537040045, 26.042033315344252],
			name: "carwash5",
			address: "Bulevardul Bucureștii Noi 25, blE 012352",
			photos: [
				{
					id: 1,
					src: "https://lh5.googleusercontent.com/p/AF1QipOXNdhS8iauBFj1i_8FsP9wODKcaUDZBVlySaHA=w203-h152-k-no",
					alt: "Tuddav"
				},
				{
					id: 2,
					src: "https://lh5.googleusercontent.com/p/AF1QipO-CwrCtN2jvqVRKGURDCKMEnaP_jWFXNxVa7t2=s773-k-no",
					alt: "Tuddav"
				},
				{
					id: 3,
					src: "https://lh5.googleusercontent.com/p/AF1QipNJHB34GyO4FSoZvJrwcajU2ZVj-3nl0EXjJZn6=w203-h152-k-no",
					alt: "Tuddav"
				}
			],
			services: [
				{
					product: "Basic Wash",
					price: "50 RON",
					size: "Small Car"
				}, 
				{
					product: "Basic Wash",
					price: "70 RON",
					size: "Medium Car"
				},
				{
					product: "Basic Wash",
					price: "90 RON",
					size: "Large Car"
				},
				{
					product: "Deluxe Wash",
					price: "100 RON",
					size: "Small Car"
				},
				{
					product: "Deluxe Wash",
					price: "120 RON",
					size: "Medium Car"
				},
				{
					product: "Deluxe Wash",
					price: "140 RON",
					size: "Large Car"
				},
				{
					product: "Premium Wash",
					price: "150 RON",
					size: "Small Car"
				},
				{
					product: "Premium Wash",
					price: "170 RON",
					size: "Medium Car"
				},
				{
					product: "Premium Wash",
					price: "190 RON",
					size: "Large Car"
				}
			],
			contactInfo: {
				phone: "0722 582 018",
				email: "tuddavcoffee@coffee.com"
			}
		}
	]);

	const [location, setLocation] = useState(null);
	const [current, setCurrent] = useState(0);
	const [phLength, setPhLength] = useState(0);
	const [popup, setPopup] = useState("main");
	const [selectedServices, setSelectedServices] = useState([]);
	const [placeOrder, setPlaceOrder] = useState(false);
	const [runLocationOnce, setRunLocationOnce] = useState(false);

	const userContext = useContext(UserContext);

	const navigate = useNavigate();

	const nextSlide = () => {
		setCurrent(current === phLength - 1 ? 0 : current + 1);
	};

	const prevSlide = () => {
		setCurrent(current === 0 ? phLength - 1 : current - 1);
	};

	useEffect(() => {
		let auxShops = [];
		clientInstance().get("/carwash").then((res) => {
			res.data.forEach((shop) => {
				auxShops.push({
					ID: shop.ID,
					position: [shop.latitude, shop.longitude],
					name: shop.name,
					address: shop.address,
					contactInfo: {
						email: shop.contact,
					}
				});
			});
			setShops(auxShops);
		}).catch((err) => {
			console.log(err);
		});
	}, []);

	useEffect(() => 
		{
			location?.photos && setPhLength(location?.photos.length);

			let auxServices = [];
			if (runLocationOnce) clientInstance().get("/service", {
				params: {
					carWashID: location?.ID
				}
			})
			.then((res) => {
				res.data.forEach((service) => {
					auxServices.push({
						ID: service.ID,
						product: service.name,
						price: service.price,
						carWashID: service.carWashID,
					});
				})
				setRunLocationOnce(false);
				setLocation(prev => {
					return {
						...prev,
						services: auxServices
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
		}
	, [location, runLocationOnce]);

	useEffect(() => {
		if (placeOrder && selectedServices.length > 0) {
			navigate("/order", {state: {services: selectedServices, carWashID: location?.ID}})
		}
		
		return () => {
			if (placeOrder && selectedServices.length > 0) {
				setPlaceOrder(false);
				setPopup("main");
				setSelectedServices([]);
			}
		};
	}, [placeOrder]);
	
	return (
		<div className="main">
			<div className={location !== null ? 'pop-up' : 'pop-up display-none'}>
				<div className='pop-up-title-div'>
					<h1>{location?.name}</h1>
					<p>{location?.address}</p>
				</div>
				<div className={popup === "main" ? "pop-up-scroll" : "pop-up-scroll pop-up-hidden"}>
					{/* slider for pictures */}
					<section className='slider'>
					{/* <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
					{location?.photos?.map((slide, index) => {
						return (
							<div
							className={index === current ? 'slide active' : 'slide'}
							key={index}
							>
							{index === current && (
								<img src={slide.src} alt={slide.alt} className='image' />
								)}
						</div>
						);
					})}
					<FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} /> */}
					<div>
						<RiCarWashingFill size="15rem"></RiCarWashingFill>
					</div>
					</section>
					{/* button wrapper */}
					<div className="button-wrapper">
						<button onClick={() => setPopup("order")}>Order</button>
						<button onClick={() => setPopup("contact")}>Contact</button>
					</div>
					<div className="button-wrapper">
						<button style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '.1rem'
						}} onClick={() => setLocation(null)}>
							<TiArrowBack className='right-arrow'/>
							<span style={{
								fontSize: '3rem'
							}}>Close</span>
						</button>
					</div>
				</div>
				<div className={popup === "order" ? "pop-up-scroll" : "pop-up-scroll pop-up-hidden"}>
					{/* list of carwashes */}
					<div className='list-of-coffes'>
						<h1>Choose your service</h1>
						<ul>
							{location?.services && location?.services.map((service, index) => (
								<li key={index}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											flexDirection: "row"
										}}
									>
										<div 
											style={{
												margin: "0",
												padding: "0",
											}}
										>
											<span style={{
												fontSize: "1.5rem",
												fontWeight: "900"
											}}>{service.product}</span>
											<div style={{
												display: "flex",
												alignItems: "center",
												gap: "1rem"
											}}>
												<span>{service.price}</span>
												{/* <span>{service.size}</span> */}
											</div>
										</div>

										<div className='div-plus-minus'>
											<CiCircleMinus className='plus-minus' onClick={() => {
												setSelectedServices(
													prev => {
														const carwashIndex = prev.findIndex((item) => item.service === service)
														if (carwashIndex === -1) {
															return [...prev];
														} else {
															const newPrev = [...prev];
															if (newPrev[carwashIndex].count > 0) {
															newPrev[carwashIndex] = {...newPrev[carwashIndex], count: newPrev[carwashIndex].count - 1};
															}
															return newPrev;
														}
													}
												);
											}}/>
											<span>{selectedServices?.find((item) => item.service === service) ? selectedServices?.find((item) => item.service === service)?.count : 0}</span>
											<CiCirclePlus className='plus-minus'
											onClick={() => {
												setSelectedServices(
													prev => {
														const carwashIndex = prev.findIndex((item) => item.service === service)
														if (carwashIndex === -1) {
															return [...prev, {service: service, carWashID: location?.ID, count: 1}]
														} else {
															const newPrev = [...prev];
															newPrev[carwashIndex] = {...newPrev[carwashIndex], count: newPrev[carwashIndex].count + 1};
          													return newPrev;
														}
													}
												);
											}}/>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="button-wrapper">
						<button onClick={() => {
							setPlaceOrder(true);
						}}>Place Order</button>
					</div>
					<div className="button-wrapper">
						<button onClick={() => {
							setPopup("main");
							setSelectedServices([]);
					}}>Back</button>
					</div>
				</div>
				<div className={popup === "contact" ? "pop-up-scroll" : "pop-up-scroll pop-up-hidden"}>
					{/* contact info */}
					<div className='contact-info'>
						<h1>Contact</h1>
						{/* <p>Phone: {location?.contactInfo.phone}</p> */}
						<p>Email: {location?.contactInfo.email}</p>
					</div>
					<div className="button-wrapper">
						<button onClick={() => {
							setPopup("main");
						}}>Back</button>
					</div>
				</div>
			</div>
			{userContext.activeOrder && <button style={{ 
				zIndex: "9999", 
				position: "fixed", 
				bottom: "20px",
				left: "50%", 
				transform: "translateX(-50%)", 
				backgroundColor: "green",
				padding: "10px 20px", 
				color: "white", 
				border: "none",
				borderRadius: "5px", 
				fontSize: "3rem"
			}} onClick={() => {
				clientInstance().patch("/order")
				.then((res) => {
					if (res.status === 200) {
						userContext.setActiveOrder(false);
						Cookies.remove('order');
					}
				})
				.catch((err) => {
					console.log(err);
				});
			}}>Close-By Button</button>}
			<MapContainer style={{ width: "100%", height: "100%" }} center={[44.4268, 26.1025]} zoom={18} zoomControl={false} minZoom={17}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{shops.map((shop, index) => (
					<Marker key={index} position={shop.position}>
						<Popup>
							<span className='span-carwash-shop' onClick={() => {
									if (!userContext.activeOrder) {
										setLocation(shop);
										setRunLocationOnce(true);
									}
								}}>{shop.name}</span>
						</Popup>
					</Marker>
				))}
				<Location />
				<SearchField />
			</MapContainer>
		</div>
	);	
}
