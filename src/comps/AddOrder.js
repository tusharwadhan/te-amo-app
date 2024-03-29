import { React, useEffect, useState } from 'react'
import axios from 'axios';
import { Table, Image, Button } from 'react-bootstrap';
import logo from '../tmoLogo.png'
import vegLogo from '../vegLogo.png'
import nonVegLogo from '../nonVegLogo.png'
import { toast } from 'react-toastify';
import {url} from '../config.js'

function AddOrder(props) {
    // category data
    const [category, setcategory] = useState([]);
    //items data
    const [item, setitem] = useState([]);

    const insert = async (quantityId , isVeg , itemId ,buttonId) =>{
        document.getElementById(buttonId).disabled = true
        document.getElementById(buttonId).innerText = "loading..."

        //checking requirements
        if(quantityId === undefined){
            toast("please select price!");
            document.getElementById(buttonId).disabled = false
            document.getElementById(buttonId).innerText = "add"
            return;
        }
        if(isVeg === undefined || props.table === undefined || itemId === undefined){
            toast("something went wrong please try again later!");
            document.getElementById(buttonId).disabled = false
            document.getElementById(buttonId).innerText = "add"
            return;
        }
        
        //making objects
        const obj = [{
            "item_id":itemId,
            "isVeg":isVeg,
            "table_no":props.table,
            "quantity_id":quantityId
        }]
        
        //calling api
        const response = await axios.post(`${url}/order`, obj);
        //if api status: 200
        if(response.status === 200){
            const data = response.data;
            //if response status: true
            if(data.status === true){
                document.getElementById(buttonId).disabled = false
                document.getElementById(buttonId).innerText = "add"
                toast(data.message);
            }
            //if response status is false
            else{
                document.getElementById(buttonId).disabled = false
                document.getElementById(buttonId).innerText = "add"
                toast(data.message);
            }
        }
        //if api status is not 200
        else{
            document.getElementById(buttonId).disabled = false
            document.getElementById(buttonId).innerText = "add"
            toast("server error.. try again later!");
        }
    }

    useEffect(() => {
        get();
    }, []);

    const get = async () => {
        const categories = await axios.get(`${url}/category`);
        const items = await axios.get(`${url}/items`);
        if (categories.status === 200) {
            setcategory(categories.data);
        }
        if (items.status === 200) {
            setitem(items.data);
        }
    }
    return (
        <>
            <div>
                {!category.data ? <h1>loading...</h1> : category.data.map((cat, cIndex) => {
                    return (<>
                        <br key={cIndex}/>

                        <Table responsive="sm" key={cIndex}>


                            <thead key={cIndex}>
                                <h3 >{cat.name}</h3>
                            </thead>

                            <tbody key={cIndex}>
                                <tr >
                                    <div>
                                        {item.data && item.data.map((product, pIndex) => {

                                            let quantity;
                                            const setQuantity = (q) =>{
                                                quantity = q;
                                            }


                                            return (cat._id === product.category_id && <>
                                                <td key={pIndex}>
                                                    <Image src={logo} style={{ height: '40px' }} />
                                                </td>
                                                <td key={pIndex}></td>
                                                <td key={pIndex}>
                                                    <p style={{ fontSize: '15px' }}>{product.name}</p>
                                                </td>
                                                <td key={pIndex}>
                                                    {product.isVeg ? <Image src={vegLogo} style={{ height: '15px' }} /> : <Image src={nonVegLogo} style={{ height: '15px' }} />}
                                                </td>
                                                
                                                <td style={{float:'center' ,marginLeft:'-100px'}}>
                                                <div style={{display:'block',textAlign:'center'}}>
                                                <form key={pIndex}  style={{marginTop:'-50px'}}>
                                                    <td>
                                                    {product.quantity_price[2] && <>
                                                        <input type="radio" 
                                                            name="same"
                                                            value="1"
                                                            onClick={()=>setQuantity(product.quantity_price[2]._id)}/> {product.quantity_price[2].type}<p>{`Rs. ${product.quantity_price[2].price} ||`}</p>
                                                    </>
                                                    }
                                                    </td>
                                                    <td>
                                                    {product.quantity_price[1] && <>
                                                        <input type="radio" 
                                                            name="same"
                                                            value="2" 
                                                            onClick={()=>setQuantity(product.quantity_price[1]._id)}/> {product.quantity_price[1].type} <p>{`Rs. ${product.quantity_price[1].price} ||`}</p>
                                                    </>
                                                    }
                                                    </td>
                                                    <td>
                                                    {product.quantity_price[0] && <>
                                                        <input type="radio"
                                                            name="same"
                                                            value="3"
                                                            onClick={()=>setQuantity(product.quantity_price[0]._id)}/> {product.quantity_price[0].type}<p>{`Rs. ${product.quantity_price[0].price}`}</p>
                                                        </>
                                                    }
                                                    </td>
                                                    
                                                </form>
                                                </div>
                                                </td>

                                                    <td style={{float:'right'}}>
                                                <Button variant="outline-primary" id={pIndex} style={{float:'right' ,marginTop:'-60px' , marginLeft:'280px'}} onClick={()=>insert(quantity , product.isVeg , product._id ,pIndex)}>add</Button>
                                                </td>
                                                <hr />
                                            </>
                                            )
                                        })}
                                    </div>
                                </tr>
                            </tbody>
                        </Table>
                    </>
                    )
                })}
            </div>
        </>
    )
}

export default AddOrder