import React, { useState } from "react";
import { Steps } from "primereact/steps";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { FileUpload } from "primereact/fileupload";
import './addProperty.css'
import axios from "axios";
import { config } from "../../api/config";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";



const AddProperty = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate()

    const [selectedCity, setSelectedCity] = useState("");
    const [formData, setFormData] = useState({
        ownerType: "",
        city: "",
        locality: "",
        propertyType: "",
        transactionType: "",
        furnishedStatus: "",
        societyName: "",

        totalFlats: "",
        balconies: "",
        floorNo: "",
        totalFloors: "",
        facing: "",
        bathrooms: "",
        floorsAllowed: "",

        area: "",
        superArea: "",
        builtupArea: "",
        carpetArea: "",
        availableFrom: "",

        budget: "",
        bhk: "",
        possessionStatus: "",
        basePrice: "",
        plc: "",
        parkingCharges: "",
        bookingAmount: "",
        maintenanceCharges: "",
        stampDuty: "",

        images: []
    });


    const cityLocalities = {
        "Bengaluru": [
            "Whitefield", "Sarjapur Road", "Electronic City", "Marathahalli", "HSR Layout",
            "Koramangala", "Bellandur", "Bannerghatta Road", "Mahadevapura", "JP Nagar",
            "BTM Layout", "Doddenakundi", "Kanakapura Road", "Indira Nagar", "K R Puram",
            "Brookefield", "Thanisandra Main Road", "Yelahanka", "Hennur Road", "Horamavu",
            "Ramamurthy Nagar", "Jayanagar", "Hosur Road", "Panathur", "Hebbal",
            "Kundalahalli", "Kaggadasapura", "CV Raman Nagar", "Banashankari"
        ],
        "Mumbai": [
            "Andheri", "Bandra", "Dadar", "Goregaon", "Borivali",
            "Colaba", "Worli", "Juhu", "Thane", "Navi Mumbai"
        ],
        "Delhi": [
            "Dwarka", "Saket", "Karol Bagh", "Rohini", "Lajpat Nagar",
            "Connaught Place", "Vasant Kunj", "Pitampura", "Mayur Vihar"
        ],
        "Hyderabad": [
            "Gachibowli", "Hitech City", "Madhapur", "Banjara Hills", "Jubilee Hills",
            "Kondapur", "Manikonda", "Kukatpally", "Begumpet", "Attapur"
        ],
        "Chennai": [
            "Adyar", "Anna Nagar", "Velachery", "T Nagar", "OMR",
            "Kodambakkam", "Perungudi", "Tambaram", "Sholinganallur"
        ]
    };




    // Ensure numeric fields are sent as null if empty
    const sanitizedData = { ...formData };
    Object.keys(sanitizedData).forEach((key) => {
        if (["basePrice", "plc", "parkingCharges", "bookingAmount", "maintenanceCharges", "stampDuty"].includes(key)) {
            sanitizedData[key] = sanitizedData[key] === "" ? null : parseInt(sanitizedData[key], 10);
        }
    });

    const formDataToSend = new FormData();
    Object.entries(sanitizedData).forEach(([key, value]) => {
        if (key === "images" && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                formDataToSend.append("images", value[i]);
            }
        } else if (value !== null) {
            formDataToSend.append(key, value);
        }
    });

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Convert number fields to strings and prevent NaN
        if (["totalFloors", "bathrooms", "floorsAllowed"].includes(name)) {
            value = value ? String(parseInt(value, 10) || "") : "";
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Special handling for city selection
        if (name === "city") {
            setSelectedCity(value);
            setFormData(prevData => ({ ...prevData, city: value, locality: "" }));
        }
    };

    const onInputChange = (e) => {
        const { name, value, type, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files : value,
        }));

        if (name === "city") {
            setSelectedCity(value);
            setFormData((prevData) => ({
                ...prevData,
                city: value,
                locality: "",  // Reset locality when city changes
            }));
        }
    };


    const handleImageUpload = (e) => {
        const files = e.files;

        // Restrict to a minimum of 2 and a maximum of 5 images
        if (files.length < 2 || files.length > 5) {
            alert("Please upload between 2 and 5 images.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            images: files, // Store selected files in state
        }));
    };

    // ✅ Define Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        ownerType: Yup.string().required("Owner Type is required"),
        city: Yup.string().required("City is required"),
        locality: Yup.string().required("Locality is required"),
        propertyType: Yup.string().required("Property Type is required"),
        transactionType: Yup.string().required("Transaction Type is required"),
        furnishedStatus: Yup.string().required("Furnished Status is required"),
        societyName: Yup.string().optional(),

        budget: Yup.number().required("Budget is required").min(1, "Budget must be greater than 0"),
        bhk: Yup.number().required("BHK is required").min(1, "BHK must be at least 1"),
        otherBhk: Yup.string().optional(),
        possessionStatus: Yup.string().required("Possession Status is required"),
        basePrice: Yup.number().required("Base Price is required").min(0, "Base Price cannot be negative"),
        plc: Yup.number().nullable(),
        parkingCharges: Yup.number().nullable(),
        bookingAmount: Yup.number().required("Booking Amount is required").min(0, "Booking Amount cannot be negative"),
        maintenanceCharges: Yup.number().nullable(),
        stampDuty: Yup.number().nullable(),

        // Newly added fields
        totalFlats: Yup.string().required("Total Flats is required"),
        balconies: Yup.number().required("Balconies is required").min(0, "Balconies cannot be negative"),
        floorNo: Yup.string().required("Floor No is required"),
        totalFloors: Yup.number().required("Total Floors is required").min(1, "Total Floors must be at least 1"),
        facing: Yup.string().required("Facing is required"),
        bathrooms: Yup.number().required("Bathrooms is required").min(1, "Bathrooms must be at least 1"),
        floorsAllowed: Yup.number().required("Floors Allowed is required").min(1, "Must allow at least 1 floor"),
        area: Yup.string().required("Area is required"),
        superArea: Yup.string().required("Super Area is required"),
        builtupArea: Yup.string().required("Built-up Area is required"),
        carpetArea: Yup.string().required("Carpet Area is required"),
        availableFrom: Yup.string().required("Available From is required"),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ✅ Validate Form Data
            await validationSchema.validate(formData, { abortEarly: false });

            // ✅ Ensure numeric fields are sent as null if empty
            const sanitizedData = { ...formData };
            Object.keys(sanitizedData).forEach((key) => {
                if (["totalFlats", "budget", "basePrice", "plc", "parkingCharges", "bookingAmount", "maintenanceCharges", "stampDuty"].includes(key)) {
                    sanitizedData[key] = sanitizedData[key] === "" || sanitizedData[key] === null ? null : parseFloat(sanitizedData[key]);
                }
            });

            // ✅ Prepare FormData for Submission
            const formDataToSend = new FormData();
            Object.entries(sanitizedData).forEach(([key, value]) => {
                if (key === "images" && value.length > 0) {
                    for (let i = 0; i < value.length; i++) {
                        formDataToSend.append("images", value[i]);
                    }
                } else if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            // ✅ Send API Request
            const response = await axios.post(config.addProperty, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Success:", response.data);
            toast.success("Uploaded successfully");
            setFormData("");
            navigate("/home")

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                // ✅ Show all validation errors in toast
                error.inner.forEach((err) => {
                    toast.error(err.message);
                });
            } else {
                toast.error("Upload Error: " + (error.response?.data || error.message));
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-11">
                    <div className="card mt-4">
                        <div className="card-body">

                            <h2 className="mb-4 text-center"> Add Property</h2>

                            {/* Stepper */}
                            <div className="step-container">
                                <Steps model={[{ label: "Basic" }, { label: "Property" }, { label: "Pricing" }, { label: "Upload" }, { label: "Submit" }]} activeIndex={activeIndex} className="responsive-steps" onSelect={(e) => setActiveIndex(e.index)} />

                                {/* Step 1: Basic Details */}
                                {activeIndex === 0 && (
                                    <div>
                                        <div>

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <h6>Owner Type</h6>
                                                    <select className="form-select" name="ownerType" onChange={onInputChange} value={formData.ownerType || ""} required>
                                                        <option value="">Select Owner Type</option>
                                                        <option value="Owner">Owner</option>
                                                        <option value="Agent">Agent</option>
                                                        <option value="Builder">Builder</option>
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>City</h6>
                                                    <select className="form-select" name="city" onChange={onInputChange} value={formData.city || ""} required>
                                                        <option value="">Select City</option>
                                                        {Object.keys(cityLocalities).map((city) => (
                                                            <option key={city} value={city}>{city}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Locality</h6>
                                                    <select className="form-select" name="locality" onChange={onInputChange} value={formData.locality || ""} required disabled={!selectedCity}>
                                                        <option value="">Select Locality</option>
                                                        {selectedCity && cityLocalities[selectedCity].map((locality) => (
                                                            <option key={locality} value={locality}>{locality}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mt-4">
                                                <div className="col-lg-4">
                                                    <h6>Property Type</h6>
                                                    <select className="form-select" name="propertyType" onChange={onInputChange} value={formData.propertyType || ""} required>
                                                        <option value="">Choose Property Type</option>
                                                        <option value="Flat/Apartment">Flat/Apartment</option>
                                                        <option value="Residential House">Residential House</option>
                                                        <option value="Villa">Villa</option>
                                                        <option value="Builder Floor">Builder Floor</option>
                                                        <option value="Residential Land">Residential Land</option>
                                                        <option value="Penthouse">Penthouse</option>
                                                        <option value="Studio Apartment">Studio Apartment</option>
                                                        <option value="Commercial Office Space">Commercial Office Space</option>
                                                        <option value="Commercial Shop">Commercial Shop</option>
                                                        <option value="Commercial Showroom">Commercial Showroom</option>
                                                        <option value="Commercial Land">Commercial Land</option>
                                                        <option value="Industrial Land">Industrial Land</option>
                                                        <option value="Warehouse/Godown">Warehouse/Godown</option>
                                                        <option value="Industrial Shed">Industrial Shed</option>
                                                        <option value="Industrial Building">Industrial Building</option>
                                                        <option value="Agriculture Land">Agriculture Land</option>
                                                        <option value="Farm House">Farm House</option>
                                                    </select>

                                                </div>


                                                <div className="col-lg-4">
                                                    <h6>Transaction Type</h6>
                                                    <select className="form-select" name="transactionType" onChange={onInputChange} value={formData.transactionType || ""} required>
                                                        <option value="">Select Transaction Type</option>
                                                        <option value="New Property">New Property</option>
                                                        <option value="Resale">Resale</option>
                                                    </select>

                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Phone Number</h6>
                                                    <input type="text" name="phone" placeholder="Enter Contact Number" className="form-control" value={formData.phone} onChange={onInputChange} required />
                                                </div>



                                            </div>
                                            <div className="text-center mt-3">
                                                <Button label="Next" className="btn btn-sm btn-info" onClick={() => setActiveIndex(1)} />
                                            </div>
                                        </div>

                                    </div>
                                )}

                                {/* Step 1: Basic Details */}
                                {activeIndex === 1 && (
                                    <div>
                                        <div>



                                            <div className="row mt-4">

                                                <div className="col-lg-4">
                                                    <h6>Name of the Society</h6>
                                                    <input type="text" name="societyName" placeholder="Enter Socity Name" className="form-control" value={formData.societyNamey} onChange={onInputChange} required />
                                                </div>

                                                <div className="col-lg-4 mb-3">
                                                    <h6>Budget</h6>
                                                    <InputNumber
                                                        name="budget"
                                                        value={formData.budget || ""}
                                                        onValueChange={(e) =>
                                                            onInputChange({ target: { name: 'budget', value: e.value } })
                                                        }
                                                        mode="currency"
                                                        currency="INR"
                                                        locale="en-IN"
                                                        placeholder="Enter Budget"
                                                        className="w-100"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-lg-4">
                                                    <h6>BHK</h6>
                                                    <select className="form-select" name="bhk" value={formData.bhk || ""} onChange={onInputChange} required>
                                                        <option value="">Select BHK</option>
                                                        <option value="1">1 BHK</option>
                                                        <option value="2">2 BHK</option>
                                                        <option value="3">3 BHK</option>
                                                        <option value="4+">4+ BHK</option>

                                                    </select>

                                                </div>

                                            </div>


                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <h6>Total Flats:</h6>
                                                    <select name="totalFlats" className="form-select" value={formData.totalFlats || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select total flats</option>
                                                        <option value="<50">&lt;50</option>
                                                        <option value="50-100">50-100</option>
                                                        <option value="100-200">100-200</option>
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Balconies:</h6>
                                                    <select name="balconies" className="form-select" value={formData.balconies || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select balconies</option>
                                                        {[0, 1, 2, 3, 4].map((num) => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Floor No:</h6>
                                                    <select name="floorNo" className="form-select" value={formData.floorNo || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select floor number</option>
                                                        {["Lower Basement", "Upper Basement", "Ground", 1, 2, 3, 4, 5].map((floor, index) => (
                                                            <option key={index} value={floor}>{floor}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <h6>Total Floors:</h6>
                                                    <input type="number" className="form-control" placeholder="Enter total floors" value={formData.totalFloors || ""} name="totalFloors" onChange={handleChange} />
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Facing:</h6>
                                                    <select name="facing" className="form-select" value={formData.facing || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select facing direction</option>
                                                        {["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"].map((dir) => (
                                                            <option key={dir} value={dir}>{dir}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Bathrooms:</h6>
                                                    <select name="bathrooms" className="form-select" value={formData.bathrooms || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select bathrooms</option>
                                                        {[1, 2, 3, 4].map((num) => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <h6>Floors Allowed for Construction:</h6>
                                                    <input type="number" className="form-control" placeholder="Enter floors allowed" value={formData.floorsAllowed || ""} name="floorsAllowed" onChange={handleChange} />
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Available From:</h6>
                                                    <input type="month" className="form-control" value={formData.availableFrom || ""} name="availableFrom" onChange={handleChange} />
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Possession Status</h6>
                                                    <select className="form-select" name="possessionStatus" value={formData.possessionStatus || ""} onChange={handleChange} required>
                                                        <option value="" disabled>Select possession status</option>
                                                        <option value="Under construction">Under Construction</option>
                                                        <option value="Ready to occupy">Ready to Occupy</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mt-4">
                                                <div className="col-lg-4">
                                                    <h6>Furnished Status</h6>
                                                    <select className="form-select" name="furnishedStatus" value={formData.furnishedStatus || ""} onChange={handleChange} required>
                                                        <option value="" disabled>Choose furnishing</option>
                                                        <option value="fully-Furnished">Fully Furnished</option>
                                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                                        <option value="Unfurnished">Unfurnished</option>
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Area:</h6>
                                                    <select name="area" className="form-select" value={formData.area || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select area</option>
                                                        {["500 sqft", "1000 sqft", "1500 sqft", "2000 sqft", "2500 sqft"].map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Super Area:</h6>
                                                    <select name="superArea" className="form-select" value={formData.superArea || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select super area</option>
                                                        {["600 sqft", "1100 sqft", "1600 sqft", "2100 sqft", "2600 sqft"].map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <h6>Built-up Area:</h6>
                                                    <select name="builtupArea" className="form-select" value={formData.builtupArea || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select built-up area</option>
                                                        {["550 sqft", "1050 sqft", "1550 sqft", "2050 sqft", "2550 sqft"].map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-lg-4">
                                                    <h6>Carpet Area:</h6>
                                                    <select name="carpetArea" className="form-select" value={formData.carpetArea || ""} onChange={handleChange}>
                                                        <option value="" disabled>Select carpet area</option>
                                                        {["450 sqft", "950 sqft", "1450 sqft", "1950 sqft", "2450 sqft"].map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-3 text-center">
                                                <Button label="Back" onClick={() => setActiveIndex(0)} className="btn btn-sm btn-secondary me-3" />
                                                <Button label="Next" onClick={() => setActiveIndex(2)} className="btn btn-sm btn-primary" />
                                            </div>
                                        </div>

                                    </div>
                                )}





                                {/* Step 3: Pricing */}
                                {activeIndex === 2 && (
                                    <div className="row mt-4">
                                        <div className="col-lg-4 mb-3">
                                            <h6>Base Price</h6>
                                            <InputNumber
                                                name="basePrice"
                                                value={formData.basePrice || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'basePrice', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                locale="en-IN"
                                                placeholder="Enter Base Price "
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="col-lg-4 mb-3">
                                            <h6>PLC (Preferential Location Charges)</h6>
                                            <InputNumber
                                                name="plc"
                                                value={formData.plc || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'plc', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                locale="en-IN"
                                                placeholder="Enter PLC"
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="col-lg-4 mb-3">
                                            <h6>Parking Charges</h6>
                                            <InputNumber
                                                name="parkingCharges"
                                                value={formData.parkingCharges || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'parkingCharges', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                placeholder="Enter Parking Charges "
                                                locale="en-IN"
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="col-lg-4 mb-3">
                                            <h6>Booking Amount</h6>
                                            <InputNumber
                                                name="bookingAmount"
                                                value={formData.bookingAmount || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'bookingAmount', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                placeholder="Enter Booking Amount"
                                                locale="en-IN"
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="col-lg-4 mb-3">
                                            <h6>Maintenance Charges</h6>
                                            <InputNumber
                                                name="maintenanceCharges"
                                                value={formData.maintenanceCharges || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'maintenanceCharges', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                locale="en-IN"
                                                placeholder="Enter Maintenance Charges "
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="col-lg-4 mb-3">
                                            <h6>Stamp Duty & Registration</h6>
                                            <InputNumber
                                                name="stampDuty"
                                                value={formData.stampDuty || ""}
                                                onValueChange={(e) =>
                                                    handleChange({ target: { name: 'stampDuty', value: e.value } })
                                                }
                                                mode="currency"
                                                currency="INR"
                                                locale="en-IN"
                                                placeholder="Enter Stamp Duty & Registration "
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="mt-3 text-center">
                                            <Button
                                                label="Back"
                                                onClick={() => setActiveIndex(1)}
                                                className="btn btn-sm btn-secondary me-3"
                                            />
                                            <Button
                                                label="Next"
                                                onClick={() => setActiveIndex(3)}
                                                className="btn btn-sm btn-primary"
                                            />
                                        </div>
                                    </div>

                                )}
                                {/* Step 3: Upload Images & Submit */}
                                {activeIndex === 3 && (
                                    <div>
                                        {/* <h3>Upload Images & Submit</h3> */}

                                        <div className="card">
                                            <FileUpload
                                                name="images"
                                                multiple
                                                accept="image/*"
                                                maxFileSize={5000000}
                                                customUpload
                                                uploadHandler={handleImageUpload}
                                            // value={formData.images || ""}
                                            />
                                        </div>

                                        <div className="mt-3 text-center">


                                            <Button
                                                label="Back"
                                                onClick={() => setActiveIndex(2)} // Fixed: Changed 1 → 2 (previous step)
                                                className="btn btn-sm btn-secondary me-3"
                                            />
                                            <Button
                                                label="Next"
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setActiveIndex(4)} // Fixed: Wrapped in arrow function
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeIndex === 4 && (
                                    <div className="mt-3">

                                        <p className="text-center"> Review your details and submit the form.</p>

                                        {/* Debugging: Console log data */}
                                        {console.log("Reviewing Data:", formData)}

                                        {/* Display Form Data */}
                                        <div className="col-lg-6 m-auto">

                                            <table className="table table-striped table-bordered">
                                                <tbody>
                                                    <tr><td>Owner Type</td><td>{formData.ownerType}</td></tr>
                                                    <tr><td>City</td><td>{formData.city}</td></tr>
                                                    <tr><td>Locality</td><td>{formData.locality}</td></tr>
                                                    <tr><td>Property Type</td><td>{formData.propertyType}</td></tr>
                                                    <tr><td>Transaction Type</td><td>{formData.transactionType}</td></tr>
                                                    <tr><td>Contact Number</td><td>{formData.phone}</td></tr>

                                                    <tr><td>Furnished Status</td><td>{formData.furnishedStatus}</td></tr>
                                                    <tr><td>Possession Status</td><td>{formData.possessionStatus}</td></tr>
                                                    <tr><td>Possession societyName</td><td>{formData.societyName}</td></tr>
                                                    <tr><td>Budget</td><td>{formData.budget}</td></tr>
                                                    <tr><td>BHK</td><td>{formData.bhk}</td></tr>
                                                    <tr><td>Total Flats</td><td>{formData.totalFlats}</td></tr>

                                                    <tr><td>Balconies</td><td>{formData.balconies}</td></tr>
                                                    <tr><td>Total Floors</td><td>{formData.totalFloors}</td></tr>
                                                    <tr><td>Facing</td><td>{formData.facing}</td></tr>
                                                    <tr><td>Bathrooms</td><td>{formData.bathrooms}</td></tr>
                                                    <tr><td>Floors Allowed</td><td>{formData.floorsAllowed}</td></tr>
                                                    <tr><td> Area</td><td>{formData.area}</td></tr>
                                                    <tr><td>  Super Area</td><td>{formData.superArea}</td></tr>
                                                    <tr><td>  Builtup Area</td><td>{formData.builtupArea}</td></tr>
                                                    <tr><td>  Carpet Area</td><td>{formData.carpetArea}</td></tr>
                                                    <tr><td>  Available From</td><td>{formData.availableFrom}</td></tr>

                                                    <tr><td>Base Price</td><td>{formData.basePrice}</td></tr>
                                                    <tr><td>PLC</td><td>{formData.plc}</td></tr>
                                                    <tr><td>Parking Charges</td><td>{formData.parkingCharges}</td></tr>
                                                    <tr><td>Booking Amount</td><td>{formData.bookingAmount}</td></tr>
                                                    <tr><td>Maintenance Charges</td><td>{formData.maintenanceCharges}</td></tr>
                                                    <tr><td>Stamp Duty</td><td>{formData.stampDuty}</td></tr>
                                                    <tr><td>Uploaded Images</td><td>{formData.images ? formData.images.length : 0} Images</td></tr>
                                                </tbody>
                                            </table>
                                        </div>


                                        <div className="text-center">
                                            <Button
                                                label="Back"
                                                className="btn btn-sm btn-secondary me-3"
                                                onClick={() => setActiveIndex(3)}
                                            />
                                            <Button
                                                label="Submit"
                                                className="btn btn-sm btn-success"
                                                onClick={handleSubmit}
                                            />
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddProperty;
