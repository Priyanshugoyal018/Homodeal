const db = require("../../database/models");
const {
    Property,
    RentalProperty,
    SaleProperty,
    CommercialProperty,
    PlotProperty,
} = db;

// -------------------------------------------------- CREATE PROPERTY --------------------------------------------------
exports.createProperty = async (req, res) => {
    try {
        const propertyData = req.body;
        const imageFiles = req.files;

        const imageUrls = imageFiles.map((img) => img.path);
        const normalizeArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') {
                // Handle comma-separated strings or potential JSON strings
                if (value.startsWith('[') && value.endsWith(']')) {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value.split(',').map(s => s.trim());
                    }
                }
                return value.split(',').map(s => s.trim());
            }
            return [];
        };

        // Robust mapping for array fields
        const facilitiesArray = normalizeArray(propertyData.facilities || propertyData.amenities);
        const suitableForArray = normalizeArray(propertyData.suitableFor);
        const nearbyLandmarksArray = normalizeArray(propertyData.nearbyLandmarks);
        const nearbyAmenitiesArray = normalizeArray(propertyData.nearbyAmenities || propertyData.amenities);

        const newProperty = await Property.create({
            location: propertyData.location,
            images: imageUrls,
            property_purpose: propertyData.propertyCategory,
            price: propertyData.price,
            description: propertyData.description || propertyData.specialNotes || propertyData.additionalInfo || "",
            name: propertyData.propertyName || propertyData.name || "",
            userId: req.user.id,
        });

        const normalizeEnum = (value) => {
            if (value === undefined || value === null) return null;
            if (typeof value !== 'string') return String(value);
            if (value.trim() === "") return null;
            return value.trim().toLowerCase(); // Enums are often case-sensitive/lowercase in DB
        };

        const normalizeFloat = (value) => {
            if (value === undefined || value === null || value === "") return null;
            return parseFloat(value);
        };

        const normalizeInt = (value) => {
            if (value === undefined || value === null || value === "") return null;
            return parseInt(value, 10);
        };

        const validateRequired = (value, fieldName) => {
            if (value === undefined || value === null || value === "") {
                throw new Error(`${fieldName} is required`);
            }
            return value;
        };

        switch (propertyData.propertyCategory) {
            case "rental":
                await RentalProperty.create({
                    propertyId: newProperty.id,
                    propertyType: propertyData.propertyType,
                    customType: propertyData.customType || "",
                    suitableFor: suitableForArray,
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    kitchenAvailable: normalizeEnum(propertyData.kitchenAvailable),
                    kitchenType: normalizeEnum(propertyData.kitchenType),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    capacity: normalizeInt(validateRequired(propertyData.capacity, 'Capacity')),
                    facilities: facilitiesArray,
                });
                break;

            case "sale":
                await SaleProperty.create({
                    propertyId: newProperty.id,
                    propertyType: propertyData.propertyType,
                    carpetArea: normalizeFloat(validateRequired(propertyData.carpetArea, 'Carpet Area')),
                    superBuiltUpArea: normalizeFloat(propertyData.superBuiltUpArea),
                    currentFloor: propertyData.currentFloor,
                    totalFloors: normalizeInt(propertyData.totalFloors),
                    liftAvailable: normalizeEnum(propertyData.liftAvailable),
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    propertyAge: normalizeEnum(propertyData.propertyAge),
                    nearbyLandmarks: nearbyLandmarksArray,
                    negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                    washroomAvailable: normalizeEnum(propertyData.washroomAvailable),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    parkingAvailable: normalizeEnum(propertyData.parkingAvailable),
                    parkingType: normalizeEnum(propertyData.parkingType),
                    roadFacing: normalizeEnum(propertyData.roadFacing),
                    roadWidth: propertyData.roadWidth,
                });
                break;

            case "commercial":
                await CommercialProperty.create({
                    propertyId: newProperty.id,
                    propertyType: propertyData.propertyType,
                    carpetArea: normalizeFloat(validateRequired(propertyData.carpetArea, 'Carpet Area')),
                    superBuiltUpArea: normalizeFloat(propertyData.superBuiltUpArea),
                    currentFloor: propertyData.currentFloor,
                    totalFloors: normalizeInt(propertyData.totalFloors),
                    liftAvailable: normalizeEnum(propertyData.liftAvailable),
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    propertyAge: normalizeEnum(propertyData.propertyAge),
                    washroomAvailable: normalizeEnum(propertyData.washroomAvailable),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    parkingAvailable: normalizeEnum(propertyData.parkingAvailable),
                    parkingType: normalizeEnum(propertyData.parkingType),
                    roadFacing: normalizeEnum(propertyData.roadFacing),
                    roadWidth: propertyData.roadWidth,
                    nearbyLandmarks: nearbyLandmarksArray,
                    negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                });
                break;

            case "plot":
                await PlotProperty.create({
                    propertyId: newProperty.id,
                    plotCategory: propertyData.plotCategory,
                    plotArea: propertyData.plotArea,
                    frontage: normalizeFloat(propertyData.frontage),
                    length: normalizeFloat(propertyData.length),
                    breadth: normalizeFloat(propertyData.breadth),
                    facingDirection: normalizeEnum(propertyData.facingDirection),
                    price_negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                    roadWidth: propertyData.roadWidth,
                    nearbyAmenities: nearbyAmenitiesArray,
                });
                break;

            default:
                await newProperty.destroy(); // Rollback property creation if invalid category
                return res.status(400).json({
                    success: false,
                    message: "Invalid property category provided",
                });
        }

        return res.status(201).json({
            success: true,
            message: "Property created successfully",
        });
    } catch (error) {
        console.error("Error creating property:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create property",
            error: error.message,
        });
    }
};

