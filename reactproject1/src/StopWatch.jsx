// const { useState, useRef, useEffect } = require("react");

// function StopWatch() {
//     const [seconds, setSeconds] = useState(0);
//     const [isRunning, setIsRunning] = useState(0);
//     const intervalRef = useRef(null);

//     useEffect( () => {
//         if(isRunning){
//             console.log("Timer Is started");
//             intervalRef.current = setInterval( () => {
//                 setSeconds( prev => prev+1);
//             },1000);
//         }

//         return () => {
//             console.log("Timer Stopped");
//             clearInterval(intervalRef.current);
//         }
//     },[isRunning])
//     const handleStart = () => setIsRunning(true);
//     const handleStop = () => setIsRunning(false);
//     const handleReset = () => {
//         setIsRunning(false);
//         setSeconds(0);
//     };

//     return(
//         <>
//             <h2>Stop Watch:{seconds}</h2>
//             <button onClick={handleStart}>Start</button>
//             <button onClick={handleStop}>Stop</button>
//             <button onClick={handleReset}>Reset</button>
//         </>
//     )
// }

// export default StopWatch;