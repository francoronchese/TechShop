import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} from "@store/api/apiSlice";
import { Button, Input, PageLoader, Loader } from "@components";

export const AddressesPage = () => {
  // Toggle new address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  // New address form data
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  // RTK Query hooks
  const { data: addresses = [], isLoading: loadingAddresses } =
    useGetAddressesQuery();
  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(addressForm).unwrap();
      toast.success("Address added successfully");
      setAddressForm({
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      });
      setShowAddressForm(false);
    } catch (error) {
      toast.error(error.data?.message || "Error adding address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress({ _id: id }).unwrap();
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Error deleting address");
    }
  };

  if (loadingAddresses) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-slate-800 text-lg font-bold">My Addresses</h2>
            <p className="text-sm text-slate-600">
              Manage your saved addresses
            </p>
          </div>
          <Button
            onClick={() => setShowAddressForm(!showAddressForm)}
            icon={Plus}
            iconSize={16}
            className="w-full sm:w-auto justify-center bg-orange-500 text-white hover:bg-orange-600"
          >
            Add New
          </Button>
        </div>

        {/* New address form */}
        {showAddressForm && (
          <form
            onSubmit={handleAddAddress}
            className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Address"
                name="address"
                value={addressForm.address}
                onChange={handleAddressFormChange}
                placeholder="Street address"
              />
              <Input
                label="City"
                name="city"
                value={addressForm.city}
                onChange={handleAddressFormChange}
                placeholder="City"
              />
              <Input
                label="State"
                name="state"
                value={addressForm.state}
                onChange={handleAddressFormChange}
                placeholder="State"
              />
              <Input
                label="Country"
                name="country"
                value={addressForm.country}
                onChange={handleAddressFormChange}
                placeholder="Country"
              />
              <Input
                label="Postal Code"
                name="postal_code"
                value={addressForm.postal_code}
                onChange={handleAddressFormChange}
                placeholder="Postal code"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={addingAddress}
                className={`bg-orange-500 text-white hover:bg-orange-600 ${addingAddress ? "opacity-85 px-10" : ""}`}
              >
                {addingAddress ? <Loader /> : "Save Address"}
              </Button>
              <Button
                onClick={() => setShowAddressForm(false)}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Addresses list */}
        {addresses.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <MapPin className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No saved addresses yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-orange-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {addr.address}
                    </p>
                    <p className="text-sm text-slate-500">
                      {addr.city}, {addr.state}, {addr.country}{" "}
                      {addr.postal_code}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
