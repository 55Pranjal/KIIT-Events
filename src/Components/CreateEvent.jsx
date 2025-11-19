// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { societies } from "../constants/societies";

// const CreateEvent = () => {
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [guest, setGuest] = useState("");
//   const [registrationStatus, setRegistrationStatus] = useState("");
//   const [coverImageURL, setCoverImageURL] = useState("");
//   const [eventCategory, setEventCategory] = useState("");
//   const [societyId, setSocietyId] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   function normalizeDriveURL(url) {
//     const match = url.match(/\/d\/(.*?)\//);
//     if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
//     return url;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const selectedDate = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     selectedDate.setHours(0, 0, 0, 0);
//     const twoMonthsLater = new Date();
//     twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

//     if (selectedDate <= today) {
//       setMessage("⚠️ Please select a future date for the event.");
//       return;
//     }
//     if (selectedDate > twoMonthsLater) {
//       setMessage("⚠️ Event date must be within the next 2 months.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setMessage("You must be logged in as an admin to create an event");
//         return;
//       }
//       if (!societyId) {
//         setMessage("Please select a society to associate this event with");
//         return;
//       }

//       const normalizedURL = normalizeDriveURL(coverImageURL);

//       const eventData = {
//         title,
//         date,
//         time,
//         location,
//         description,
//         guest,
//         registrationStatus,
//         coverImageURL: normalizedURL,
//         eventCategory,
//         societyId,
//       };

//       console.info("[INFO] Submitting new event:", {
//         title,
//         societyId,
//         eventCategory,
//         date,
//       });

//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/events/add`,
//         eventData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.info("[INFO] Event created successfully:", {
//         id: res.data?._id || "(no id returned)",
//         status: res.status,
//       });

//       setMessage(res.data.message || "Event created successfully!");
//       if (res.status === 201) {
//         setTitle("");
//         setDate("");
//         setTime("");
//         setLocation("");
//         setDescription("");
//         setGuest("");
//         setRegistrationStatus("");
//         setCoverImageURL("");
//         setEventCategory("");
//         setSocietyId("");
//         setTimeout(() => navigate("/"), 1000);
//       }
//     } catch (err) {
//       console.error(
//         "[ERROR] Failed to create event:",
//         err.response?.data?.message || err.message
//       );
//       setMessage(
//         err.response?.data?.message || "Error creating event. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white flex flex-col">
//       <Navbar />

//       <div className="flex justify-center items-center flex-grow px-4 py-8">
//         <div className="bg-black/40 border border-green-900/30 backdrop-blur-md shadow-xl shadow-green-900/40 w-full max-w-2xl rounded-2xl py-8 px-6 sm:px-10">
//           <h1 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text drop-shadow-md">
//             Create Your Event
//           </h1>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             {[
//               {
//                 type: "text",
//                 placeholder: "Event Title",
//                 value: title,
//                 onChange: setTitle,
//               },
//               {
//                 type: "date",
//                 placeholder: "Date",
//                 value: date,
//                 onChange: setDate,
//               },
//               {
//                 type: "time",
//                 placeholder: "Time",
//                 value: time,
//                 onChange: setTime,
//               },
//               {
//                 type: "text",
//                 placeholder: "Location",
//                 value: location,
//                 onChange: setLocation,
//               },
//               {
//                 type: "text",
//                 placeholder: "Guest",
//                 value: guest,
//                 onChange: setGuest,
//               },
//               {
//                 type: "text",
//                 placeholder: "Cover Image URL",
//                 value: coverImageURL,
//                 onChange: setCoverImageURL,
//               },
//             ].map((input, idx) => (
//               <input
//                 key={idx}
//                 type={input.type}
//                 placeholder={input.placeholder}
//                 required
//                 value={input.value}
//                 onChange={(e) => input.onChange(e.target.value)}
//                 className="rounded-lg p-3 w-full bg-[#0d1b12] border border-green-700/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//               />
//             ))}

//             <textarea
//               placeholder="Description"
//               required
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 w-full resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//             />

//             <select
//               required
//               value={registrationStatus}
//               onChange={(e) => setRegistrationStatus(e.target.value)}
//               className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//             >
//               <option value="" disabled>
//                 Registration Status
//               </option>
//               <option value="open">Open</option>
//               <option value="closed">Closed</option>
//               <option value="upcoming">Upcoming</option>
//             </select>

//             <select
//               required
//               value={eventCategory}
//               onChange={(e) => setEventCategory(e.target.value)}
//               className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//             >
//               <option value="" disabled>
//                 Event Category
//               </option>
//               <option value="Music">Music</option>
//               <option value="Dance">Dance</option>
//               <option value="Party">Party</option>
//               <option value="Other">Other</option>
//             </select>

//             <select
//               required
//               value={societyId}
//               onChange={(e) => setSocietyId(e.target.value)}
//               className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//             >
//               <option value="" disabled>
//                 Select Society
//               </option>
//               {societies.map((soc) => (
//                 <option key={soc._id} value={soc._id}>
//                   {soc.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="submit"
//               className="mt-2 font-semibold bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg py-2.5 w-full sm:w-1/2 mx-auto hover:scale-[1.02] hover:shadow-[0_0_10px_#00ff88aa] transition-all duration-300"
//             >
//               Create Event
//             </button>

