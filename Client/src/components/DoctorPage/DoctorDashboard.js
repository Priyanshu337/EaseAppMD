import React,{useState, useEffect} from 'react';
import DoctorCard from './DoctorCard'; 
import CategoryBox from './CategoryBox';
import heartImage from '../../assets/heart.png'; 
import kidneyImage from '../../assets/kidney.png';
import brainImage from '../../assets/brain.png';
import lungImage from '../../assets/lung.png';
import searchIcon from '../../assets/searchicon.png';
import './DoctorDashboard.css'; 
const itemsPerPage = 6; // Number of doctors per page
const categories = [
  { name: 'Heart', image: heartImage },
  { name: 'Kidney', image: kidneyImage },
  { name: 'Brain', image: brainImage },
  { name: 'Lungs', image: lungImage }
];



const DoctorDashboard = () => {
  const [doctorsData, setDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch("https://localhost:7012/api/Doctors/GetAllDoctors")
      .then((response) => response.json())
      .then((data) => setDoctors(data)) // Set the fetched data to the state variable
      .catch((error) => console.error("Error fetching data:", error));
  }, []); 

    const filteredDoctors = doctorsData.filter((doctor) =>
    doctor.speciality.toLowerCase().includes(selectedCategory.toLowerCase()) &&
    (searchQuery === '' || doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Handle logic related to the selected category, if needed
  };
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Logic to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="container">
       <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button">
          <img src={searchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
      <div className="header">Categories</div>     
      <div className="categories">
        {categories.map((category, index) => (
          <CategoryBox
            key={index}
            category={category.name}
            image={category.image}
            onClick={handleCategoryClick}
            selected={selectedCategory === category.name || (selectedCategory === '' && category.name === '')}
          />
        ))}
      </div>
      <div className="header">Doctors</div>
      <div className="doctor-cards">
      {currentDoctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredDoctors.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
          <button key={number} className={`page-button ${currentPage === number ? 'active' : ''}`} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
