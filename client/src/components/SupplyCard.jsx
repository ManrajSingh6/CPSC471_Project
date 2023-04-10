import "../pages/AdminPagesStyles.css";

export default function SupplyCard({Name, ID, category, price, availableQuantity, manufacturer, dinNum, expiryDate, itemType, warranty, equipmentNumber}){
    return(<>
        {
            itemType === "Medication" ? (
                <div className="supplies-card-container">
                    <div>
                        <p><strong>{Name} | {ID}</strong></p>
                        <p>Category: {category}</p>
                        <p>Price: ${price}</p>
                        <p>Available Quantity: {availableQuantity}</p>
                    </div>
                    <div>
                        <p>Manufacturer: {manufacturer}</p>
                        <p>DIN Number: {dinNum}</p>
                        <p>Expiry Date: {expiryDate}</p>
                    </div>
                </div>
            ) : (
                <div className="supplies-card-container">
                    <div>
                        <p><strong>{Name} | {ID}</strong></p>
                        <p>Category: {category}</p>
                        <p>Price: ${price}</p>
                        <p>Available Quantity: {availableQuantity}</p>
                    </div>
                    <div>
                        <p>Manufacturer: {manufacturer}</p>
                        <p>Warranty: {warranty}</p>
                        <p>Equipment Number: {equipmentNumber}</p>
                    </div>
                </div>
            )
        }
    </>);
}