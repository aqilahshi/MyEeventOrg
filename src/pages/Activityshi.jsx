import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';

const Activity = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          const eventData = eventDocSnap.data();
          setEventData(eventData);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        setError('Error fetching event data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(eventData);
  };

  const handleInputChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSave = async () => {
    try {
      if (imageFile) {
        // Upload the image file to Firebase Storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${eventId}`);
        await fileRef.put(imageFile);

        // Get the download URL of the uploaded image
        const imageUrl = await fileRef.getDownloadURL();
        setEditedData({
          ...editedData,
          imageUrl,
        });
      }

      const eventDocRef = doc(db, 'events', eventId);
      await updateDoc(eventDocRef, editedData);
      setIsEditing(false);
      setEventData(editedData);
    } catch (error) {
      console.error('Error saving event data:', error);
      setError('Error saving event data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Main" title="Activity" />

      <div className="flex flex-wrap">
        <div className="w-full md:w-3/4 mt-3">
          <div className="mb-4">
            <label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">
              Event Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="eventName"
                value={editedData.eventName}
                onChange={handleInputChange}
                className="border border-gray-300 px-2 py-1 rounded-md"
              />
            ) : (
              <p>{eventData.eventName}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="organization" className="block text-gray-700 font-bold mb-2">
              Organization
            </label>
            {isEditing ? (
              <input
                type="text"
                name="organization"
                value={editedData.organization}
                onChange={handleInputChange}
                className="border border-gray-300 px-2 py-1 rounded-md"
              />
            ) : (
              <p>{eventData.organization}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="venue" className="block text-gray-700 font-bold mb-2">
              Event Venue
            </label>
            {isEditing ? (
              <input
                type="text"
                name="venue"
                value={editedData.venue}
                onChange={handleInputChange}
                className="border border-gray-300 px-2 py-1 rounded-md"
              />
            ) : (
              <p>{eventData.venue}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="details" className="block text-gray-700 font-bold mb-2">
              Event Details
            </label>
            {isEditing ? (
              <textarea
                name="details"
                value={editedData.eventDetails}
                onChange={handleInputChange}
                className="border border-gray-300 px-2 py-1 rounded-md"
              ></textarea>
            ) : (
              <p>{eventData.eventDtails}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">
                Start Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="startDate"
                  value={editedData.startDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-2 py-1 rounded-md"
                />
              ) : (
                <p>{eventData.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">
                Start Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="startTime"
                  value={editedData.startTime}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-2 py-1 rounded-md"
                />
              ) : (
                <p>{eventData.startTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
                End Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="endDate"
                  value={editedData.endDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-2 py-1 rounded-md"
                />
              ) : (
                <p>{eventData.endDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endTime" className="block text-gray-700 font-bold mb-2">
                End Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="endTime"
                  value={editedData.endTime}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-2 py-1 rounded-md"
                />
              ) : (
                <p>{eventData.endTime}</p>
              )}
            </div>
          </div>

          {/* {isEditing ? (
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                Event Image
              </label>
              <input type="file" name="image" onChange={handleImageChange} />
            </div>
          ) : null} */}

          <div className="flex justify-end">
            {isEditing ? (
              <button
                type="button"
                className="mt-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="mt-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}

            <button
              type="button"
              className="mt-8 ml-4 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/4 mt-8 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Image" className="max-w-full h-auto rounded-lg" />
          ) : (
            <img
              src={eventData.imageUrl || 'path/to/default-image.jpg'}
              alt="Image"
              className="max-w-full h-auto rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
