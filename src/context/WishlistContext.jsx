/**
 * WishlistContext — makes wishlist state available globally
 * Wrap <App> with <WishlistProvider> so Navbar and any page can read count
 */
import { createContext, useContext } from 'react';
import useWishlist from '../hooks/useWishlist';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const wishlistData = useWishlist();
    return (
        <WishlistContext.Provider value={wishlistData}>
            {children}
        </WishlistContext.Provider>
    );
};

/** Convenience hook — use anywhere inside the tree */
export const useWishlistContext = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlistContext must be used inside <WishlistProvider>');
    return ctx;
};

export default WishlistContext;
