import { Textarea } from "@chakra-ui/react";
import React, { useState } from "react";

const QuoteForm = ({ input, handleChange, handleSubmit, isLoading }) => {
  // Get today's date in the format yyyy-mm-dd
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="block font-libre w-full" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-slate-900 font-semibold">Make a booking</h1>
      <input
        name="event_date"
        value={input.event_date}
        onChange={handleChange}
        type="date"
        min={today} // Set minimum date to today
        placeholder="Event date"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <input
        name="event_type"
        value={input.event_type}
        onChange={handleChange}
        placeholder="Event type"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <input
        name="guest_count"
        value={input.guest_count}
        onChange={handleChange}
        placeholder="Guest Count"
        className="rounded-xl border-slate-400 my-3 p-3 w-full border-2"
      />
      <Textarea
        name="special_requests"
        value={input.special_requests}
        onChange={handleChange}
        placeholder="Special requests"
        className="w-full rounded-md p-3 border-2 border-slate-400"
      ></Textarea>
      <button
        type="submit"
        className="w-[150px] p-2 rounded-md bg-gold text-black my-3"
      >
        {isLoading ? "posting" : "  Submit  booking"}
      </button>
    </form>
  );
};

export default QuoteForm;
