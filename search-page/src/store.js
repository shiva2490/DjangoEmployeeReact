import { configureStore, createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice( {
    name : 'products',
    initialState : {
        products: [
                    { id: 1, name: 'Laptop',image:"https://i.pinimg.com/originals/5c/dd/c2/5cddc2b889ab36f39105c62dddf4e439.jpg"},
                    { id: 2, name: 'Phone', image:"https://tse3.mm.bing.net/th/id/OIP.U2KwyAij3kH7m7U_SvXmBQHaE8?pid=Api&P=0&h=180"},
                    { id: 3, name: 'Tablet',image:"https://tse4.mm.bing.net/th/id/OIP.lUhOnQVpr_vRUbTk4n14ogHaHa?pid=Api&P=0&h=180"},
                    { id: 4, name: 'Keyboard',image:"https://m.media-amazon.com/images/I/81SLAR9MnxS.jpg"},
                    { id: 5, name: 'Laptop Stand',image:"https://tse4.mm.bing.net/th/id/OIP.nY7DoMn_4DXKRvG975qdsAHaHa?pid=Api&P=0&h=180"},
                    { id: 6, name: 'Laptop Charger',image:"https://i5.walmartimages.com/asr/e4ac19f8-9968-4237-af10-bff0efc1b460.8c2b274ecbd30c32dc0df596ed1f593c.jpeg"}
                    ],
    },

    reducers: {}
})

const store = configureStore( {
    reducer : {products : productSlice.reducer}
})

export default store;