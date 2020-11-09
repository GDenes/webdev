import React, {useEffect, useContext} from "react";
import { useHistory } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from '../context/RestaurantsContext';
import StarRating from "./StarRating";

export const RestaurantList = (props) => {
    const {restaurants, setRestaurants} = useContext(RestaurantsContext)
    let history = useHistory()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get("/")
                setRestaurants(response.data.data.restaurants);
            } catch (err) {}
        };
        fetchData();
    }, []);

    const handleDelete = async (e, id) =>{
        e.stopPropagation();
        try {
           const response = await RestaurantFinder.delete(`/${id}`)
          setRestaurants(restaurants.filter(restaurant => {
              return restaurant.id !== id
          }))
        } catch (error) {
            console.log(error)
        }
    };

    const handleUpdate = (e, id) =>{
        e.stopPropagation();
        history.push(`/restaurants/${id}/update`)
    }

    const handleRestoranSelect = (id) =>{
        history.push(`/restaurants/${id}`)
    }

    const renderRating = (restaurant) =>{
        if(!restaurant.count){
            return <span className="text-warning">0 reviews</span>
        }
       return(
       <>
        <StarRating rating={restaurant.average_rating}/>
    <span className="text-warning m1-1"> ({restaurant.count})</span>
    </>)
    }

    return (
        <div className="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope="col">Restaurant</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price Range</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && restaurants.map(restaurant =>{
                        return (
                            <tr onClick={() => handleRestoranSelect(restaurant.id) } key={restaurant.id}>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.location}</td>
                            <td>{"$".repeat(restaurant.price_range)}</td>
                            <td>{renderRating(restaurant)}</td>
                            <td><button onClick={(e) => handleUpdate(e, restaurant.id)} className="btn btn-warning">Update</button></td>
                            <td><button onClick={(e) => handleDelete(e, restaurant.id)} className="btn btn-danger">Delete</button></td>
                        </tr>
                        );
                    })}
{/*                     <td>restaurant</td>
                    <td>new york</td>
                    <td>$$</td>
                    <td>Rating</td>
                    <td><button className="btn btn-warning">Update</button></td>
                    <td><button className="btn btn-danger">Delete</button></td> */}
                </tbody>
            </table>
        </div>
    )
}