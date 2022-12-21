// when 'click' - add {objectname} to {cartItems} and ++ {cartCount}
export const addToCart = () => {
    let cartCount: number = 0;
    // put correct query once HTML is correct
    document.querySelector('button')?.addEventListener('click', () => {
        // E2S2 - add {objectname to cartItems}

        // ++ cartCount
        cartCount++;

        // E2S2 - print out cartCount
        console.log(cartCount)
    })
}