// -------------------------------------------------- GET ALL PROPERTIES --------------------------------------------------
// -------------------------------------------------- GET ALL PROPERTIES (PUBLIC) --------------------------------------------------
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { status: 'approved' },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            data: properties,
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch properties",
        });
    }
};

// -------------------------------------------------- GET ADMIN PROPERTIES --------------------------------------------------
exports.getAdminProperties = async (req, res) => {
    try {
        const { status } = req.query;
        // If status query param is provided, filter by it. Otherwise fetch all.
        const whereClause = status ? { status } : {};

        const properties = await Property.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            include: [
                { model: SaleProperty, as: "SaleProperty" },
                { model: RentalProperty, as: "RentalProperty" },
                { model: CommercialProperty, as: "CommercialProperty" },
                { model: PlotProperty, as: "PlotProperty" },
                { model: db.AuthUser, as: "owner", attributes: ["name", "email"] },
            ]
        });

        res.status(200).json({
            success: true,
            data: properties,
        });
    } catch (error) {
        console.error("Error fetching admin properties:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin properties",
        });
    }
};

// -------------------------------------------------- UPDATE PROPERTY STATUS --------------------------------------------------
exports.updatePropertyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        property.status = status;
        await property.save();

        res.status(200).json({
            success: true,
            message: `Property status updated to ${status}`,
            data: property,
        });
    } catch (error) {
        console.error("Error updating property status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update property status",
        });
    }
};

