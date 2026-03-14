/**
 * useWishlist — localStorage-based wishlist hook
 * Provides: wishlist[], addToWishlist(), removeFromWishlist(), isWishlisted(), toggleWishlist()
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cc_wishlist'; // cc = Classic Couture

const getStored = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveStored = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const useWishlist = () => {
    const [wishlist, setWishlist] = useState(getStored);

    // Sync to localStorage whenever wishlist changes
    useEffect(() => {
        saveStored(wishlist);
        // Dispatch event so Navbar can update its count
        window.dispatchEvent(new Event('wishlistUpdated'));
    }, [wishlist]);

    /** Check if a product is already wishlisted */
    const isWishlisted = useCallback(
        (productId) => wishlist.some((item) => item.id === productId),
        [wishlist]
    );

    /** Add product — prevents duplicates */
    const addToWishlist = useCallback((product) => {
        setWishlist((prev) => {
            if (prev.some((item) => item.id === product.id)) return prev;
            return [...prev, {
                id: product.id || product.product_id,
                name: product.name || product.product_name,
                price: product.price,
                image: product.image,
                category_name: product.category_name || '',
            }];
        });
    }, []);

    /** Remove product by id */
    const removeFromWishlist = useCallback((productId) => {
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
    }, []);

    /** Toggle — add if absent, remove if present */
    const toggleWishlist = useCallback((product) => {
        const id = product.id || product.product_id;
        setWishlist((prev) => {
            if (prev.some((item) => item.id === id)) {
                return prev.filter((item) => item.id !== id);
            }
            return [...prev, {
                id,
                name: product.name || product.product_name,
                price: product.price,
                image: product.image,
                category_name: product.category_name || '',
            }];
        });
    }, []);

    return { wishlist, isWishlisted, addToWishlist, removeFromWishlist, toggleWishlist };
};

export default useWishlist;
