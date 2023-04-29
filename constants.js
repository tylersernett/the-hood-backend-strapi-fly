const prod = {  
    url: {
        BASE_URL: 'https://tylersernett.github.io/react-ecommerce',
        // API_URL: 'https://myapp.herokuapp.com',
        //API_URL_USERS: 'https://myapp.herokuapp.com/users'
    }
};

const dev = { 
    url: {
        BASE_URL: 'http://localhost:2000/react-ecommerce',
        // API_URL: 'http://localhost:1337',
    }
};

// export const serv_config = process.env.NODE_ENV === 'development' ? dev : prod;
const serv_config = process.env.NODE_ENV === 'development' ? dev : prod;
module.exports = { serv_config };