// -------------------------------------------------- GET PROPERTY BY ID --------------------------------------------------
exports.getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findByPk(id, {
            include: [
                { model: SaleProperty, as: "SaleProperty" },
                { model: RentalProperty, as: "RentalProperty" },
                { model: CommercialProperty, as: "CommercialProperty" },
                { model: PlotProperty, as: "PlotProperty" },
            ],
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        const propertyData = property.toJSON();
        const features = [];

        // ======== SALE PROPERTY FEATURES ========
        if (propertyData.property_purpose === "sale" && propertyData.SaleProperty) {
            const sale = propertyData.SaleProperty;
            if (sale.carpetArea) features.push(`${sale.carpetArea} sqft carpet area`);
            if (sale.superBuiltUpArea) features.push(`${sale.superBuiltUpArea} sqft super built-up`);
            if (sale.currentFloor && sale.totalFloors) features.push(`${sale.currentFloor} of ${sale.totalFloors} floors`);
            else if (sale.currentFloor) features.push(`Floor ${sale.currentFloor}`);

            if (sale.bhkType) features.push(sale.bhkType.replace(/-/g, " "));
            if (sale.propertyType) features.push(sale.propertyType.replace(/-/g, " "));
            if (sale.furnishingStatus) features.push(sale.furnishingStatus.replace(/-/g, " "));
            if (sale.liftAvailable === "yes") features.push("lift available");
            if (sale.parkingAvailable === "yes") features.push("parking available");
            if (sale.roadFacing === "yes") features.push("road facing");
            if (sale.washroomAvailable === "yes") features.push("washroom available");
            if (sale.negotiable === "yes") features.push("price negotiable");
            if (sale.ownershipType) features.push(sale.ownershipType.replace(/-/g, " "));
            if (sale.nearbyLandmarks && Array.isArray(sale.nearbyLandmarks))
                features.push(...sale.nearbyLandmarks.map((l) => l.trim()));
            propertyData.features = [...new Set(features)];
        }

        else if (propertyData.property_purpose === "rental" && propertyData.RentalProperty) {
            const rent = propertyData.RentalProperty;
            if (rent.capacity) features.push(`Capacity: ${rent.capacity} Persons`);
            if (Array.isArray(rent.facilities)) features.push(...rent.facilities.map((f) => f.trim()));
            if (rent.furnishingStatus) features.push(rent.furnishingStatus.replace(/-/g, " "));
            if (rent.kitchenAvailable === "yes") {
                if (rent.kitchenType) features.push(`${rent.kitchenType} kitchen`);
                else features.push("kitchen available");
            }
            if (rent.washroomType) features.push(`${rent.washroomType} washroom`);
            if (rent.propertyType) features.push(rent.propertyType.replace(/-/g, " "));
            if (Array.isArray(rent.suitableFor)) features.push(...rent.suitableFor.map((s) => s.trim()));
            propertyData.features = [...new Set(features)];
        }

        else if (propertyData.property_purpose === "plot" && propertyData.PlotProperty) {
            const plot = propertyData.PlotProperty;
            if (plot.plotArea) features.push(`Area: ${plot.plotArea}`);
            if (plot.length && plot.breadth) features.push(`${plot.length} x ${plot.breadth} ft`);
            if (plot.frontage) features.push(`${plot.frontage} ft frontage`);
            if (plot.roadWidth) features.push(`${plot.roadWidth} ft road width`);

            if (plot.facingDirection) features.push(`${plot.facingDirection.toLowerCase()} facing`);
            if (plot.nearbyAmenities && Array.isArray(plot.nearbyAmenities))
                features.push(...plot.nearbyAmenities.map((a) => a.trim()));
            else if (typeof plot.nearbyAmenities === 'string')
                features.push(...plot.nearbyAmenities.split(',').map(a => a.trim()));

            if (plot.ownershipType) features.push(plot.ownershipType.replace(/-/g, " "));
            if (plot.plotCategory) features.push(plot.plotCategory.replace(/-/g, " "));
            if (plot.price_negotiable === "yes") features.push("price negotiable");
            propertyData.features = [...new Set(features)];
        }

        else if (propertyData.property_purpose === "commercial" && propertyData.CommercialProperty) {
            const comm = propertyData.CommercialProperty;
            if (comm.carpetArea) features.push(`${comm.carpetArea} sqft carpet area`);
            if (comm.superBuiltUpArea) features.push(`${comm.superBuiltUpArea} sqft super built-up`);
            if (comm.currentFloor && comm.totalFloors) features.push(`${comm.currentFloor} of ${comm.totalFloors} floors`);
            else if (comm.currentFloor) features.push(`Floor ${comm.currentFloor}`);

            if (comm.furnishingStatus) features.push(comm.furnishingStatus.replace(/-/g, " "));
            if (comm.nearbyLandmarks && Array.isArray(comm.nearbyLandmarks))
                features.push(...comm.nearbyLandmarks.map((l) => l.trim()));
            else if (typeof comm.nearbyLandmarks === 'string')
                features.push(...comm.nearbyLandmarks.split(',').map(l => l.trim()));

            if (comm.ownershipType) features.push(comm.ownershipType.replace(/-/g, " "));
            if (comm.negotiable === "yes") features.push("price negotiable");
            if (comm.propertyType) features.push(comm.propertyType.replace(/-/g, " "));
            if (comm.roadFacing === "yes") features.push("road facing");
            if (comm.liftAvailable === "yes") features.push("lift available");
            if (comm.parkingAvailable === "yes") {
                if (comm.parkingType) features.push(`${comm.parkingType} parking`);
                else features.push("parking available");
            }
            if (comm.washroomAvailable === "yes" && comm.washroomType)
                features.push(`${comm.washroomType} washroom`);
            else if (comm.washroomAvailable === "yes") features.push("washroom available");
            if (comm.propertyAge) features.push(comm.propertyAge.replace(/-/g, " "));
            propertyData.features = [...new Set(features)];
        }

        res.status(200).json({
            success: true,
            data: propertyData,
        });
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch property",
        });
    }
};

