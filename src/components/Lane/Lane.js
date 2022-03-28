import React, { useImperativeHandle, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { IconArrowRight } from "../Icons/IconArrowRight";
import { IconArrowLeft } from "../Icons/IconArrowLeft";
import { v4 as uuidv4 } from 'uuid';
import { LaneItem } from '../../components/Lane/LaneItem';
import movies from "../../movies.json";
import useWindowSize from "./WindowSize";
import MiniModal from "../MiniModal/MiniModal";
import "./Lane.scss";

const Lane = ({ children }) => {
    const size = useWindowSize()
    const [activeIndex, setActiveIndex] = useState(1);
    const [startSwitch, setStartSwitch] = useState(0);
    const [animationState, setAnimationState] = useState(true);

    // const [stateZIndex, setStateZIndex] = useState(0);

       const stateZIndex = useRef(0)
       const updateRef = (number) => {
         console.log('UPDATE', stateZIndex.current)
         stateZIndex.current = number
        }

    //    useImperativeHandle(stateZIndex)

    const keyedMovies = movies.map(movie => {movie.key = uuidv4()
        return movie} )
    const midLane = movies && keyedMovies.map((movie) => {
        return (
        <LaneItem key={movie.key} updateRef={updateRef} >
            <div className="miniModal"><MiniModal/></div>
            <img
            src={require(`../../assets/mockup_images/${movie.id}`)}
            alt={movie.title}
            className="movie-image"/>
        </LaneItem>)
        })

    const arrayFromFirstLane = midLane.filter((movie, index) => index < (size.length+1))
    const arrayFromLastLane = midLane.filter((movie, index) => index >= keyedMovies.length - (size.length+1))
    const fullLaneLenght = arrayFromLastLane.length + midLane.length + arrayFromFirstLane.length;
    const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))}
    const animationStateOn = () => { setAnimationState(true) }
    const checkIndexNext = async (activeIndex) => {
      await sleep(800);
      if (activeIndex > fullLaneLenght - 1 - size.length * 2) {
            setAnimationState(false);
            setActiveIndex(
            size.length + 2 + (size.length - (fullLaneLenght - activeIndex))
            )
        }
    }
    const checkIndexPrev = async (activeIndex) => {
        await sleep(800)
        if (activeIndex < (arrayFromLastLane.length+size.length)) {
            if (startSwitch > 0) {
                setAnimationState(false)
                setActiveIndex(fullLaneLenght-1 - ((size.length + arrayFromFirstLane.length)-(size.length-(size.length-activeIndex))))
            }
        }
    }
    const updateIndexNext  = (newIndex) => {
        setActiveIndex(newIndex);
        checkIndexNext(newIndex);
        animationStateOn();
        setStartSwitch(1);
    }
    const updateIndexPrev  = (newIndex) => {
        setActiveIndex(newIndex);
        checkIndexPrev(newIndex);
        animationStateOn();
        setStartSwitch(1);
    }
    const handlers = useSwipeable({
        onSwipedLeft: () => updateIndexPrev(activeIndex + size.length),
        onSwipedRight: () => updateIndexNext(activeIndex - size.length)
    })

    console.log("state z: ",stateZIndex.current)

    return (
        <div className="laneContainer" style={{zIndex: stateZIndex.current}} onMouseEnter={() => stateZIndex.current = 1} onMouseLeave={() => stateZIndex.current =0}>
        <div className="lane"
        style={{
                height: `${size.itemHeight*1.4}vw`}}
                >
            <div className="laneName">
                Lane
                <button className="laneNameButton"><div className="laneNameButtonOpened">Explore all </div><IconArrowRight/></button>
                </div>

            <div id="MovingLane" className="inner"
                {...handlers}
                style={{ transform: `translateX(-${activeIndex * size.itemWidth}vw)`,
                transition: `${animationState ? ' transform 0.8s' : 'undefined'}`
                }}>
                {arrayFromLastLane}
                {midLane}
                {arrayFromFirstLane}
            </div>

            <div className="indicators">
                <button className={`${ (startSwitch) === 0 ? "indicator_inactive indicator_prev" : "indicator indicator_prev"}`}
                    style={{height: `${size.itemHeight}vw`, width: "5vw", top: `-${size.itemHeight}vw`}}
                    onClick={() => {updateIndexPrev(activeIndex - size.length)}}>
                    <IconArrowLeft/>
                </button>

                <button className="indicator indicator_next"
                    style={{height: `${size.itemHeight}vw`, width: "5vw", top: `-${size.itemHeight}vw`}}
                    onClick={() => {updateIndexNext(activeIndex + size.length)}}>
                    <IconArrowRight/>
                </button>

                <div className="pageIndicator_container"
                 style={{ top: `-${(size.itemHeight * 2.1)}vw`}}>
                    {React.Children.map(children, (child, index) => {
                        if ((index) % (size.length) === 1) return (
                            <button className={`${ (index) === activeIndex-size.length ? "active_pageIndicatior pageIndicator" : "pageIndicator"}`}/>)
                    })}

                </div>
            </div>
        </div>
        </div>
    )
}

export default Lane