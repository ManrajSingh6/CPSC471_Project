import "../pages/AdminPagesStyles.css";

export default function SupplyCard(props){
    return(<>
        {
            props.itemType === "Medication" ? (
                <div className="supplies-card-container">
                    <div>
                        <p><strong>{props.name} | {props.item_id}</strong></p>
                        <p>Category: {props.category}</p>
                        <p>Price: ${props.price}</p>
                        <p>Available Quantity: {props.quantity}</p>
                    </div>
                    <div>
                        <p>DIN Number: {props.din_number}</p>
                        <p>Expiry Date: {new Date(props.expiry_date).toLocaleDateString()}</p>
                    </div>
                </div>
            ) : (
                <div className="supplies-card-container">
                    <div>
                        <p><strong>{props.name} | {props.item_id}</strong></p>
                        <p>Category: {props.category}</p>
                        <p>Price: ${props.price}</p>
                        <p>Available Quantity: {props.quantity}</p>
                        <p>Equipment Number: {props.equipment_number}</p>
                    </div>
                    <div>
                        <p>Manufacturer: {props.manufacturer}</p>
                        <p>Warranty Name: {props.warranty_name}</p>
                        <p>Warranty Start Date: {new Date(props.warranty_start).toLocaleDateString()}</p>
                        <p>Warranty Length: {props.warranty_length_months}</p>
                        
                    </div>
                </div>
            )
        }
    </>);
}