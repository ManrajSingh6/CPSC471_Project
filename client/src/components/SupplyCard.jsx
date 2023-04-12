import "../pages/AdminPagesStyles.css";
import { useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SupplyCard(props){

    const [newQuantity, setNewQuantity] = useState('');

    function isWhitespace(str) {
        return !str.replace(/\s/g, '').length;
    }

    async function deleteItem(){

    }

    async function addQuantity(){
        if (newQuantity === "" || isWhitespace(newQuantity)){
            toast.error("Cannot be empty");
        } else {
            const updatedQuantity = parseInt(props.quantity) + parseInt(newQuantity);
            const response = await fetch(`http://localhost:5000/admin/modify-supply-quantity/${props.hospital_id}`, {
                method: 'PUT',
                body: JSON.stringify({itemID: props.item_id, newQuantity: updatedQuantity}),
                headers: {'Content-Type':'application/json'}
            });
    
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error modifying item.")
            }
        }
    }

    async function removeQuantity(){
        if (newQuantity === "" || isWhitespace(newQuantity)){
            toast.error("Cannot be empty");
        } else {
            const updatedQuantity = parseInt(props.quantity) - parseInt(newQuantity);
            const response = await fetch(`http://localhost:5000/admin/modify-supply-quantity/${props.hospital_id}`, {
                method: 'PUT',
                body: JSON.stringify({itemID: props.item_id, newQuantity: updatedQuantity}),
                headers: {'Content-Type':'application/json'}
            });
    
            if (response.ok){
                window.location.reload();
            } else {
                toast.error("Error modifying item.")
            }
        }
    }

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
                    <div>
                        <input style={{border: "1px solid red"}} type="number" max={props.quantity - 1} min={0} placeholder="Increase/Decrease Quantity" value={newQuantity} onChange={(ev) => setNewQuantity(ev.target.value)}/>
                        <div style={{marginTop: "15px", display: "flex", flexDirection: "row", gap: "30px"}}>
                            <p onClick={deleteItem} style={{fontSize: "small", cursor: "pointer", color: "red"}}>Delete Item</p>
                            <p onClick={addQuantity} style={{fontSize: "small", cursor: "pointer", color: "green"}}>Add Quantity</p>
                            <p onClick={removeQuantity} style={{fontSize: "small", cursor: "pointer", color: "red"}}>Remove Quantity</p>
                        </div>
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
                    <div>
                        <input style={{border: "1px solid red"}} type="number" max={props.quantity - 1} min={0} placeholder="Increase/Decrease Quantity" value={newQuantity} onChange={(ev) => setNewQuantity(ev.target.value)}/>
                        <div style={{marginTop: "15px", display: "flex", flexDirection: "row", gap: "30px"}}>
                            <p onClick={deleteItem} style={{fontSize: "small", cursor: "pointer", color: "red"}}>Delete Item</p>
                            <p onClick={addQuantity} style={{fontSize: "small", cursor: "pointer", color: "green"}}>Add Quantity</p>
                            <p onClick={removeQuantity} style={{fontSize: "small", cursor: "pointer", color: "red"}}>Remove Quantity</p>
                        </div>
                    </div>
                </div>
            )
        }
    </>);
}