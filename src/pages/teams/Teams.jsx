import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { BsBoxSeam } from 'react-icons/bs';
import { FiBarChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './teams.css';

const Teams = () => {
  const icons = [
    <MdOutlineSupervisorAccount size={32} />,
    <BsBoxSeam size={32} />,
    <FiBarChart size={32} />,
    <HiOutlineRefresh size={32} />,
  ];
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    organization: '',
    venue: '',
    eventDetails: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [events, setEvents] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = {};
        querySnapshot.forEach((doc) => {
          fetchedEvents[doc.id] = doc.data();
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Save the form data to Firebase Firestore
      const docRef = await addDoc(collection(db, 'events'), formData);

      console.log('Document written with ID:', docRef.id);

      // Reset the form data state to its initial values
      setFormData({
        eventName: '',
        organization: '',
        venue: '',
        eventDetails: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
      });

      // Close the modal after successful submission
      closeModal();
    } catch (error) {
      console.error('Error saving form data to Firebase Firestore:', error);
    }
  };

  return (
    <div className="relative">
      <div className="flex mt-2 ml-10" style={{ zIndex: '1000' }}>
        <button
          type="button"
          onClick={openModal}
          style={{ background: currentColor }}
          className="text-base text-white p-2 hover:drop-shadow-xl hover:bg-light-gray rounded-full opacity-0.9"
        >
          Add / Join Team
        </button>
      </div>

      {/* Modal */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            </Transition.Child>

            {/* Modal Content */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {/* Form Content */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Event Name:</label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter event name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Organization:</label>
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border rounded-md"
                      required>
                      <option value="">Select organization</option>
                      <option value="CS Society">CS Society</option>
                      {/* Add your organization options here */}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Venue:</label>
                    <select
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select venue</option>
                      <option value="ELL">ELL</option>
                        <option value="CS Lounge">CS Lounge</option>
                        <option value="FYP Lab">FYP Lab</option>
                        <option value="Dewan Tengku Syed Putra">Dewan Tengku Syed Putra</option>
                        <option value="Dewan Utama Pelajar">Dewan Utama Pelajar</option>
                        <option value="Dewan Utama Desasiswa">Dewan Utama Desasiswa</option>
                        <option value="Dewan Budaya">Dewan Budaya</option>
                        <option value="Stadium Azman Hashim">Stadium Azman Hashim</option>
                        <option value="Padang Kawad">Padang Kawad</option>
                        <option value="DKG 31">DKG 31</option>
                        <option value="CS Auditorium">CS Auditorium</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Event Details:</label>
                    <textarea
                      name="eventDetails"
                      value={formData.eventDetails}
                      onChange={handleChange}
                      placeholder="Enter event details"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-semibold">Start Date:</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Start Time:</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-semibold">End Date:</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">End Time:</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-white bg-gray-500 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ background: currentColor }}
                      className="ml-2 px-4 py-2 text-white rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex m-14 flex-wrap justify-center gap-7 items-center">
      {Object.entries(events).map(([eventId, eventData]) => (
        <div
          key={eventId}
          className="bg-white h-60 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-60 p-4 pt-9 rounded-2xl"
          style={{
            color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
              Math.random() * 256
            )})`,
            backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
              Math.random() * 256
            )})`,
          }}
        >
        <Link
            key={eventId}
            to={`/activity/${eventId}`}
            className="link"
          >
            <div className="flex flex-col justify-center items-center content-container">
              {icons[Math.floor(Math.random() * icons.length)]}
              <p className="mt-12">
                <span className="text-xl font-semibold event-name">{eventData.eventName}</span>
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Teams;