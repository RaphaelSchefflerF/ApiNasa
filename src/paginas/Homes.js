import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import nasaLogo from '../imagens/NASA_logo.svg.png'
import Asteroide from '../imagens/cometa.png'
import './../css/Homes.css';

const App = () => {
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async (page = 0) => {
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&api_key=y0PUGwJ6cEmX2PDEEtjV3NzAUN2O5zEe9MaapzU7`);
      setNeoData(response.data.near_earth_objects);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching NEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    fetchData(selectedPage);
  };

  const formataData = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  };


  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <div className="App">
      <div className="container py-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-10">
            <div className="col-md-2">
              <img src={nasaLogo} alt="NASA Logo" className="img-fluid" />
            </div>
            <h1 className="text-right">Objetos Perto da Terra</h1>
            <p className="text-secondary text-right">Informações sobre asteroides e cometas perto do nosso planeta.</p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {neoData.map((neo) => (
            <div key={neo.id} className="col">
              <div className="card h-100 shadow">
                <img src={Asteroide} className="card-img-top" alt="Asteroid" />
                <div className="card-body">
                  <h5 className="card-title">{neo.name}</h5>
                  <p className="card-text">Diâmetro estimado: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                  <p className="card-text">Observado de {formataData(neo.orbital_data.first_observation_date)} até {formataData(neo.orbital_data.last_observation_date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReactPaginate
          pageCount={neoData.length}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default App;
