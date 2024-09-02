import { Textarea } from "@chakra-ui/react";

const Quote = ({ input, handleChange, handleSubmit, isLoading }) => {
  // Get today's date in the format yyyy-mm-dd
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="block font-libre w-full" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-slate-900 font-semibold">Request a Quote</h1>

      <input
        name="name"
        value={input.name}
        onChange={handleChange}
        placeholder="Name"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <input
        name="phone_number"
        value={input.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <input
        name="price"
        value={input.price}
        onChange={handleChange}
        placeholder="Price"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <input
        name="event_date"
        value={input.event_date}
        onChange={handleChange}
        type="date"
        min={today} // Set minimum date to today
        placeholder="Event date"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <Textarea
        name="description"
        value={input.description}
        onChange={handleChange}
        placeholder="Description of services needed"
        className="w-full rounded-md p-3 border-2 border-slate-400"
      ></Textarea>
      <input
        name="address"
        value={input.address}
        onChange={handleChange}
        placeholder="Address"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <button
        type="submit"
        className="w-[150px] p-2 rounded-md bg-gold text-black my-3"
      >
        {isLoading ? "posting" : "  Submit  Quote Request"}
      </button>
    </form>
  );
};

export default Quote;
