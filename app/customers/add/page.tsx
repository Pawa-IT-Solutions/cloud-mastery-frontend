"use client";

import { useState } from "react";
import NavigationTitleBar from "@/app/components/common/NavigationTitleBar";
import { addCustomer } from "@/app/api";
import { CustomersType } from "@/app/types/CustomersType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

const CustomerForm: React.FC = () => {
  const [form, setForm] = useState<CustomersType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    createdAt: "",
    id: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addCustomer(form);
      toast.success("Customer added successfully!");
      router.push("/customers");
    } catch (error: unknown) {
      console.error("Error adding customer:", error);
      if (axios.isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          messages.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(error.message || "An unexpected error occurred");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-4">
        <NavigationTitleBar title="" showBack={true} />
        <h2 className="text-xl font-semibold text-gray-700">
          Add new customer
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow mx-auto p-6 space-y-8">
        <div className="border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-3">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
          </div>
        </div>

        <div className="border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-3">
            Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              name="address"
              placeholder="Home address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 bg-sky-200 hover:border hover:bg-sky-200  hover:border-sky-300 text-sky-900 font-medium py-2 px-3 rounded-md transition cursor-pointer"
          >
            {isLoading ? "Adding..." : "Add Customer"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
