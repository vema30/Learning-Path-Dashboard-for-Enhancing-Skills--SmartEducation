import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa'; // Importing delete icon from react-icons

const InstructorTests = () => {
  const { user } = useSelector((state) => state.profile);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`http://localhost:4000/api/test/instructor/${user._id}`)
        .then((res) => setTests(res.data))
        .catch((err) => console.error('Failed to fetch instructor tests:', err));
    }
  }, [user]);

  const handleDelete = (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      axios
        .delete(`http://localhost:4000/api/test/${testId}`)
        .then(() => {
          setTests(tests.filter((test) => test._id !== testId));
          alert('Test deleted successfully!');
        })
        .catch((err) => console.error('Failed to delete test:', err));
    }
  };

  if (!user) return <div className="p-4">Please log in to view your tests.</div>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Your Created Tests</h2>

      {/* Display message if no tests are available */}
      {tests.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          <p>You haven't created any tests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test._id}
              className="relative border rounded-lg p-4 shadow bg-white cursor-pointer hover:bg-gray-50 transition"
              onClick={() => navigate(`/edit-test/${test._id}`)}
            >
              <img
                src={test.image}
                alt={test.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
              <p className="text-gray-600">Category: {test.category?.name}</p>
              <p className="text-gray-500 text-sm">{test.questions.length} questions</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the onClick for the div
                  handleDelete(test._id);
                }}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorTests;