//             {message && (
//               <p className="text-center mt-3 text-sm text-green-300">
//                 {message}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>

//       <footer className="w-full mt-12 bg-gradient-to-r from-black via-[#0f2e1f] to-[#003300] border-t border-green-800/30 text-green-300 py-4 px-6 text-center">
//         <p className="text-sm tracking-wide">
//           © {new Date().getFullYear()}{" "}
//           <span className="font-semibold text-green-400">KIIT Events</span>. All
//           rights reserved.
//         </p>
//         <p className="text-xs text-green-200/70 mt-1">
//           Built by a fellow KIITIAN (Pranjal Agarwal).
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default CreateEvent;

import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { societies } from "../constants/societies";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [guest, setGuest] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function normalizeDriveURL(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  }

  // 🔥 NEW — instant date validation
  const validateDate = (selected) => {
    const selectedDate = new Date(selected);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    if (selectedDate <= today) {
      setMessage("⚠️ Please select a future date for the event.");
      return false;
    }

    if (selectedDate > twoMonthsLater) {
      setMessage("⚠️ Event date must be within the next 2 months.");
      return false;
    }

    setMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    if (selectedDate <= today) {
      setMessage("⚠️ Please select a future date for the event.");
      return;
    }
    if (selectedDate > twoMonthsLater) {
      setMessage("⚠️ Event date must be within the next 2 months.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as an admin to create an event");
        return;
      }
      if (!societyId) {
        setMessage("Please select a society to associate this event with");
        return;
      }

      const normalizedURL = normalizeDriveURL(coverImageURL);

      const eventData = {
        title,
        date,
        time,
        location,
        description,
        guest,
        registrationStatus,
        coverImageURL: normalizedURL,
        eventCategory,
        societyId,
      };

      console.info("[INFO] Submitting new event:", {
        title,
        societyId,
        eventCategory,
        date,
      });

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/add`,
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.info("[INFO] Event created successfully:", {
        id: res.data?._id || "(no id returned)",
        status: res.status,
      });

      setMessage(res.data.message || "Event created successfully!");
      if (res.status === 201) {
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setGuest("");
        setRegistrationStatus("");
        setCoverImageURL("");
        setEventCategory("");
        setSocietyId("");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error(
        "[ERROR] Failed to create event:",
        err.response?.data?.message || err.message
      );
      setMessage(
        err.response?.data?.message || "Error creating event. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#001a0f] to-[#003319] text-white flex flex-col">
      <Navbar />

      <div className="flex justify-center items-center flex-grow px-4 py-8">
        <div className="bg-black/40 border border-green-900/30 backdrop-blur-md shadow-xl shadow-green-900/40 w-full max-w-2xl rounded-2xl py-8 px-6 sm:px-10">
          <h1 className="text-center font-bold text-3xl mb-6 bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text drop-shadow-md">
            Create Your Event
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              {
                type: "text",
                placeholder: "Event Title",
                value: title,
                onChange: setTitle,
              },
              {
                type: "date",
                placeholder: "Date",
                value: date,
                onChange: (value) => {
                  setDate(value);
                  validateDate(value); // 🔥 instant validation here
                },
              },
              {
                type: "time",
                placeholder: "Time",
                value: time,
                onChange: setTime,
              },
              {
                type: "text",
                placeholder: "Location",
                value: location,
                onChange: setLocation,
              },
              {
                type: "text",
                placeholder: "Guest",
                value: guest,
                onChange: setGuest,
              },
              {
                type: "text",
                placeholder: "Cover Image URL",
                value: coverImageURL,
                onChange: setCoverImageURL,
              },
            ].map((input, idx) => (
              <input
                key={idx}
                type={input.type}
                placeholder={input.placeholder}
                required
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                className="rounded-lg p-3 w-full bg-[#0d1b12] border border-green-700/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            ))}

            <textarea
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 w-full resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />

            <select
              required
              value={registrationStatus}
              onChange={(e) => setRegistrationStatus(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <option value="" disabled>
                Registration Status
              </option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="upcoming">Upcoming</option>
            </select>

            <select
              required
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <option value="" disabled>
                Event Category
              </option>
              <option value="Music">Music</option>
              <option value="Dance">Dance</option>
              <option value="Party">Party</option>
              <option value="Other">Other</option>
            </select>

            <select
              required
              value={societyId}
              onChange={(e) => setSocietyId(e.target.value)}
              className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <option value="" disabled>
                Select Society
              </option>
              {societies.map((soc) => (
                <option key={soc._id} value={soc._id}>
                  {soc.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="mt-2 font-semibold bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg py-2.5 w-full sm:w-1/2 mx-auto hover:scale-[1.02] hover:shadow-[0_0_10px_#00ff88aa] transition-all duration-300"
            >
              Create Event
            </button>

            {message && (
              <p className="text-center mt-3 text-sm text-green-300">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <footer className="w-full mt-12 bg-gradient-to-r from-black via-[#0f2e1f] to-[#003300] border-t border-green-800/30 text-green-300 py-4 px-6 text-center">
        <p className="text-sm tracking-wide">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-green-400">KIIT Events</span>. All
          rights reserved.
        </p>
        <p className="text-xs text-green-200/70 mt-1">
          Built by a fellow KIITIAN (Pranjal Agarwal).
        </p>
      </footer>
    </div>
  );
};

export default CreateEvent;