// -------------------------------------------------- GET USER PROPERTIES --------------------------------------------------
exports.getUserProperties = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware adds user to req

        const properties = await Property.findAll({
            where: { userId },
            include: [
                {
                    model: db.Interest,
                    as: "interests",
                    attributes: ["id", "name", "phone", "message", "createdAt"],
                },
                { model: SaleProperty, as: "SaleProperty" },
                { model: RentalProperty, as: "RentalProperty" },
                { model: CommercialProperty, as: "CommercialProperty" },
                { model: PlotProperty, as: "PlotProperty" },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            data: properties,
        });
    } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user properties",
        });
    }
};

// -------------------------------------------------- CREATE INTEREST --------------------------------------------------
exports.createInterest = async (req, res) => {
    try {
        const { name, phone, message, propertyId } = req.body;

        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        const interest = await db.Interest.create({
            name,
            phone,
            message,
            propertyId,
        });

        res.status(201).json({
            success: true,
            message: "Interest submitted successfully",
            data: interest,
        });
    } catch (error) {
        console.error("Error creating interest:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit interest",
        });
    }
};

// -------------------------------------------------- DELETE PROPERTY --------------------------------------------------
exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const property = await Property.findOne({ where: { id, userId } });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you are not authorized to delete it",
            });
        }

        // Deleting the property will automatically delete associated records due to onDelete: CASCADE
        await property.destroy();

        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete property",
        });
    }
};

