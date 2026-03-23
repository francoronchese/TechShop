import { useDispatch, useSelector } from "react-redux";
import { setFavorites } from "@store/slices/favoritesSlice";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "@store/api/apiSlice";

const useFavoriteActions = () => {
  const dispatch = useDispatch();

  // Get user state from Redux store
  const userState = useSelector((state) => state.user);
  const isLoggedIn = userState._id !== "";

  // Get favorites from Redux store
  const favorites = useSelector((state) => state.favorites.items);

  // RTK Query mutations for favorites
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  // Check if a product is in favorites by its ID
  const isFavorite = (productId) =>
    favorites.some((fav) => fav._id === productId);

  const handleFavoriteToggle = async (product) => {
    if (isFavorite(product._id)) {
      // Remove from favorites and update Redux
      await removeFromFavorites({ productId: product._id }).unwrap();
      dispatch(setFavorites(favorites.filter((fav) => fav._id !== product._id)));
    } else {
      // Add to favorites and update Redux
      await addToFavorites({ productId: product._id }).unwrap();
      dispatch(setFavorites([...favorites, product]));
    }
  };

  return {
    isLoggedIn,
    isFavorite,
    handleFavoriteToggle,
  };
};

export default useFavoriteActions;