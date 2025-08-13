import { useState, useEffect } from "react";
import { fetchData } from "../../api/apiHandler";
import { config } from "../../api/config";
import { Galleria } from "primereact/galleria";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // Optional but better for icons

const ManageProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

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

  const handleDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this property?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const response = await fetch(`${config.deletePropertyById}/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setProperties(properties.filter((property) => property.id !== id));
            console.log("Property deleted successfully");
          } else {
            console.error("Failed to delete property");
          }
        } catch (error) {
          console.error("Error deleting property:", error);
        }
      },
      reject: () => {
        console.log("Deletion cancelled");
      },
    });
  };

  const handleEdit = (property) => {
    navigate(`/editProperty/${property.id}`);
  };

  return (
    <div className="container-fluid bg-secondary ">
      {/* Confirm Dialog Component */}
      <ConfirmDialog />

      <div className="row">
        <div className="text-center fs-3 mb-4 text-white">Property Listings</div>

        {properties.map((property) => (
          <div key={property.id} className="col-lg-9 m-auto mb-4">
            <div className="card shadow-sm rounded overflow-hidden ">
              <div className="row m-3 g-0">
                {/* Image Gallery */}
                <div className="col-lg-5 p-2">
                  <div className="position-relative">
                    <Galleria
                      value={Array.isArray(property.images) ? property.images : []}
                      numVisible={5}
                      circular
                      showThumbnails={false}
                      item={(item) => (
                        <img
                          src={item}
                          alt="Property"
                          className="w-100 h-100 rounded"
                          style={{ objectFit: "cover", height: "200px" }}
                        />
                      )}
                    />
                    <div className="overlay position-absolute top-0 start-0 p-2 text-white bg-dark bg-opacity-50">
                      <div className="mb-1">
                        <i className="pi pi-user"></i> {property.ownerType}
                      </div>
                      <div className="text-end">
                        <i className="pi pi-map-marker"></i> {property.city}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="col-lg-7 p-4 d-flex flex-column justify-content-center">
                  <h5 className="mb-3">{property.propertyType}</h5>
                  <p className="mb-2">
                    <i className="pi pi-map-marker"></i> {property.locality}, {property.city}
                  </p>
                  <p className="mb-2">
                    <i className="pi pi-home"></i> {property.bhk} BHK
                  </p>
                  <p className="mb-2">
                    <i className="pi pi-money-bill"></i> Budget: ₹
                    {new Intl.NumberFormat("en-IN").format(property.budget)}
                  </p>
                  <p className="mb-2">
                    <i className="pi pi-sync"></i> {property.transactionType}
                  </p>
                  <p className="mb-2">
                    <i className="pi pi-phone"></i> {property.phone}
                  </p>

                  <div className="d-flex gap-2 flex-wrap justify-content-end ">
                    <Button
                      icon="pi pi-eye"
                      className="btn btn-secondary btn-sm rounded"
                      label="View"
                      onClick={() => navigate(`/property/${property.id}`)}
                    />
                    <Button
                      icon="pi pi-pencil"
                      label="Edit"
                      className="btn btn-primary btn-sm rounded"
                      onClick={() => handleEdit(property)}
                    />
                    <Button
                      icon="pi pi-trash"
                      label="Delete"
                      className="btn btn-danger btn-sm rounded"
                      onClick={() => handleDelete(property.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProperties;
