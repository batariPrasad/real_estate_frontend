import { useState, useEffect } from "react";
import { fetchData } from "../../../api/apiHandler";
import { config } from "../../../api/config";
import { Galleria } from "primereact/galleria";
import { Link } from "react-router-dom";
import "./getAllProperties.css"

const GetAllProperties = () => {
    const [properties, setProperties] = useState([]);

    // Fetch properties from API
    const getAllProperties = async () => {
        try {
            let res = await fetchData(config.getAllProperties);
            if (res.success && res.data?.success && Array.isArray(res.data.data)) {
                setProperties(res.data.data);
            } else {
                setProperties([]);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    useEffect(() => {
        getAllProperties();
    }, []);

    return (
        <div className="container-fluid bg-secondary ">
            <div className="row">
                <div className="text-center fs-3 mb-4">Property Listings</div>
                {properties.map((property) => (
                    <div key={property.id} className="col-md-3 mb-4">
                        <div className="card shadow-sm position-relative">
                            {/* Image Gallery with Overlay */}
                            <div className="position-relative">
                                <Galleria
                                    value={Array.isArray(property.images) ? property.images : []}
                                    numVisible={5}
                                    circular
                                    showThumbnails={false}
                                    style={{ maxWidth: "100%", height: "200px" }}
                                    item={(item) => (
                                        <img src={item} alt="Property" className="w-100 property-img" />
                                    )}
                                />
                                <div className="overlay">
                                    <span className="owner-type">
                                        <i className="pi pi-user"></i> {property.ownerType}
                                    </span>
                                    <span className="city">
                                        <i className="pi pi-map-marker"></i> {property.city}
                                    </span>
                                </div>
                            </div>
                            {/* Property Details */}
                            
                            <div className="card-body">
                            
                
                                        <div> <i className="pi pi-building"></i> {property.propertyType} </div>
                                       <div>  <i className="pi pi-map-marker"></i> {property.locality}  </div>
                                       <div className="mb-2">  <i className="pi pi-money-bill"></i> {property.budget}  </div>
                                
                               <div className="text-center">  <Link to={`/property/${property.id}`} className="btn btn-primary btn-sm ">
                                    <i className="pi pi-eye"></i> View 
                                </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetAllProperties;
