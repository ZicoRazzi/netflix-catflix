import React, { useEffect } from 'react';
import HomeHero from '../components/HomeHero/HomeHero';
import FooterBrowserPage from '../components/FooterBrowserPage/FooterBrowserPage';
import Navbar from '../components/Navbar/Navbar';
import Lane from '../components/Lane/Lane';
import '../components/Lane/Lane.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesResultsAsync } from '../redux/movies/movies.actions';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const dispatch = useDispatch();
  const allMoviesSelector = useSelector((state) => state.movies.allMovies);

  useEffect(() => {
    dispatch(fetchMoviesResultsAsync());
  }, []);

  return (
    <>
      <Navbar />
      <HomeHero />
      {allMoviesSelector?.map((movieSet) => {
        // console.log('SET', movieSet);

        return (
          <Lane laneTitle={'lane title'} movies={movieSet} key={uuidv4()} />
        );
      })}

      <FooterBrowserPage />
    </>
  );
};

export default HomePage;
