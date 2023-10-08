
const axios = require("axios");




exports.meddetails=async(name)=>{const options = {
        method: 'GET',
        url: 'https://drug-info-and-price-history.p.rapidapi.com/1/druginfo',
        params: {drug: name},
        headers: {
            'X-RapidAPI-Key': '1c83e43142msh7d0a8589e13b990p1aadc9jsn71e6373d26e8',
            'X-RapidAPI-Host': 'drug-info-and-price-history.p.rapidapi.com'
        }
    };
    

        const response = await axios.request(options);
        return response.data
  

    }



// exports.meddetails=async(name)=>{const options = {
//     method: 'GET',
//     url: 'https://indian-stock-exchange-api1.p.rapidapi.com/stock_price/',
//     params: {
//       symbol: name 
//     },
//     headers: {
//       'X-RapidAPI-Key': '1c83e43142msh7d0a8589e13b990p1aadc9jsn71e6373d26e8',
//       'X-RapidAPI-Host': 'indian-stock-exchange-api1.p.rapidapi.com'
//     }
//   };

//       const response = await axios.request(options);
//       return response.data;
  
// }