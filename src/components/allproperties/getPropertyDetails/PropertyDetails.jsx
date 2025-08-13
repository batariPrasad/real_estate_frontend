import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../../../api/apiHandler";
import { config } from "../../../api/config";
import { Galleria } from "primereact/galleria";
import "./propertyDetails.css"; // Add a CSS file for styling

const PropertyDetails = () => {
    const { id } = useParams(); // Get property ID from URL
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                let res = await fetchData(`${config.getPropertyById}/${id}`);
                if (res.success && res.data?.success) {
                    setProperty(res.data.data);
                } else {
                    console.error("Invalid API response:", res);
                }
            } catch (error) {
                console.error("Error fetching property details:", error);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    if (!property) return <div className="loading-container">Loading...</div>;

    return (
        <div className="container-fluid mt-3">
            <div className="property-card ">
                <h2 className="property-title">{property.propertyType} Details</h2>

                {/* Image Gallery */}
                <div className="row">
                    <div className="col-lg-7">
                        <div className="galleria-container">
                            <Galleria
                                value={property.images}
                                numVisible={5}
                                circular
                                autoPlay
                                transitionInterval={5000}
                                showThumbnails={true}
                                showIndicators={false} // Hide indicators if they interfere
                                style={{ maxWidth: "100%", position: "relative" }}
                                item={(item) => <img src={item} alt="Property" className="property-image" />}
                                thumbnail={(item) => <img src={item} alt="Property" className="thumbnail-image" />}
                                pt={{
                                    previousButton: "galleria-nav-btn prev-btn",
                                    nextButton: "galleria-nav-btn next-btn"
                                }}
                            />
                        </div>
                    </div>
                    {/* Property Details */}
                    <div className="col-lg-5">
                        <div className="property-info scrollable-section">
                            <h3><i className="pi pi-home"></i> Property Details</h3>
                            <div>
                                <div className="info-grid">
                                    <p><i className="pi pi-user"></i> <b>Owner Type:</b> {property.ownerType}</p>
                                    <p><i className="pi pi-map-marker"></i> <b>City:</b> {property.city}</p>
                                    <p><i className="pi pi-globe"></i> <b>Locality:</b> {property.locality}</p>
                                    <p><i className="pi pi-building"></i> <b>Property Type:</b> {property.propertyType}</p>
                                    <p><i className="pi pi-phone"></i> <b>Contact Number:</b> {property.phone}</p>
                                    <p><i className="pi pi-sync"></i> <b>Transaction Type:</b> {property.transactionType}</p>
                                    <p><i className="pi pi-map"></i> <b>Society Name:</b> {property.societyName}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Total Flats:</b> {property.totalFlats}</p>
                                    <p><i className="pi pi-home"></i> <b>BHK:</b> {property.bhk}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Balconies:</b> {property.balconies}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Floor No:</b> {property.floorNo}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Total Floors:</b> {property.totalFloors}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Facing:</b> {property.facing}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Bathrooms:</b> {property.bathrooms}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Floors Allowed:</b> {property.floorsAllowed}</p>
                                    <p><i className="pi pi-th-large"></i> <b>Area:</b> {property.area} sqft</p>
                                    <p><i className="pi pi-th-large"></i> <b>Super Area:</b> {property.superArea} sqft</p>
                                    <p><i className="pi pi-th-large"></i> <b>Built-up Area:</b> {property.builtupArea} sqft</p>
                                    <p><i className="pi pi-th-large"></i> <b>Carpet Area:</b> {property.carpetArea} sqft</p>
                                    <p><i className="pi pi-calendar"></i> <b>Available From:</b> {property.availableFrom}</p>
                                </div>

                                <h3><i className="pi pi-wallet"></i> Pricing Details</h3>
                                <div className="info-grid">
                                    <p><i className="pi pi-money-bill"></i> <b>Budget:</b> ₹{new Intl.NumberFormat('en-IN').format(property.budget)}</p>
                                    <p><i className="pi pi-tag"></i> <b>Base Price:</b> ₹{new Intl.NumberFormat('en-IN').format(property.basePrice)}</p>
                                    <p><i className="pi pi-dollar"></i> <b>PLC:</b> ₹{new Intl.NumberFormat('en-IN').format(property.plc)}</p>
                                    <p><i className="pi pi-car"></i> <b>Parking Charges:</b> ₹{new Intl.NumberFormat('en-IN').format(property.parkingCharges)}</p>
                                    <p><i className="pi pi-credit-card"></i> <b>Booking Amount:</b> ₹{new Intl.NumberFormat('en-IN').format(property.bookingAmount)}</p>
                                    <p><i className="pi pi-cog"></i> <b>Maintenance Charges:</b> ₹{new Intl.NumberFormat('en-IN').format(property.maintenanceCharges)}</p>
                                    <p><i className="pi pi-percentage"></i> <b>Stamp Duty:</b> ₹{new Intl.NumberFormat('en-IN').format(property.stampDuty)}</p>
                                </div>

                                <h3><i className="pi pi-info-circle"></i> Additional Info</h3>
                                <div className="info-grid">
                                    <p><i className="pi pi-palette"></i> <b>Furnished Status:</b> {property.furnishedStatus}</p>
                                    <p>
                                        <i className="pi pi-home me-2"></i>
                                        <b>Possession Status:</b> {property.possessionStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                {/* <div className="btn-container">
                    <Link to="/" className="btn btn-secondary">
                        <i className="pi pi-arrow-left"></i> Back to Listings
                    </Link>
                </div> */}

            </div>
        </div>
    );
};

export default PropertyDetails;
