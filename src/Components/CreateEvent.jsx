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
//   const [customCategory, setCustomCategory] = useState(""); // ✅ NEW
//   const [societyId, setSocietyId] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   function normalizeDriveURL(url) {
//     const match = url.match(/\/d\/(.*?)\//);
//     if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
//     return url;
//   }

//   const validateDate = (selected) => {
//     const selectedDate = new Date(selected);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     selectedDate.setHours(0, 0, 0, 0);

//     const twoMonthsLater = new Date();
//     twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

//     if (selectedDate <= today) {
//       setMessage("⚠️ Please select a future date for the event.");
//       return false;
//     }

//     if (selectedDate > twoMonthsLater) {
//       setMessage("⚠️ Event date must be within the next 2 months.");
//       return false;
//     }

//     setMessage("");
//     return true;
//   };

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

//       const finalCategory =
//         eventCategory === "Other" ? customCategory : eventCategory; // ✅ FIX

//       const eventData = {
//         title,
//         date,
//         time,
//         location,
//         description,
//         guest,
//         registrationStatus,
//         coverImageURL: normalizedURL,
//         eventCategory: finalCategory, // ✅ send correct value
//         societyId,
//       };

//       console.info("[INFO] Submitting new event:", {
//         title,
//         societyId,
//         eventCategory: finalCategory,
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
//         setCustomCategory(""); // reset
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
//                 onChange: (value) => {
//                   setDate(value);
//                   validateDate(value);
//                 },
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

//             <div className="w-full">
//               <select
//                 required
//                 value={eventCategory}
//                 onChange={(e) => setEventCategory(e.target.value)}
//                 className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//               >
//                 <option value="" disabled>
//                   Event Category
//                 </option>
//                 <option value="Music">Music</option>
//                 <option value="Dance">Dance</option>
//                 <option value="Party">Party</option>
//                 <option value="Other">Other</option>
//               </select>

