import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : "https://nftirl.herokuapp.com"

const apiService = {
    createAccount: (userAddress) => {
        axios.post(`${BASE_URL}/users`, {address: userAddress})
    }
}

export default apiService