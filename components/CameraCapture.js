import React, { useRef, useState, useEffect } from 'react';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { Button, Box } from "@mui/material";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  const captureImage = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}.png`);
    await uploadString(storageRef, imageData, 'data_url');
    const imageUrl = await getDownloadURL(storageRef);

    if (onCapture) {
      onCapture(imageUrl);
    } else {
      console.error("onCapture function is not defined");
    }
  };

  const buttonStyle = {
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
    color: '#f6f6f6',
    background: 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)',
    fontSize: '8px', // Reduced font size
    fontFamily: 'Cormorant',
    transition: 'background 0.3s, color 0.3s',
    margin: '5px',
    padding: '5px 10px' // Adjusted padding
  };

  const buttonHoverStyle = {
    background: '#f6f6f6',
    color: '#1c1c1c',
    transition: 'background 0.3s, color 0.3s'
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="20vh" padding="0" margin="0">
      {!isCameraOn ? (
        <Button
          variant="contained"
          onClick={() => setIsCameraOn(true)}
          sx={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.background = buttonHoverStyle.background;
            e.target.style.color = buttonHoverStyle.color;
          }}
          onMouseOut={(e) => {
            e.target.style.background = buttonStyle.background;
            e.target.style.color = buttonStyle.color;
          }}
        >
          Start Camera
        </Button>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" margin="0" padding="0">
          <video ref={videoRef} autoPlay width="200" height="150" style={{ marginBottom: '5px' }}></video>
          <canvas ref={canvasRef} width="200" height="150" style={{ display: 'none' }}></canvas>
          <Box display="flex" justifyContent="center" gap={1} marginTop="5px">
            <Button
              variant="contained"
              onClick={captureImage}
              sx={buttonStyle}
              onMouseOver={(e) => {
                e.target.style.background = buttonHoverStyle.background;
                e.target.style.color = buttonHoverStyle.color;
              }}
              onMouseOut={(e) => {
                e.target.style.background = buttonStyle.background;
                e.target.style.color = buttonStyle.color;
              }}
            >
              Capture Image
            </Button>
            <Button
              variant="contained"
              onClick={stopCamera}
              sx={buttonStyle}
              onMouseOver={(e) => {
                e.target.style.background = buttonHoverStyle.background;
                e.target.style.color = buttonHoverStyle.color;
              }}
              onMouseOut={(e) => {
                e.target.style.background = buttonStyle.background;
                e.target.style.color = buttonStyle.color;
              }}
            >
              Stop Camera
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CameraCapture;