//               {eventCategory === "Other" && (
//                 <input
//                   type="text"
//                   placeholder="Enter custom category"
//                   value={customCategory}
//                   onChange={(e) => setCustomCategory(e.target.value)}
//                   className="mt-3 rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
//                   required
//                 />
//               )}
//             </div>

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

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadPoster from "./UploadPoster"; // <-- imported

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
  const [customCategory, setCustomCategory] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // societies from backend (normalized to { _id, name, raw })
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(false);
  const [societiesError, setSocietiesError] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    const fetchSocieties = async () => {
      setLoadingSocieties(true);
      setSocietiesError("");
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        console.info("[CreateEvent] fetching societies from /api/users ...");
        const res = await axios.get(`${BACKEND}/api/users`, config);
        console.debug("[CreateEvent] raw /api/users response:", res.data);

        if (!Array.isArray(res.data)) {
          console.warn(
            "[CreateEvent] /api/users did not return an array:",
            res.data
          );
          setSocieties([]);
          setSocietiesError("Unexpected societies response from server.");
          return;
        }

        // Normalize response into { _id, name, raw }
        const normalized = res.data
          .map((item) => {
            // Candidate id: user._id or item.societyId / item.society._id
            const candidateId =
              (item && (item._id || item.id)) ||
              (item &&
                item.societyId &&
                (item.societyId._id || item.societyId)) ||
              (item && item.society && (item.society._id || item.society));
            // Candidate name: prefer society.name (if nested), else user.name, else email
            const candidateName =
              (item &&
                item.society &&
                item.society.name &&
                String(item.society.name).trim()) ||
              (item && item.name && String(item.name).trim()) ||
              (item && item.email && String(item.email).trim()) ||
              null;

            if (!candidateId || !candidateName) return null;
            return { _id: String(candidateId), name: candidateName, raw: item };
          })
          .filter(Boolean);

        if (normalized.length === 0) {
          console.warn(
            "[CreateEvent] normalization yielded 0 societies:",
            res.data
          );
          setSocieties([]);
          setSocietiesError("No societies available (server returned empty).");
          return;
        }

        setSocieties(normalized);
        console.info(
          "[CreateEvent] societies loaded (normalized):",
          normalized.length
        );
      } catch (err) {
        console.error(
          "[CreateEvent] failed to fetch societies:",
          err?.response?.data || err.message
        );
        setSocieties([]);
        setSocietiesError("Failed to load societies. Try reloading the page.");
      } finally {
        setLoadingSocieties(false);
      }
    };

    fetchSocieties();
  }, [BACKEND]);

  function normalizeDriveURL(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return url;
  }

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

    // --- date checks (same as before) ---
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

      // sanity-check the selected society exists in fetched list
      const found = societies.find((s) => s._id === societyId);
      console.info(
        "[DEBUG] Selected societyId:",
        societyId,
        "found:",
        !!found,
        found
      );
      if (!found) {
        setMessage("⚠️ Selected society not found in fetched societies.");
        return;
      }

      if (typeof coverImageURL !== "string" || coverImageURL.trim() === "") {
        setMessage(
          "⚠️ Please upload a poster or paste an image URL for the event."
        );
        return;
      }

      const normalizedURL = normalizeDriveURL(coverImageURL);
      const finalCategory =
        eventCategory === "Other" ? customCategory : eventCategory;

      const eventData = {
        title: title?.trim() || "",
        date: date || "",
        time: time || "",
        location: location?.trim() || "",
        description: description?.trim() || "",
        guest: guest?.trim() || "",
        registrationStatus: registrationStatus || "",
        coverImageURL: normalizedURL,
        eventCategory: finalCategory || "",
        societyId: societyId,
      };

      console.debug("[DEBUG] POST payload:", eventData);

      const res = await axios.post(`${BACKEND}/api/events/add`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // --- inspect full response carefully ---
      console.info("[INFO] create event response:", {
        status: res.status,
        data: res.data,
      });

      // server returns created event either in res.data._id or res.data.event
      const returnedEvent = res.data?.event ?? res.data;

      // log returned event
      console.debug("[DEBUG] returnedEvent:", returnedEvent);

      // check societyId presence & type
      const returnedSociety = returnedEvent?.societyId;
      if (!returnedSociety) {
        console.warn(
          "[WARN] Created event does not include societyId in response. Server may not have saved it."
        );
        setMessage(
          "Event created but server did not return associated society. Check server logs."
        );
      } else {
        // if populated, it may be an object with ._id and .name, else it's likely a string id
        const isPopulated =
          typeof returnedSociety === "object" &&
          (returnedSociety.name || returnedSociety._id);
        console.info(
          "[INFO] returned society in created event:",
          returnedSociety,
          "populated:",
          !!isPopulated
        );
        if (!isPopulated) {
          // it's probably an ObjectId string — that's okay, event is associated but not populated
          setMessage(
            res.data?.message || "Event created successfully! (societyId saved)"
          );
        } else {
          setMessage(
            res.data?.message ||
              "Event created successfully and society populated!"
          );
        }
      }

      if (res.status === 201) {
        // reset
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setGuest("");
        setRegistrationStatus("");
        setCoverImageURL("");
        setEventCategory("");
        setCustomCategory("");
        setSocietyId("");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("[ERROR] create event failed - axios error:", err);
      if (err.response) {
        console.error("[ERROR] server response:", err.response.data);
        setMessage(
          err.response.data?.message || `Server returned ${err.response.status}`
        );
      } else {
        setMessage(err.message || "Error creating event. Please try again.");
      }
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
                  validateDate(value);
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

            <div className="w-full">
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

              {eventCategory === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-3 rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  required
                />
              )}
            </div>

            {/* Society select (populated from backend) */}
            {loadingSocieties ? (
              <div className="rounded-lg p-3 bg-[#0d1b12] border border-green-700/40 text-gray-300 w-full">
                Loading societies...
              </div>
            ) : societiesError ? (
              <div className="rounded-lg p-3 bg-[#1a0f12] border border-red-600/40 text-red-300 w-full">
                {societiesError}
              </div>
            ) : (
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
            )}

            {/* Poster uploader + manual URL fall-back */}
            <div className="w-full mt-2">
              <label className="block mb-2 text-sm text-green-200">
                Poster
              </label>

              <UploadPoster
                onUploaded={(url) => {
                  console.info(
                    "[DEBUG] UploadPoster onUploaded called with:",
                    url
                  );
                  setCoverImageURL(url);
                  setMessage("Poster uploaded successfully.");
                }}
                initialPreviewUrl={coverImageURL}
              />

              <p className="text-xs text-green-200/60 mt-2 mb-1">
                Or paste an image URL (optional) — this will be normalized on
                submit.
              </p>
              <input
                type="text"
                placeholder="Paste image URL (optional)"
                value={coverImageURL}
                onChange={(e) => setCoverImageURL(e.target.value)}
                className="rounded-lg p-3 w-full bg-[#0d1b12] border border-green-700/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />

              {coverImageURL && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={coverImageURL}
                    alt="poster preview"
                    onError={(e) => {
                      e.currentTarget.src = ""; // hide broken image
                    }}
                    className="max-w-full max-h-48 rounded-lg object-cover border border-green-700/30"
                  />
                </div>
              )}
            </div>

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