// -------------------------------------------------- UPDATE PROPERTY --------------------------------------------------
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const propertyData = req.body;
        const imageFiles = req.files;

        const property = await Property.findOne({ where: { id, userId } });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you are not authorized to update it",
            });
        }

        const normalizeArray = (value) => {
            if (!value) return undefined;
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') return value.split(',').map(s => s.trim());
            return [];
        };

        const normalizeEnum = (value) => {
            if (value === undefined || value === null) return undefined;
            if (value === "") return null;
            return String(value).trim();
        };

        const normalizeFloat = (value) => {
            if (value === undefined || value === null || value === "") return undefined;
            if (value === "null" || value === "undefined") return undefined; // Handle stringified nulls
            const parsed = parseFloat(value);
            return isNaN(parsed) ? undefined : parsed;
        };

        const normalizeInt = (value) => {
            if (value === undefined || value === null || value === "") return undefined;
            if (value === "null" || value === "undefined") return undefined; // Handle stringified nulls
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? undefined : parsed;
        };

        // Update base fields
        if (propertyData.propertyName !== undefined) property.name = propertyData.propertyName;
        if (propertyData.price !== undefined) {
            const parsedPrice = normalizeFloat(propertyData.price);
            if (parsedPrice !== undefined) property.price = parsedPrice;
        }
        if (propertyData.specialNotes !== undefined || propertyData.additionalInfo !== undefined) {
            property.description = propertyData.specialNotes || propertyData.additionalInfo || property.description;
        }

        // Handle Images
        if (imageFiles && imageFiles.length > 0) {
            const newImageUrls = imageFiles.map((img) => img.path);
            const existingImages = property.images || [];
            property.images = [...existingImages, ...newImageUrls];
        }

        if (propertyData.existingImages !== undefined) {
            // If existingImages is sent, it's the list of old images to KEEP.
            // If sent as a string (one image), normalize to array.
            const keptImages = normalizeArray(propertyData.existingImages) || [];

            // If imageFiles are present, those are new.
            const newImageUrls = imageFiles ? imageFiles.map((img) => img.path) : [];

            property.images = [...keptImages, ...newImageUrls];
        }

        await property.save();

        const updateSpecific = async (Model, data) => {
            const specific = await Model.findOne({ where: { propertyId: id } });
            if (specific) {
                // Remove undefined keys so we don't overwrite with null unless intended
                Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
                await specific.update(data);
            }
        };

        const facilitiesArray = normalizeArray(propertyData.facilities);
        const suitableForArray = normalizeArray(propertyData.suitableFor);
        const nearbyLandmarksArray = normalizeArray(propertyData.nearbyLandmarks);
        const nearbyAmenitiesArray = normalizeArray(propertyData.nearbyAmenities);

        switch (property.property_purpose) {
            case "rental":
                await updateSpecific(RentalProperty, {
                    propertyType: normalizeEnum(propertyData.propertyType),
                    customType: propertyData.customType,
                    suitableFor: suitableForArray,
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    kitchenAvailable: normalizeEnum(propertyData.kitchenAvailable),
                    kitchenType: normalizeEnum(propertyData.kitchenType),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    capacity: normalizeInt(propertyData.capacity),
                    facilities: facilitiesArray,
                });
                break;

            case "sale":
                await updateSpecific(SaleProperty, {
                    propertyType: normalizeEnum(propertyData.propertyType),
                    carpetArea: normalizeFloat(propertyData.carpetArea),
                    superBuiltUpArea: normalizeFloat(propertyData.superBuiltUpArea),
                    currentFloor: propertyData.currentFloor,
                    totalFloors: normalizeInt(propertyData.totalFloors),
                    liftAvailable: normalizeEnum(propertyData.liftAvailable),
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    propertyAge: normalizeEnum(propertyData.propertyAge),
                    nearbyLandmarks: nearbyLandmarksArray,
                    negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                    washroomAvailable: normalizeEnum(propertyData.washroomAvailable),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    parkingAvailable: normalizeEnum(propertyData.parkingAvailable),
                    parkingType: normalizeEnum(propertyData.parkingType),
                    roadFacing: normalizeEnum(propertyData.roadFacing),
                    roadWidth: propertyData.roadWidth,
                });
                break;

            case "commercial":
                await updateSpecific(CommercialProperty, {
                    propertyType: normalizeEnum(propertyData.propertyType),
                    carpetArea: normalizeFloat(propertyData.carpetArea),
                    superBuiltUpArea: normalizeFloat(propertyData.superBuiltUpArea),
                    currentFloor: propertyData.currentFloor,
                    totalFloors: normalizeInt(propertyData.totalFloors),
                    liftAvailable: normalizeEnum(propertyData.liftAvailable),
                    furnishingStatus: normalizeEnum(propertyData.furnishingStatus),
                    propertyAge: normalizeEnum(propertyData.propertyAge),
                    washroomAvailable: normalizeEnum(propertyData.washroomAvailable),
                    washroomType: normalizeEnum(propertyData.washroomType),
                    parkingAvailable: normalizeEnum(propertyData.parkingAvailable),
                    parkingType: normalizeEnum(propertyData.parkingType),
                    roadFacing: normalizeEnum(propertyData.roadFacing),
                    roadWidth: propertyData.roadWidth,
                    nearbyLandmarks: nearbyLandmarksArray,
                    negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                });
                break;

            case "plot":
                await updateSpecific(PlotProperty, {
                    plotCategory: propertyData.plotCategory,
                    plotArea: propertyData.plotArea,
                    frontage: normalizeFloat(propertyData.frontage),
                    length: normalizeFloat(propertyData.length),
                    breadth: normalizeFloat(propertyData.breadth),
                    facingDirection: normalizeEnum(propertyData.facingDirection),
                    price_negotiable: normalizeEnum(propertyData.negotiable),
                    ownershipType: normalizeEnum(propertyData.ownershipType),
                    roadWidth: propertyData.roadWidth,
                    nearbyAmenities: nearbyAmenitiesArray,
                });
                break;
        }

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: property
        });

    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update property",
            error: error.message,
        });
    }
};
